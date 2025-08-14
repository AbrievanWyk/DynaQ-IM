define(['app', 'ohasService', 'responseHandlerService', 'loaderService', 'formUtils', 'workflowService'], function (app) {
   'use strict';

   return app.controller('OhasController',
      ['$scope', 'OhasService', 'ResponseHandlerService', 'LoaderService', 'FormUtils', 'WorkflowService',
         function ($scope, OhasService, ResponseHandlerService, LoaderService, FormUtils, WorkflowService) {
            console.log('OhasController loaded');
            $scope.formModel = {};
            // Expose FormUtils.formatISODateField to the scope using DI
            $scope.formatISODateField = FormUtils.formatISODateField;

            // Form Initialization
            $scope.initializeForm = async function (itemID = -1) {
               LoaderService.show();
               try {
                  await OhasService.initializeMainLists();
                  await OhasService.initializeDropdownOptions();
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
                  if ($scope.displayMode === "edit" && $scope.itemID > 0) {
                     $scope.formModel.IsDraft = isDraft;
                     if ($scope.formModel.TaskStat == "Draft" && !isDraft) {
                        $scope.formModel.TaskStat = "New"
                     }
                     await OhasService.updateOhas($scope.itemID, $scope.formModel);
                     ResponseHandlerService.handleSuccess("Ohas incident updated successfully.");
                  } else {
                     $scope.formModel.InitiatorId = SPuser.get_id();
                     $scope.formModel.IsDraft = isDraft;
                     $scope.formModel.TaskStat = isDraft ? "Draft" : "New";
                     await OhasService.createOhas($scope.formModel);
                     ResponseHandlerService.handleSuccess("Ohas incident created successfully.");
                  }
               } catch (error) {
                  console.error('Error creating/editing ohas incident:', error);
                  ResponseHandlerService.handleError(error);
               } finally {
                  $scope.$applyAsync(() => LoaderService.hide());
               }
            };

            // Form Display
            async function renderEditForm(itemID) {
               try {
                  const formData = await OhasService.loadFormData(itemID);
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
            $scope.$watch(() => $scope.formModel.PartofBodyAffectedId, function (newVal, oldVal) {
               updateCheckboxGroupSelection($scope.bodyparts, newVal);
            });
            $scope.$watch(() => $scope.formModel.OccupationalStressorId, function (newVal, oldVal) {
               updateCheckboxGroupSelection($scope.OccupationalStressors, newVal);
            });
            $scope.$watch(() => $scope.formModel.ImmediateCauseId, function (newVal, oldVal) {
               updateCheckboxGroupSelection($scope.immediateCauses, newVal);
            });
            $scope.$watch(() => $scope.formModel.NatureOfInjuryId, function (newVal, oldVal) {
               updateCheckboxGroupSelection($scope.natureOfInjuries, newVal);
            });
            $scope.$watch(() => $scope.formModel.SourceOfInjuryId, function (newVal, oldVal) {
               updateCheckboxGroupSelection($scope.sourcesOfInjury, newVal);
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

            // Generic: Get the "Other" id from a list
            function getOtherId(list) {
               if (!Array.isArray(list)) return null;
               const other = list.find(item => item.value === "Other");
               return other ? other.id : null;
            }

            $scope.isOtherChecked = function (formModelProp, list) {
               const selected = $scope.formModel[formModelProp];
               const otherId = getOtherId(list);
               if (!selected || !Array.isArray(selected.results) || !otherId) return false;
               return selected.results.includes(otherId);
            };

         }]);
});
