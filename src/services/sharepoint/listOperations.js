'use strict';

const SPListOperations = (function () {
   async function addListItem(listName, metadata) {
      try {
         const item = {
            "__metadata": { "type": SPUtils.getItemTypeForListName(listName) },
            ...metadata
         };

         const response = await $.ajax({
            url: `${appWebUrl}/_api/web/lists/getbytitle('${listName}')/items`,
            type: "POST",
            contentType: "application/json;odata=verbose",
            data: JSON.stringify(item),
            headers: {
               "Accept": "application/json;odata=verbose",
               "X-RequestDigest": $("#__REQUESTDIGEST").val()
            }
         });

         return response.d;
      } catch (error) {
         console.error('Error adding list item:', error);
         throw error;
      }
   }

   async function updateListItem(listName, metadata, itemId) {
      try {
         const item = {
            "__metadata": { "type": SPUtils.getItemTypeForListName(listName) },
            ...metadata
         };

         await $.ajax({
            url: `${appWebUrl}/_api/web/lists/getbytitle('${listName}')/items(${itemId})`,
            type: "POST",
            contentType: "application/json;odata=verbose",
            data: JSON.stringify(item),
            headers: {
               "Accept": "application/json;odata=verbose",
               "X-RequestDigest": $("#__REQUESTDIGEST").val(),
               "X-HTTP-Method": "MERGE",
               "If-Match": '*'
            }
         });

         // return mailProperties;
      } catch (error) {
         console.error('Error updating list item:', error);
         throw error;
      }
   }

   function populateScopeList(ListTitle) {
      var dfrd = $.Deferred();
      var list = website.get_lists().getByTitle(ListTitle);
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
                  isChecked: false
               };
               ScopelistOfObjects.push(singleObj);
            }

            var $scope = angular.element(myCtrl).scope();
            $scope.$apply(function () {
               mapListToScope(ListTitle, ScopelistOfObjects, $scope);
            });
            dfrd.resolve();
         }),
         Function.createDelegate(this, function (sender, args) {
            console.error('Error populating scope list:', args.get_message());
            dfrd.reject(args.get_message());
         })
      );
      return $.when(dfrd).done().promise();
   }

   // Private helper function
   function mapListToScope(ListTitle, listObjects, $scope) {
      const scopeProperty = LIST_TO_SCOPE_MAPPINGS[ListTitle];
      if (scopeProperty) {
         $scope[scopeProperty] = listObjects;
      } else {
         console.warn(`No scope mapping found for list: ${ListTitle}`);
      }
   }

   function handleQueryError(sender, args) {
      console.error('SharePoint Query Error:', args.get_message());
      return Promise.reject(new Error(args.get_message()));
   }

   function handleQuerySuccess(items) {
      if (!items || !items.getEnumerator) {
         return Promise.reject(new Error('No items found'));
      }

      const enumerator = items.getEnumerator();
      if (!enumerator.moveNext()) {
         return Promise.reject(new Error('No items found'));
      }

      return Promise.resolve(enumerator.get_current());
   }

   function executeQuery(query) {
      return new Promise((resolve, reject) => {
         const clientContext = SP.ClientContext.get_current();
         const list = clientContext.get_web().get_lists().getByTitle(query.listName);
         const items = list.getItems(query.camlQuery);

         clientContext.load(list);
         clientContext.load(items);

         clientContext.executeQueryAsync(
            () => handleQuerySuccess(items).then(resolve).catch(reject),
            handleQueryError
         );
      });
   }

   // function executeQueryWrapper(listName, items, callback) {
   //    return new Promise((resolve, reject) => {
   //       const clientContext = SP.ClientContext.get_current();
   //       const list = clientContext.get_web().get_lists().getByTitle(listName);
   //       // const items = list.getItems(query.camlQuery);

   //       clientContext.load(list);
   //       clientContext.load(items);

   //       clientContext.executeQueryAsync(
   //          () => callback(items),
   //          handleQueryError
   //       );
   //    });
   // }

   function executeFunc(scriptPath, functionName, callback) {
      SP.SOD.executeFunc(scriptPath, functionName, callback);
   }

   return {
      addListItem,
      updateListItem,
      populateScopeList,
      executeQuery,
      executeFunc
      // executeQueryWrapper
   };
})();

window.SPListOperations = SPListOperations;