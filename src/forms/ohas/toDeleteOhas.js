function ViewOHaS() {
   SPListOperations.populateScopeList("ShiftList");
   SPListOperations.populateScopeList("Drug Test");
   SPListOperations.populateScopeList("BodyPartList");
   SPListOperations.populateScopeList("OccupationalStressorList");
   SPListOperations.populateScopeList("WhoWasEffectedList");
   SPListOperations.populateScopeList("ManMadeCauses");
   SPListOperations.populateScopeList("EffectonPersonList");
   SPListOperations.populateScopeList("ResultofIncidentList");
   SPListOperations.populateScopeList("NaturalCauses");
   SPListOperations.populateScopeList("PrimaryIncidentType");
   SPListOperations.populateScopeList("Incident Classifications");
   SPListOperations.populateScopeList("ImmediateCauses");
   SPListOperations.populateScopeList("NatureOfInjury");
   SPListOperations.populateScopeList("SourceOfInjury");

   $(function () {
      $("#datepicker").datepicker({ dateFormat: 'dd/mm/yy' });
   });
}

// Purpose - Display the OHaS Form
// Recommend to move to file: src/forms/ohas/ohasForm.js
function DisplayOHaSForm() {
   SPListOperations.populateScopeList("ShiftList");
   SPListOperations.populateScopeList("Drug Test");
   SPListOperations.populateScopeList("BodyPartList");
   SPListOperations.populateScopeList("OccupationalStressorList");
   SPListOperations.populateScopeList("WhoWasEffectedList");
   SPListOperations.populateScopeList("ManMadeCauses");
   SPListOperations.populateScopeList("EffectonPersonList");
   SPListOperations.populateScopeList("ResultofIncidentList");
   SPListOperations.populateScopeList("NaturalCauses");
   SPListOperations.populateScopeList("PrimaryIncidentType");
   SPListOperations.populateScopeList("Incident Classifications");
   SPListOperations.populateScopeList("ImmediateCauses");
   SPListOperations.populateScopeList("NatureOfInjury");
   SPListOperations.populateScopeList("SourceOfInjury");


   var $scopeGetID = angular.element(myCtrl).scope();
   var list = website.get_lists().getByTitle("Incidents"); //Get the List
   var query = new SP.CamlQuery();
   query.set_viewXml("<View><Query><Where><Eq><FieldRef Name='ID' /><Value Type='Counter'>" + $scopeGetID.itemID + "</Value></Eq></Where></Query><ViewFields>" +
      "<FieldRef Name='ID' /><FieldRef Name='TaskStat' /><FieldRef Name='ARReason' /><FieldRef Name=ARStatus /><FieldRef Name=Title /><FieldRef Name='Area' />" +
      "<FieldRef Name='DepartmentAreaofProblem' /><FieldRef Name='ExactLocation' /><FieldRef Name='IncidentDate' /><FieldRef Name='NewShift' />" +
      "<FieldRef Name='DrugResults' /><FieldRef Name='ReportedBy' /><FieldRef Name='Whowaseffected' /><FieldRef Name='Howdidithappen' />" +
      //"<FieldRef Name='Supportingevidence' /><FieldRef Name='ClassificationofIncident' /><FieldRef Name='SubClassificationofIncident' /><FieldRef Name='PartofBodyAffected' />" +
      //"<FieldRef Name='OccupationalStressor' /><FieldRef Name='ManMadeCause' /><FieldRef Name='NaturalCause' /><FieldRef Name='EmployeeName' />" +
      "<FieldRef Name='Age' /><FieldRef Name='IMDepartment' /><FieldRef Name='RegularOccupation' /><FieldRef Name='PeriodPresentJob' />" +
      "<FieldRef Name='YearsCompanyService' /><FieldRef Name='NameofSupervisor' /><FieldRef Name='DepartmentManager' /><FieldRef Name='EffectonPerson' />" +
      "<FieldRef Name='ResultofIncident' /><FieldRef Name='Created'/>" +
      "<FieldRef Name=InitialActionTaken /><FieldRef Name='DrugTest' /><FieldRef Name='DrugReason' /><FieldRef Name='hasThisHappenedBefore' />" +
      "<FieldRef Name='IMKpiDescription' /><FieldRef Name='ClassificationofIncident' /><FieldRef Name='SubClassificationofIncident' /><FieldRef Name='AssignedTo' /><FieldRef Name='Initiator' /><FieldRef Name='IsDraft' /><FieldRef Name='ContentType' /></ViewFields></View>");

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
         var area = currentListItem.get_item('Area').get_lookupValue();;
         singleObj['Area'] = area;
         singleObj['Title'] = currentListItem.get_item('Title');
         singleObj['ARReason'] = currentListItem.get_item('ARReason');
         singleObj['ExactLocation'] = currentListItem.get_item('ExactLocation');
         var IncidentDateTest = $("#datepicker").datepicker();
         var IncidentDate = currentListItem.get_item('IncidentDate');
         var newDate = $.datepicker.formatDate('dd/mm/yy', IncidentDate);
         singleObj['IncidentDate'] = newDate;


         $('#datepicker').datepicker("setDate", newDate);

         if (currentListItem.get_item('NewShift') != null) {
            singleObj['NewShift'] = currentListItem.get_item('NewShift').get_lookupValue();
         }
         //singleObj['NewShift'] = currentListItem.get_item('NewShift').get_lookupValue();
         singleObj['DrugResults'] = currentListItem.get_item('DrugResults');
         singleObj['ReportedBy'] = currentListItem.get_item('ReportedBy');

         if (currentListItem.get_item('ClassificationofIncident') != null) {
            singleObj['ClassificationofIncident'] = currentListItem.get_item('ClassificationofIncident').get_lookupValue();
         }
         //singleObj['ClassificationofIncident'] = currentListItem.get_item('ClassificationofIncident').get_lookupValue();

         if (currentListItem.get_item('SubClassificationofIncident') != null) {
            singleObj['SubClassificationofIncident'] = currentListItem.get_item('SubClassificationofIncident').get_lookupValue();
         }
         //singleObj['SubClassificationofIncident'] = currentListItem.get_item('SubClassificationofIncident').get_lookupValue();





         tinymce.init({
            selector: "#SupportingEvidenceTextArea",
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



         if (currentListItem.get_item('Whowaseffected') != null) {
            singleObj['Whowaseffected'] = currentListItem.get_item('Whowaseffected').get_lookupValue();
         }
         //singleObj['Whowaseffected'] = currentListItem.get_item('Whowaseffected').get_lookupValue();

         singleObj['Age'] = currentListItem.get_item('Age');
         singleObj['Department'] = currentListItem.get_item('IMDepartment');
         singleObj['RegularOccupation'] = currentListItem.get_item('RegularOccupation');
         singleObj['PeriodPresentJob'] = currentListItem.get_item('PeriodPresentJob');
         singleObj['YearsCompanyService'] = currentListItem.get_item('YearsCompanyService');
         singleObj['NameofSupervisor'] = currentListItem.get_item('NameofSupervisor');
         singleObj['DepartmentManager'] = currentListItem.get_item('DepartmentManager');



         if (currentListItem.get_item('EffectonPerson') != null) {
            singleObj['EffectonPerson'] = currentListItem.get_item('EffectonPerson').get_lookupValue();
         }
         //singleObj['EffectonPerson'] = currentListItem.get_item('EffectonPerson').get_lookupValue();

         if (currentListItem.get_item('ResultofIncident') != null) {
            singleObj['ResultofIncident'] = currentListItem.get_item('ResultofIncident').get_lookupValue();
         }
         //singleObj['ResultofIncident'] = currentListItem.get_item('ResultofIncident').get_lookupValue();
         singleObj['InitialActionTaken'] = currentListItem.get_item('InitialActionTaken');

         if (currentListItem.get_item('DrugTest') != null) {
            singleObj['DrugTest'] = currentListItem.get_item('DrugTest').get_lookupValue();
         }
         //singleObj['DrugTest'] = currentListItem.get_item('DrugTest').get_lookupValue();
         singleObj['DrugReason'] = currentListItem.get_item('DrugReason');

         if (currentListItem.get_item('DepartmentAreaofProblem') != null) {
            singleObj['DepartmentAreaofProblem'] = currentListItem.get_item('DepartmentAreaofProblem').get_lookupValue();
         }
         //singleObj['DepartmentAreaofProblem'] = currentListItem.get_item('DepartmentAreaofProblem').get_lookupValue();
         singleObj['IMKpiDescription'] = currentListItem.get_item('IMKpiDescription');

         if (currentListItem.get_item('hasThisHappenedBefore') != null) {
            singleObj['hasThisHappenedBefore'] = currentListItem.get_item('hasThisHappenedBefore').get_lookupValue();
         }
         //singleObj['hasThisHappenedBefore'] = currentListItem.get_item('hasThisHappenedBefore').get_lookupValue();


         tinymce.init({
            selector: "#InitialActionTakenTextArea",
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

         if (singleObj['InitialActionTaken'] != null) {
            tinyMCE.get('InitialActionTakenTextArea').setContent(singleObj['InitialActionTaken']);
         }
         var $scope = angular.element(myCtrl).scope();

         if (currentListItem.get_item('IsDraft') == true) {
            $scope.$apply(function () {
               $scope.FormComplaintTitle = singleObj['Title'];
               $scope.FormComplaintReason = singleObj['ARReason'];
               $scope.ExactLocation = singleObj['ExactLocation'];
               $scope.IncidentDate = singleObj['IncidentDate'];
               $scope.selShift = $.grep($scope.Shifts, function (e) { return e.value == singleObj['NewShift']; })[0];
               $scope.DrugResults = singleObj['DrugResults'];
               $scope.ReportedBy = singleObj['ReportedBy'];
               $scope.Age = singleObj['Age'];
               $scope.Department = singleObj['Department'];
               $scope.RegularOccupation = singleObj['RegularOccupation'];
               $scope.PeriodPresentJob = singleObj['PeriodPresentJob'];
               $scope.YearsCompanyService = singleObj['YearsCompanyService'];
               $scope.NameofSupervisor = singleObj['NameofSupervisor'];
               $scope.DepartmentManager = singleObj['DepartmentManager'];

               $.when(listIncidentSubClassifications(singleObj['ClassificationofIncident'])).then(function () {
                  $scope.selIncidentSubClassification = $.grep($scope.IncidentSubClassifications, function (e) { return e.value == singleObj['SubClassificationofIncident']; })[0];
               });


               $scope.affectee = $.grep($scope.affectees, function (e) { return e.value == singleObj['Whowaseffected']; })[0];
               $scope.EffectOnPerson = $.grep($scope.EffectOnPersons, function (e) { return e.value == singleObj['EffectonPerson']; })[0];
               $scope.ResultofIncident = $.grep($scope.ResultofIncidents, function (e) { return e.value == singleObj['ResultofIncident']; })[0];
               $scope.selDrugTest = $.grep($scope.DrugTest, function (e) { return e.value == singleObj['DrugTest']; })[0];
               $scope.DrugReason = singleObj['DrugReason'];
               $scope.FormComplaintArea = singleObj['Area'];
               $scope.FormDebtAreaOfProblem = singleObj['DepartmentAreaofProblem'];
               $scope.FormHasThisHappenedBefore = singleObj['hasThisHappenedBefore'];
               $scope.CreatedDate = singleObj['Created'];
            });

         } else {
            $scope.$apply(function () {
               $scope.FormComplaintTitle = singleObj['Title'];
               $scope.FormComplaintReason = singleObj['ARReason'];
               $scope.ExactLocation = singleObj['ExactLocation'];
               $scope.IncidentDate = singleObj['IncidentDate'];
               $scope.Shift = singleObj['NewShift'];
               $scope.DrugResults = singleObj['DrugResults'];
               $scope.ReportedBy = singleObj['ReportedBy'];
               $scope.Whowaseffected = singleObj['Whowaseffected'];
               $scope.EffectonPerson = singleObj['EffectonPerson'];
               $scope.ResultofIncident = singleObj['ResultofIncident'];
               $scope.DrugTest = singleObj['DrugTest'];
               $scope.DrugReason = singleObj['DrugReason'];
               $scope.FormComplaintArea = singleObj['Area'];
               $scope.FormDebtAreaOfProblem = singleObj['DepartmentAreaofProblem'];
               $scope.FormHasThisHappenedBefore = singleObj['hasThisHappenedBefore'];
               $scope.CreatedDate = singleObj['Created'];
            });

         }

         DisplayOHaSForm2();
      }),
      Function.createDelegate(this, fail)
   );


}

// Purpose - Display the OHaS Form
// Recommend to move to file: src/forms/ohas/ohasForm.js
function DisplayOHaSForm2() {
   var $scopeGetID = angular.element(myCtrl).scope();
   var list = website.get_lists().getByTitle("Incidents"); //Get the List
   var query = new SP.CamlQuery();
   query.set_viewXml("<View><Query><Where><Eq><FieldRef Name='ID' /><Value Type='Counter'>" + $scopeGetID.itemID + "</Value></Eq></Where></Query><ViewFields>" +
      "<FieldRef Name='Supportingevidence' /><FieldRef Name='ClassificationofIncident' /><FieldRef Name='SubClassificationofIncident' /><FieldRef Name='PartofBodyAffected' />" +
      "<FieldRef Name='OccupationalStressor' /><FieldRef Name='ManMadeCause' /><FieldRef Name='NaturalCause' /><FieldRef Name='EmployeeName' />" +
      "<FieldRef Name='ID' /><FieldRef Name='ContentType' /><FieldRef Name='IsDraft' /><FieldRef Name='ImmediateCause' /><FieldRef Name='NatureOfInjury' />" +
      "<FieldRef Name='SourceOfInjury' /><FieldRef Name='ImmediateCauseOther' /><FieldRef Name='NatureOfInjuryOther' /><FieldRef Name='SourceOfInjuryOther' /><FieldRef Name='BodyPartsAdditionalInformation' /></ViewFields></View>");

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
         singleObj['Supportingevidence'] = currentListItem.get_item('Supportingevidence');

         if (currentListItem.get_item('ClassificationofIncident') != null) {
            singleObj['ClassificationofIncident'] = currentListItem.get_item('ClassificationofIncident').get_lookupValue();
         }
         //singleObj['ClassificationofIncident'] = currentListItem.get_item('ClassificationofIncident').get_lookupValue();

         if (currentListItem.get_item('SubClassificationofIncident') != null) {
            singleObj['SubClassificationofIncident'] = currentListItem.get_item('SubClassificationofIncident').get_lookupValue();
         }
         //singleObj['SubClassificationofIncident'] = currentListItem.get_item('SubClassificationofIncident').get_lookupValue();
         //TODO:
         singleObj['PartofBodyAffected'] = "";

         var PartofBodyAffected = currentListItem.get_item('PartofBodyAffected');
         debugger;
         for (var bodypart = 0; bodypart < PartofBodyAffected.length; bodypart++) {
            if (currentListItem.get_item('IsDraft') == true) {
               $.grep($scopeGetID.bodyparts, function (e) { return e.id == PartofBodyAffected[bodypart].get_lookupId(); })[0].isChecked = true;
            } else {
               if (bodypart + 1 == PartofBodyAffected.length) {
                  singleObj['PartofBodyAffected'] += PartofBodyAffected[bodypart].get_lookupValue();
               }
               else {
                  singleObj['PartofBodyAffected'] += PartofBodyAffected[bodypart].get_lookupValue() + ", ";
               }
            }
         }
         // singleObj['OccupationalStressor'] = currentListItem.get_item('OccupationalStressor');
         singleObj['OccupationalStressor'] = "";
         var OccupationalStressor = currentListItem.get_item('OccupationalStressor');
         for (var Stressor = 0; Stressor < OccupationalStressor.length; Stressor++) {

            if (currentListItem.get_item('IsDraft') == true) {
               $.grep($scopeGetID.OccupationalStressors, function (e) { return e.id == OccupationalStressor[Stressor].get_lookupId(); })[0].isChecked = true;
            } else {
               if (Stressor + 1 == OccupationalStressor.length) {
                  singleObj['OccupationalStressor'] += OccupationalStressor[Stressor].get_lookupValue();
               }
               else {
                  singleObj['OccupationalStressor'] += OccupationalStressor[Stressor].get_lookupValue() + ", ";
               }
            }



         }

         singleObj['ImmediateCause'] = "";
         var ImmediateCause = currentListItem.get_item('ImmediateCause');
         for (var cause = 0; cause < ImmediateCause.length; cause++) {
            if (currentListItem.get_item('IsDraft') == true) {
               $.grep($scopeGetID.immediateCauses, function (e) { return e.id == ImmediateCause[cause].get_lookupId(); })[0].isChecked = true;
            } else {
               if (cause + 1 == ImmediateCause.length) {
                  singleObj['ImmediateCause'] += ImmediateCause[cause].get_lookupValue();
               }
               else {
                  singleObj['ImmediateCause'] += ImmediateCause[cause].get_lookupValue() + ", ";
               }
            }
         }

         singleObj['SourceOfInjury'] = "";

         var SourceOfInjury = currentListItem.get_item('SourceOfInjury');
         for (var source = 0; source < SourceOfInjury.length; source++) {
            if (currentListItem.get_item('IsDraft') == true) {
               $.grep($scopeGetID.sourcesOfInjury, function (e) { return e.id == SourceOfInjury[source].get_lookupId(); })[0].isChecked = true;
            } else {
               if (source + 1 == SourceOfInjury.length) {
                  singleObj['SourceOfInjury'] += SourceOfInjury[source].get_lookupValue();
               }
               else {
                  singleObj['SourceOfInjury'] += SourceOfInjury[source].get_lookupValue() + ", ";
               }
            }
         }
         singleObj['NatureOfInjury'] = "";

         var NatureOfInjury = currentListItem.get_item('NatureOfInjury');
         for (var injury = 0; injury < NatureOfInjury.length; injury++) {
            if (currentListItem.get_item('IsDraft') == true) {
               $.grep($scopeGetID.natureOfInjuries, function (e) { return e.id == NatureOfInjury[injury].get_lookupId(); })[0].isChecked = true;
            } else {
               if (injury + 1 == NatureOfInjury.length) {
                  singleObj['NatureOfInjury'] += NatureOfInjury[injury].get_lookupValue();
               }
               else {
                  singleObj['NatureOfInjury'] += NatureOfInjury[injury].get_lookupValue() + ", ";
               }
            }
         }


         if (currentListItem.get_item('ManMadeCause') != null) {
            singleObj['ManMadeCause'] = currentListItem.get_item('ManMadeCause').get_lookupValue();
         }
         //singleObj['ManMadeCause'] = currentListItem.get_item('ManMadeCause').get_lookupValue();

         if (currentListItem.get_item('NaturalCause') != null) {
            singleObj['NaturalCause'] = currentListItem.get_item('NaturalCause').get_lookupValue();
         }
         //singleObj['NaturalCause'] = currentListItem.get_item('NaturalCause').get_lookupValue();
         singleObj['EmployeeName'] = currentListItem.get_item('EmployeeName');

         if (singleObj['Supportingevidence'] != null) {
            tinyMCE.get('SupportingEvidenceTextArea').setContent(singleObj['Supportingevidence']);
         }

         singleObj['ImmediateCauseOther'] = currentListItem.get_item('ImmediateCauseOther');
         singleObj['NatureOfInjuryOther'] = currentListItem.get_item('NatureOfInjuryOther');
         singleObj['SourceOfInjuryOther'] = currentListItem.get_item('SourceOfInjuryOther');

         if (!tinyMCE.get('BodyPartInformation')) {
            tinymce.init({
               selector: "#BodyPartInformation",
               toolbar: false,
               menubar: false,
               setup: function (editor) {
                  editor.on('init', function () {
                     $(editor.getBody()).on('click', 'a[href]', function (e) {
                        var win = window.open($(e.currentTarget).attr('href'), '_blank');
                        win.focus();
                     });
                  })
               },
               plugins: [],
               content_css: []

            });
         }

         singleObj['BodyPartsAdditionalInformation'] = currentListItem.get_item('BodyPartsAdditionalInformation');
         if (singleObj['BodyPartsAdditionalInformation'] != null) {
            tinyMCE.get('BodyPartInformation').setContent(singleObj['BodyPartsAdditionalInformation']);
         }

         if (!tinyMCE.get('ImmediateCauseOtherTextArea')) {
            tinymce.init({
               selector: "#ImmediateCauseOtherTextArea",
               toolbar: false,
               menubar: false,
               setup: function (editor) {
                  editor.on('init', function () {
                     $(editor.getBody()).on('click', 'a[href]', function (e) {
                        var win = window.open($(e.currentTarget).attr('href'), '_blank');
                        win.focus();
                     });
                  })
               },
               plugins: [],
               content_css: []

            });
         }

         singleObj['ImmediateCauseOther'] = currentListItem.get_item('ImmediateCauseOther');
         if (singleObj['ImmediateCauseOther'] != null) {
            tinyMCE.get('ImmediateCauseOtherTextArea').setContent(singleObj['ImmediateCauseOther']);
         }

         if (!tinyMCE.get('NatureOfInjuryOtherTextArea')) {
            tinymce.init({
               selector: "#NatureOfInjuryOtherTextArea",
               toolbar: false,
               menubar: false,
               setup: function (editor) {
                  editor.on('init', function () {
                     $(editor.getBody()).on('click', 'a[href]', function (e) {
                        var win = window.open($(e.currentTarget).attr('href'), '_blank');
                        win.focus();
                     });
                  })
               },
               plugins: [],
               content_css: []

            });
         }

         singleObj['NatureOfInjuryOther'] = currentListItem.get_item('NatureOfInjuryOther');
         if (singleObj['NatureOfInjuryOther'] != null) {
            tinyMCE.get('NatureOfInjuryOtherTextArea').setContent(singleObj['NatureOfInjuryOther']);
         }

         if (!tinyMCE.get('SourceOfInjuryOtherTextArea')) {
            tinymce.init({
               selector: "#SourceOfInjuryOtherTextArea",
               toolbar: false,
               menubar: false,
               setup: function (editor) {
                  editor.on('init', function () {
                     $(editor.getBody()).on('click', 'a[href]', function (e) {
                        var win = window.open($(e.currentTarget).attr('href'), '_blank');
                        win.focus();
                     });
                  })
               },
               plugins: [],
               content_css: []

            });
         }

         singleObj['SourceOfInjuryOther'] = currentListItem.get_item('SourceOfInjuryOther');
         if (singleObj['SourceOfInjuryOther'] != null) {
            tinyMCE.get('SourceOfInjuryOtherTextArea').setContent(singleObj['SourceOfInjuryOther']);
         }





         var $scope = angular.element(myCtrl).scope();

         if (currentListItem.get_item('IsDraft') == true) {
            $scope.$apply(function () {
               $scope.PartofBodyAffected = singleObj['PartofBodyAffected'];
               $scope.selIncidentClassification = $.grep($scope.IncidentClassifications, function (e) { return e.value == singleObj['ClassificationofIncident']; })[0];
               $scope.OccupationalStressor = singleObj['OccupationalStressor'];
               $scope.ManMadeCause = $.grep($scope.ManMadeCauses, function (e) { return e.value == singleObj['ManMadeCause']; })[0];
               $scope.NaturalCause = $.grep($scope.NaturalCauses, function (e) { return e.value == singleObj['NaturalCause']; })[0];
               $scope.EmployeeName = singleObj['EmployeeName'];
               $scope.ImmediateCause = singleObj['ImmediateCause'];
               $scope.NatureOfInjury = singleObj['NatureOfInjury'];
               $scope.SourceOfInjury = singleObj['SourceOfInjury'];
               $scope.ImmediateCauseOther = singleObj['ImmediateCauseOther'];
               $scope.NatureOfInjuryOther = singleObj['NatureOfInjuryOther'];
               $scope.SourceOfInjuryOther = singleObj['SourceOfInjuryOther'];
               $scope.BodyPartsAdditionalInformation = singleObj['BodyPartsAdditionalInformation'];

               /*$.when(listIncidentSubClassifications(singleObj['ClassificationofIncident'])).then(function() {
                     $scope.selIncidentSubClassification= $.grep($scope.IncidentSubClassifications, function(e){ return e.value == singleObj['SubClassificationofIncident']; })[0];				
           });*/

               $scope.immediateCauseChange();
               $scope.natureOfInjuryChange();
               $scope.sourceOfInjuryChange();
            });
         } else {
            $scope.$apply(function () {
               $scope.PartofBodyAffected = singleObj['PartofBodyAffected'];
               $scope.OccupationalStressor = singleObj['OccupationalStressor'];
               $scope.ManMadeCause = singleObj['ManMadeCause'];
               $scope.NaturalCause = singleObj['NaturalCause'];
               $scope.ImmediateCause = singleObj['ImmediateCause'];
               $scope.NatureOfInjury = singleObj['NatureOfInjury'];
               $scope.SourceOfInjury = singleObj['SourceOfInjury'];
               $scope.ImmediateCauseOther = singleObj['ImmediateCauseOther'];
               $scope.NatureOfInjuryOther = singleObj['NatureOfInjuryOther'];
               $scope.SourceOfInjuryOther = singleObj['SourceOfInjuryOther'];
               $scope.BodyPartsAdditionalInformation = singleObj['BodyPartsAdditionalInformation'];
            });
         }


         $('#loaderImage').css("display", "none");
         $('#editForm').css("display", "block");

      }),
      Function.createDelegate(this, fail)
   );


}

