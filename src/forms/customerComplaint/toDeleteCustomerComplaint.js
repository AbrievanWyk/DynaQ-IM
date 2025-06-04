function ViewCustomerComplaintData() {
   SPListOperations.populateScopeList("Customers");
   SPListOperations.populateScopeList("ComplaintType");
   SPListOperations.populateScopeList("Product Categories");
   SPListOperations.populateScopeList("Province List");
   SPListOperations.populateScopeList("Store Outlet Retailer List");
   SPListOperations.populateScopeList("Source of Complaint");
   SPListOperations.populateScopeList("Unit Type List");
   getListChoices("CustomerComplaintCategory");
   initializeMultiPeoplePicker('businessManagerPeoplePicker', null);
   SPListOperations.populateCustomerRepresentativeList();

   $(function () {
      $("#datepicker").datepicker({ dateFormat: 'dd/mm/yy' });
      $("#productionDateDatepicker").datepicker({ dateFormat: 'dd/mm/yy' });
      $("#bestBeforeDatepicker").datepicker({ dateFormat: 'dd/mm/yy' });
   });
}

// Purpose - Display the Customer Complaint Form
// Recommend to move to file: src/forms/customerComplaint/customerComplaintForm.js
function DisplayCustomerComplaintForm() {
   SP.SOD.executeFunc("/_layouts/15/clientpeoplepicker.js", "SP.ClientContext", function () {

      SPListOperations.populateScopeList("Customers");
      SPListOperations.populateScopeList("ComplaintType");
      SPListOperations.populateScopeList("Product Categories");
      SPListOperations.populateScopeList("Province List");
      SPListOperations.populateScopeList("Store Outlet Retailer List");
      SPListOperations.populateScopeList("Source of Complaint");
      SPListOperations.populateScopeList("Unit Type List");
      getListChoices("CustomerComplaintCategory");

      CustomerComplaintService.populateCustomerRepresentativeList();
      initializeMultiPeoplePicker('businessManagerPeoplePicker', null);

      $(function () {
         $("#datepicker").datepicker({
            dateFormat: 'dd/mm/yy'
         });
         $("#productionDateDatepicker").datepicker({
            dateFormat: 'dd/mm/yy'
         });
      });

      var $scopeGetID = angular.element(myCtrl).scope();
      var list = website.get_lists().getByTitle("Incidents"); //Get the List
      //var query = new SP.CamlQuery(); //The Query object. This is used to query for data in the List
      //    // query.set_viewXml('<View><RowLimit></RowLimit>10</View>');
      // query.set_viewXml("<View><query><where><eq><FieldRef Name='ID'/><value type='Counter'>" + $scopeGetID.itemID + "</value></eq></where></query></View>");
      //query.set_viewXml("<Query><Where><Eq><FieldRef Name='ID'/><Value type='Counter'>"+2+"</Value></Eq></Where></Query>");
      var query = new SP.CamlQuery();
      query.set_viewXml("<View><Query><Where><Eq><FieldRef Name='ID' /><Value Type='Counter'>" + $scopeGetID.itemID + "</Value></Eq></Where></Query><ViewFields>" +
         "<FieldRef Name='ID' /><FieldRef Name='Title' /><FieldRef Name='ARReason' /><FieldRef Name='CustomerLocation' /><FieldRef Name='CustomerContactPerson' />" +
         "<FieldRef Name='CustomerContactTelephone' /><FieldRef Name='CustomerContactEmail' /><FieldRef Name='CustomerProblemDate' /><FieldRef Name='Area' /><FieldRef Name='IMKpiDescription' /><FieldRef Name='hasThisHappenedBefore' />" +
         "<FieldRef Name='IsCustomerClaim' /><FieldRef Name='CustomerClaimDetail' /><FieldRef Name='CustomerName' /><FieldRef Name='CustomerComplaintService' /><FieldRef Name='ComplaintType' />" +
         "<FieldRef Name='ProductCategory' /><FieldRef Name='ProductName' /><FieldRef Name='DepartmentAreaofProblem' /><FieldRef Name='CustomerRepresentatives' /><FieldRef Name='Initiator' /><FieldRef Name='TaskStat' />" +
         "<FieldRef Name='IsDraft' /><FieldRef Name='ExistingARReference' /><FieldRef Name='Created' /><FieldRef Name='CustomerClaimDetail' /><FieldRef Name='BusinessManagers' /><FieldRef Name='ProductionDate' /><FieldRef Name='BatchNumberFiled' />" +
         "</ViewFields></View>");

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
            if (currentListItem.get_item('IsDraft') == true) {
               if (currentListItem.get_item('BusinessManagers') != null) {
                  var peoplePicker = SPClientPeoplePicker.SPClientPeoplePickerDict.businessManagerPeoplePicker_TopSpan; //Select the People Picker AKA Get the instance of the People Picker from the Dictionary
                  //Set the user value AKA 'Key' name value pair format: myDomain\UserId  i.e. abc\shane.gibson you may have to drop the claims token prefix {i:0#.w|}
                  //peoplePicker.AddUnresolvedUser(usrObj, true); //Resolve the User

                  for (var x = 0; x < currentListItem.get_item('BusinessManagers').length; x++) {


                     var userEmail = currentListItem.get_item('BusinessManagers')[x].get_email();
                     var usrObj = {
                        'Key': userEmail
                     };
                     peoplePicker.AddUnresolvedUser(usrObj, true);
                  }
               }
            }

            tinymce.init({
               selector: "#CustomerClaimDetailTextArea",
               toolbar: false,
               menubar: false,
               setup: function (editor) {
                  editor.on('init', function () {
                     $(editor.getBody()).on('click', 'a[href]', function (e) {
                        //window.open = $(e.currentTarget).attr('href');
                        var win = window.open($(e.currentTarget).attr('href'), '_blank');
                        win.focus();
                     });
                  })
               },
               plugins: [
                  //    'autolink link image',
                  //  //'advlist autolink lists link image charmap print preview anchor',
                  //  //'searchreplace visualblocks code fullscreen',
                  //  //'insertdatetime media table contextmenu paste code'
                  //   'autolink link image print',
                  ' code insertdatetime paste code autoresize'
               ],
               //toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
               content_css: [
                  //  '//fast.fonts.net/cssapi/e6dc9b99-64fe-4292-ad98-6974f93cd2a2.css',
                  //'//www.tinymce.com/css/codepen.min.css'
               ]

            });

            if (currentListItem.get_item('Initiator') != null) {
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
            }

            if (singleObj['TaskStat'] == "Final Finance Approval") {
               tinymce.remove('#CustomerClaimDetailTextArea');

               tinymce.init({
                  selector: "#CustomerClaimDetailTextArea",
                  toolbar: false,
                  menubar: false,
                  setup: function (editor) {
                     editor.on('init', function () {
                        $(editor.getBody()).on('click', 'a[href]', function (e) {
                           //window.open = $(e.currentTarget).attr('href');
                           var win = window.open($(e.currentTarget).attr('href'), '_blank');
                           win.focus();
                        });
                     })
                  },
                  plugins: [
                     //    'autolink link image',
                     //  //'advlist autolink lists link image charmap print preview anchor',
                     //  //'searchreplace visualblocks code fullscreen',
                     //  //'insertdatetime media table contextmenu paste code'
                     //   'autolink link image print',
                     ' code insertdatetime paste code autoresize'
                  ],
                  //toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
                  content_css: [
                     //  '//fast.fonts.net/cssapi/e6dc9b99-64fe-4292-ad98-6974f93cd2a2.css',
                     //'//www.tinymce.com/css/codepen.min.css'
                  ]

               });

            }

            var TempApprovalDate = currentListItem.get_item('Created');
            var ApprovalDate = $.datepicker.formatDate('dd/mm/yy', TempApprovalDate);
            singleObj['Created'] = ApprovalDate;

            if (singleObj['IMKpiDescription'] != null) {
               tinyMCE.get('DisplayDescriptionTextArea').setContent(singleObj['IMKpiDescription']);
            }

            if (singleObj['CustomerClaimDetail'] != null) {
               tinyMCE.get('CustomerClaimDetailTextArea').setContent(singleObj['CustomerClaimDetail']);
            }

            var $scope = angular.element(myCtrl).scope();

            if (singleObj['TaskStat'] == "Final Finance Approval") {
               $scope.selIsCustomerClaim = singleObj['IsCustomerClaim'].toString();
            }

            if (currentListItem.get_item('IsDraft') == true) {
               $scope.$apply(function () {
                  setTimeout(function () {

                     $scope.FormComplaintTitle = singleObj['Title'];
                     $scope.FormComplaintReason = singleObj['ARReason'];
                     $scope.selCustomerNames = $.grep($scope.CustomerNames, function (e) {
                        return e.value == singleObj['CustomerName'];
                     })[0];
                     //$scope.selCustomerNames= $scope.CustomerNames.find(x => x.value === singleObj['CustomerName']);
                     $scope.custLocation = singleObj['CustomerLocation'];
                     $scope.contactPerson = singleObj['CustomerContactPerson'];
                     $scope.contactTel = singleObj['CustomerContactTelephone'];
                     $scope.contactEmail = singleObj['CustomerContactEmail'];

                     $scope.productionDate = singleObj['ProductionDate'];
                     $scope.batchNumberFiled = singleObj['BatchNumberFiled'];

                     $scope.selProductOrServiceComplaint = $.grep($scope.ComplaintTypes, function (e) {
                        return e.value == singleObj['ComplaintType'];
                     })[0];
                     //$scope.selProductOrServiceComplaint= $scope.ComplaintTypes.find(x => x.value === singleObj['ComplaintType']);



                     $.when(listServiceCategories(singleObj['ComplaintType'])).then(function () {
                        console.log("In Complaint Type");
                        console.log($scope.ComplaintClassifications);
                        let complaintClassification = $.grep($scope.ComplaintClassifications, function (e) {
                           return e.value == singleObj['CustomerComplaintService'];
                        })[0];
                        $scope.selComplaintClassification = complaintClassification;
                        console.log("After complaint type");
                        console.log($scope.selComplaintClassification);
                     });



                     $scope.selProductCategory = $.grep($scope.ComplaintProductCategories, function (e) {
                        return e.value == singleObj['ProductCategory'];
                     })[0];

                     $.when(listProductNames(singleObj['ProductCategory'])).then(function () {
                        console.log("In Product Type");
                        console.log($scope.ComplaintProductNames);
                        let complaintProductName = $.grep($scope.ComplaintProductNames, function (e) {
                           return e.value == singleObj['ProductName'];
                        })[0];


                        $scope.selComplaintProductName = complaintProductName;

                        console.log("After product type");
                        console.log($scope.selComplaintProductName);
                     });

                     $scope.productionDateDatepicker = singleObj['ProductionDate'];
                     $scope.datepicker = singleObj['CustomerProblemDate'];
                     $scope.FormComplaintArea = singleObj['Area'];
                     $scope.FormDebtAreaOfProblem = singleObj['DepartmentAreaofProblem'];
                     $scope.FormHasThisHappenedBefore = singleObj['hasThisHappenedBefore'];
                     $scope.CreatedDate = singleObj['Created'];
                     $scope.selIsCustomerClaim = singleObj['IsCustomerClaim'].toString();
                     $scope.CustomerClaimDetail = singleObj['CustomerClaimDetail'];

                  }, 5000);



               });
            }

            DisplayCustomerComplaintFormExtension();
         }),
         Function.createDelegate(this, fail)
      );
   });
}

