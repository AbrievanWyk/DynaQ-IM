define(['app', 'listOperations', 'responseHandlerService', 'sharedConstants', 'internalNonConformanceConstants', 'internalNonConformanceMapper'], function (app) {
   'use strict';

   return app.service('InternalNonConformanceService', function (
      $q,
      $rootScope,
      SPListOperations,
      ResponseHandlerService,
      SHARED_CONSTANTS,
      INTERNAL_NON_CONFORMANCE_CONSTANTS,
      INTERNAL_NON_CONFORMANCE_LOOKUP_CONFIG,
      InternalNonConformanceMapper
   ) {
      var that = this;
      // Initialize main lists
      this.initializeMainLists = function () {
         SPListOperations.populateScopeList("Business Area");
         SPListOperations.populateScopeList("Area of Problem Departments");
         // SPListOperations.populateScopeList("HasThisHappenedBefore");
      };

      // Create a new customer complaint
      this.createInternalNonConformance = async function (formModel) {
         try {
            const result = await SPListOperations.addListItem(SHARED_CONSTANTS.INCIDENT_LIST_NAME, formModel);
            await ResponseHandlerService.handleSuccess(result);
            return result;
         } catch (error) {
            ResponseHandlerService.handleError(error);
            throw error;
         }
      };

      // Update an existing customer complaint
      this.updateInternalNonConformance = async function (itemID, formModel) {
         try {
            const result = await SPListOperations.updateListItem(SHARED_CONSTANTS.INCIDENT_LIST_NAME, itemID, formModel);
            await ResponseHandlerService.handleSuccess(result);
            return result;
         } catch (error) {
            ResponseHandlerService.handleError(error);
            throw error;
         }
      };

      this.loadFormData = async function (itemID) {
         const mainData = await this.loadMainData(itemID);
         const formModel = InternalNonConformanceMapper.mapFormData(mainData);

         return {
            formModel,
            complexTypesModel: {
               AssignedTo: mainData.AssignedTo ? [mainData.AssignedTo] : []
            }
         };
      };

      this.loadMainData = async function (itemID) {
         const mainFields = [
            ...Object.values(SP_FIELDS.COMMON)
         ];
         return await SPListOperations.getListItem(
            SHARED_CONSTANTS.INCIDENT_LIST_NAME,
            itemID,
            mainFields,
            INTERNAL_NON_CONFORMANCE_LOOKUP_CONFIG.MAIN);
      };
   });
});