function createOHaS() {

   var Investigator = getUserInfo();
   var Title;
   var $scope = angular.element(myCtrl).scope();
   Title = $scope.listTitle;





   var BusinessAreaID = $scope.selBusinessArea.id;
   var DebtAreaOfProbelemID = $scope.selProbDebtArea.id;

   var $scopeViewOHaS = angular.element(ViewNewOhas).scope();
   var selectedBodyParts = $scope.ShowSelectedBodyParts();
   var selectedOccupationalStressor = $scope.ShowSelectedOccupationalStressors();

   var selectedImmediateCauses = $scopeViewOHaS.ShowSelectedImmediateCauses();
   //var immediateCauseOther = $scopeViewOHaS.ImmediateCauseOther;
   var selectedNaturesOfInjury = $scopeViewOHaS.ShowSelectedNatureOfInjury();
   //var natureOfInjuryOther = $scopeViewOHaS.NatureOfInjuryOther;
   var selectedSourcesOfInjury = $scopeViewOHaS.ShowSourcesOfInjury();
   //var sourceOfInjuryOther = $scopeViewOHaS.SourceOfInjuryOther;
   //var bodyPartInformation = $scopeViewOHaS.BodyPartsAdditionalInformation;

   var immediateCauseOther = tinyMCE.get('ImmediateCauseOtherTextArea').getContent({ format: 'raw' });
   var natureOfInjuryOther = tinyMCE.get('NatureOfInjuryOtherTextArea').getContent({ format: 'raw' });
   var sourceOfInjuryOther = tinyMCE.get('SourceOfInjuryOtherTextArea').getContent({ format: 'raw' });
   var bodyPartInformation = tinyMCE.get('BodyPartInformation').getContent({ format: 'raw' });

   var ExactLocation = $scopeViewOHaS.ExactLocation;
   var IncidentDate = $("#datepicker").datepicker("getDate");

   var hour = parseInt($("#datepickerHour").val()); // Get the selected hour
   var minutes = parseInt($("#datepickerMinutes").val()); // Get the selected minutes

   // Set the hour and minutes on the IncidentDate
   IncidentDate.setHours(hour);
   IncidentDate.setMinutes(minutes);

   // Now IncidentDate contains the combined date and time
   console.log(IncidentDate);

   var ShiftID;
   if ($scopeViewOHaS.IsDraft == false) {
      ShiftID = $scopeViewOHaS.selShift.id;
   } else if ($scopeViewOHaS.selShift != null) {
      ShiftID = $scopeViewOHaS.selShift.id;
   }

   //var ShiftID = $scopeViewOHaS.selShift.id;
   var Description = tinyMCE.get('DescriptionTextArea').getContent({ format: 'raw' });
   var InitialActionTaken = tinyMCE.get('InitialActionTakenTextArea').getContent({ format: 'raw' });

   var DrugTestID;
   if ($scopeViewOHaS.IsDraft == false) {
      DrugTestID = $scopeViewOHaS.selDrugTest.id;
   } else if ($scopeViewOHaS.selDrugTest != null) {
      DrugTestID = $scopeViewOHaS.selDrugTest.id;
   }
   //var DrugTestID = $scopeViewOHaS.selDrugTest.id;
   var DrugTestNoReason = $scopeViewOHaS.DrugReason;
   var TestResults = $scopeViewOHaS.DrugResults;
   var ReportedBy = $scopeViewOHaS.ReportedBy;

   var WhoWasAffectedID;
   if ($scopeViewOHaS.IsDraft == false) {
      WhoWasAffectedID = $scopeViewOHaS.affectee.id;
   } else if ($scopeViewOHaS.affectee != null) {
      WhoWasAffectedID = $scopeViewOHaS.affectee.id;
   }
   //var WhoWasAffectedID = $scopeViewOHaS.affectee.id;

   var SupportingEvidence = tinyMCE.get('SupportingEvidenceTextArea').getContent({ format: 'raw' });

   var incidentClassificationID;
   if ($scopeViewOHaS.IsDraft == false) {
      incidentClassificationID = $scopeViewOHaS.selIncidentClassification.id;
   } else if ($scopeViewOHaS.selIncidentClassification != null) {
      incidentClassificationID = $scopeViewOHaS.selIncidentClassification.id;
   }
   //var incidentClassificationID = $scopeViewOHaS.selIncidentClassification.id;

   var incidentSubClassificationID;
   if ($scopeViewOHaS.IsDraft == false) {
      incidentSubClassificationID = $scopeViewOHaS.selIncidentSubClassification.id;
   } else if ($scopeViewOHaS.selIncidentSubClassification != null) {
      incidentSubClassificationID = $scopeViewOHaS.selIncidentSubClassification.id;
   }
   //var incidentSubClassificationID = $scopeViewOHaS.selIncidentSubClassification.id;

   var manMadeCauseID;
   if ($scopeViewOHaS.IsDraft == false) {
      manMadeCauseID = $scopeViewOHaS.ManMadeCause.id;
   } else if ($scopeViewOHaS.ManMadeCause != null) {
      manMadeCauseID = $scopeViewOHaS.ManMadeCause.id;
   }
   //var manMadeCauseID = $scopeViewOHaS.ManMadeCause.id;

   var naturalCauseID;
   if ($scopeViewOHaS.IsDraft == false) {
      naturalCauseID = $scopeViewOHaS.NaturalCause.id;
   } else if ($scopeViewOHaS.NaturalCause != null) {
      naturalCauseID = $scopeViewOHaS.NaturalCause.id;
   }
   //var naturalCauseID = $scopeViewOHaS.NaturalCause.id;
   var EmployeeName = $scopeViewOHaS.EmployeeName;
   var EmployeeAge = $scopeViewOHaS.Age;
   var EmployeeDepartment = $scopeViewOHaS.Department;
   var EmployeeRegularOccupation = $scopeViewOHaS.RegularOccupation;
   var EmployeePeriodInPresentJob = $scopeViewOHaS.PeriodPresentJob;
   var EmployeeYearsOfCompanyService = $scopeViewOHaS.YearsCompanyService;
   var EmployeeNameOfSupervisor = $scopeViewOHaS.NameofSupervisor;
   var EmployeeDepartmentManager = $scopeViewOHaS.DepartmentManager;


   var EffectOnPersonID;
   if ($scopeViewOHaS.IsDraft == false) {
      EffectOnPersonID = $scopeViewOHaS.EffectOnPerson.id;
   } else if ($scopeViewOHaS.EffectOnPerson != null) {
      EffectOnPersonID = $scopeViewOHaS.EffectOnPerson.id;
   }
   //var EffectOnPersonID = $scopeViewOHaS.EffectOnPerson.id;

   var ResultofIncident;
   if ($scopeViewOHaS.IsDraft == false) {
      ResultofIncident = $scopeViewOHaS.ResultofIncident.id;
   } else if ($scopeViewOHaS.ResultofIncident != null) {
      ResultofIncident = $scopeViewOHaS.ResultofIncident.id;
   }
   //var ResultofIncident = $scopeViewOHaS.ResultofIncident.id;
   var HasThisHappenedBeforeID = $scope.selHasThisHappenedBefore.id;
   var AssignedTo;
   var taskStat = "New";

   if ($scopeViewOHaS.IsDraft == false) {
      AssignedTo = Investigator['Key'];
      //Investigator = getUserInfo();
   } else {
      taskStat = "Draft";
   }

   var itemProperties = {
      "TaskStat": taskStat,
      "ARReason": "OHaS",
      "ARStatus": "In Progress",
      "Title": Title,
      "IsDraft": $scopeViewOHaS.IsDraft,
      "ExactLocation": ExactLocation,
      "IncidentDate": IncidentDate,
      "InitialActionTaken": InitialActionTaken,
      "ReportedBy": ReportedBy,
      "Supportingevidence": SupportingEvidence,
      "IMKpiDescription": Description,
      "DrugReason": DrugTestNoReason,
      "DrugResults": TestResults,
      "EmployeeName": EmployeeName,
      "Age": EmployeeAge,
      "IMDepartment": EmployeeDepartment,
      "RegularOccupation": EmployeeRegularOccupation,
      "PeriodPresentJob": EmployeePeriodInPresentJob,
      "YearsCompanyService": EmployeeYearsOfCompanyService,
      "NameofSupervisor": EmployeeNameOfSupervisor,
      "DepartmentManager": EmployeeDepartmentManager,
      "DrugTestId": DrugTestID,
      "EffectonPersonId": EffectOnPersonID,
      "ResultofIncidentId": ResultofIncident,
      "AreaId": BusinessAreaID,
      "DepartmentAreaofProblemId": DebtAreaOfProbelemID,
      "WhowaseffectedId": WhoWasAffectedID,
      "SubClassificationofIncidentId": incidentSubClassificationID,
      "ManMadeCauseId": manMadeCauseID,
      "NaturalCauseId": naturalCauseID,
      "NewShiftId": ShiftID,
      "hasThisHappenedBeforeId": HasThisHappenedBeforeID,
      "ClassificationofIncidentId": incidentClassificationID,
      "InitiatorId": SPuser.get_id(),
      "PartofBodyAffectedId": { "results": selectedBodyParts },
      "OccupationalStressorId": { "results": selectedOccupationalStressor },
      "ImmediateCauseId": { "results": selectedImmediateCauses },
      "NatureOfInjuryId": { "results": selectedNaturesOfInjury },
      "SourceOfInjuryId": { "results": selectedSourcesOfInjury },
      "ImmediateCauseOther": immediateCauseOther,
      "NatureOfInjuryOther": natureOfInjuryOther,
      "SourceOfInjuryOther": sourceOfInjuryOther,
      "BodyPartsAdditionalInformation": bodyPartInformation
   }


   if ($scopeViewOHaS.IsDraft == true) {
      addListItem(appWebUrl, 'Incidents', itemProperties);
   }

   var getRevisor = GetUserId(AssignedTo);
   getRevisor.done(function (user) {
      //user.d.Id <-- This is your precious data


      itemProperties.AssignedToId = user.d.Id;


      addListItem(appWebUrl, 'Incidents', itemProperties);
   });

   //var AssignedTo = Investigator['Key'];
   /*var getRevisor = GetUserId(AssignedTo);
   getRevisor.done(function (user) {
       //user.d.Id <-- This is your precious data
       
       addListItem(appWebUrl, 'Incidents', itemProperties
   );*/
   //});
}

