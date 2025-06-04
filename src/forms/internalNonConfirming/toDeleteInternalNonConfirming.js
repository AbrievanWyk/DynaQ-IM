// Purpose - Display the Internal Non-Conforming Product Form
// Recommend to move to file: src/forms/nonConformingProduct/nonConformingProductForm.js
function DisplayeditInternalNonConformForm() {
   var $scopeGetID = angular.element(myCtrl).scope();
   var list = website.get_lists().getByTitle("Incidents"); //Get the List
   var query = new SP.CamlQuery();
   query.set_viewXml("<View><Query><Where><Eq><FieldRef Name='ID' /><Value Type='Counter'>" + $scopeGetID.itemID + "</Value></Eq></Where></Query></View>");
   var items = list.getItems(query);

   clientContext.load(list); //Retrieves the properties of a client object from the server.
   clientContext.load(items);
   var singleObj = {}
   //Execute the Query Asynchronously
   clientContext.executeQueryAsync(
      Function.createDelegate(this, function () {
         var itemInfo = '';
         var enumerator = items.getEnumerator();
         enumerator.moveNext();
         var currentListItem = enumerator.get_current();
         singleObj['id'] = currentListItem.get_item('ID');
         singleObj['Title'] = currentListItem.get_item('Title');
         singleObj['ARReason'] = currentListItem.get_item('ARReason');
         singleObj['Area'] = currentListItem.get_item('Area').get_lookupValue();
         singleObj['DepartmentAreaofProblem'] = currentListItem.get_item('DepartmentAreaofProblem').get_lookupValue();
         singleObj['IMKpiDescription'] = currentListItem.get_item('IMKpiDescription');
         singleObj['hasThisHappenedBefore'] = currentListItem.get_item('hasThisHappenedBefore').get_lookupValue();

         var userId = currentListItem.get_item('Initiator').get_lookupId();
         var usr = clientContext.get_web().getUserById(userId);
         clientContext.load(usr);
         clientContext.executeQueryAsync(function () {
            var dispUsr = usr.get_title();
            var $scope = angular.element(myCtrl).scope();
            $scope.$apply(function () {
               $scope.Initiator = dispUsr;
            });
         }, function () {
            console.log("error");
         });
         var TempApprovalDate = currentListItem.get_item('Created');
         var ApprovalDate = $.datepicker.formatDate('dd/mm/yy', TempApprovalDate);
         singleObj['Created'] = ApprovalDate;

         if (singleObj['IMKpiDescription'] != null) {
            tinyMCE.get('DisplayDescriptionTextArea').setContent(singleObj['IMKpiDescription']);
         }

         var $scope = angular.element(myCtrl).scope();

         $scope.$apply(function () {
            $scope.FormComplaintTitle = singleObj['Title'];
            $scope.FormComplaintReason = singleObj['ARReason'];
            $scope.FormComplaintArea = singleObj['Area'];
            $scope.FormDebtAreaOfProblem = singleObj['DepartmentAreaofProblem'];
            $scope.FormHasThisHappenedBefore = singleObj['hasThisHappenedBefore'];
            $scope.CreatedDate = singleObj['Created'];
         });
         $('#loaderImage').css("display", "none");
         $('#editForm').css("display", "block");
      }),
      Function.createDelegate(this, onQueryFailed)
   );
}