define(['app', 'environmentalService', 'responseHandlerService', 'loaderService', 'formUtils', 'workflowService'], function (app) {
   'use strict';

   return app.controller('EnvironmentalController',
      ['$scope', 'EnvironmentalService', 'ResponseHandlerService', 'LoaderService', 'FormUtils', 'WorkflowService', 'InstanceIdService',
         function ($scope, EnvironmentalService, ResponseHandlerService, LoaderService, FormUtils, WorkflowService, InstanceIdService) {
            console.log('EnvironmentalController loaded');
            $scope.formModel = {};
            // Expose FormUtils.formatISODateField to the scope using DI
            $scope.formatISODateField = FormUtils.formatISODateField;

            // Form Initialization
            $scope.initializeForm = async function (itemID = -1) {
               LoaderService.show();
               try {
                  await EnvironmentalService.initializeMainLists();
                  await EnvironmentalService.initializeDropdownOptions();
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
                     await EnvironmentalService.updateEnvironmental($scope.itemID, $scope.formModel);
                     ResponseHandlerService.handleSuccess("Environmental incident updated successfully.");
                  } else {
                     $scope.formModel.InitiatorId = SPuser.get_id();
                     $scope.formModel.IsDraft = isDraft;
                     $scope.formModel.TaskStat = isDraft ? "Draft" : "New";
                     await EnvironmentalService.createEnvironmental($scope.formModel);
                     ResponseHandlerService.handleSuccess("Environmental incident created successfully.");
                  }
               } catch (error) {
                  console.error('Error creating/editing environmental incident:', error);
                  ResponseHandlerService.handleError(error);
               } finally {
                  $scope.$applyAsync(() => LoaderService.hide());
               }
            };

            // Form Display
            async function renderEditForm(itemID) {
               try {
                  const formData = await EnvironmentalService.loadFormData(itemID);
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

            function updateCheckboxGroupSelection(list, selected) {
               if (!Array.isArray(list)) return;
               const selectedIds = (selected && Array.isArray(selected.results)) ? selected.results : [];
               list.forEach(function (item) {
                  item.isChecked = selectedIds.includes(item.id);
               });
            }

            // Watch for each group
            $scope.$watch(() => $scope.formModel.PermitConditionId, function (newVal, oldVal) {
               updateCheckboxGroupSelection($scope.permitConditions, newVal);
            });
            $scope.$watch(() => $scope.formModel.PublicComplaintId, function (newVal, oldVal) {
               updateCheckboxGroupSelection($scope.publicComplaints, newVal);
            });
            $scope.$watch(() => $scope.formModel.NonComformanceId, function (newVal, oldVal) {
               updateCheckboxGroupSelection($scope.nonConformances, newVal);
            });
            $scope.$watch(() => $scope.formModel.ExcessiveResourceUseId, function (newVal, oldVal) {
               updateCheckboxGroupSelection($scope.resourcesUses, newVal);
            });
            $scope.$watch(() => $scope.formModel.WasteGenerationId, function (newVal, oldVal) {
               updateCheckboxGroupSelection($scope.wasteGeneration, newVal);
            });
            $scope.$watch(() => $scope.formModel.EnvironmentalSpillageId, function (newVal, oldVal) {
               updateCheckboxGroupSelection($scope.environmentSpillage, newVal);
            });

            // Generic helper for dropdown lookups
            $scope.getLookupValue = function (list, id) {
               if (!Array.isArray(list)) return '';
               var found = list.find(function (item) { return item.id === id; });
               return found ? found.value : '';
            };

            $scope.onCheckboxGroupChange = function (listName, formModelProp) {
               $scope.formModel[formModelProp] = $scope.getSelectedCheckboxResults($scope[listName]);
            };

            $scope.getSelectedCheckboxResults = function (checkboxList, checkedProp = 'isChecked') {
               if (!Array.isArray(checkboxList)) return { results: [] };
               return {
                  results: checkboxList
                     .filter(function (item) { return item[checkedProp]; })
                     .map(function (item) { return item.id; })
               };
            };
            //TODO: Write a function that can be used to take all the selected checkboxes and have it in the form of { results: [1,2,3] } where the array is of all the selected ids
         }]);
});
