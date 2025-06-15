'use strict';

const FormProcessingService = (function () {
   function handleDraftForm(currentListItem) {
      var formData = {
         ARReason: currentListItem.get_item('ARReason'),
         TaskStat: currentListItem.get_item('TaskStat'),
         ARStatus: currentListItem.get_item('ARStatus'),
         ID: currentListItem.get_item('ID')
      };

      var $scope = angular.element(incidentManagementCtrl).scope();
      $scope.incidentsDetailsForm = false;
      return formData;
   }

   function processApproval() {
      var params = location.search;
      var itemId = extractItemId(params);
      return getIncidentItem(itemId);
   }

   // Private helper functions
   function extractItemId(params) {
      var pos = params.search("ID");
      var param = params.slice(pos);
      var pos2 = param.indexOf('=');
      var pos3 = param.indexOf('&');
      if (pos3 < 1) {
         pos3 = param.length;
      }
      return param.slice(pos2 + 1, pos3);
   }

   function getIncidentItem(itemId) {
      var list = website.get_lists().getByTitle("Incidents");
      var query = new SP.CamlQuery();
      query.set_viewXml(
         `<View><Query><Where><Eq><FieldRef Name='ID' />
            <Value Type='Counter'>${itemId}</Value></Eq></Where></Query></View>`
      );
      return list.getItems(query);
   }

   return {
      handleDraftForm,
      processApproval
   };
})();

window.FormProcessingService = FormProcessingService; 