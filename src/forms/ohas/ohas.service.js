define(['app', 'listOperations', 'responseHandlerService', 'sharedConstants', 'ohasConstants', 'ohasMapper'], function (app) {
   'use strict';

   return app.service('OhasService', function (
      $q,
      $rootScope,
      SPListOperations,
      ResponseHandlerService,
      SHARED_CONSTANTS,
      OHAS_CONSTANTS,
      OHAS_LOOKUP_CONFIG,
      OhasMapper
   ) {
      // Initialize main lists
      this.initializeMainLists = function () {
         SPListOperations.populateScopeList("Business Area");
         SPListOperations.populateScopeList("Area of Problem Departments");
      };

      // Initialize dropdown options
      this.initializeDropdownOptions = function () {
         const dropdownLookupLists = OHAS_CONSTANTS.DROPDOWN_LOOKUP_LISTS;
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

      // Create a new Ohas incident
      this.createOhas = async function (formModel) {
         try {
            const result = await SPListOperations.addListItem(SHARED_CONSTANTS.INCIDENT_LIST_NAME, formModel);
            await ResponseHandlerService.handleSuccess(result);
            return result;
         } catch (error) {
            ResponseHandlerService.handleError(error);
            throw error;
         }
      };

      // Update an existing Ohas incident
      this.updateOhas = async function (itemID, formModel) {
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
         const formModel = OhasMapper.mapFormData(mainData, extensionData);

         return {
            formModel,
            complexTypesModel: {
               PartsofBodyAffected: extensionData.PartofBodyAffected?.results || [],
               OccupationalStressors: extensionData.OccupationalStressor?.results || [],
               ImmediateCauses: extensionData.ImmediateCause?.results || [],
               NatureOfInjuries: extensionData.NatureOfInjury?.results || [],
               SourceOfInjuries: extensionData.SourceOfInjury?.results || [],


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
            OHAS_LOOKUP_CONFIG.MAIN);
      };

      this.loadExtensionData = async function (itemID) {
         const extensionFields = [
            ...Object.values(SP_FIELDS.OHAS)
         ];
         return await SPListOperations.getListItem(
            SHARED_CONSTANTS.INCIDENT_LIST_NAME,
            itemID,
            extensionFields,
            OHAS_LOOKUP_CONFIG.EXTENSION
         );
      };
   });
});