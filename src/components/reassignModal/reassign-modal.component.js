define(['app'], function (app) {
   return app.component('reassignModal', {
      bindings: {
         itemId: '<',
         onClose: '&'
      },
      templateUrl: `${srcFolderPath}/js/new/components/reassignModal/reassign-modal.template.html`,
      controller: ['SPListOperations', function (SPListOperations) {
         const ctrl = this;
         ctrl.selectedUser = null;
            ctrl.itemId = 67;

         ctrl.$onInit = function () {
         };

         ctrl.save = function () {
            if (!ctrl.selectedUser) return;
            SPListOperations.updateListItem('Incidents', ctrl.itemId, { AssignedToId: ctrl.selectedUser.Id })
               .then(() => ctrl.onClose({ $value: true }))
               .catch(() => ctrl.onClose({ $value: false }));
         };

         ctrl.cancel = function () {
            // ctrl.dismiss({ $value: false });
         };
      }]
   });
});