define(['app', 'auditFindingService', 'responseHandlerService', 'loaderService', 'formUtils', 'workflowService'], function (app) {
   'use strict';

   return app.controller('AuditFindingController',
      ['$scope', 'AuditFindingService', 'ResponseHandlerService', 'LoaderService', 'FormUtils', 'WorkflowService', 'InstanceIdService',
         function ($scope, AuditFindingService, ResponseHandlerService, LoaderService, FormUtils, WorkflowService, InstanceIdService) {
            console.log('AuditFindingController loaded');

            // Expose FormUtils.formatISODateField to the scope using DI
            $scope.formatISODateField = FormUtils.formatISODateField;

            // Form Initialization
            $scope.initializeForm = async function (itemID = -1) {
               LoaderService.show();
               try {
                  await AuditFindingService.initializeMainLists();
                  await AuditFindingService.initializeDropdownOptions();
                  $scope.formModel = $scope.baseFormModel || {};
                  if (itemID > 0) {
                     await renderEditForm(itemID);
                  }
               } finally {
                  $scope.$applyAsync(() => LoaderService.hide());
               }
            };

            $scope.saveForm = async function (formId, isDraft, skipToEnd) {
               LoaderService.show();
               try {
                  $scope.formModel.reqInstanceID = InstanceIdService.get();
                  if (!$scope.formModel.reqInstanceID) {
                     ResponseHandlerService.handleError('Instance ID is not available. Please try again later.');
                     return;
                  }
                  if ($scope.displayMode === "edit" && $scope.itemID > 0) {
                     $scope.formModel.IsDraft = isDraft;
                     if($scope.formModel.TaskStat == "Draft" && !isDraft) {
                        $scope.formModel.TaskStat = "New"
                     }
                     await AuditFindingService.updateAuditFinding($scope.itemID, $scope.formModel);
                     ResponseHandlerService.handleSuccess("Audit finding updated successfully.");
                  } else {
                     $scope.formModel.InitiatorId = SPuser.get_id();
                     $scope.formModel.IsDraft = isDraft;
                     $scope.formModel.TaskStat = isDraft ? "Draft" : "New";
                     await AuditFindingService.createAuditFinding($scope.formModel);
                     ResponseHandlerService.handleSuccess("Audit finding created successfully.");
                  }
               } catch (error) {
                  console.error('Error creating/editing audit finding:', error);
                  ResponseHandlerService.handleError(error);
               } finally {
                  $scope.$applyAsync(() => LoaderService.hide());
               }
            };

            // Form Display
            async function renderEditForm(itemID) {
               try {
                  const formData = await AuditFindingService.loadFormData(itemID);
                  $scope.$apply(() => {
                     $scope.displayMode = "edit";
                     $scope.itemID = itemID;

                     $scope.formModel = formData.formModel || {};
                     $scope.complexTypesModel = {
                        ...formData.complexTypesModel
                     };
                  });

               } catch (error) {
                  console.error('Error loading form:', error);
                  ResponseHandlerService.handleError(error);
               }
            }

            // Generic helper for dropdown lookups
            $scope.getLookupValue = function (list, id) {
               if (!Array.isArray(list)) return '';
               var found = list.find(function (item) { return item.id === id; });
               return found ? found.value : '';
            };
         }]);
});
