define(['app', 'listOperations', 'responseHandlerService', 'sharedConstants', 'nonConformingProductConstants', 'nonConformingProductMapper'], function (app) {
   'use strict';

   return app.service('NonConformingProductService', function (
      $q,
      $rootScope,
      SPListOperations,
      ResponseHandlerService,
      SHARED_CONSTANTS,
      NON_CONFORMING_PRODUCT_CONSTANTS,
      NON_CONFORMING_PRODUCT_LOOKUP_CONFIG,
      NonConformingProductMapper
   ) {
      var that = this;
      // Initialize main lists
      this.initializeMainLists = function () {
         SPListOperations.populateScopeList("Business Area");
         SPListOperations.populateScopeList("Area of Problem Departments");
         // SPListOperations.populateScopeList("HasThisHappenedBefore");
      };

      // Initialize dropdown options
      this.initializeDropdownOptions = function () {
         const dropdownLookupLists = NON_CONFORMING_PRODUCT_CONSTANTS.DROPDOWN_LOOKUP_LISTS;
         const lookupPromises = dropdownLookupLists.map(list => {
            let parentIdColumnName = null;
            if (list == "Products") parentIdColumnName = "Product_x0020_Category";
            return SPListOperations.getLookupColumnOptions(list, parentIdColumnName).then(options => {
               $rootScope.$apply(() => {
                  const scopeProperty = SHARED_CONSTANTS.LIST_TO_SCOPE_MAPPINGS[list];
                  if (scopeProperty) {
                     $rootScope[scopeProperty] = options;
                  }
               });
            });
         });

         return $q.all([...lookupPromises])
            .then(() => {
               // $rootScope.$apply(() => {
               $rootScope.formReady = true;
               // });
            })
            .catch(err => {
               console.error("Error loading lists:", err);
            });
      };

      // Create a new non-conforming product
      this.createNonConformingProduct = async function (formModel) {
         try {
            const result = await SPListOperations.addListItem(SHARED_CONSTANTS.INCIDENT_LIST_NAME, formModel);
            await ResponseHandlerService.handleSuccess(result);
            return result;
         } catch (error) {
            ResponseHandlerService.handleError(error);
            throw error;
         }
      };

      // Update an existing non-conforming product
      this.updateNonConformingProduct = async function (itemID, formModel) {
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
         const formModel = NonConformingProductMapper.mapFormData(mainData);

         return {
            formModel,
            complexTypesModel: {
               AssignedTo: mainData.AssignedTo ? [mainData.AssignedTo] : []
            }
         };
      };

      this.loadMainData = async function (itemID) {
         const mainFields = [
            ...Object.values(SP_FIELDS.COMMON),
            ...Object.values(SP_FIELDS.PRODUCT),
            ...Object.values(SP_FIELDS.NON_CONFORMING_PRODUCT)
         ];
         return await SPListOperations.getListItem(
            SHARED_CONSTANTS.INCIDENT_LIST_NAME,
            itemID,
            mainFields,
            NON_CONFORMING_PRODUCT_LOOKUP_CONFIG.MAIN);
      };
   });
});