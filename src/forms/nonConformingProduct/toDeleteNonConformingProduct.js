

function createNonConform() {

   var Investigator = getUserInfo();
   var $scope = angular.element(myCtrl).scope();
   var Title;
   var DebtAreaOfProbelemID = $scope.selProbDebtArea.id;
   var BusinessAreaID = $scope.selBusinessArea.id;
   Title = $scope.listTitle;
   var HasThisHappenedBeforeID = $scope.selHasThisHappenedBefore.id;
   var Description = tinyMCE.get('DescriptionTextArea').getContent({ format: 'raw' });
   var AssignedTo;
   var taskStat = "New";

   if ($scope.IsDraft == false) {
      var Investigator = getUserInfo();
      AssignedTo = Investigator['Key'];
   } else {
      taskStat = "Draft";
   }

   var itemProperties = {
      "TaskStat": taskStat,
      "ARReason": "Internal non-conformance",
      "ARStatus": "In Progress",
      "Title": Title,
      //"AssignedToId": user.d.Id,
      "InitiatorId": SPuser.get_id(),
      "IMKpiDescription": Description,

      "AreaId": BusinessAreaID,
      "DepartmentAreaofProblemId": DebtAreaOfProbelemID,
      "hasThisHappenedBeforeId": HasThisHappenedBeforeID,
      "IsDraft": $scope.IsDraft
   }

   if ($scope.IsDraft == true) {
      addListItem(appWebUrl, 'Incidents', itemProperties);
   }

   //var AssignedTo = Investigator['Key'];
   var getRevisor = GetUserId(AssignedTo);
   getRevisor.done(function (user) {
      //user.d.Id <-- This is your precious data
      itemProperties.AssignedToId = user.d.Id;
      addListItem(appWebUrl, 'Incidents', itemProperties
      );
   });
}

function updateNonConform() {

   var Investigator = getUserInfo();
   var $scope = angular.element(myCtrl).scope();
   var Title;
   var itemId = $scope.itemID;
   //var DebtAreaOfProbelemID = $scope.selProbDebtArea.id;
   //var BusinessAreaID = $scope.selBusinessArea.id;
   Title = $scope.listTitle;
   //var HasThisHappenedBeforeID = $scope.selHasThisHappenedBefore.id;
   //var Description = tinyMCE.get('DescriptionTextArea').getContent({format : 'raw'});
   var AssignedTo;
   var taskStat = "New";

   if ($scope.IsDraft == false) {
      var Investigator = getUserInfo();
      AssignedTo = Investigator['Key'];
   } else {
      taskStat = "Draft";
   }

   var itemProperties = {
      "TaskStat": taskStat,
      "ARReason": "Internal non-conformance",
      "ARStatus": "In Progress",
      "Title": Title,
      //"AssignedToId": user.d.Id,
      "InitiatorId": SPuser.get_id(),
      "IsDraft": $scope.IsDraft
      //"IMKpiDescription": Description,

      //"AreaId": BusinessAreaID,
      //"DepartmentAreaofProblemId": DebtAreaOfProbelemID,
      //"hasThisHappenedBeforeId": HasThisHappenedBeforeID
   }

   if ($scope.IsDraft == true) {
      updateListItem(appWebUrl, 'Incidents', itemId, itemProperties, null);
   }

   //var AssignedTo = Investigator['Key'];
   var getRevisor = GetUserId(AssignedTo);
   getRevisor.done(function (user) {
      //user.d.Id <-- This is your precious data
      itemProperties.AssignedToId = user.d.Id;
      var mailProperties =
      {
         "d":
         {
            "AssignedToId": user.d.Id,
            "ARReason": "Internal non-conformance",
            "ID": itemId
         }
      }
      updateListItem(appWebUrl, 'Incidents', itemId, itemProperties, mailProperties);
   });
}

