define(['app'], function (app) {
   return app.component('incidentCommonFieldsSection', {
      bindings: {
         displayMode: '@',
         incidentTitle: '=',
         formModel: '=',
         form: '=',
         selectedBusinessArea: '=',
         selectedProblemDepartmentArea: '=',
         businessAreas: '=',
         problemDepartmentAreas: '='
      },
      template: '<ng-include src="$ctrl.templateUrl"></ng-include>',
      controller: function ($element, $attrs) {
         const ctrl = this;

         ctrl.$onInit = function () {
            ctrl.templateUrl = ctrl.displayMode === 'view'
               ? `${srcFolderPath}/js/new/components/incidentCommonFieldsSection/incident-common-fields-section-view.html`
               : `${srcFolderPath}/js/new/components/incidentCommonFieldsSection/incident-common-fields-section-edit.html`;
         };

         ctrl.$onChanges = function (changes) {
            if (changes.selectedBusinessArea && changes.selectedBusinessArea.currentValue) {
               ctrl.selectedBusinessArea = changes.selectedBusinessArea.currentValue;
            }

            if (changes.selectedProblemDepartmentArea && changes.selectedProblemDepartmentArea.currentValue) {
               ctrl.selectedProblemDepartmentArea = changes.selectedProblemDepartmentArea.currentValue;
            }
         };
      }
   });
});