// Purpose - Display the Customer Complaint Form
// Recommend to move to file: src/forms/customerComplaint/customerComplaintForm.js
function DisplayCustomerComplaintFormExtension() {
   SP.SOD.executeFunc("/_layouts/15/clientpeoplepicker.js", "SP.ClientContext", function () {
      SPListOperations.populateScopeList("Province List");
      SPListOperations.populateScopeList("Store Outlet Retailer List");
      SPListOperations.populateScopeList("Source of Complaint");

      $(function () {
         $("#bestBeforeDatepicker").datepicker({
            dateFormat: 'dd/mm/yy'
         });
      });


      var $scope = angular.element(myCtrl).scope();
      var list = website.get_lists().getByTitle("Incidents"); //Get the List

      var query = new SP.CamlQuery();
      query.set_viewXml("<View><Query><Where><Eq><FieldRef Name='ID' /><Value Type='Counter'>" + $scope.itemID + "</Value></Eq></Where></Query><ViewFields>" +
         "<FieldRef Name='ID' /><FieldRef Name='Title' /><FieldRef Name='IsDraft' /><FieldRef Name='TaskStat' /><FieldRef Name='ARReason' /><FieldRef Name='Province' /><FieldRef Name='StoreOutletRetailer' /><FieldRef Name='SourceofComplaint' />" +
         "<FieldRef Name='UnitQuantity' /><FieldRef Name='UnitType' /><FieldRef Name='BestBeforeDate' /><FieldRef Name='CustomerComplaintCategory' /></ViewFields></View>");

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

            var complaintCategory = currentListItem.get_item('CustomerComplaintCategory');
            singleObj['CustomerComplaintCategory'] = complaintCategory;

            if (currentListItem.get_item('IsDraft') == true) {
               $scope.$apply(function () {

                  $scope.selProvince = $.grep($scope.ProvinceList, function (e) {
                     return e.value == singleObj['Province'];
                  })[0];
                  $scope.selStoreOutletRetailer = $.grep($scope.StoreOutletRetailerList, function (e) {
                     return e.value == singleObj['StoreOutletRetailer'];
                  })[0];
                  $scope.selSourceOfComplaint = $.grep($scope.SourceOfComplaintList, function (e) {
                     return e.value == singleObj['SourceOfComplaint'];
                  })[0];
                  $scope.selUnitType = $.grep($scope.UnitTypeList, function (e) {
                     return e.value == singleObj['UnitType'];
                  })[0];

                  $scope.selComplaintCategory = $.grep($scope.CustomerComplaintCategories, function (e) {
                     return e.value == singleObj['CustomerComplaintCategory'];
                  })[0];

                  $scope.bestBeforeDatepicker = singleObj['BestBeforeDate'];
                  //$scope.ComplaintCategory = singleObj['CustomerComplaintCategory'];
                  $scope.unitQuantity = singleObj['UnitQuantity'];
               });
            }
         }),
         Function.createDelegate(this, fail)
      );
   });
}

