'use strict';

const PeoplePickerHelper = (function () {
   function initializePeoplePicker(fieldName, initialValue) {
      SP.SOD.executeFunc("/_layouts/15/clientpeoplepicker.js", "SP.ClientContext", function () {
         // Initialize the SharePoint People Picker
         let tmp = initializeMultiPeoplePicker(fieldName, initialValue);
      });
   }

   function initializeSinglePeoplePicker(fieldName, initialValue) {
      // Initialize the SharePoint People Picker
      // TODO: This needs to be implemented
      //initializePeoplePicker(fieldName, initialValue);
   }

   function initializeMultiPeoplePicker(peoplePickerElementId, defaultVals) {
      var schema = {};
      schema['PrincipalAccountType'] = 'User,DL,SecGroup,SPGroup';
      schema['ng-model'] = 'BusinessManagers';
      schema['id'] = 'BusinessManagers';
      schema['SearchPrincipalSource'] = 15;
      schema['ResolvePrincipalSource'] = 15;
      schema['AllowMultipleValues'] = true;
      schema['MaximumEntitySuggestions'] = 50;
      schema['Width'] = '280px';
      this.SPClientPeoplePicker_InitStandaloneControlWrapper(peoplePickerElementId, defaultVals, schema);
   }

   function getPeoplePickerUsers(fieldName, returnAll) {
      var peoplePickerDiv = $("[id$='" + fieldName + "_TopSpan']");
      var peoplePicker = SPClientPeoplePicker.SPClientPeoplePickerDict[peoplePickerDiv[0].id];
      var users = peoplePicker.GetAllUserInfo();
      return returnAll ? users : users[0];
   }

   return {
      initializePeoplePicker,
      initializeSinglePeoplePicker,
      getPeoplePickerUsers
   };
})();

window.PeoplePickerHelper = PeoplePickerHelper; 