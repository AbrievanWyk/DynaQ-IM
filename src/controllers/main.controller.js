define(['app', 'formUtils', 'loaderService', 'workflowService', 'itemIdService', 'instanceIdService'], function (app) {
   return app.controller('MainController', ['$scope', 'FormUtils', 'LoaderService', 'WorkflowService', 'ItemIdService', 'InstanceIdService', function ($scope, FormUtils, LoaderService, WorkflowService, ItemIdService, InstanceIdService) {
      $scope.displayMode = 'edit'; // Default mode
      $scope.selectedForm = null;

      // Utility function to generate a GUID
      function generateGUID() {
         return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
         });
      }

      // TODO: Add editUrl property to each form object using similar naming convention as viewUrl
      $scope.forms = [
         {
            id: 'Complaint',
            label: 'Customer Complaint',
            alternativeLabel: 'Customer complaint',
            viewUrl: `${srcFolderPath}/js/new/forms/customerComplaint/customerComplaint-view.html`,
            editUrl: `${srcFolderPath}/js/new/forms/customerComplaint/customerComplaint-edit.html`,
            selected: false
         },
         {
            id: 'Auditfinding',
            label: 'Audit Finding',
            alternativeLabel: 'Audit finding',
            viewUrl: `${srcFolderPath}/js/new/forms/auditFinding/auditFinding-view.html`,
            editUrl: `${srcFolderPath}/js/new/forms/auditFinding/auditFinding-edit.html`,
            selected: false
         },
         // {
         //    id: 'NonConform',
         //    label: 'Internal Non Conformance',
         //    alternativeLabel: 'Internal non-conformance',
         //    viewUrl: `${srcFolderPath}/Pages/ViewInternalNonConform.html`,
         //    selected: false
         // },
         {
            id: 'InternalNonConformance',
            label: 'Internal Non Conformance',
            alternativeLabel: 'Internal non-conformance',
            viewUrl: `${srcFolderPath}/js/new/forms/internalNonConformance/internalNonConformance-view.html`,
            editUrl: `${srcFolderPath}/js/new/forms/internalNonConformance/internalNonConformance-edit.html`,
            selected: false
         },
         {
            id: 'NonConformingProduct',
            label: 'Non Conforming Product',
            alternativeLabel: 'Non-conforming product',
            viewUrl: `${srcFolderPath}/js/new/forms/nonConformingProduct/nonConformingProduct-view.html`,
            editUrl: `${srcFolderPath}/js/new/forms/nonConformingProduct/nonConformingProduct-edit.html`,
            selected: false
         },
         {
            id: 'OHaS',
            label: 'OHaS Incident',
            alternativeLabel: 'OHaS',
            viewUrl: `${srcFolderPath}/js/new/forms/ohas/ohas-view.html`,
            editUrl: `${srcFolderPath}/js/new/forms/ohas/ohas-edit.html`,
            selected: false
         },
         {
            id: 'Environmental',
            label: 'Environmental',
            alternativeLabel: 'Environmental',
            viewUrl: `${srcFolderPath}/js/new/forms/environmental/environmental-view.html`,
            editUrl: `${srcFolderPath}/js/new/forms/environmental/environmental-edit.html`,
            selected: false
         }
      ];

      // $scope.ComplaintProductCategories = [];
      // $scope.ComplaintTypes = [];
      // $scope.ComplaintClassifications = [];
      // $scope.ComplaintProductNames = [];
      $scope.instanceID = null;
      $scope.baseFormModel = {
         Title: "",
         // ProductCategoryId: 0,
         // ComplaintTypeId: 0,
         // BusinessManagersId: [],
         // AssignedToId: 0,
         TaskStat: "Draft", // New
         ARReason: "", // form.alternativeLabel
         ARStatus: "In Progress", // Completed
         InitiatorId: 0,
         IsDraft: false,
      };

      $scope.complexTypesModel = {
         BusinessManagers: [],
         AssignedTo: [],
      }

      $scope.selectForm = function (form) {
         if (form.selected) return;

         // Deselect all
         $scope.forms.forEach(t => t.selected = false);

         // Select this one
         form.selected = true;
         $scope.selectedForm = form;

         // TODO: Does this need to be done here?
         $scope.baseFormModel.ARReason = form.alternativeLabel;
      };

      // Hide the global loader after controller initialization
      $scope.$applyAsync(() => LoaderService.hide());

      let listItemID = FormUtils.extractIdFromUrl(location.search);
      if (listItemID) {
         ItemIdService.set(listItemID);
         $scope.selectedItemId = listItemID;
         WorkflowService.getFormWorkflowStatus('Incidents', listItemID, $scope.forms)
            .then(function (result) {
               if (result) {
                  $scope.$applyAsync(() => {
                     $scope.displayMode = result.displayMode;
                     $scope.currentWorkflowStage = result.workflowStage;
                     $scope.instanceID = result.instanceID;
                     InstanceIdService.set($scope.instanceID);
                     $scope.selectForm(result.form);
                  });
               }
            });
      } else {
         // New form: generate a new instanceID
         $scope.instanceID = generateGUID();
         InstanceIdService.set($scope.instanceID);
      }
      InstanceIdService.set($scope.instanceID);
   }]);
});



// $scope.SaveForm = function (formID, isDraft, skipToEnd) {
//    console.log("SaveForm");
//    $('#saveLoaderImage').css("display", "block");
//    $("#formMessage").text("");
//    try {
//       // $scope.saveDisabled = true;
//       // $scope.IsDraft = isDraft;
//       // $scope.skipToEnd = skipToEnd ?? false;
//       switch (formID) {
//          case "Complaint":
//             var $scopeCustomerComplaint = angular.element(incidentManagementCtrl).scope();
//             // var $aaaaa = angular.element(CustomerComplaintController).scope();
//             debugger;
//             CustomerComplaintService.createCustomerComplaint($scope.formModel)
//                .then(function () {
//                   $('#saveLoaderImage').css("display", "none");
//                })
//                .catch(function (error) {
//                   $('#saveLoaderImage').css("display", "none");
//                   console.error('Error creating customer complaint:', error);
//                   // Handle error appropriately
//                });
//             break;
//          // case "Auditfinding":
//          //    createViewAuditFinding();
//          //    break;
//          // case "NonConform":
//          //    createNonConform();
//          //    break;
//          // case "NonConformingProduct":
//          //    var $scopeNonConformingProduct = angular.element(ViewNonConformingProduct).scope();
//          //    NonConformingProductService.createNonConformingProduct($scope, $scopeNonConformingProduct)
//          //       .then(function () {
//          //          $('#saveLoaderImage').css("display", "none");
//          //       })
//          //       .catch(function (error) {
//          //          $('#saveLoaderImage').css("display", "none");
//          //          console.error('Error creating non conforming product:', error);
//          //          // Handle error appropriately
//          //       });
//          //    break;
//          // case "ViewOHaS":
//          //    createOHaS();
//          //    break;
//          // case "ViewEnvironmental":
//          //    createEnvironmental();
//          //    break;
//       }
//    } catch (e) {
//       $("#dvMessage").text("Save unsuccessful: " + e.message);
//    }

// }