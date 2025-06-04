'use strict';

const NonConformingProductMapper = (function () {
   // Core mapping function
   async function mapViewToModel($scope, $scopeCustomerComplaint) {
      const taskStatus = determineTaskStatus($scope, $scopeCustomerComplaint);
      const investigator = SPHelper.getUserInfo();

      const itemData = {
         common: mapCommonInfo($scope, $scopeCustomerComplaint),
         supplier: $scopeCustomerComplaint.ProductSupplier,
         product: mapProductInfo($scopeCustomerComplaint),
         dates: mapDateInfo($scopeCustomerComplaint)
      };

      const itemProperties = buildListItemProperties({
         ...itemData,
         taskStatus,
         initiatorId: SPuser.get_id(),
         isDraft: $scope.IsDraft
      });

      if (!($scope.IsDraft || $scope.skipToEnd)) {
         const assignedTo = await determineAssignedTo(taskStatus, investigator);
         const userId = await SPUtils.getSPUserId(assignedTo);
         itemProperties.AssignedToId = userId;
      }

      return itemProperties;
   }

   //View/Model mapping
   function mapModelToView(mainData) {
      return {
         common: mapCommonDataToView(mainData),
         product: mapProductDataToView(mainData),
         nonConformingProduct: mapNonConformingProductDataToView(mainData)
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

   function mapNonConformingProductDataToView(item) {
      return {
         supplier: item.get_item(SP_FIELDS.NON_CONFORMING_PRODUCT.SUPPLIER)
      };
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
   function mapCommonInfo($scope, $scopeCustomerComplaint) {
      // if ($scope.IsDraft) return {};

      return {
         title: $scope.listTitle,
         businessAreaId: $scope.selBusinessArea?.id,
         debtAreaOfProblemId: $scope.selProbDebtArea?.id,
         description: tinyMCE.get('DescriptionTextArea')?.getContent({ format: 'raw' }),
         hasThisHappenedBeforeId: $scope.selHasThisHappenedBefore?.id
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
      let productionDate = FormUtils.formatDate(FormUtils.convertStringToDate($scopeCustomerComplaint.productionDateDatepicker), "mm/dd/yy");
      let bestBeforeDate = FormUtils.formatDate(FormUtils.convertStringToDate($scopeCustomerComplaint.bestBeforeDatepicker), "mm/dd/yy");

      return {
         productionDate: $("#productionDateDatepicker").datepicker("getDate") || productionDate,
         bestBeforeDate: $("#bestBeforeDatepicker").datepicker("getDate") || bestBeforeDate
      };
   }

   // Final Properties Builder
   function buildListItemProperties(data) {
      return {
         "Title": data.common.title,
         "TaskStat": data.taskStatus.taskStat,
         "ARReason": "Non-conforming product",
         "ARStatus": data.taskStatus.arStatus,
         "ProductSupplier": data.supplier,
         "IMKpiDescription": data.common.description,
         "UnitTypeId": data.product.unitTypeId,
         "UnitQuantity": data.product.unitQuantity,
         "AreaId": data.common.businessAreaId,
         "DepartmentAreaofProblemId": data.common.debtAreaOfProblemId,
         "ProductCategoryId": data.product.categoryId,
         "ProductNameId": data.product.productNameId,
         "hasThisHappenedBeforeId": data.common.hasThisHappenedBeforeId,
         "ProductionDate": data.dates.productionDate,
         "BestBeforeDate": data.dates.bestBeforeDate,
         "BatchNumberFiled": data.product.batchNumber,
         "IsDraft": data.isDraft,
         "InitiatorId": data.initiatorId
      }
   }

   function getUnitTypeId($scope) {
      return ($scope.IsDraft === false && $scope.selUnitType != null) || $scope.selUnitType != null
         ? $scope.selUnitType.id
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

   return {
      mapViewToModel,
      mapModelToView,
      buildListItemProperties // Exposed for testing or specific use cases
   };
})();

window.NonConformingProductMapper = NonConformingProductMapper; 