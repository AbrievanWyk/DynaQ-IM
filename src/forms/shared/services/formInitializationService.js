'use strict';

const FormInitializationService = (function () {
   function initializeMainLists() {
      SPListOperations.populateScopeList("Business Area");
      SPListOperations.populateScopeList("Area of Problem Departments");
      // SPListOperations.populateScopeList("HasThisHappenedBefore");
   }

   function initializeDatePickers(datePickerIds) {
      $(function () {
         const dateFormat = { dateFormat: 'dd/mm/yy' };
         datePickerIds.forEach(id => {
            $(`#${id}`).datepicker(dateFormat);
         });
      });
   }

   function getListChoices(fieldName, scopePropertyName) {
      var list = website.get_lists().getByTitle("Incidents");
      var choiceField = clientContext.castTo(
         list.get_fields().getByInternalNameOrTitle(fieldName),
         SP.FieldChoice
      );

      clientContext.load(choiceField);
      var ScopelistOfObjects = [];

      return new Promise((resolve, reject) => {
         clientContext.executeQueryAsync(
            function () {
               var choices = choiceField.get_choices();
               ScopelistOfObjects = choices.map((choice, index) => ({
                  id: index,
                  value: choice
               }));

               var $scope = angular.element(incidentManagementCtrl).scope();
               $scope.$apply(function () {
                  $scope[scopePropertyName] = ScopelistOfObjects;
               });
               resolve(ScopelistOfObjects);
            },
            function (sender, args) {
               reject(new Error(`Error getting list choices: ${args.get_message()}`));
            }
         );
      });
   }

   return {
      initializeMainLists,
      initializeDatePickers,
      getListChoices
   };
})();

window.FormInitializationService = FormInitializationService; 