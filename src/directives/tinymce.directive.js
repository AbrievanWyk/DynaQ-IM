angular.module('incidentManagementApp')
   .directive('tinymceEditor', function () {
      return {
         restrict: 'A',
         require: 'ngModel',
         link: function (scope, element, attrs, ngModel) {
            setTimeout(function () {
               tinymce.init({
                  target: element[0],
                  toolbar: false,
                  menubar: false,
                  plugins: ['code', 'insertdatetime', 'paste', 'autoresize'],
                  content_css: [],
                  setup: function (editor) {
                     editor.on('init', function () {
                        if (ngModel.$viewValue) {
                           editor.setContent(ngModel.$viewValue);
                        }
                        $(editor.getBody()).on('click', 'a[href]', function (e) {
                           const win = window.open($(e.currentTarget).attr('href'), '_blank');
                           win.focus();
                        });
                     });

                     editor.on('change keyup paste', function () {
                        const content = editor.getContent({ format: 'raw' });
                        scope.$applyAsync(() => {
                           ngModel.$setViewValue(content);
                        });
                     });

                     editor.on('blur', function () {
                        const content = editor.getContent({ format: 'raw' });
                        scope.$applyAsync(() => {
                           ngModel.$setViewValue(content);
                        });
                     });
                  }
               });
            }, 100); // Let DOM finish rendering
         }
      };
   });