function createNonConformingProduct() {

   var Title;
   var Investigator = getUserInfo();
   var $scope = angular.element(myCtrl).scope();
   Title = $scope.listTitle;
   var BusinessAreaID = $scope.selBusinessArea.id;
   var DebtAreaOfProbelemID = $scope.selProbDebtArea.id;

   var $scopeViewNonConformingProduct = angular.element(ViewNonConformingProduct).scope();

   var BatchNumberFiled = $scopeViewNonConformingProduct.batchNumberFiled;
   var ProductionDate = $("#productionDateDatepicker").datepicker("getDate");
   var BestBeforeDate = $("#bestBeforeDatepicker").datepicker("getDate");

   var ComplaintProductCategoryID;
   if ($scopeViewNonConformingProduct.IsDraft == false) {
      ComplaintProductCategoryID = $scopeViewNonConformingProduct.selProductCategory.id;
   } else if ($scopeViewNonConformingProduct.selProductCategory != null) {
      ComplaintProductCategoryID = $scopeViewNonConformingProduct.selProductCategory.id;
   }


   var ComplaintProductNameID;
   if ($scopeViewNonConformingProduct.IsDraft == false) {
      ComplaintProductNameID = $scopeViewNonConformingProduct.selComplaintProductName.id;
   } else if ($scopeViewNonConformingProduct.selComplaintProductName != null) {
      ComplaintProductNameID = $scopeViewNonConformingProduct.selComplaintProductName.id;
   }

   var UnitTypeID;
   if ($scopeViewNonConformingProduct.IsDraft == false && $scopeViewNonConformingProduct.selUnitType != null) {
      UnitTypeID = $scopeViewNonConformingProduct.selUnitType.id;
   } else if ($scopeViewNonConformingProduct.selUnitType != null) {
      UnitTypeID = $scopeViewNonConformingProduct.selUnitType.id;
   }

   var ProductSupplier = $scopeViewNonConformingProduct.ProductSupplier;
   var UnitQuantity = $scopeViewNonConformingProduct.unitQuantity;
   var HasThisHappenedBeforeID = $scope.selHasThisHappenedBefore.id;
   var Description = tinyMCE.get('DescriptionTextArea').getContent({ format: 'raw' });
   var AssignedTo;
   var taskStat = "New";

   if ($scope.IsDraft == false) {
      AssignedTo = Investigator['Key'];
      Investigator = getUserInfo();
   } else {
      taskStat = "Draft";
   }

   var itemProperties = {
      "TaskStat": taskStat,
      "ARReason": "Non-conforming product",
      "ARStatus": "In Progress",
      "Title": Title,
      //"AssignedToId": user.d.Id,
      "InitiatorId": SPuser.get_id(),
      "ProductSupplier": ProductSupplier,
      "IMKpiDescription": Description,
      "UnitTypeId": UnitTypeID,
      "UnitQuantity": UnitQuantity,
      "AreaId": BusinessAreaID,
      "DepartmentAreaofProblemId": DebtAreaOfProbelemID,
      "ProductCategoryId": ComplaintProductCategoryID,
      "ProductNameId": ComplaintProductNameID,
      "hasThisHappenedBeforeId": HasThisHappenedBeforeID,
      "ProductionDate": ProductionDate,
      "BestBeforeDate": BestBeforeDate,
      "BatchNumberFiled": BatchNumberFiled,
      "IsDraft": $scope.IsDraft
   }

   if ($scope.IsDraft == true) {
      addListItem(appWebUrl, 'Incidents', itemProperties);
   }

   var getRevisor = GetUserId(AssignedTo);
   getRevisor.done(function (user) {
      //user.d.Id <-- This is your precious data
      itemProperties.AssignedToId = user.d.Id;
      addListItem(appWebUrl, 'Incidents', itemProperties
      );
   });
}

