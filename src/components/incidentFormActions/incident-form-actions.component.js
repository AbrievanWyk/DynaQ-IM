angular.module('incidentManagementApp')
   .component('incidentFormActions', {
      bindings: {
         formId: '=',
         formModel: '=',
         saveFn: '=',
         formValid: '='
      },
      templateUrl: `${srcFolderPath}/js/new/components/incidentFormActions/incident-form-actions.template.html`,
      controller: function ($element, $scope) {
         const ctrl = this;

         // initializePeoplePicker('peoplePickerDiv', null);
         ctrl.selectedNextAction = 'submitForInvestigation';

         // let tmpSelectedNextAction = "";
         // ctrl.changeSelectedNextAction = function (el) {
            // tmpSelectedNextAction = selectedValue;
         //    ctrl.selectedNextAction = selectedValue;
         // };

         // $element.on('change', function () {
         //    $scope.$apply(() => {
         //       ctrl.selectedNextAction = tmpSelectedNextAction;
         //    });
         // });

         ctrl.buttonConfig = {
            save: {
               label: 'Save',
               clickArgs: [false, false],
               showError: true
            },
            complete: {
               label: 'Complete',
               clickArgs: [false, true],
               showError: true
            },
            continue: {
               label: 'Save & Continue Later',
               clickArgs: [true, false],
               showError: false
            }
         };

         ctrl.getActionType = function () {
            if (ctrl.formId !== 'Complaint') return 'save';

            switch (ctrl.selectedNextAction) {
               case 'submitForInvestigation': return 'save';
               case 'existingAR': return 'complete';
               case 'saveAndContinueLater': return 'continue';
               default: return '';
            }
         };

         ctrl.getActionConfig = function () {
            return ctrl.buttonConfig[ctrl.getActionType()] || null;
         };

         ctrl.cancelAndBack = function () {
            const params = location.search;
            const sourceMatch = params.match(/Source=([^&]+)/);
            if (sourceMatch && sourceMatch[1]) {
               const gotoURL = decodeURIComponent(sourceMatch[1]);
               window.location = gotoURL;
            }
         };
      }
   });
