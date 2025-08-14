// Investigator Stage Component
define(['app', 'formUtils'], function (app) {
   return app.component('cpaStage', {
      bindings: {
         formModel: '<',
         editable: '<',
         saveStage: '&',
         handleNextActionChange: '&'
      },
      templateUrl: `${srcFolderPath}/js/new/components/workflowStages/cpaStage/cpa-stage.template.html`,
      controller: ['SPListOperations', 'FormUtils', function (SPListOperations, FormUtils) {
         const FIELD_MAPPINGS = WORKFLOW_CONSTANTS.STAGE_SP_FIELDS.CPA;
         const ctrl = this;
         ctrl.dateActionedText = '';

         ctrl.$onInit = async function () {
            ctrl.selectedAction = ''; // Default action
            ctrl.nextStepOptions = [];

            if (!ctrl.editable) return;

            try {
               const choices = await SPListOperations.getChoiceColumnOptions('Incidents', 'ActionStep');
               ctrl.nextStepOptions = choices.map(function (choice) {
                  return { label: choice.value, value: choice.id };
               });
            } catch (error) {
               console.error('Failed to load ActionStep choices:', error);
            } finally {
            }
         };

         ctrl.onNextActionChange = function (action, assigneeId) {
            ctrl.handleNextActionChange({ action: action, assigneeId: assigneeId });
         };

         const scope = angular.element(document.getElementById('incidentManagementCtrl')).scope();
         scope.$watch(() => ctrl.formModel.CpaApprovalDate, function (newVal, oldVal) {
            if (newVal !== oldVal) {
               ctrl.dateActionedText = FormUtils.formatISODateField(newVal);
            }
         });

         ctrl.saveStageForm = async function (continueToNextStage) {
            try {
               let stageModel = {
                  CPA: ctrl.formModel.CPA,
                  CpaApprovalDate: new Date().toISOString(),
                  CPAPersonId: SPuser.get_id(),
               }
               if (continueToNextStage) {
                  stageModel.AssignedToId = ctrl.formModel.AssignedToId;
                  stageModel.TaskStat = ctrl.formModel.TaskStat;
               }
               await ctrl.saveStage({ stageModel }); // Pass as object with key 'stageModel'
            } catch (error) {
               console.error('Error editing cpaStage:', error);
            } finally {
            }
         };
      }]
   });
});