define(['app', 'nonConformingProductService', 'responseHandlerService', 'loaderService', 'formUtils', 'workflowService'], function (app) {
   'use strict';

   return app.controller('NonConformingProductController',
      ['$scope', 'NonConformingProductService', 'ResponseHandlerService', 'LoaderService', 'FormUtils', 'WorkflowService', 'InstanceIdService',
         function ($scope, NonConformingProductService, ResponseHandlerService, LoaderService, FormUtils, WorkflowService, InstanceIdService) {
            console.log('NonConformingProductController loaded');

            // Expose FormUtils.formatISODateField to the scope using DI
            $scope.formatISODateField = FormUtils.formatISODateField;

            // Form Initialization
            $scope.initializeForm = async function (itemID = -1) {
               LoaderService.show();
               try {
                  await NonConformingProductService.initializeMainLists();
                  await NonConformingProductService.initializeDropdownOptions();
                  $scope.formModel = $scope.baseFormModel || {};
                  if (itemID > 0) {
                     await renderEditForm(itemID);
                  }
               } finally {
                  $scope.$applyAsync(() => LoaderService.hide());
               }
            };

            $scope.saveForm = async function () {
               LoaderService.show();
               try {
                  $scope.formModel.reqInstanceID = InstanceIdService.get();
                  if (!$scope.formModel.reqInstanceID) {
                     ResponseHandlerService.handleError('Instance ID is not available. Please try again later.');
                     return;
                  }
                  if ($scope.displayMode === "edit" && $scope.itemID > 0) {
                     await NonConformingProductService.updateNonConformingProduct($scope.itemID, $scope.formModel);
                     ResponseHandlerService.handleSuccess("Customer complaint updated successfully.");
                  } else {
                     $scope.formModel.InitiatorId = SPuser.get_id();
                     await NonConformingProductService.createNonConformingProduct($scope.formModel);
                     ResponseHandlerService.handleSuccess("Customer complaint created successfully.");
                  }
               } catch (error) {
                  console.error('Error creating/editing customer complaint:', error);
                  ResponseHandlerService.handleError(error);
               } finally {
                  $scope.$applyAsync(() => LoaderService.hide());
               }
            };

            // Form Display
            async function renderEditForm(itemID) {
               try {
                  const formData = await NonConformingProductService.loadFormData(itemID);
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
