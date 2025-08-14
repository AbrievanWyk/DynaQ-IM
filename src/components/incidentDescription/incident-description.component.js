define(['app', 'listOperations'], function (app) {
   return app.component('incidentDescription', {
      bindings: {
         displayMode: '@',
         formId: '=',
         formModel: '=',
         hasThisHappenedBeforeOptions: '<',
         businessAreas: '<',
         problemDepartmentAreas: '<'
      },
      template: '<ng-include src="$ctrl.templateUrl"></ng-include>',
      controller: ['SPListOperations', function (SPListOperations) {
         const ctrl = this;

         ctrl.$onInit = function () {
            ctrl.templateUrl = ctrl.displayMode === 'view'
               ? `${srcFolderPath}/js/new/components/incidentDescription/incident-description-view.html`
               : `${srcFolderPath}/js/new/components/incidentDescription/incident-description-edit.html`;
         };

         ctrl.getAreaName = function (id) {
            return (ctrl.businessAreas || []).find(area => area.id === id)?.value || '';
         };
         ctrl.getDepartmentAreaName = function (id) {
            return (ctrl.problemDepartmentAreas || []).find(area => area.id === id)?.value || '';
         };
         ctrl.getHasThisHappenedBeforeText = function (id) {
            return (ctrl.hasThisHappenedBeforeOptions || []).find(opt => opt.id === id)?.value || '';
         };

         SPListOperations.populateScopeList("HasThisHappenedBefore");
      }]
   });
});
