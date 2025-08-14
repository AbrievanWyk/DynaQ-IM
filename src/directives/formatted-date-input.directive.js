define(['app', 'formUtils'], function (app) {
   return app.directive('formattedDateInput', ['FormUtils', function (FormUtils) {
      return {
         require: 'ngModel',
         restrict: 'A',
         link: function (scope, element, attrs, ngModelCtrl) {
   const displayFormat = attrs.dateFormat || 'dd/mm/yy';
   const includeTime = attrs.includeTime !== undefined; // Only show time dropdowns if attribute is present

   // --- Helper to format as dd/mm/yyyy for view ---
   function toDisplayFormat(date) {
      return FormUtils.formatDate(date, displayFormat);
   }

   // --- Helper to ensure ISO 8601 format for SharePoint model ---
   function toISOStringIfDate(dateStr, hour, minute) {
      if (!dateStr) return null;

      let date;
      if (Object.prototype.toString.call(dateStr) === "[object Date]") {
         date = new Date(dateStr);
      } else {
         const parts = dateStr.split('/');
         if (parts.length === 3) {
            const [day, month, year] = parts.map(p => parseInt(p, 10));
            date = new Date(year, month - 1, day);
         } else {
            date = new Date(dateStr);
         }
      }
      if (isNaN(date.getTime())) return null;

      // Set hour and minute if provided
      if (includeTime && typeof hour !== 'undefined' && typeof minute !== 'undefined') {
         date.setHours(hour, minute, 0, 0);
      }
      return date.toISOString();
   }

   let hourSelect, minuteSelect;

   if (includeTime) {
      // --- Create time dropdowns ---
      hourSelect = angular.element('<select style="padding: 3px 5px; margin-left:4px;" id="datepickerHour"></select>');
      for (let h = 0; h < 24; h++) {
         const val = h < 10 ? '0' + h : '' + h;
         hourSelect.append('<option value="' + val + '">' + val + '</option>');
      }
      minuteSelect = angular.element('<select style="padding: 3px 5px; margin-left:4px;" id="datepickerMinutes"></select>');
      for (let m = 0; m < 60; m += 5) {
         const val = m < 10 ? '0' + m : '' + m;
         minuteSelect.append('<option value="' + val + '">' + val + '</option>');
      }
      // Insert after the date input
      element.after(minuteSelect);
      element.after(hourSelect);
   }

   // --- Sync dropdowns with model ---
   function setDropdownsFromModel(modelValue) {
      if (!includeTime || !modelValue) return;
      const date = FormUtils.convertStringToDate(modelValue);
      if (!date || isNaN(date.getTime())) return;
      const h = date.getHours();
      const m = date.getMinutes();
      hourSelect.val(h < 10 ? '0' + h : '' + h);
      // Snap to nearest 5 for minutes
      const min5 = Math.round(m / 5) * 5;
      minuteSelect.val(min5 < 10 ? '0' + min5 : '' + min5);
   }

   // --- Update model when any input changes ---
   function updateModel() {
      const dateVal = element.val();
      let hourVal, minVal;
      if (includeTime) {
         hourVal = hourSelect.val();
         minVal = minuteSelect.val();
      }
      const iso = toISOStringIfDate(dateVal, includeTime ? parseInt(hourVal, 10) : undefined, includeTime ? parseInt(minVal, 10) : undefined);
      scope.$applyAsync(() => {
         ngModelCtrl.$setViewValue(iso);
         ngModelCtrl.$render();
      });
   }

   // --- Format the model value (from SharePoint or model) for display ---
   ngModelCtrl.$formatters.push(function (modelValue) {
      if (!modelValue) return '';
      const date = FormUtils.convertStringToDate(modelValue); // expected to return a Date object
      if (includeTime) setTimeout(() => setDropdownsFromModel(modelValue), 0);
      return toDisplayFormat(date);
   });

   // --- Parse the view value and convert to ISO format ---
   ngModelCtrl.$parsers.push(function (viewValue) {
      let hourVal, minVal;
      if (includeTime) {
         hourVal = hourSelect.val();
         minVal = minuteSelect.val();
      }
      return toISOStringIfDate(viewValue, includeTime ? parseInt(hourVal, 10) : undefined, includeTime ? parseInt(minVal, 10) : undefined);
   });

   // --- Format visually on blur ---
   element.on('blur', function () {
      const viewValue = element.val();
      if (!viewValue) {
         element.val();
         return;
      }
      const date = FormUtils.convertStringToDate(viewValue);
      element.val(toDisplayFormat(date));
      updateModel();
   });

   // --- Update model when dropdowns change ---
   if (includeTime) {
      hourSelect.on('change', updateModel);
      minuteSelect.on('change', updateModel);
   }

   // --- Init datepicker ---
   setTimeout(() => {
      $(element).datepicker({
         dateFormat: displayFormat,
         onSelect: function (dateText) {
            scope.$apply(() => {
               let hourVal, minVal;
               if (includeTime) {
                  hourVal = hourSelect.val();
                  minVal = minuteSelect.val();
               }
               ngModelCtrl.$setViewValue(
                  toISOStringIfDate(dateText, includeTime ? parseInt(hourVal, 10) : undefined, includeTime ? parseInt(minVal, 10) : undefined)
               );
               ngModelCtrl.$render();
            });
         }
      });
      if (includeTime) setDropdownsFromModel(ngModelCtrl.$modelValue);
   }, 3000);

   // --- Override $render to always display formatted date and sync dropdowns ---
   ngModelCtrl.$render = function () {
      let value = ngModelCtrl.$viewValue;
      if (!value || value === 'NaN/NaN/NaN') {
         value = ngModelCtrl.$modelValue;
      }
      if (!value || value === 'NaN/NaN/NaN') {
         element.val('');
         return;
      }
      let displayValue = '';
      try {
         displayValue = FormUtils.formatISODateField(value);
      } catch (e) {
         displayValue = '';
      }
      if (!displayValue || displayValue === 'NaN/NaN/NaN') {
         element.val('');
      } else {
         element.val(displayValue);
         if (includeTime) setDropdownsFromModel(value);
      }
   };
}
      };
   }]);
});
