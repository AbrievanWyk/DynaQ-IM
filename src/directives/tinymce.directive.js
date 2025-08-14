define(['app'], function (app) {
   return app.directive('tinymceEditor', function () {
      return {
         restrict: 'A',
         require: 'ngModel',
         link: function (scope, element, attrs, ngModel) {
            let editorInstance;
            setTimeout(function () {
               tinymce.init({
                  target: element[0],
                  toolbar: false,
                  menubar: false,
                  plugins: ['code', 'insertdatetime', 'paste', 'autoresize'],
                  content_css: [],
                  setup: function (editor) {
                     editorInstance = editor;

                     if (attrs.disabled !== undefined && attrs.disabled !== "false") {
                        editor.setMode('readonly');
                     }

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

            // Watch for model changes and update editor content if needed
            scope.$watch(function () {
               return ngModel.$viewValue;
            }, function (newVal, oldVal) {
               if (editorInstance && editorInstance.initialized) {
                  const currentContent = editorInstance.getContent({ format: 'raw' });
                  if (newVal !== currentContent) {
                     editorInstance.setContent(newVal || '');
                  }
               }
            });
         }
      };
   });
});