function updateCustomerComplaint() {
   var $scope = angular.element(myCtrl).scope();
   var $scopeCustomerComplaint = angular.element(ViewCustomerComplaint).scope();
   CustomerComplaintService.updateCustomerComplaint($scope, $scopeCustomerComplaint)
      .then(function () {
         $('#saveLoaderImage').css("display", "none");
      })
      .catch(function (error) {
         $('#saveLoaderImage').css("display", "none");
         console.error('Error creating customer complaint:', error);
         // Handle error appropriately
      });
   return;

   var Title;
   var CustLocation;
   var ContactPerson;
   var CustomerTel;
   var CustomerEmail;
   var ProductOrServiceComplaint;
   var ComplaintClassification;
   var ComplaintProductCategory;
   var ComplaintProductName;
   var ProblemDate;
   Title = $scope.listTitle;
   var itemId = $scope.itemID;
   // var $scopeCustomerComplaint = angular.element(ViewCustomerComplaint).scope();

   var BatchNumberFiled = $scopeCustomerComplaint.batchNumberFiled;
   var ProductionDate = $("#productionDateDatepicker").datepicker("getDate");
   var BestBeforeDate = $("#bestBeforeDatepicker").datepicker("getDate");
   var UnitQuantity = $scopeCustomerComplaint.unitQuantity;

   var CustomerNameID;

   if ($scopeCustomerComplaint.IsDraft == false) {
      CustomerNameID = $scopeCustomerComplaint.selCustomerNames.id;
   } else if ($scopeCustomerComplaint.selCustomerNames != null) {
      CustomerNameID = $scopeCustomerComplaint.selCustomerNames.id;
   }

   CustLocation = $scopeCustomerComplaint.custLocation;
   ContactPerson = $scopeCustomerComplaint.contactPerson;
   CustomerTel = $scopeCustomerComplaint.contactTel;
   CustomerEmail = $scopeCustomerComplaint.contactEmail;

   var ProductOrServiceComplaintID;

   if ($scopeCustomerComplaint.IsDraft == false) {
      ProductOrServiceComplaintID = $scopeCustomerComplaint.selProductOrServiceComplaint.id;
   } else if ($scopeCustomerComplaint.selProductOrServiceComplaint != null) {
      ProductOrServiceComplaintID = $scopeCustomerComplaint.selProductOrServiceComplaint.id;
   }

   var ComplaintClassificationID;
   if ($scopeCustomerComplaint.selComplaintClassification != null) {
      ComplaintClassificationID = $scopeCustomerComplaint.selComplaintClassification.id;
   }

   var ComplaintProductCategoryID;
   if ($scopeCustomerComplaint.IsDraft == false) {
      ComplaintProductCategoryID = $scopeCustomerComplaint.selProductCategory.id;
   } else if ($scopeCustomerComplaint.selProductCategory != null) {
      ComplaintProductCategoryID = $scopeCustomerComplaint.selProductCategory.id;
   }

   var ComplaintProductNameID;
   if ($scopeCustomerComplaint.IsDraft == false) {
      ComplaintProductNameID = $scopeCustomerComplaint.selComplaintProductName.id;
   } else if ($scopeCustomerComplaint.selComplaintProductName != null) {
      ComplaintProductNameID = $scopeCustomerComplaint.selComplaintProductName.id;
   }

   var ProvinceID;
   if ($scopeCustomerComplaint.IsDraft == false) {
      ProvinceID = $scopeCustomerComplaint.selProvince.id;
   } else if ($scopeCustomerComplaint.selProvince != null) {
      ProvinceID = $scopeCustomerComplaint.selProvince.id;
   }

   var SourceOfComplaintID;
   if ($scopeCustomerComplaint.IsDraft == false) {
      SourceOfComplaintID = $scopeCustomerComplaint.selSourceOfComplaint.id;
   } else if ($scopeCustomerComplaint.selSourceOfComplaint != null) {
      SourceOfComplaintID = $scopeCustomerComplaint.selSourceOfComplaint.id;
   }

   var StoreOutletRetailerID;
   if ($scopeCustomerComplaint.IsDraft == false) {
      StoreOutletRetailerID = $scopeCustomerComplaint.selStoreOutletRetailer.id;
   } else if ($scopeCustomerComplaint.selStoreOutletRetailer != null) {
      StoreOutletRetailerID = $scopeCustomerComplaint.selStoreOutletRetailer.id;
   }

   var UnitTypeID;
   if ($scopeCustomerComplaint.IsDraft == false) {
      UnitTypeID = $scopeCustomerComplaint.selUnitType.id;
   } else if ($scopeCustomerComplaint.selUnitType != null) {
      UnitTypeID = $scopeCustomerComplaint.selUnitType.id;
   }


   var customerRepresentatives;
   if ($scopeCustomerComplaint.IsDraft == false) {
      customerRepresentatives = $scopeCustomerComplaint.CustomerRepresentativeList.id;
   } else if ($scopeCustomerComplaint.CustomerRepresentativeList != null) {
      customerRepresentatives = $scopeCustomerComplaint.CustomerRepresentativeList.id;
   }

   var customerRepresentatives = $scopeCustomerComplaint.ShowSelectedCustomerRepresentatives();

   ProblemDate = $("#datepicker").datepicker("getDate");
   var isCustomerClaim = $scopeCustomerComplaint.selIsCustomerClaim;
   var CustomerClaimDetail = tinyMCE.get('CustomerClaimDetailTextArea').getContent({ format: 'raw' });
   var AssignedTo;

   // Mint addition - checking if item should skip to the end.
   var taskStat = $scope.skipToEnd ? "Completed" : "New";


   var businessManagers = getBusinessUserInfo();

   $scope.businessManagerIds = [];
   getBusinessManagerIds(businessManagers).then(function () {


      if ($scopeCustomerComplaint.IsDraft == false && !$scope.skipToEnd) {
         var Investigator = getUserInfo();
         AssignedTo = Investigator['Key'];

      } else {
         taskStat = $scope.skipToEnd ? "Completed" : "Draft";
      }

      var itemProperties = {
         "TaskStat": taskStat,
         "ARStatus": $scope.skipToEnd ? "Completed" : "In Progress", // Mint addition - checking if item should skip to the end.
         //  "ARStatus": "In Progress",
         "Title": Title,
         "CustomerLocation": CustLocation,
         "CustomerContactPerson": ContactPerson,
         "CustomerContactTelephone": CustomerTel,
         "CustomerContactEmail": CustomerEmail,
         "CustomerProblemDate": ProblemDate,
         "IsCustomerClaim": isCustomerClaim,
         "CustomerClaimDetail": CustomerClaimDetail,
         "CustomerNameId": CustomerNameID,
         "ComplaintTypeId": ProductOrServiceComplaintID,
         "ProvinceId": ProvinceID,
         "StoreOutletRetailerId": StoreOutletRetailerID,
         "UnitQuantity": UnitQuantity,
         "UnitTypeId": UnitTypeID,
         "SourceofComplaintId": SourceOfComplaintID,
         "CustomerComplaintServiceId": ComplaintClassificationID,
         "ProductCategoryId": ComplaintProductCategoryID,
         "ProductNameId": ComplaintProductNameID,
         "CustomerRepresentativesId": { "results": customerRepresentatives },
         "BusinessManagersId": { "results": $scope.businessManagerIds },
         "IsDraft": $scopeCustomerComplaint.IsDraft,
         "ProductionDate": ProductionDate,
         "BestBeforeDate": BestBeforeDate,
         "BatchNumberFiled": BatchNumberFiled
      }

      // Mint addition - Adding the existing AR Reference should this item skip to the end. abrie.vanwyk@mintgroup.net
      if ($scope.skipToEnd) itemProperties.ExistingARReference = $("#existingARReference").val();

      if ($scopeCustomerComplaint.IsDraft == true || $scope.skipToEnd) {
         updateListItem(appWebUrl, 'Incidents', itemId, itemProperties, null);
      } else {
         var getRevisor = GetUserId(AssignedTo);
         getRevisor.done(function (user) {
            //user.d.Id <-- This is your precious data

            itemProperties.AssignedToId = user.d.Id;
            var mailProperties =
            {
               "d": {
                  "AssignedToId": user.d.Id,
                  "ARReason": "Customer Complaint",
                  "ID": itemId
               }
            }
            updateListItem(appWebUrl, 'Incidents', itemId, itemProperties, mailProperties);
         });
      }
   })
}