define(['app', 'listOperations'], function(app) {
  'use strict';

  return app.service('FormSelectorService', ['SPListOperations', function(SPListOperations) {
      /**
       * Retrieves ARReason for a list item and finds the matching form.
       * @param {string} listName - The SharePoint list name.
       * @param {number} itemId - The item ID.
       * @param {Array} forms - The forms array to search.
       * @returns {Promise<Object|null>} Resolves with the matching form object or null if not found.
       */
      this.getFormWorkflowStatus = function(listName, itemId, forms) {
        return SPListOperations.getListItem(listName, itemId, ['ARReason', 'IsDraft', 'TaskStat', 'reqInstanceID'])
          .then(function(item) {
            if (item && item.ARReason) {
              var form = forms.find(f => f.alternativeLabel === item.ARReason);
               var workflowStage = item.TaskStat;
               var displayMode = item.IsDraft ? 'edit' : 'view';
               var instanceID = item.reqInstanceID || null;
              return {form, displayMode, workflowStage, instanceID} || null;
            }
            return null;
          });
      };
    }]);
});
