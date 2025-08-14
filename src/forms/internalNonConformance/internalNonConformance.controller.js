define(['app', 'internalNonConformanceService', 'responseHandlerService', 'loaderService', 'formUtils', 'workflowService'], function (app) {
   'use strict';

   return app.controller('InternalNonConformanceController',
      ['$scope', 'InternalNonConformanceService', 'ResponseHandlerService', 'LoaderService', 'FormUtils', 'WorkflowService', 'InstanceIdService',
         function ($scope, InternalNonConformanceService, ResponseHandlerService, LoaderService, FormUtils, WorkflowService, InstanceIdService) {
            console.log('InternalNonConformanceController loaded');

            // Expose FormUtils.formatISODateField to the scope using DI
            $scope.formatISODateField = FormUtils.formatISODateField;

            // Form Initialization
            $scope.initializeForm = async function (itemID = -1) {
               LoaderService.show();
               try {
                  await InternalNonConformanceService.initializeMainLists();
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
                  // Ensure reqInstanceID is always set on the form model
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
                     await InternalNonConformanceService.updateInternalNonConformance($scope.itemID, $scope.formModel);
                     ResponseHandlerService.handleSuccess("Internal Non-Conformance updated successfully.");
                  } else {
                     $scope.formModel.InitiatorId = SPuser.get_id();
                     $scope.formModel.IsDraft = isDraft;
                     $scope.formModel.TaskStat = isDraft ? "Draft" : "New";
                     await InternalNonConformanceService.createInternalNonConformance($scope.formModel);
                     ResponseHandlerService.handleSuccess("Internal Non-Conformance created successfully.");
                  }
               } catch (error) {
                  console.error('Error creating/editing internal non-conformance:', error);
                  ResponseHandlerService.handleError(error);
               } finally {
                  $scope.$applyAsync(() => LoaderService.hide());
               }
            };

            // Form Display
            async function renderEditForm(itemID) {
               try {
                  const formData = await InternalNonConformanceService.loadFormData(itemID);
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

            function addRepresentative(selectedRep) {
               InternalNonConformanceService.addRepresentative($scope, selectedRep);
            }

            function removeRepresentative(repToRemove) {
               InternalNonConformanceService.removeRepresentative($scope, repToRemove);
            }

            // Generic helper for dropdown lookups
            $scope.getLookupValue = function (list, id) {
               if (!Array.isArray(list)) return '';
               var found = list.find(function (item) { return item.id === id; });
               return found ? found.value : '';
            };
         }]);
});
