angular.module('incidentManagementApp')
   .directive('formattedDateInput', function () {
      return {
         require: 'ngModel',
         restrict: 'A',
         link: function (scope, element, attrs, ngModelCtrl) {
            const displayFormat = attrs.dateFormat || 'dd/mm/yy';

            // --- Helper to format as dd/mm/yyyy for view ---
            function toDisplayFormat(date) {
               return FormUtils.formatDate(date, displayFormat);
            }

            // --- Helper to ensure ISO 8601 format for SharePoint model ---
            function toISOStringIfDate(value) {
               if (!value) return null;

               if (Object.prototype.toString.call(value) === "[object Date]") {
                  return value.toISOString();
               }

               const parts = value.split('/');
               if (parts.length === 3) {
                  const [day, month, year] = parts.map(p => parseInt(p, 10));
                  const date = new Date(year, month - 1, day);
                  return date.toISOString();
               }

               const fallback = new Date(value);
               return isNaN(fallback.getTime()) ? null : fallback.toISOString();
            }

            // Format the model value (from SharePoint or model) for display
            ngModelCtrl.$formatters.push(function (modelValue) {
               if (!modelValue) return '';
               const date = FormUtils.convertStringToDate(modelValue); // expected to return a Date object
               return toDisplayFormat(date);
            });

            // Parse the view value and convert to ISO format
            ngModelCtrl.$parsers.push(function (viewValue) {
               return toISOStringIfDate(viewValue);
            });

            // Format visually on blur
            element.on('blur', function () {
               const viewValue = element.val();
               const date = FormUtils.convertStringToDate(viewValue);
               element.val(toDisplayFormat(date));
            });

            // Init datepicker
            setTimeout(() => {
               $(element).datepicker({
                  dateFormat: displayFormat,
                  onSelect: function (dateText) {
                     scope.$apply(() => {
                        ngModelCtrl.$setViewValue(toISOStringIfDate(dateText));
                        ngModelCtrl.$render();
                     });
                  }
               });
            }, 100);
         }
      };
   });