function updateNonConformingProduct() {

   var Title;
   var Investigator = getUserInfo();
   var $scope = angular.element(myCtrl).scope();
   Title = $scope.listTitle;
   var itemId = $scope.itemID;

   var $scopeViewNonConformingProduct = angular.element(ViewNonConformingProduct).scope();

   var BatchNumberFiled = $scopeViewNonConformingProduct.batchNumberFiled;
   var ProductionDate = $("#productionDateDatepicker").datepicker("getDate");
   var BestBeforeDate = $("#bestBeforeDatepicker").datepicker("getDate");

   var ComplaintProductCategoryID;
   if ($scopeViewNonConformingProduct.IsDraft == false) {
      ComplaintProductCategoryID = $scopeViewNonConformingProduct.selProductCategory.id;
   } else if ($scopeViewNonConformingProduct.selProductCategory != null) {
      ComplaintProductCategoryID = $scopeViewNonConformingProduct.selProductCategory.id;
   }

   var UnitTypeID;
   if ($scopeViewNonConformingProduct.IsDraft == false) {
      UnitTypeID = $scopeViewNonConformingProduct.selUnitType.id;
   } else if ($scopeViewNonConformingProduct.selUnitType != null) {
      UnitTypeID = $scopeViewNonConformingProduct.selUnitType.id;
   }

   var ComplaintProductNameID;
   if ($scopeViewNonConformingProduct.IsDraft == false) {
      ComplaintProductNameID = $scopeViewNonConformingProduct.selComplaintProductName.id;
   } else if ($scopeViewNonConformingProduct.selComplaintProductName != null) {
      ComplaintProductNameID = $scopeViewNonConformingProduct.selComplaintProductName.id;
   }

   var ProductSupplier = $scopeViewNonConformingProduct.ProductSupplier;
   var UnitQuantity = $scopeViewNonConformingProduct.unitQuantity;

   var AssignedTo;
   var taskStat = "New";

   if ($scope.IsDraft == false) {
      AssignedTo = Investigator['Key'];
      Investigator = getUserInfo();
   } else {
      taskStat = "Draft";
   }

   var itemProperties = {
      "TaskStat": taskStat,
      "ARReason": "Non-conforming product",
      "ARStatus": "In Progress",
      "Title": Title,
      "InitiatorId": SPuser.get_id(),
      "ProductSupplier": ProductSupplier,
      "ProductCategoryId": ComplaintProductCategoryID,
      "ProductNameId": ComplaintProductNameID,
      "UnitTypeId": UnitTypeID,
      "UnitQuantity": UnitQuantity,
      "ProductionDate": ProductionDate,
      "BestBeforeDate": BestBeforeDate,
      "BatchNumberFiled": BatchNumberFiled,
      "IsDraft": $scope.IsDraft
   }

   if ($scope.IsDraft == true) {
      updateListItem(appWebUrl, 'Incidents', itemId, itemProperties, null);
   }

   var getRevisor = GetUserId(AssignedTo);
   getRevisor.done(function (user) {
      //user.d.Id <-- This is your precious data
      itemProperties.AssignedToId = user.d.Id;
      var mailProperties =
      {
         "d":
         {
            "AssignedToId": user.d.Id,
            "ARReason": "Non-conforming product",
            "ID": itemId
         }
      }
      updateListItem(appWebUrl, 'Incidents', itemId, itemProperties, mailProperties);
   });
}

function ViewNonConformingProductDetail() {
   SPListOperations.populateScopeList("Product Categories");
   SPListOperations.populateScopeList("Unit Type List");

   $(function () {
      $("#productionDateDatepicker").datepicker({ dateFormat: 'dd/mm/yy' });
      $("#bestBeforeDatepicker").datepicker({ dateFormat: 'dd/mm/yy' });
   });
}

