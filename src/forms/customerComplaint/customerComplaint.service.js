define(['app', 'listOperations', 'responseHandlerService', 'sharedConstants', 'customerComplaintConstants', 'customerComplaintMapper'], function (app) {
   'use strict';

   return app.service('CustomerComplaintService', function (
      $q,
      $rootScope,
      SPListOperations,
      ResponseHandlerService,
      SHARED_CONSTANTS,
      CUSTOMER_COMPLAINT_CONSTANTS,
      CUSTOMER_COMPLAINT_LOOKUP_CONFIG,
      CustomerComplaintMapper
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
         const dropdownLookupLists = CUSTOMER_COMPLAINT_CONSTANTS.DROPDOWN_LOOKUP_LISTS;
         const lookupPromises = dropdownLookupLists.map(list => {
            let parentIdColumnName = null;
            if (list == "Service Categories") parentIdColumnName = "Complaint_x0020_Type";
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

         const choicePromise = SPListOperations.getChoiceColumnOptions(SHARED_CONSTANTS.INCIDENT_LIST_NAME, "CustomerComplaintCategory")
            .then(options => {
               $rootScope.$apply(() => {
                  $rootScope.CustomerComplaintCategories = options;
                  $rootScope.claimOptions = [
                     { label: 'Yes', value: true },
                     { label: 'No', value: false }
                  ];
               });
            });

         return $q.all([...lookupPromises, choicePromise])
            .then(() => {
               // $rootScope.$apply(() => {
               $rootScope.formReady = true;
               // });
            })
            .catch(err => {
               console.error("Error loading lists:", err);
            });
      };

      // Create a new customer complaint
      this.createCustomerComplaint = async function (formModel) {
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
      this.updateCustomerComplaint = async function (itemID, formModel) {
         try {
            const result = await SPListOperations.updateListItem(SHARED_CONSTANTS.INCIDENT_LIST_NAME, itemID, formModel);
            await ResponseHandlerService.handleSuccess(result);
            return result;
         } catch (error) {
            ResponseHandlerService.handleError(error);
            throw error;
         }
      };

      // Populate the customer representative list
      this.populateCustomerRepresentativeList = function () {
         const deferred = $q.defer();
         const list = website.get_lists().getByTitle("CustomerRepresentatives");
         const query = new SP.CamlQuery();
         const items = list.getItems(query);

         clientContext.load(list);
         clientContext.load(items);

         clientContext.executeQueryAsync(
            function () {
               const enumerator = items.getEnumerator();
               const ScopelistOfObjects = [];
               while (enumerator.moveNext()) {
                  const currentListItem = enumerator.get_current();
                  const singleObj = {
                     id: currentListItem.get_item('ID'),
                     value: currentListItem.get_item('Title'),
                     email: currentListItem.get_item('Email'),
                     area: currentListItem.get_item('Area'),
                     isChecked: false
                  };
                  ScopelistOfObjects.push(singleObj);
               }
               $rootScope.$apply(function () {
                  $rootScope.CustomerRepresentatives = ScopelistOfObjects;
               });
               deferred.resolve(ScopelistOfObjects);
            },
            function (sender, args) {
               console.log('Error: ' + args.get_message());
               deferred.reject(args.get_message());
            }
         );
         return deferred.promise;
      };

      this.loadFormData = async function (itemID) {
         const mainData = await this.loadMainData(itemID);
         const extensionData = await this.loadExtensionData(itemID);
         const formModel = CustomerComplaintMapper.mapFormData(mainData, extensionData);

         // Map selected customer representatives from extensionData to CustomerRepresentativeList
         let customerRepresentatives = [];
         if (Array.isArray(extensionData.CustomerRepresentatives?.results) && Array.isArray($rootScope.CustomerRepresentatives)) {
            customerRepresentatives = extensionData.CustomerRepresentatives?.results.map(rep => {
               // Find the matching option in CustomerRepresentatives by id
               return $rootScope.CustomerRepresentatives.find(opt => opt.id === rep.Id) || {
                  id: rep.Id,
                  value: rep.Title || '',
                  email: rep.EMail || rep.Email || '',
                  area: rep.Area || '',
                  isChecked: false
               };
            });
         } else {
            customerRepresentatives = [];
         }

         return {
            formModel,
            complexTypesModel: {
               BusinessManagers: extensionData.BusinessManagers?.results || [],
               AssignedTo: mainData.AssignedTo ? [mainData.AssignedTo] : []
            },
            customerRepresentatives
         };
      };

      this.loadMainData = async function (itemID) {
         const mainFields = [
            ...Object.values(SP_FIELDS.COMMON),
            ...Object.values(SP_FIELDS.CUSTOMER)
         ];
         return await SPListOperations.getListItem(
            SHARED_CONSTANTS.INCIDENT_LIST_NAME,
            itemID,
            mainFields,
            CUSTOMER_COMPLAINT_LOOKUP_CONFIG.MAIN);
      };

      this.loadExtensionData = async function (itemID) {
         const extensionFields = [
            ...Object.values(SP_FIELDS.PRODUCT),
            ...Object.values(SP_FIELDS.COMPLAINT)
         ];
         return await SPListOperations.getListItem(
            SHARED_CONSTANTS.INCIDENT_LIST_NAME,
            itemID,
            extensionFields,
            CUSTOMER_COMPLAINT_LOOKUP_CONFIG.EXTENSION
         );
      };

      this.addRepresentative = function (formScope, selectedRep) {
         if (!selectedRep || !selectedRep.id) return;

         if (!formScope.CustomerRepresentativeList) {
            formScope.CustomerRepresentativeList = [];
         }

         const exists = formScope.CustomerRepresentativeList.some(rep => rep.id === selectedRep.id);
         if (!exists) {
            formScope.CustomerRepresentativeList.push(angular.copy(selectedRep));
            that.syncCustomerRepresentativeIds(formScope);
         }

         formScope.selRepresentativeNames = null;
      };

      this.removeRepresentative = function (formScope, repToRemove) {
         if (!formScope.CustomerRepresentativeList) return;

         formScope.CustomerRepresentativeList = formScope.CustomerRepresentativeList.filter(rep => rep.id !== repToRemove.id);
         that.syncCustomerRepresentativeIds(formScope);
      };

      this.syncCustomerRepresentativeIds = function (formScope) {
         if (!formScope.formModel) formScope.formModel = {};
         formScope.formModel.CustomerRepresentativesId = { results: formScope.CustomerRepresentativeList.map(rep => rep.id) };
      }
   });
});