define(['app', 'listOperations', 'responseHandlerService', 'sharedConstants', 'auditFindingConstants', 'auditFindingMapper'], function (app) {
   'use strict';

   return app.service('AuditFindingService', function (
      $q,
      $rootScope,
      SPListOperations,
      ResponseHandlerService,
      SHARED_CONSTANTS,
      AUDIT_FINDING_CONSTANTS,
      AUDIT_FINDING_LOOKUP_CONFIG,
      AuditFindingMapper
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
         const dropdownLookupLists = AUDIT_FINDING_CONSTANTS.DROPDOWN_LOOKUP_LISTS;
         const lookupPromises = dropdownLookupLists.map(list => {
            let parentIdColumnName = null;
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
               $rootScope.formReady = true;
            })
            .catch(err => {
               console.error("Error loading lists:", err);
            });
      };

      // Create a new audit finding
      this.createAuditFinding = async function (formModel) {
         try {
            const result = await SPListOperations.addListItem(SHARED_CONSTANTS.INCIDENT_LIST_NAME, formModel);
            await ResponseHandlerService.handleSuccess(result);
            return result;
         } catch (error) {
            ResponseHandlerService.handleError(error);
            throw error;
         }
      };

      // Update an existing audit finding
      this.updateAuditFinding = async function (itemID, formModel) {
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
         const formModel = AuditFindingMapper.mapFormData(mainData);

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
            ...Object.values(SP_FIELDS.AUDIT_FINDING)
         ];
         return await SPListOperations.getListItem(
            SHARED_CONSTANTS.INCIDENT_LIST_NAME,
            itemID,
            mainFields,
            AUDIT_FINDING_LOOKUP_CONFIG.MAIN);
      };
   });
});