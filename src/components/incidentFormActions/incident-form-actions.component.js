define(['app', 'instanceIdService'], function (app) {
   return app.component('incidentFormActions', {
      bindings: {
         formId: '=',
         formModel: '=',
         complexTypesModel: '=',
         saveFn: '=',
         formValid: '='
      },
      templateUrl: `${srcFolderPath}/js/new/components/incidentFormActions/incident-form-actions.template.html`,
      controller: ['$element', '$scope', 'InstanceIdService', function ($element, $scope, InstanceIdService) {
         const ctrl = this;


         // ctrl.selectedNextAction = 'submitForInvestigation';

         ctrl.buttonConfig = {
            save: {
               label: 'Save',
               clickArgs: [false, false],
               showError: true
            },
            complete: {
               label: 'Complete',
               clickArgs: [false, true],
               showError: true
            },
            continue: {
               label: 'Save & Continue Later',
               clickArgs: [true, false],
               showError: false
            }
         };

         ctrl.getActionType = function () {
            if (ctrl.formId !== 'Complaint') return 'save';

            switch (ctrl.selectedNextAction) {
               case 'submitForInvestigation': return 'save';
               case 'existingAR': return 'complete';
               case 'saveAndContinueLater': return 'continue';
               default: return '';
            }
         };

         ctrl.getActionConfig = function () {
            return ctrl.buttonConfig[ctrl.getActionType()] || null;
         };

         ctrl.cancelAndBack = function () {
            const params = location.search;
            const sourceMatch = params.match(/Source=([^&]+)/);
            if (sourceMatch && sourceMatch[1]) {
               const gotoURL = decodeURIComponent(sourceMatch[1]);
               window.location = gotoURL;
            }
         };

         // Watch for changes to selectedNextAction and update formModel properties
         $scope.$watch(() => ctrl.selectedNextAction, function (newVal) {
            if (!ctrl.formModel) return;
            ctrl.formModel.reqInstanceID = InstanceIdService.get(); // Ensure formModel has reqInstanceID
            ctrl.formModel.ARStatus = 'In Progress';
            switch (newVal) {
               case 'submitForInvestigation':
                  ctrl.formModel.TaskStat = 'New';
                  ctrl.formModel.IsDraft = false;
                  break;
               case 'existingAR':
                  ctrl.formModel.TaskStat = 'Completed';
                  ctrl.formModel.ARStatus = 'Completed';
                  ctrl.formModel.IsDraft = false;
                  break;
               case 'saveAndContinueLater':
                  ctrl.formModel.TaskStat = 'Draft';
                  ctrl.formModel.IsDraft = true;
                  break;
               default:
                  ctrl.formModel.TaskStat = '';
                  ctrl.formModel.IsDraft = false;
            }
         });
      }]
   });
});
