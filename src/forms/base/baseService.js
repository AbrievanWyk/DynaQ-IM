'use strict';

const BaseService = (function() {
    async function createItem(listName, mapper, $scope, $scopeData) {
        try {
            const itemProperties = await mapper.mapViewToModel($scope, $scopeData);
            const result = await SPListOperations.addListItem(listName, itemProperties);
            await ResponseHandlerService.handleSuccess(result);
            return result;
        } catch (error) {
            ResponseHandlerService.handleError(error);
            throw error;
        }
    }

    async function updateItem(listName, mapper, $scope, $scopeData) {
        try {
            const itemProperties = await mapper.mapViewToModel($scope, $scopeData);
            const result = await SPListOperations.updateListItem(listName, $scopeData.itemID, itemProperties);
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
        createItem,
        updateItem,
        updateProductNames
    };
})(); 