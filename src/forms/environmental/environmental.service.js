define(['app', 'listOperations', 'responseHandlerService', 'sharedConstants', 'customerComplaintConstants', 'customerComplaintMapper'], function (app) {
   'use strict';

   return app.service('EnvironmentalService', function (
      $q,
      $rootScope,
      SPListOperations,
      ResponseHandlerService,
      SHARED_CONSTANTS,
      ENVIRONMENTAL_CONSTANTS,
      ENVIRONMENTAL_LOOKUP_CONFIG,
      EnvironmentalMapper
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
         const dropdownLookupLists = ENVIRONMENTAL_CONSTANTS.DROPDOWN_LOOKUP_LISTS;
         const lookupPromises = dropdownLookupLists.map(list => {
            let parentIdColumnName = null;
            if (list == "Incident Subclassifications") parentIdColumnName = "Classificationof_x0020_Incident";
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

      // Create a new Environmental incident
      this.createEnvironmental = async function (formModel) {
         try {
            const result = await SPListOperations.addListItem(SHARED_CONSTANTS.INCIDENT_LIST_NAME, formModel);
            await ResponseHandlerService.handleSuccess(result);
            return result;
         } catch (error) {
            ResponseHandlerService.handleError(error);
            throw error;
         }
      };

      // Update an existing Environmental incident
      this.updateEnvironmental = async function (itemID, formModel) {
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
         const extensionData = await this.loadExtensionData(itemID);
         const formModel = EnvironmentalMapper.mapFormData(mainData, extensionData);

         return {
            formModel,
            complexTypesModel: {
               PermitConditions: extensionData.PermitCondition?.results || [],
               PublicComplaints: extensionData.PublicComplaint?.results || [],
               NonComformances: extensionData.NonComformance?.results || [],
               ExcessiveResourceUses: extensionData.ExcessiveResourceUse?.results || [],
               WasteGenerations: extensionData.WasteGeneration?.results || [],
               EnvironmentalSpillages: extensionData.EnvironmentalSpillage?.results || [],

               ScopeOfPollutions: extensionData.ScopeOfPollution?.results || [],
               DurationOfPollutions: extensionData.DurationOfPollution?.results || [],
               EnvironmentalImpacts: extensionData.EnvironmentalImpact?.results || [],


               AssignedTo: mainData.AssignedTo ? [mainData.AssignedTo] : []
            },
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
            ENVIRONMENTAL_LOOKUP_CONFIG.MAIN);
      };

      this.loadExtensionData = async function (itemID) {
         const extensionFields = [
            ...Object.values(SP_FIELDS.ENVIRONMENTAL)
         ];
         return await SPListOperations.getListItem(
            SHARED_CONSTANTS.INCIDENT_LIST_NAME,
            itemID,
            extensionFields,
            ENVIRONMENTAL_LOOKUP_CONFIG.EXTENSION
         );
      };
   });
});