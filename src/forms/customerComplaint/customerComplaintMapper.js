'use strict';

const CustomerComplaintMapper = (function () {
   // Core mapping function
   async function mapViewToModel($scope, $scopeCustomerComplaint) {
      const taskStatus = determineTaskStatus($scope, $scopeCustomerComplaint);
      const investigator = SPHelper.getUserInfo();
      const businessManagers = await SPUtils.getBusinessManagers();

      const complaintData = {
         common: mapBasicInfo($scope, $scopeCustomerComplaint),
         customer: mapCustomerInfo($scopeCustomerComplaint),
         product: mapProductInfo($scopeCustomerComplaint),
         dates: mapDateInfo($scopeCustomerComplaint),
         classifications: mapClassificationInfo($scopeCustomerComplaint),
         representatives: await mapRepresentativesInfo($scope, $scopeCustomerComplaint)
      };

      const itemProperties = buildListItemProperties({
         ...complaintData,
         taskStatus,
         businessManagerIds: businessManagers,
         initiatorId: SPuser.get_id(),
         isDraft: $scope.IsDraft,
         existingARReference: $scope.skipToEnd ? $("#existingARReference").val() : null
      });

      if (!($scope.IsDraft || $scope.skipToEnd)) {
         const assignedTo = await determineAssignedTo(taskStatus, investigator);
         const userId = await SPUtils.getSPUserId(assignedTo);
         itemProperties.AssignedToId = userId;
      }

      return itemProperties;
   }

   //View/Model mapping
   function mapModelToView(mainData, extensionData) {
      return {
         common: mapCommonDataToView(mainData),
         customer: mapCustomerDataToView(mainData),
         product: mapProductDataToView(extensionData),
         complaint: mapComplaintDataToView(extensionData)
      };
   }

   function mapCommonDataToView(item) {
      return {
         id: item.get_item(SP_FIELDS.COMMON.ID),
         title: item.get_item(SP_FIELDS.COMMON.TITLE),
         arReason: item.get_item(SP_FIELDS.COMMON.AR_REASON),
         businessArea: item.get_item(SP_FIELDS.COMMON.BUSINESS_AREA)?.get_lookupValue(),
         departmentArea: item.get_item(SP_FIELDS.COMMON.DEPARTMENT_AREA)?.get_lookupValue(),
         description: item.get_item(SP_FIELDS.COMMON.DESCRIPTION),
         happenedBefore: item.get_item(SP_FIELDS.COMMON.HAPPENED_BEFORE)?.get_lookupValue(),
         isDraft: item.get_item(SP_FIELDS.COMMON.IS_DRAFT),
         created: item.get_item(SP_FIELDS.COMMON.CREATED),
         initiator: item.get_item(SP_FIELDS.COMMON.INITIATOR)?.get_lookupValue(),
         taskStatus: item.get_item(SP_FIELDS.COMMON.TASK_STATUS),
         arStatus: item.get_item(SP_FIELDS.COMMON.AR_STATUS)
      };
   }

   function mapProductDataToView(item) {
      return {
         category: item.get_item(SP_FIELDS.PRODUCT.CATEGORY)?.get_lookupValue(),
         name: item.get_item(SP_FIELDS.PRODUCT.NAME)?.get_lookupValue(),
         unitQuantity: item.get_item(SP_FIELDS.PRODUCT.UNIT_QUANTITY),
         unitType: item.get_item(SP_FIELDS.PRODUCT.UNIT_TYPE)?.get_lookupValue(),
         productionDate: item.get_item(SP_FIELDS.PRODUCT.PRODUCTION_DATE),
         bestBeforeDate: item.get_item(SP_FIELDS.PRODUCT.BEST_BEFORE_DATE),
         batchNumber: item.get_item(SP_FIELDS.PRODUCT.BATCH_NUMBER)
      };
   }

   function mapCustomerDataToView(item) {
      return {
         name: item.get_item(SP_FIELDS.CUSTOMER.NAME)?.get_lookupValue(),
         category: item.get_item(SP_FIELDS.CUSTOMER.CATEGORY),
         location: item.get_item(SP_FIELDS.CUSTOMER.LOCATION),
         province: item.get_item(SP_FIELDS.CUSTOMER.PROVINCE)?.get_lookupValue(),
         storeOutlet: item.get_item(SP_FIELDS.CUSTOMER.STORE_OUTLET)?.get_lookupValue(),
         sourceOfComplaint: item.get_item(SP_FIELDS.CUSTOMER.SOURCE_OF_COMPLAINT)?.get_lookupValue(),
         contact: {
            person: item.get_item(SP_FIELDS.CUSTOMER.CONTACT_PERSON),
            phone: item.get_item(SP_FIELDS.CUSTOMER.CONTACT_PHONE),
            email: item.get_item(SP_FIELDS.CUSTOMER.CONTACT_EMAIL)
         }
      };
   }

   function mapComplaintDataToView(item) {
      return {
         type: item.get_item(SP_FIELDS.COMPLAINT.TYPE)?.get_lookupValue(),
         classification: item.get_item(SP_FIELDS.COMPLAINT.CLASSIFICATION)?.get_lookupValue(),
         existingRef: item.get_item(SP_FIELDS.COMPLAINT.EXISTING_REF),
         problemDate: item.get_item(SP_FIELDS.COMPLAINT.PROBLEM_DATE),
         isClaim: item.get_item(SP_FIELDS.COMPLAINT.IS_CLAIM),
         claimDetail: item.get_item(SP_FIELDS.COMPLAINT.CLAIM_DETAIL),
         representatives: formatRepresentatives(item.get_item(SP_FIELDS.COMPLAINT.REPRESENTATIVES)),
         businessManagers: formatBusinessManagers(item.get_item(SP_FIELDS.COMPLAINT.BUSINESS_MANAGERS))
      };
   }

   // Helper functions for formatting
   function formatRepresentatives(representatives) {
      if (!representatives) return [];

      return representatives.map(rep => ({
         id: rep.get_lookupId(),
         value: rep.get_lookupValue(),
         email: '', // TODO: This would need to be populated from the scope
         area: '', // TODO: This would need to be populated from the scope
         isChecked: true
      }));

      //  if (!representatives) return [];

      //  return representatives.map(rep => {
      //     const matchingRep = formScope.CustomerRepresentatives.find(
      //        e => e.id === rep.get_lookupId()
      //     );

      //     return {
      //        id: rep.get_lookupId(),
      //        value: rep.get_lookupValue(),
      //        email: matchingRep?.email || '',
      //        area: matchingRep?.area || '',
      //        isChecked: true
      //     };
      //  });
   }

   function formatBusinessManagers(managers) {
      if (!managers) return [];

      return managers.map(manager => ({
         Key: manager.get_email(),
         DisplayText: manager.get_lookupValue() || manager.get_email(),
         Description: manager.get_email(),
         EntityType: "User",
         IsResolved: true
      }));
   }

   function formatListItems(items) {
      if (!items) return [];

      try {
         const formattedItems = [];
         const itemCount = items.get_count();

         for (let i = 0; i < itemCount; i++) {
            const item = items.itemAt(i);
            formattedItems.push({
               id: item.get_item('ID'),
               value: item.get_item('Title')
            });
         }

         return formattedItems;
      } catch (error) {
         console.error('Error formatting list items:', error);
         return [];
      }
   }

   // Status and Assignment Helpers
   function determineTaskStatus($scope, $scopeCustomerComplaint) {
      return {
         taskStat: $scope.skipToEnd ? "Completed" : ($scopeCustomerComplaint.IsDraft ? "Draft" : "New"),
         arStatus: $scope.skipToEnd ? "Completed" : "In Progress"
      };
   }

   async function determineAssignedTo(taskStatus, investigator) {
      try {
         if (taskStatus.taskStat === "New") {
            return investigator['Key'];
         }
         return null;
      } catch (error) {
         console.error('Error determining assigned user:', error);
         throw error;
      }
   }

   // Section Mappers
   function mapBasicInfo($scope, $scopeCustomerComplaint) {
      if ($scope.IsDraft) return {};

      return {
         title: $scope.listTitle,
         businessAreaId: $scope.selBusinessArea.id,
         debtAreaOfProblemId: $scope.selProbDebtArea.id,
         description: tinyMCE.get('DescriptionTextArea')?.getContent({ format: 'raw' }),
         hasThisHappenedBeforeId: $scope.selHasThisHappenedBefore.id
      };
   }

   function mapCustomerInfo($scopeCustomerComplaint) {
      return {
         customerId: getCustomerId($scopeCustomerComplaint),
         location: $scopeCustomerComplaint.custLocation,
         contactPerson: $scopeCustomerComplaint.contactPerson,
         telephone: $scopeCustomerComplaint.contactTel,
         email: $scopeCustomerComplaint.contactEmail,
         provinceId: getProvinceId($scopeCustomerComplaint),
         storeId: getStoreId($scopeCustomerComplaint),
         sourceOfComplaintId: getSourceId($scopeCustomerComplaint)
      };
   }

   function mapProductInfo($scopeCustomerComplaint) {
      return {
         categoryId: getProductCategoryId($scopeCustomerComplaint),
         productNameId: getProductNameId($scopeCustomerComplaint),
         unitQuantity: $scopeCustomerComplaint.unitQuantity,
         unitTypeId: getUnitTypeId($scopeCustomerComplaint),
         batchNumber: $scopeCustomerComplaint.batchNumberFiled
      };
   }

   function mapDateInfo($scopeCustomerComplaint) {
      let problemDate = FormUtils.formatDate(FormUtils.convertStringToDate($scopeCustomerComplaint.datepicker), "mm/dd/yy");
      let productionDate = FormUtils.formatDate(FormUtils.convertStringToDate($scopeCustomerComplaint.productionDateDatepicker), "mm/dd/yy");
      let bestBeforeDate = FormUtils.formatDate(FormUtils.convertStringToDate($scopeCustomerComplaint.bestBeforeDatepicker), "mm/dd/yy");

      return {
         problemDate: $("#datepicker").datepicker("getDate") || problemDate,
         productionDate: $("#productionDateDatepicker").datepicker("getDate") || productionDate,
         bestBeforeDate: $("#bestBeforeDatepicker").datepicker("getDate") || bestBeforeDate
      };
   }

   function mapClassificationInfo($scopeCustomerComplaint) {
      return {
         productServiceId: getProductServiceId($scopeCustomerComplaint),
         classificationId: getClassificationId($scopeCustomerComplaint),
         categoryId: getComplaintCategoryId($scopeCustomerComplaint)
      };
   }

   async function mapRepresentativesInfo($scope, $scopeCustomerComplaint) {
      try {
         const representatives = $scope.ShowSelectedCustomerRepresentatives?.map(rep => rep.id) || [];
         return {
            list: representatives,
            isCustomerClaim: getIsCustomerClaim($scopeCustomerComplaint),
            claimDetail: tinyMCE.get('CustomerClaimDetailTextArea')?.getContent({ format: 'raw' })
         };
      } catch (error) {
         console.error('Error getting representatives info:', error);
         throw error;
      }
   }

   // ID Getters
   function getCustomerId($scope) {
      return ($scope.IsDraft === false || $scope.selCustomerNames != null)
         ? $scope.selCustomerNames.id
         : null;
   }

   function getProvinceId($scope) {
      return ($scope.IsDraft === false && $scope.selProvince != null) || $scope.selProvince != null
         ? $scope.selProvince.id
         : null;
   }

   function getStoreId($scope) {
      return ($scope.IsDraft === false && $scope.selStoreOutletRetailer != null) || $scope.selStoreOutletRetailer != null
         ? $scope.selStoreOutletRetailer.id
         : null;
   }

   function getSourceId($scope) {
      return ($scope.IsDraft === false && $scope.selSourceOfComplaint != null) || $scope.selSourceOfComplaint != null
         ? $scope.selSourceOfComplaint.id
         : null;
   }

   function getUnitTypeId($scope) {
      return ($scope.IsDraft === false && $scope.selUnitType != null) || $scope.selUnitType != null
         ? $scope.selUnitType.id
         : null;
   }

   function getProductServiceId($scope) {
      return ($scope.IsDraft === false || $scope.selProductOrServiceComplaint != null)
         ? $scope.selProductOrServiceComplaint.id
         : null;
   }

   function getClassificationId($scope) {
      return ($scope.IsDraft === false || $scope.selComplaintClassification != null)
         ? $scope.selComplaintClassification.id
         : null;
   }

   function getComplaintCategoryId($scope) {
      return ($scope.IsDraft === false && $scope.selComplaintCategory != null) || $scope.selComplaintCategory != null
         ? $scope.selComplaintCategory.value
         : null;
   }

   function getProductCategoryId($scope) {
      return ($scope.IsDraft === false || $scope.selProductCategory != null)
         ? $scope.selProductCategory.id
         : null;
   }

   function getProductNameId($scope) {
      return ($scope.IsDraft === false || $scope.selComplaintProductName != null)
         ? $scope.selComplaintProductName.id
         : null;
   }

   function getIsCustomerClaim($scope) {
      return ($scope.IsDraft === false || $scope.selIsCustomerClaim != null)
         ? $scope.selIsCustomerClaim
         : null;
   }

   // Final Properties Builder
   function buildListItemProperties(data) {
      return {
         "TaskStat": data.taskStatus.taskStat,
         "ARReason": "Customer complaint",
         "ARStatus": data.taskStatus.arStatus,
         "Title": data.common.title,
         "IMKpiDescription": data.common.description,
         "CustomerLocation": data.customer.location,
         "CustomerContactPerson": data.customer.contactPerson,
         "CustomerContactTelephone": data.customer.telephone,
         "CustomerContactEmail": data.customer.email,
         "CustomerProblemDate": data.dates.problemDate,
         "IsCustomerClaim": data.representatives.isCustomerClaim,
         "CustomerClaimDetail": data.representatives.claimDetail,
         "AreaId": data.common.businessAreaId,
         "DepartmentAreaofProblemId": data.common.debtAreaOfProblemId,
         "hasThisHappenedBeforeId": data.common.hasThisHappenedBeforeId,
         "CustomerNameId": data.customer.customerId,
         "ProvinceId": data.customer.provinceId,
         "StoreOutletRetailerId": data.customer.storeId,
         "SourceofComplaintId": data.customer.sourceOfComplaintId,
         "UnitQuantity": data.product.unitQuantity,
         "UnitTypeId": data.product.unitTypeId,
         "ComplaintTypeId": data.classifications.productServiceId,
         "CustomerComplaintServiceId": data.classifications.classificationId,
         "ProductCategoryId": data.product.categoryId,
         "ProductNameId": data.product.productNameId,
         "CustomerRepresentativesId": { "results": data.representatives.list },
         "InitiatorId": data.initiatorId,
         "BusinessManagersId": { "results": data.businessManagerIds },
         "IsDraft": data.isDraft,
         "ProductionDate": data.dates.productionDate,
         "BestBeforeDate": data.dates.bestBeforeDate,
         "BatchNumberFiled": data.product.batchNumber,
         "CustomerComplaintCategory": data.classifications.categoryId,
         "ExistingARReference": data.existingARReference
      };
   }

   return {
      mapViewToModel,
      mapModelToView,
      formatListItems,
      buildListItemProperties // Exposed for testing or specific use cases
   };
})();

window.CustomerComplaintMapper = CustomerComplaintMapper; 