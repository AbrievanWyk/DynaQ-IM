'use strict';

const BaseMapper = (function() {
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

    function determineTaskStatus($scope, $scopeCustomerComplaint) {
        return {
            taskStat: $scope.skipToEnd ? "Completed" : ($scopeCustomerComplaint.IsDraft ? "Draft" : "New"),
            arStatus: $scope.skipToEnd ? "Completed" : "In Progress"
        };
    }

    return {
        mapCommonDataToView,
        mapProductDataToView,
        determineTaskStatus
    };
})(); 