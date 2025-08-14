// Investigator Stage Component
define(['app', 'formUtils', 'workflowService', 'itemIdService'], function (app) {
   return app.component('investigatorStage', {
      bindings: {
         formModel: '<',
         editable: '<',
         saveStage: '&',
         handleNextActionChange: '&'
      },
      templateUrl: `${srcFolderPath}/js/new/components/workflowStages/investigatorStage/investigator-stage.template.html`,
      controller: ['SPListOperations', 'FormUtils', 'WorkflowService', 'ItemIdService', function (SPListOperations, FormUtils, WorkflowService, ItemIdService) {
         const FIELD_MAPPINGS = WORKFLOW_CONSTANTS.STAGE_SP_FIELDS.INVESTIGATION;
         const ctrl = this;
         ctrl.dateActionedText = '';
         ctrl.financeFieldsEditable = false;

         ctrl.updateDueDateAndStartDate = function () {
            // Find the selected priority object
            const selectedPriority = ctrl.formModel.Priority;
            if (!selectedPriority) return;

            // Set StartDate to today
            const startDate = new Date();
            ctrl.formModel.StartDate = startDate.toISOString();

            // Calculate DueDate based on priority value
            let daysToAdd = 0;
            switch (selectedPriority) {
               case "(1) High":
                  daysToAdd = 3;
                  break;
               case "(2) Normal":
                  daysToAdd = 14;
                  break;
               case "(3) Low":
                  daysToAdd = 30;
                  break;
               default:
                  daysToAdd = 0;
            }
            const dueDate = new Date(startDate);
            dueDate.setDate(startDate.getDate() + daysToAdd);
            ctrl.formModel.TaskDueDate = dueDate.toISOString();
         };

         ctrl.setWorkflowStatus = async function () {
            const result = await WorkflowService.getFormWorkflowStatus('Incidents', ItemIdService.get());
            ctrl.formStage = result.workflowStage;
            ctrl.financeFieldsEditable = ctrl.formStage === WORKFLOW_CONSTANTS.STATES.FINANCE || ctrl.formStage === WORKFLOW_CONSTANTS.STATES.FINAL_FINANCE;

            ctrl.formID = result.form.id;
         }


         ctrl.$onInit = async function () {
            ctrl.selectedAction = ''; // Default action
            ctrl.nextStepOptions = [];
            // Get dropdown options from service
            const dropdowns = await WorkflowService.initializeDropdownOptions();
            ctrl.RootCauseCategories = dropdowns.RootCauseCategories || [];
            ctrl.RootCauses = dropdowns.RootCauses || [];
            ctrl.ActionsRequired = dropdowns.ActionsRequired || [];
            ctrl.Priorities = dropdowns.Priorities || [];
            ctrl.yesNoOptions = [
               { label: 'Yes', value: true },
               { label: 'No', value: false }
            ];
            await ctrl.setWorkflowStatus();

            if (!ctrl.editable) return;

            try {
               const choices = await SPListOperations.getChoiceColumnOptions('Incidents', 'InvestigatorStep');
               ctrl.nextStepOptions = choices.map(function (choice) {
                  return { label: choice.value, value: choice.id };
               });
               ctrl.filterNextStepOptions(false);
            } catch (error) {
               console.error('Failed to load InvestigatorStep choices:', error);
            } finally {
            }
         };

         ctrl.onNextActionChange = function (action, assigneeId) {
            ctrl.handleNextActionChange({ action: action, assigneeId: assigneeId });
         };

         // Helper to filter nextStepOptions based on FinancialApprovalRequired
         ctrl.filterNextStepOptions = function (value = false) {
            const isFinanceApproval = value === true || value === 'true' || value === 'Yes';
            if (isFinanceApproval) {
               ctrl.filteredNextStepOptions = ctrl.nextStepOptions.filter(opt =>
                  opt.label === 'Submit for Finance Approval' || opt.label === 'Return to Initiator');
            } else {
               ctrl.filteredNextStepOptions = ctrl.nextStepOptions.filter(opt =>
                  opt.label === 'Submit for CPA' || opt.label === 'Return to Initiator');
            }
         };

         // Add $watch after options are initialized
         const scope = angular.element(document.getElementById('incidentManagementCtrl')).scope();
         scope.$watch(() => ctrl.formModel.FinancialApprovalRequired, function (newVal, oldVal) {
            if (newVal !== oldVal) {
               setTimeout(() => {
                  ctrl.filterNextStepOptions(newVal);
               }, 100);
            }
         });
         scope.$watch(() => ctrl.formModel.InvestigatorApprovalDate, function (newVal, oldVal) {
            if (newVal !== oldVal) {
               ctrl.dateActionedText = FormUtils.formatISODateField(newVal);
            }
         });
         scope.$watch(() => scope.PollutionDurations, function (newVal, oldVal) {
            if (newVal !== oldVal) {
               ctrl.PollutionDurations = newVal;
            }
         });
         scope.$watch(() => scope.PollutionScopes, function (newVal, oldVal) {
            if (newVal !== oldVal) {
               ctrl.PollutionScopes = newVal;
            }
         });
         scope.$watch(() => scope.environmentalImpacts, function (newVal, oldVal) {
            if (newVal !== oldVal) {
               ctrl.environmentalImpacts = newVal;
            }
         });
         // scope.$watch(() => ctrl.formModel.EnvironmentalImpact, function (newVal, oldVal) {
         //    if (newVal !== oldVal) {
         //       ctrl.selectedEnvironmentalImpacts = newVal.results;
         //    }
         // });
         scope.$watch(() => ctrl.formModel.EnvironmentalImpactId, function (newVal, oldVal) {
            if (newVal !== oldVal && ctrl.environmentalImpacts && Array.isArray(ctrl.environmentalImpacts)) {
               const selectedIds = (newVal && Array.isArray(newVal.results)) ? newVal.results : [];
               scope.$applyAsync(() => {
                  ctrl.environmentalImpacts.forEach(function (item) {
                     item.isChecked = selectedIds.includes(item.id);
                  });
               });
            }
         });


         ctrl.onCheckboxGroupChange = function (listName, formModelProp) {
            ctrl.formModel[formModelProp] = ctrl.getSelectedCheckboxResults(ctrl[listName]);
         };

         ctrl.getSelectedCheckboxResults = function (checkboxList, checkedProp = 'isChecked') {
            if (!Array.isArray(checkboxList)) return { results: [] };
            return {
               results: checkboxList
                  .filter(function (item) { return item[checkedProp]; })
                  .map(function (item) { return item.id; })
            };
         };

         ctrl.saveStageForm = async function (continueToNextStage) {
            try {

               // List of allowed properties to send
               const allowedFields = [
                  'IsDraft',
                  'InvestigationParticipants',
                  'InvestigatorDetails',
                  'ProcedureName',
                  'ReviewTrainingDate',
                  'IsIncidentCovered',
                  'RiskAssessmentDetails',
                  'RootCauseCategoryId',
                  'RootCauseARId',
                  'ActionRequiredId',
                  'ImmediateCorrection',
                  'SuggestedCPA',
                  'Priority',
                  'StartDate',
                  'TaskDueDate',
                  'FinancialApprovalRequired',
                  'CostClaim',
                  'CostTransport',
                  'CostConformance',
                  'CostDirectDamage',
                  'OperationalImprovements',
                  'CostTraining',
                  'CostOther',
                  'CostDetails',
                  'InvestigatorApprovalDate',

                  'QuantityOfPollutant',
                  'DurationOfPollutionId',
                  'ScopeOfPollutionId',
                  'EnvironmentalImpactId'
               ];

               // Build stageModel with only allowed fields
               let stageModel = {};
               allowedFields.forEach(field => {
                  if (ctrl.formModel.hasOwnProperty(field)) {
                     stageModel[field] = ctrl.formModel[field];
                  }
               });

               // Add/override fields as needed
               stageModel.InvestigatorApprovalDate = new Date().toISOString();
               if (continueToNextStage) {
                  stageModel.AssignedToId = ctrl.formModel.AssignedToId;
                  stageModel.TaskStat = ctrl.formModel.TaskStat;
                  stageModel.InvestigatorId = SPuser.get_id();
               }
               await ctrl.saveStage({ stageModel });
            } catch (error) {
               console.error('Error editing investigatorStage:', error);
            } finally {
            }
         };
      }]
   });
});