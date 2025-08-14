'use strict';

const NonConformingProductService = (function () {
   async function createNonConformingProduct($scope, $scopeCustomerComplaint) {
      try {
         const itemProperties = await NonConformingProductMapper.mapViewToModel($scope, $scopeCustomerComplaint);
         const result = await SPListOperations.addListItem('Incidents', itemProperties);
         await ResponseHandlerService.handleSuccess(result);
         return result;
      } catch (error) {
         ResponseHandlerService.handleError(error);
         throw error;
      }
   }

   async function updateNonConformingProduct($scope, $scopeCustomerComplaint) {
      try {
         const itemProperties = await NonConformingProductMapper.mapViewToModel($scope, $scopeCustomerComplaint);
         const result = await SPListOperations.updateListItem('Incidents', itemProperties, $scopeCustomerComplaint.itemID);
         await ResponseHandlerService.handleSuccess(result);
         return result;
      } catch (error) {
         ResponseHandlerService.handleError(error);
         throw error;
      }
   }

   async function updateProductNames(productCategory) {
      const dfrd = $.Deferred();

      try {
         const list = website.get_lists().getByTitle("Products");
         const items = list.getItems(QueryBuilder.buildProductCategoryQuery(productCategory));
         clientContext.load(list);
         clientContext.load(items);

         clientContext.executeQueryAsync(
            () => {
               dfrd.resolve(CustomerComplaintMapper.formatListItems(items));
            },
            (sender, args) => {
               console.error('Error loading products:', args.get_message());
               ResponseHandlerService.handleError(args.get_message());
               dfrd.reject(args.get_message());
            }
         );
      } catch (error) {
         console.error('Error updating product names:', error);
         ResponseHandlerService.handleError(error);
         dfrd.reject(error);
      }

      return dfrd.promise();
   }

   return {
      createNonConformingProduct,
      updateNonConformingProduct,
      updateProductNames
   };
})();

// Export the service
window.NonConformingProductService = NonConformingProductService;



// async function mapViewToModel($scope, $scopeCustomerComplaint) {
//    const taskStatus = determineTaskStatus($scope, $scopeCustomerComplaint);
//    const investigator = SPHelper.getUserInfo();
//    const businessManagers = await SPUtils.getBusinessManagers();
//    const assignedTo = await determineAssignedTo(taskStatus, investigator);
//    debugger;
//    const complaintData = {
//       common: $scope.IsDraft ? {} : getBasicComplaintInfo($scope, $scopeCustomerComplaint),
//       customer: getCustomerInfo($scopeCustomerComplaint),
//       product: getProductInfo($scopeCustomerComplaint),
//       dates: getDateInfo($scopeCustomerComplaint),
//       classifications: getClassificationInfo($scopeCustomerComplaint),
//       representatives: await getRepresentativesInfo($scopeCustomerComplaint)
//    };

//    const itemProperties = buildListItemProperties({
//       ...complaintData,
//       taskStatus,
//       assignedTo,
//       businessManagerIds: businessManagers,
//       initiatorId: SPuser.get_id(),
//       isDraft: $scope.IsDraft,
//       existingARReference: $scope.skipToEnd ? $("#existingARReference").val() : null
//    });

//    if (!($scope.IsDraft || $scope.skipToEnd)) {
//       const userId = await SPUtils.getSPUserId(assignedTo);
//       itemProperties.AssignedToId = userId;
//    }

//    return itemProperties;
// }