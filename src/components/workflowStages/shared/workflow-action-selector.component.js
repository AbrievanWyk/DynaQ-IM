define(['app', 'listOperations', 'itemIdService'], function (app) {
   return app.component('workflowActionSelector', {
      bindings: {
         actionLabel: '@',          // Label for the action selector
         assigneeLabel: '@',        // Label for the assignee selector
         assigneePeoplePickerPrefix: '@', // Prefix for the people picker
         actions: '=',              // Array of { label, value }
         selectedAction: '<',       // Bound to model for selected action
         assignee: '=',             // Bound to model for assigned person
         assigneeId: '=',             // Bound to model for assigned person
         required: '<',             // Boolean, whether selection is mandatory
         onChange: '&',             // Callback: function(action, assignee)
         onSaveStageForm: '&',                // Callback for save action,
         isLastStep: '<'         // Boolean, whether this is the last step in the workflow
      },
      templateUrl: `${srcFolderPath}/js/new/components/workflowStages/shared/workflow-action-selector.template.html`,
      controller: ['SPListOperations', 'ItemIdService', function (SPListOperations, ItemIdService) {
         const ctrl = this;
         ctrl.itemId = ItemIdService.get(); // Get the item ID from the service

         ctrl.showReassignModal = false; // Flag to control modal visibility

         ctrl.$onInit = function () {
            if (!ctrl.selectedAction && ctrl.actions && ctrl.actions.length > 0) {
               ctrl.selectedAction = ctrl.actions[0].value;
            }
         };

         ctrl.handleChange = function () {
            if (ctrl.onChange) {
               ctrl.onChange({ action: ctrl.selectedAction, assigneeId: ctrl.assigneeId });
            }
         };

         ctrl.cancelAndBack = function () {
            ctrl.showReassign = false
            const params = location.search;
            const sourceMatch = params.match(/Source=([^&]+)/);
            if (sourceMatch && sourceMatch[1]) {
               const gotoURL = decodeURIComponent(sourceMatch[1]);
               window.location = gotoURL;
            }
         };
      }]
   });
});
