angular.module('incidentManagementApp').controller('MainController', function ($scope) {
   $scope.selectedForm = null;
   $scope.forms = [
      {
         id: 'Complaint',
         label: 'Customer Complaint',
         viewUrl: `${srcFolderPath}/js/new/forms/customerComplaint/NewCustomerComplaint.html`,
         selected: false
      },
      {
         id: 'Auditfinding',
         label: 'Audit Finding',
         viewUrl: `${srcFolderPath}/Pages/ViewAuditfinding.html`,
         selected: false
      },
      {
         id: 'NonConform',
         label: 'Internal Non Conformance',
         viewUrl: `${srcFolderPath}/Pages/ViewInternalNonConform.html`,
         selected: false
      },
      {
         id: 'NonConformingProduct',
         label: 'Non Conforming Product',
         viewUrl: `${srcFolderPath}/Pages/ViewNonConformingProduct.html`,
         selected: false
      },
      {
         id: 'OHaS',
         label: 'OHaS Incident',
         viewUrl: `${srcFolderPath}/Pages/ViewOhasComplaint.html`,
         selected: false
      },
      {
         id: 'Environmental',
         label: 'Environmental',
         viewUrl: `${srcFolderPath}/Pages/ViewEnvironmental.html`,
         selected: false
      }
   ];

   $scope.ComplaintProductCategories = [];
   $scope.ComplaintTypes = [];
   $scope.ComplaintClassifications = [];
   $scope.ComplaintProductNames = [];

   $scope.formModel = {
      ProductCategoryId: 0,
      ComplaintTypeId: 0,
      BusinessManagersId: [],
      AssignedToId: 0
   };

   $scope.selectForm = function (form) {
      if (form.selected) return;
      // Deselect all
      $scope.forms.forEach(t => t.selected = false);

      // Select this one
      form.selected = true;
      $scope.selectedForm = form;

      if (!$scope.showCommonFieldsSection) {
         // listMainLists();
         $scope.showCommonFieldsSection = !$scope.showCommonFieldsSection;
      }

      // Trigger form-specific initialization
      switch (form.id) {
         case "Complaint":
            CustomerComplaintForm.initializeForm();
            break;
         // case "Auditfinding":
         //    ViewAuditComplaintData();
         //    break;
         // case "NonConformingProduct":
         //    NonConformingProductForm.initializeForm();
         //    break;
         // case "ViewOHaS":
         //    ViewOHaS();
         //    break;
         // case "ViewEnvironmental":
         //    ViewEnvironmental();
         //    break;
         // case "NonConform":
         //    break;
      }
   };


   $scope.SaveForm = function (desc, isDraft, skipToEnd) {
      console.log("SaveForm");
      $('#saveLoaderImage').css("display", "block");
      $("#formMessage").text("");
      try {
         // $scope.saveDisabled = true;
         // $scope.IsDraft = isDraft;
         // $scope.skipToEnd = skipToEnd ?? false;
         switch (desc) {
            case "Complaint":
               var $scopeCustomerComplaint = angular.element(incidentManagementCtrl).scope();
               debugger;
               // CustomerComplaintService.createCustomerComplaint($scope, $scopeCustomerComplaint)
               CustomerComplaintService.createCustomerComplaint($scope.formModel)
                  .then(function () {
                     $('#saveLoaderImage').css("display", "none");
                  })
                  .catch(function (error) {
                     $('#saveLoaderImage').css("display", "none");
                     console.error('Error creating customer complaint:', error);
                     // Handle error appropriately
                  });
               break;
            // case "Auditfinding":
            //    createViewAuditFinding();
            //    break;
            // case "NonConform":
            //    createNonConform();
            //    break;
            // case "NonConformingProduct":
            //    var $scopeNonConformingProduct = angular.element(ViewNonConformingProduct).scope();
            //    NonConformingProductService.createNonConformingProduct($scope, $scopeNonConformingProduct)
            //       .then(function () {
            //          $('#saveLoaderImage').css("display", "none");
            //       })
            //       .catch(function (error) {
            //          $('#saveLoaderImage').css("display", "none");
            //          console.error('Error creating non conforming product:', error);
            //          // Handle error appropriately
            //       });
            //    break;
            // case "ViewOHaS":
            //    createOHaS();
            //    break;
            // case "ViewEnvironmental":
            //    createEnvironmental();
            //    break;
         }
      } catch (e) {
         $("#dvMessage").text("Save unsuccessful: " + e.message);
      }

   }


   // $scope.ComplaintTypeValue = "";
   // $scope.ProductCategoryValue = "";
   // $scope.$watch('formModel.ComplaintTypeId', function (newVal) {
   //    if (newVal) {
   //       $scope.ComplaintTypeValue = $scope.ComplaintTypes.find(item => item.id === newVal)?.value;
   //    }
   // });

   // $scope.$watch('formModel.ProductCategoryId', function (newVal) {
   //    if (newVal) {
   //       $scope.ProductCategoryValue = $scope.ComplaintProductCategories.find(item => item.id === newVal)?.value;
   //    }
   // });
});