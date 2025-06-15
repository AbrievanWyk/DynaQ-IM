angular.module('incidentManagementApp')
   .component('incidentDescription', {
      bindings: {
         formId: '=',
         formModel: '=',
         hasThisHappenedBeforeOptions: '<'
      },
      templateUrl: `${srcFolderPath}/js/new/components/incidentDescription/incident-description.template.html`,
      controller: function () {
         SPListOperations.populateScopeList("HasThisHappenedBefore");
      }
   });
