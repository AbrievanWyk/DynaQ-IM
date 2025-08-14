define(['app', 'workflowService', 'loaderService'], function (app) {
   return app.component('workflowStages', {
      bindings: {
         itemId: '<',
         currentStageText: '<',
      },
      templateUrl: `${srcFolderPath}/js/new/components/workflowStages/workflow-stages.template.html`,
      controller: ['WorkflowService', 'LoaderService', function (WorkflowService, LoaderService) {
         const ctrl = this;
         ctrl.formModel = {};
         ctrl.visibleStages = [];
         ctrl.currentStage = null;
         ctrl.isEditable = false;

         function loadStageFormModel(itemId, stageName) {
            (async () => {
               try {
                  const data = await WorkflowService.getStageDetails(itemId, stageName);
                  ctrl.formModel = data;
               } catch (err) {
                  console.error('Failed to load stage details:', err);
               }
            })();
         }

         ctrl.$onInit = function () {
         };

         // Update visibleStages and currentStage when currentStageText changes
         ctrl.$onChanges = function (changes) {
            if (changes.currentStageText && !changes.currentStageText.isFirstChange()) {
               const taskStat = changes.currentStageText.currentValue || 'New';
               ctrl.visibleStages = WorkflowService.getVisibleStages(taskStat);
               ctrl.currentStage = ctrl.visibleStages.length > 0 ? ctrl.visibleStages[0] : null;

               if (ctrl.itemId && ctrl.currentStage) {
                  loadStageFormModel(ctrl.itemId, ctrl.currentStage);
               }
            }
         };

         ctrl.handleNextActionChange = function (action, assigneeId) {
            // Update assigned to
            ctrl.formModel.AssignedToId = assigneeId;

            // Map action to TaskStat/IsDraft using WorkflowService
            const status = WorkflowService.getActionStatus(action);
            if (status) {
               ctrl.formModel.TaskStat = status.TaskStat;
               ctrl.formModel.IsDraft = status.IsDraft;
            }
         };

         ctrl.saveCurrentStage = async function (formModel) {
            if (!formModel) {
               console.error('Invalid form model');
               return;
            }
            LoaderService.show();
            try {
               await WorkflowService.updateStageDetails(ctrl.itemId, formModel);
            } catch (error) {
               console.error('Error updating stage model:', error);
            } finally {
               const scope = angular.element(document.getElementById('incidentManagementCtrl')).scope();
               scope.$applyAsync(() => LoaderService.hide());
            }
         };
      }]
   });
});
