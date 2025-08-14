define(['app'], function (app) {
   return app.directive('smartSelect', function () {
      return {
         restrict: 'E',
         scope: {
            model: '=',       // The primitive bound to formModel
            options: '=',     // The array of {id, value} or similar
            valueProp: '@',   // Property to compare (e.g., 'value')
            labelProp: '@',   // Property to display (e.g., 'value')
            name: '@?',
            required: '<?',
            ngDisabled: '<?'
         },
         template: `
            <select 
               ng-model="selectedOption" 
               ng-options="item as item[labelProp] for item in options track by item[valueProp]"
               name="{{name}}" 
               ng-required="required === true"
               ng-disabled="ngDisabled === true">
            </select>
         `,
         link: function (scope) {
            let updatingFromOptions = false;
            let updatingFromUser = false;

            scope.$watchGroup(['options', 'model'], function () {
               if (!Array.isArray(scope.options)) return;

               const match = scope.options.find(opt => opt[scope.valueProp] === scope.model) || null;

               // Prevent circular updates
               if (!updatingFromUser && scope.selectedOption !== match) {
                  updatingFromOptions = true;
                  scope.selectedOption = match;
               }
            });

            scope.$watch('selectedOption', function (newVal) {
               if (updatingFromOptions) {
                  updatingFromOptions = false;
                  return;
               }

               if (!newVal || typeof newVal !== 'object') return;

               const newPrimitive = newVal[scope.valueProp];
               if (scope.model !== newPrimitive) {
                  updatingFromUser = true;
                  scope.model = newPrimitive;
                  updatingFromUser = false;
               }
            });
         }

      };
   });
});