// Purpose - Display the Non-Conforming Product Form
// Recommend to move to file: src/forms/nonConformingProduct/nonConformingProductForm.js
function DisplayNonConformingProductForm() {
   SPListOperations.populateScopeList("Product Categories");
   SPListOperations.populateScopeList("Unit Type List");
   var $scopeGetID = angular.element(myCtrl).scope();
   var list = website.get_lists().getByTitle("Incidents"); //Get the List
   var query = new SP.CamlQuery();

   query.set_viewXml("<View><Query><Where><Eq><FieldRef Name='ID' /><Value Type='Counter'>" + $scopeGetID.itemID + "</Value></Eq></Where></Query><ViewFields>" +
      "<FieldRef Name='ID' /><FieldRef Name='Title' /><FieldRef Name='ARReason' /><FieldRef Name='ProductSupplier' /><FieldRef Name='ProductCategory' /><FieldRef Name='ProductName' />" +
      "<FieldRef Name='Area' /><FieldRef Name='DepartmentAreaofProblem' /><FieldRef Name='IMKpiDescription' /><FieldRef Name='Initiator' /><FieldRef Name='Created' />" +
      "<FieldRef Name='IsDraft' /><FieldRef Name='Created' /><FieldRef Name='hasThisHappenedBefore' /><FieldRef Name='UnitQuantity' /><FieldRef Name='UnitType' />" +
      "<FieldRef Name='BestBeforeDate' /><FieldRef Name='ProductionDate' /><FieldRef Name='BatchNumberFiled' /></ViewFields></View>");
   //query.set_viewXml("<View><Query><Where><Eq><FieldRef Name='ID' /><Value Type='Counter'>" + $scopeGetID.itemID + "</Value></Eq></Where></Query></View>");
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
         singleObj['ProductSupplier'] = currentListItem.get_item('ProductSupplier');
         singleObj['UnitQuantity'] = currentListItem.get_item('UnitQuantity');
         singleObj['BatchNumberFiled'] = currentListItem.get_item('BatchNumberFiled');

         var productionDate = currentListItem.get_item('ProductionDate');
         var newProductionDate = $.datepicker.formatDate('dd/mm/yy', productionDate);
         singleObj['ProductionDate'] = newProductionDate;

         var bestBeforeDate = currentListItem.get_item('BestBeforeDate');
         var newBestBeforeDate = $.datepicker.formatDate('dd/mm/yy', bestBeforeDate);
         singleObj['BestBeforeDate'] = newBestBeforeDate;

         if (currentListItem.get_item('ProductCategory') != null) {
            singleObj['ProductCategory'] = currentListItem.get_item('ProductCategory').get_lookupValue();
         }

         if (currentListItem.get_item('ProductName') != null) {
            singleObj['ProductName'] = currentListItem.get_item('ProductName').get_lookupValue();
         }

         if (currentListItem.get_item('UnitType') != null) {
            singleObj['UnitType'] = currentListItem.get_item('UnitType').get_lookupValue();
         }

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

         if (currentListItem.get_item('IsDraft') == true) {
            $scope.$apply(function () {
               // $scope.FormComplaintTitle = singleObj['Title'];
               // $scope.FormComplaintReason = singleObj['ARReason'];
               // $scope.ProductSupplier = singleObj['ProductSupplier'];
               // $scope.selProductCategory = $.grep($scope.ComplaintProductCategories, function (e) { return e.value == singleObj['ProductCategory']; })[0];
               // $.when(listProductNames(singleObj['ProductCategory'])).then(function () {
               //    $scope.selComplaintProductName = $.grep($scope.ComplaintProductNames, function (e) { return e.value == singleObj['ProductName']; })[0];
               // });
               // $scope.selUnitType = $.grep($scope.UnitTypeList, function (e) {
               //    return e.value == singleObj['UnitType'];
               // })[0];
               // $scope.unitQuantity = singleObj['UnitQuantity'];
               // $scope.FormComplaintArea = singleObj['Area'];
               // $scope.FormDebtAreaOfProblem = singleObj['DepartmentAreaofProblem'];
               // $scope.FormHasThisHappenedBefore = singleObj['hasThisHappenedBefore'];
               // $scope.CreatedDate = singleObj['Created'];
               // $scope.bestBeforeDatepicker = singleObj['BestBeforeDate'];
               // $scope.productionDateDatepicker = singleObj['ProductionDate'];
               // $scope.batchNumberFiled = singleObj['BatchNumberFiled'];


            });
         } else {
            $scope.$apply(function () {
               // $scope.FormComplaintTitle = singleObj['Title'];
               // $scope.FormComplaintReason = singleObj['ARReason'];
               // $scope.ProductSupplier = singleObj['ProductSupplier'];
               // $scope.ProductCategory = singleObj['ProductCategory'];
               // $scope.ProductName = singleObj['ProductName'];
               // $scope.FormComplaintArea = singleObj['Area'];
               // $scope.UnitType = singleObj['UnitType'];
               // $scope.UnitQuantity = singleObj['UnitQuantity'];
               // $scope.FormDebtAreaOfProblem = singleObj['DepartmentAreaofProblem'];
               // $scope.FormHasThisHappenedBefore = singleObj['hasThisHappenedBefore'];
               // $scope.CreatedDate = singleObj['Created'];
               // $scope.bestBeforeDate = singleObj['BestBeforeDate'];
               // $scope.productionDate = singleObj['ProductionDate'];
               // $scope.batchNumberFiled = singleObj['BatchNumberFiled'];
            });
         }

         $('#loaderImage').css("display", "none");
         $('#editForm').css("display", "block");

      }),
      Function.createDelegate(this, fail)
   );
}

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