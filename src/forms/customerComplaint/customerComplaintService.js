'use strict';

const CustomerComplaintService = (function () {
   // async function createCustomerComplaint($scope, $scopeCustomerComplaint) {
   async function createCustomerComplaint(formModel) {
      try {
         // const itemProperties = await CustomerComplaintMapper.mapViewToModel($scope, $scopeCustomerComplaint);
         // const result = await SPListOperations.addListItem('Incidents', itemProperties);
         const result = await SPListOperations.addListItem('Incidents', formModel);
         await ResponseHandlerService.handleSuccess(result);
         return result;
      } catch (error) {
         ResponseHandlerService.handleError(error);
         throw error;
      }
   }

   async function updateCustomerComplaint($scope, $scopeCustomerComplaint) {
      try {
         const itemProperties = await CustomerComplaintMapper.mapViewToModel($scope, $scopeCustomerComplaint);
         const result = await SPListOperations.updateListItem('Incidents', itemProperties, $scopeCustomerComplaint.itemID);
         await ResponseHandlerService.handleSuccess(result);
         return result;
      } catch (error) {
         ResponseHandlerService.handleError(error);
         throw error;
      }
   }

   function populateCustomerRepresentativeList() {
      var dfrd = $.Deferred();
      var list = website.get_lists().getByTitle("CustomerRepresentatives");
      var query = new SP.CamlQuery();
      var items = list.getItems(query);

      clientContext.load(list);
      clientContext.load(items);

      var ScopelistOfObjects = [];
      clientContext.executeQueryAsync(
         Function.createDelegate(this, function () {
            var enumerator = items.getEnumerator();
            while (enumerator.moveNext()) {
               var currentListItem = enumerator.get_current();
               var singleObj = {
                  id: currentListItem.get_item('ID'),
                  value: currentListItem.get_item('Title'),
                  email: currentListItem.get_item('Email'),
                  area: currentListItem.get_item('Area'),
                  isChecked: false
               };
               ScopelistOfObjects.push(singleObj);
            }

            var $scope = angular.element(incidentManagementCtrl).scope();
            $scope.$apply(function () {
               $scope.CustomerRepresentatives = ScopelistOfObjects;
            });
            dfrd.resolve(ScopelistOfObjects);
         }),
         Function.createDelegate(this, function (sender, args) {
            console.log('Error: ' + args.get_message());
            dfrd.reject(args.get_message());
         })
      );
      return dfrd.promise();
   }

   async function updateServiceCategories(complaintType) {
      const dfrd = $.Deferred();

      try {
         const list = website.get_lists().getByTitle("Service Categories");
         const items = list.getItems(QueryBuilder.buildComplaintTypeQuery(complaintType));
         clientContext.load(list);
         clientContext.load(items);

         clientContext.executeQueryAsync(
            () => {
               dfrd.resolve(CustomerComplaintMapper.formatListItems(items));
            },
            (sender, args) => {
               console.error('Error loading service categories:', args.get_message());
               ResponseHandlerService.handleError(args.get_message());
               dfrd.reject(args.get_message());
            }
         );
      } catch (error) {
         console.error('Error updating service categories:', error);
         ResponseHandlerService.handleError(error);
         dfrd.reject(error);
      }

      return dfrd.promise();
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
      createCustomerComplaint,
      updateCustomerComplaint,
      populateCustomerRepresentativeList,
      updateServiceCategories,
      updateProductNames
   };
})();

// Export the service
window.CustomerComplaintService = CustomerComplaintService;



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