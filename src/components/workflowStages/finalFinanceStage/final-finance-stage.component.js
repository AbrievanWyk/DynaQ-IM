// Investigator Stage Component
define(['app', 'formUtils'], function (app) {
   return app.component('finalFinanceStage', {
      bindings: {
         formModel: '<',
         editable: '<',
         saveStage: '&',
         handleNextActionChange: '&'
      },
      templateUrl: `${srcFolderPath}/js/new/components/workflowStages/finalFinanceStage/final-finance-stage.template.html`,
      controller: ['SPListOperations', 'FormUtils', function (SPListOperations, FormUtils) {
         const FIELD_MAPPINGS = WORKFLOW_CONSTANTS.STAGE_SP_FIELDS.FINAL_FINANCE;
         const ctrl = this;
         ctrl.dateActionedText = '';

         ctrl.$onInit = async function () {
            ctrl.selectedAction = ''; // Default action
            ctrl.nextStepOptions = [];

            if (!ctrl.editable) return;

            try {
               const choices = await SPListOperations.getChoiceColumnOptions('Incidents', 'FinalFinanceApprovalStep');
               ctrl.nextStepOptions = choices.map(function (choice) {
                  return { label: choice.value, value: choice.id };
               });
            } catch (error) {
               console.error('Failed to load FinalFinanceApprovalStep choices:', error);
            } finally {
            }
         };

         const scope = angular.element(document.getElementById('incidentManagementCtrl')).scope();
         scope.$watch(() => ctrl.formModel.FinalFinanceApprovalDate, function (newVal, oldVal) {
            if (newVal !== oldVal) {
               ctrl.dateActionedText = FormUtils.formatISODateField(newVal);
            }
         });

         ctrl.onNextActionChange = function (action, assigneeId) {
            ctrl.handleNextActionChange({ action: action, assigneeId: assigneeId });
         };
         
         ctrl.saveStageForm = async function (continueToNextStage) {
            try {
               let stageModel = {
                  FinalFinanceApprovalComments: ctrl.formModel.FinalFinanceApprovalComments,
                  FinalFinanceApprovalDate: new Date().toISOString(),
                  FinalFinanceApprovalManagerId: SPuser.get_id(),
               }
               if (continueToNextStage) {
                  stageModel.ARStatus = "Completed";
                  stageModel.TaskStat = "Completed";
                  stageModel.AssignedToId = ctrl.formModel.AssignedToId;
               }
               await ctrl.saveStage({ stageModel }); // Pass as object with key 'stageModel'
            } catch (error) {
               console.error('Error editing financeStage:', error);
            } finally {
            }
         };
      }]
   });
});