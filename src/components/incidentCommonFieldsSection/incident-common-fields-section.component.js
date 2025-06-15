angular.module('incidentManagementApp').component('incidentCommonFieldsSection', {
   bindings: {
      incidentTitle: '=',
      selectedBusinessArea: '=',
      selectedProblemDepartmentArea: '=',
      businessAreas: '<',
      problemDepartmentAreas: '<',
      form: '<'
   },
   templateUrl: `${srcFolderPath}/js/new/components/incidentCommonFieldsSection/incident-common-fields-section.html`
});