function updateOHaS() {
   var Title;
   var $scope = angular.element(myCtrl).scope();
   Title = $scope.listTitle;
   //SPListOperations.populateScopeList("OccupationalStressorList");

   var itemId = $scope.itemID;


   //var BusinessAreaID = $scope.selBusinessArea.id;
   //var DebtAreaOfProbelemID = $scope.selProbDebtArea.id;


   var $scopeViewOHaS = angular.element(ViewNewOhas).scope();
   var selectedBodyParts = $scope.ShowSelectedBodyParts();
   var selectedOccupationalStressor = $scope.ShowSelectedOccupationalStressors();


   var ExactLocation = $scopeViewOHaS.ExactLocation;
   var IncidentDate = $("#datepicker").datepicker("getDate");


   var ShiftID;
   if ($scopeViewOHaS.IsDraft == false) {
      ShiftID = $scopeViewOHaS.selShift.id;
   } else if ($scopeViewOHaS.selShift != null) {
      ShiftID = $scopeViewOHaS.selShift.id;
   }

   //var ShiftID = $scopeViewOHaS.selShift.id;
   //var Description = tinyMCE.get('DescriptionTextArea').getContent({format : 'raw'});
   var InitialActionTaken = tinyMCE.get('InitialActionTakenTextArea').getContent({ format: 'raw' });

   var DrugTestID;
   if ($scopeViewOHaS.IsDraft == false) {
      DrugTestID = $scopeViewOHaS.selDrugTest.id;
   } else if ($scopeViewOHaS.selDrugTest != null) {
      DrugTestID = $scopeViewOHaS.selDrugTest.id;
   }
   //var DrugTestID = $scopeViewOHaS.selDrugTest.id;
   var DrugTestNoReason = $scopeViewOHaS.DrugReason;
   var TestResults = $scopeViewOHaS.DrugResults;
   var ReportedBy = $scopeViewOHaS.ReportedBy;

   var WhoWasAffectedID;
   if ($scopeViewOHaS.IsDraft == false) {
      WhoWasAffectedID = $scopeViewOHaS.affectee.id;
   } else if ($scopeViewOHaS.affectee != null) {
      WhoWasAffectedID = $scopeViewOHaS.affectee.id;
   }
   //var WhoWasAffectedID = $scopeViewOHaS.affectee.id;

   var selectedImmediateCauses = $scopeViewOHaS.ShowSelectedImmediateCauses();
   var immediateCauseOther = tinyMCE.get('ImmediateCauseOtherTextArea').getContent({ format: 'raw' });
   var selectedNaturesOfInjury = $scopeViewOHaS.ShowSelectedNatureOfInjury();
   var natureOfInjuryOther = tinyMCE.get('NatureOfInjuryOtherTextArea').getContent({ format: 'raw' });
   var selectedSourcesOfInjury = $scopeViewOHaS.ShowSourcesOfInjury();
   var sourceOfInjuryOther = tinyMCE.get('SourceOfInjuryOtherTextArea').getContent({ format: 'raw' });
   var bodyPartInformation = tinyMCE.get('BodyPartInformation').getContent({ format: 'raw' });

   var SupportingEvidence = tinyMCE.get('SupportingEvidenceTextArea').getContent({ format: 'raw' });

   var incidentClassificationID;
   if ($scopeViewOHaS.IsDraft == false) {
      incidentClassificationID = $scopeViewOHaS.selIncidentClassification.id;
   } else if ($scopeViewOHaS.selIncidentClassification != null) {
      incidentClassificationID = $scopeViewOHaS.selIncidentClassification.id;
   }
   //var incidentClassificationID = $scopeViewOHaS.selIncidentClassification.id;

   var incidentSubClassificationID;
   if ($scopeViewOHaS.IsDraft == false) {
      incidentSubClassificationID = $scopeViewOHaS.selIncidentSubClassification.id;
   } else if ($scopeViewOHaS.selIncidentSubClassification != null) {
      incidentSubClassificationID = $scopeViewOHaS.selIncidentSubClassification.id;
   }
   //var incidentSubClassificationID = $scopeViewOHaS.selIncidentSubClassification.id;

   var manMadeCauseID;
   if ($scopeViewOHaS.IsDraft == false) {
      manMadeCauseID = $scopeViewOHaS.ManMadeCause.id;
   } else if ($scopeViewOHaS.ManMadeCause != null) {
      manMadeCauseID = $scopeViewOHaS.ManMadeCause.id;
   }
   //var manMadeCauseID = $scopeViewOHaS.ManMadeCause.id;

   var naturalCauseID;
   if ($scopeViewOHaS.IsDraft == false) {
      naturalCauseID = $scopeViewOHaS.NaturalCause.id;
   } else if ($scopeViewOHaS.NaturalCause != null) {
      naturalCauseID = $scopeViewOHaS.NaturalCause.id;
   }
   //var naturalCauseID = $scopeViewOHaS.NaturalCause.id;
   var EmployeeName = $scopeViewOHaS.EmployeeName;
   var EmployeeAge = $scopeViewOHaS.Age;
   var EmployeeDepartment = $scopeViewOHaS.Department;
   var EmployeeRegularOccupation = $scopeViewOHaS.RegularOccupation;
   var EmployeePeriodInPresentJob = $scopeViewOHaS.PeriodPresentJob;
   var EmployeeYearsOfCompanyService = $scopeViewOHaS.YearsCompanyService;
   var EmployeeNameOfSupervisor = $scopeViewOHaS.NameofSupervisor;
   var EmployeeDepartmentManager = $scopeViewOHaS.DepartmentManager;


   var EffectOnPersonID;
   if ($scopeViewOHaS.IsDraft == false) {
      EffectOnPersonID = $scopeViewOHaS.EffectOnPerson.id;
   } else if ($scopeViewOHaS.EffectOnPerson != null) {
      EffectOnPersonID = $scopeViewOHaS.EffectOnPerson.id;
   }
   //var EffectOnPersonID = $scopeViewOHaS.EffectOnPerson.id;

   var ResultofIncident;
   if ($scopeViewOHaS.IsDraft == false) {
      ResultofIncident = $scopeViewOHaS.ResultofIncident.id;
   } else if ($scopeViewOHaS.ResultofIncident != null) {
      ResultofIncident = $scopeViewOHaS.ResultofIncident.id;
   }


   //var ResultofIncident = $scopeViewOHaS.ResultofIncident.id;
   //var HasThisHappenedBeforeID = $scope.selHasThisHappenedBefore.id;
   var AssignedTo;
   var taskStat = "New";

   if ($scopeViewOHaS.IsDraft == false) {

      var Investigator = getUserInfo();
      AssignedTo = Investigator['Key'];
      //Investigator = getUserInfo();
   } else {
      taskStat = "Draft";
   }

   var itemProperties = {
      "TaskStat": taskStat,
      "ARReason": "OHaS",
      "ARStatus": "In Progress",
      //"Title": Title,
      "IsDraft": $scopeViewOHaS.IsDraft,
      "ExactLocation": ExactLocation,
      "IncidentDate": IncidentDate,
      "InitialActionTaken": InitialActionTaken,
      "ReportedBy": ReportedBy,
      "Supportingevidence": SupportingEvidence,
      //"IMKpiDescription": Description,
      "DrugReason": DrugTestNoReason,
      "DrugResults": TestResults,
      "EmployeeName": EmployeeName,
      "Age": EmployeeAge,
      "IMDepartment": EmployeeDepartment,
      "RegularOccupation": EmployeeRegularOccupation,
      "PeriodPresentJob": EmployeePeriodInPresentJob,
      "YearsCompanyService": EmployeeYearsOfCompanyService,
      "NameofSupervisor": EmployeeNameOfSupervisor,
      "DepartmentManager": EmployeeDepartmentManager,
      "DrugTestId": DrugTestID,
      "EffectonPersonId": EffectOnPersonID,
      "ResultofIncidentId": ResultofIncident,
      //"AreaId": BusinessAreaID,
      //"DepartmentAreaofProblemId": DebtAreaOfProbelemID,
      "WhowaseffectedId": WhoWasAffectedID,
      "SubClassificationofIncidentId": incidentSubClassificationID,
      "ManMadeCauseId": manMadeCauseID,
      "NaturalCauseId": naturalCauseID,
      "NewShiftId": ShiftID,
      //"hasThisHappenedBeforeId": HasThisHappenedBeforeID,
      "ClassificationofIncidentId": incidentClassificationID,
      //"AssignedToId": user.d.Id,
      "InitiatorId": SPuser.get_id(),
      "PartofBodyAffectedId": { "results": selectedBodyParts },
      "OccupationalStressorId": { "results": selectedOccupationalStressor },
      "ImmediateCauseId": { "results": selectedImmediateCauses },
      "NatureOfInjuryId": { "results": selectedNaturesOfInjury },
      "SourceOfInjuryId": { "results": selectedSourcesOfInjury },
      "ImmediateCauseOther": immediateCauseOther,
      "NatureOfInjuryOther": natureOfInjuryOther,
      "SourceOfInjuryOther": sourceOfInjuryOther,
      "BodyPartsAdditionalInformation": bodyPartInformation

   }


   if ($scopeViewOHaS.IsDraft == true) {
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
            "ARReason": "OHaS",
            "ID": itemId
         }
      }

      updateListItem(appWebUrl, 'Incidents', itemId, itemProperties, mailProperties);
   });

   //var AssignedTo = Investigator['Key'];
   /*var getRevisor = GetUserId(AssignedTo);
   getRevisor.done(function (user) {
       //user.d.Id <-- This is your precious data
       
       addListItem(appWebUrl, 'Incidents', itemProperties
   );*/
   //});
}