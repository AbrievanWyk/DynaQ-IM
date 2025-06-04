'use strict';

const CustomerComplaintForm = (function () {
   // Private variables
   let formScope = null;

   // Form Initialization
   function initializeForm() {
      FormInitializationService.initializeMainLists();
      initializeCustomLists();
      initializePeoplePickers();
      initializeDatePickers();
   }

   function initializeCustomLists() {
      const customLists = [
         "Customers",
         "ComplaintType",
         "Product Categories",
         "Province List",
         "Store Outlet Retailer List",
         "Source of Complaint",
         "Unit Type List"
      ];

      customLists.forEach(list => SPListOperations.populateScopeList(list));
      FormInitializationService.getListChoices("CustomerComplaintCategory", "CustomerComplaintCategories");
   }

   function initializePeoplePickers() {
      PeoplePickerHelper.initializePeoplePicker('businessManagerPeoplePicker', null);
      CustomerComplaintService.populateCustomerRepresentativeList();
   }

   function initializeDatePickers() {
      FormInitializationService.initializeDatePickers([
         'datepicker',
         'productionDateDatepicker',
         'bestBeforeDatepicker'
      ]);
   }

   // Form Display
   async function displayForm(itemId) {
      try {
         formScope = angular.element(myCtrl).scope();
         initializeDatePickers();

         const formData = await loadFormData(itemId);
         formData.complaint.representatives = await updateRepresentativeDisplayFields(formData.complaint.representatives);
         updateFormView(formData);

         $('#loaderImage').hide();
         $('#editForm').show();
      } catch (error) {
         console.error('Error loading form:', error);
         ResponseHandlerService.handleError(error);
      }
   }

   // Form Data Loading
   async function loadFormData(itemId) {
      const mainData = await SPListOperations.executeQuery({
         listName: 'Incidents',
         camlQuery: getMainQuery(itemId)
      });

      const extensionData = await SPListOperations.executeQuery({
         listName: 'Incidents',
         camlQuery: getExtensionQuery(itemId)
      });

      // SPListOperations.executeQueryWrapper('Incidents', {...mainData, ...extensionData}, (items) => {
      //    return CustomerComplaintMapper.mapModelToView({
      //       ...items
      //    });
      // });
      return CustomerComplaintMapper.mapModelToView(mainData, extensionData);
   }

   function getMainQuery(itemId) {
      const mainFields = [
         ...Object.values(SP_FIELDS.COMMON),
         ...Object.values(SP_FIELDS.CUSTOMER)
      ];
      return QueryBuilder.buildListItemQuery(itemId, mainFields);
   }

   function getExtensionQuery(itemId) {
      const extensionFields = [
         ...Object.values(SP_FIELDS.PRODUCT),
         ...Object.values(SP_FIELDS.COMPLAINT)
      ];
      return QueryBuilder.buildListItemQuery(itemId, extensionFields);
   }

   // View Updates
   function updateFormView(formData) {
      if (!formScope) return;

      formScope.$apply(() => {
         updateScopeWithFormData(formData);
         initializeTinyMCEEditors([
            { id: 'CustomerClaimDetailTextArea', content: formData.complaint?.claimDetail },
            { id: 'DisplayDescriptionTextArea', content: formData.common?.description }
         ]);
      });
   }

   function updateScopeWithFormData(formData) {
      updateCommonDisplayFields(formData.common);
      updateCustomerDisplayFields(formData.customer);
      updateProductDisplayFields(formData.product);
      updateComplaintDisplayFields(formData.complaint);

      // Handle dependent dropdowns
      if (formData.complaint.type) {
         CustomerComplaintService.updateServiceCategories(formData.complaint.type)
            .then(categories => {
               formScope.ComplaintClassifications = categories;
            });
      }

      if (formData.product.category) {
         CustomerComplaintService.updateProductNames(formData.product.category)
            .then(products => {
               formScope.ComplaintProductNames = products;
            });
      }
   }

   function updateCommonDisplayFields(commonData) {
      Object.assign(formScope, {
         itemID: commonData.id,
         FormComplaintTitle: commonData.title,
         FormComplaintReason: commonData.arReason,
         FormComplaintArea: commonData.businessArea,
         FormDebtAreaOfProblem: commonData.departmentArea,
         FormHasThisHappenedBefore: commonData.happenedBefore,
         //TODO: Where is the draft status? Capitalized?
         isDraft: commonData.isDraft,
         CreatedDate: FormUtils.formatDate(commonData.created),
         Initiator: commonData.initiator,
         TaskStat: commonData.taskStatus,
         CurrentStep: commonData.arStatus
      });
   }

   function updateProductDisplayFields(productData) {
      Object.assign(formScope, {
         // TODO: Should this rather not be used?
         // ProductCategory: productData.category,
         // ProductName: productData.name,
         CustomerComplaintCategory: productData.category,
         CustomerComplaintProductName: productData.name,
         UnitQuantity: productData.unitQuantity,
         UnitType: productData.unitType,
         productionDate: FormUtils.formatDate(productData.productionDate),
         bestBeforeDate: FormUtils.formatDate(productData.bestBeforeDate),
         batchNumberFiled: productData.batchNumber
      });
   }

   function updateCustomerDisplayFields(customerData) {
      Object.assign(formScope, {
         CustomerComplaintName: customerData.name,
         ComplaintCategory: customerData.category,
         CustomerComplaintLocation: customerData.location,
         Province: customerData.province,
         StoreOutletRetailer: customerData.storeOutlet,
         SourceOfComplaint: customerData.sourceOfComplaint,
         CustomerComplainContactPerson: customerData.contact.person,
         CustomerComplaintTelephone: customerData.contact.phone,
         CustomerComplaintEmail: customerData.contact.email
      });
   }

   async function updateRepresentativeDisplayFields(selectedRepresentatives) {
      let representatives = await CustomerComplaintService.populateCustomerRepresentativeList();

      const filteredRepresentatives = representatives.filter(rep =>
         selectedRepresentatives.some(selected => selected.id === rep.id)
     );

      return filteredRepresentatives;
   }

   function updateComplaintDisplayFields(complaintData) {

      Object.assign(formScope, {
         CustomerComplaintType: complaintData.type,
         CustomerComplaintService: complaintData.classification,
         ExistingARReference: complaintData.existingRef,
         CustomerComplaintProblemDate: FormUtils.formatDate(complaintData.problemDate),
         IsCustomerClaim: complaintData.isClaim,
         CustomerRepresentativeList: complaintData.representatives,
         BusinessManagers: convertUserCollectionToEmailString(complaintData.businessManagers)
      });
   }

   function convertUserCollectionToEmailString(userCollection) {
      if (!userCollection) return '';

      let emailString = '';
      for (let x = 0; x < userCollection.length; x++) {
         emailString += userCollection[x].Key + ", ";
      }
      return emailString;
   };

   function initializeTinyMCEEditors(editorConfigs) {
      editorConfigs.forEach(({ id, content }) => {
         if (content) {
            const editor = tinymce.get(id);
            if (editor) {
               editor.setContent(content);
            }
         }
      });
   }

   // Helper Functions
   function findInScopeList(list, value) {
      if (!list || !value) return null;
      return list.find(item => item.value === value) || null;
   }

   async function initializeDraftForm(itemId) {
      try {
         initializeForm();
         formScope = angular.element(myCtrl).scope();
         await CustomerComplaintService.populateCustomerRepresentativeList();

         const formData = await loadFormData(itemId);
         updateDraftFormView(formData);

         $('#loaderImage').hide();
         $('#editForm').show();
      } catch (error) {
         console.error('Error loading form:', error);
         ResponseHandlerService.handleError(error);
      }
   }

   function updateDraftFormView(formData) {
      if (!formScope) return;
      updateCommonEditFields(formData.common);
      updateCustomerEditFields(formData.customer);
      updateProductEditFields(formData.product);
      updateComplaintEditFields(formData.complaint);
   }

   function updateCommonEditFields(commonData) {
      Object.assign(formScope, {
         itemID: commonData.id,
         FormComplaintTitle: commonData.title,
         FormComplaintReason: commonData.arReason,
         FormComplaintArea: commonData.businessArea,
         FormDebtAreaOfProblem: commonData.departmentArea,
         FormHasThisHappenedBefore: commonData.happenedBefore,
         //TODO: Where is the draft status? Capitalized?
         isDraft: commonData.isDraft,
         CreatedDate: FormUtils.formatDate(commonData.created),
         Initiator: commonData.initiator,
         TaskStat: commonData.taskStatus,
         CurrentStep: commonData.arStatus
      });
   }

   function updateCustomerEditFields(customerData) {
      Object.assign(formScope, {
         selCustomerNames: findInScopeList(
            formScope.CustomerNames,
            customerData.name
         ),
         selComplaintCategory: findInScopeList(
            formScope.CustomerComplaintCategories,
            customerData.category
         ),
         custLocation: customerData.location,
         selProvince: findInScopeList(
            formScope.ProvinceList,
            customerData.province
         ),
         selStoreOutletRetailer: findInScopeList(
            formScope.StoreOutletRetailerList,
            customerData.storeOutlet
         ),
         selSourceOfComplaint: findInScopeList(
            formScope.SourceOfComplaintList,
            customerData.sourceOfComplaint
         ),
         contactPerson: customerData.contact.person,
         contactTel: customerData.contact.phone,
         contactEmail: customerData.contact.email
      });
   }

   function updateProductEditFields(productData) {
      Object.assign(formScope, {
         selProductCategory: findInScopeList(
            formScope.ComplaintProductCategories,
            productData.category
         ),
         selComplaintProductName: findInScopeList(
            formScope.ComplaintProductNames,
            productData.name
         ),
         unitQuantity: productData.unitQuantity,
         selUnitType: findInScopeList(
            formScope.UnitTypeList,
            productData.unitType
         ),
         // TODO: WHY?!?! productionDate and productionDateDatepicker
         productionDate: FormUtils.formatDate(productData.productionDate),
         productionDateDatepicker: FormUtils.formatDate(productData.productionDate),
         bestBeforeDatepicker: FormUtils.formatDate(productData.bestBeforeDate),
         batchNumberFiled: productData.batchNumber
      });

      if (productData.category) {
         CustomerComplaintService.updateProductNames(productData.category)
            .then(products => {
               formScope.ComplaintProductNames = products;
               formScope.selComplaintProductName = findInScopeList(
                  products,
                  productData.name
               );
            });
      }
   }

   function updateComplaintEditFields(complaintData) {
      Object.assign(formScope, {
         selProductOrServiceComplaint: findInScopeList(
            formScope.ComplaintTypes,
            complaintData.type
         ),
         // TODO: Existing Ref seems to be missing
         datepicker: FormUtils.formatDate(complaintData.problemDate),
         selIsCustomerClaim: complaintData.isClaim?.toString(),
         CustomerClaimDetail: complaintData.claimDetail
      });

      // Handle dependent dropdowns
      if (complaintData.type) {
         CustomerComplaintService.updateServiceCategories(complaintData.type)
            .then(categories => {
               formScope.ComplaintClassifications = categories;
               formScope.selComplaintClassification = findInScopeList(
                  categories,
                  complaintData.classification
               );
            });
      }

      // Handle representatives
      if (complaintData.representatives) {
         formScope.ShowSelectedCustomerRepresentatives = complaintData.representatives;
      }

      // Handle business managers
      initializeMultiPeoplePicker('businessManagerPeoplePicker', complaintData.businessManagers);
   }

   // function todoDraftBusinessManagers(businessManagers) {
   //    if (businessManagers == null) return;
   //    SP.SOD.executeFunc("/_layouts/15/clientpeoplepicker.js", "SP.ClientContext", function () {
   //       var peoplePicker = SPClientPeoplePicker.SPClientPeoplePickerDict.businessManagerPeoplePicker_TopSpan;
   //       //Select the People Picker AKA Get the instance of the People Picker from the Dictionary
   //       //Set the user value AKA 'Key' name value pair format: myDomain\UserId  i.e. abc\shane.gibson you may have to drop the claims token prefix {i:0#.w|}
   //       //peoplePicker.AddUnresolvedUser(usrObj, true); //Resolve the User

   //       for (var x = 0; x < businessManagers.length; x++) {


   //          var userEmail = businessManagers[x].get_email();
   //          var usrObj = {
   //             'Key': userEmail
   //          };
   //          peoplePicker.AddUnresolvedUser(usrObj, true);
   //       }
   //    });
   // }

   // Helper function to initialize TinyMCE with content
   // function initializeTinyMCEContent(editorId, content) {
   //    if (content) {
   //       const editor = tinymce.get(editorId);
   //       if (editor) {
   //          editor.setContent(content);
   //       }
   //    }
   // }
   /*
      function TODELETEupdateDraftFormView(formData) {
         debugger;
         if (!formScope) return;
         debugger;
         todoDraftBusinessManagers(formData.complaint.businessManagers);
   
         formScope.$apply(function () {
            formScope.FormComplaintTitle = singleObj['Title'];
            formScope.FormComplaintReason = singleObj['ARReason'];
            formScope.selCustomerNames = $.grep(formScope.CustomerNames, function (e) {
               return e.value == singleObj['CustomerName'];
            })[0];
            //formScope.selCustomerNames= formScope.CustomerNames.find(x => x.value === singleObj['CustomerName']);
            formScope.custLocation = singleObj['CustomerLocation'];
            formScope.contactPerson = singleObj['CustomerContactPerson'];
            formScope.contactTel = singleObj['CustomerContactTelephone'];
            formScope.contactEmail = singleObj['CustomerContactEmail'];
   
            formScope.productionDate = singleObj['ProductionDate'];
            formScope.batchNumberFiled = singleObj['BatchNumberFiled'];
   
            formScope.selProductOrServiceComplaint = $.grep(formScope.ComplaintTypes, function (e) {
               return e.value == singleObj['ComplaintType'];
            })[0];
            //formScope.selProductOrServiceComplaint= formScope.ComplaintTypes.find(x => x.value === singleObj['ComplaintType']);
   
            $.when(todoDrafListServiceCategories(singleObj['ComplaintType'])).then(function () {
               console.log("In Complaint Type");
               console.log(formScope.ComplaintClassifications);
               let complaintClassification = $.grep(formScope.ComplaintClassifications, function (e) {
                  return e.value == singleObj['CustomerComplaintService'];
               })[0];
               formScope.selComplaintClassification = complaintClassification;
               console.log("After complaint type");
               console.log(formScope.selComplaintClassification);
            });
   
   
   
            formScope.selProductCategory = $.grep(formScope.ComplaintProductCategories, function (e) {
               return e.value == singleObj['ProductCategory'];
            })[0];
   
            $.when(todoDrafListProductNames(singleObj['ProductCategory'])).then(function () {
               console.log("In Product Type");
               console.log(formScope.ComplaintProductNames);
               let complaintProductName = $.grep(formScope.ComplaintProductNames, function (e) {
                  return e.value == singleObj['ProductName'];
               })[0];
   
   
               formScope.selComplaintProductName = complaintProductName;
   
               console.log("After product type");
               console.log(formScope.selComplaintProductName);
            });
   
            formScope.productionDateDatepicker = singleObj['ProductionDate'];
            formScope.datepicker = singleObj['CustomerProblemDate'];
            formScope.FormComplaintArea = singleObj['Area'];
            formScope.FormDebtAreaOfProblem = singleObj['DepartmentAreaofProblem'];
            formScope.FormHasThisHappenedBefore = singleObj['hasThisHappenedBefore'];
            formScope.CreatedDate = singleObj['Created'];
            formScope.selIsCustomerClaim = singleObj['IsCustomerClaim'].toString();
            formScope.CustomerClaimDetail = singleObj['CustomerClaimDetail'];
   
            formScope.selProvince = $.grep(formScope.ProvinceList, function (e) {
               return e.value == singleObj['Province'];
            })[0];
            formScope.selStoreOutletRetailer = $.grep(formScope.StoreOutletRetailerList, function (e) {
               return e.value == singleObj['StoreOutletRetailer'];
            })[0];
            formScope.selSourceOfComplaint = $.grep(formScope.SourceOfComplaintList, function (e) {
               return e.value == singleObj['SourceOfComplaint'];
            })[0];
            formScope.selUnitType = $.grep(formScope.UnitTypeList, function (e) {
               return e.value == singleObj['UnitType'];
            })[0];
   
            formScope.selComplaintCategory = $.grep(formScope.CustomerComplaintCategories, function (e) {
               return e.value == singleObj['CustomerComplaintCategory'];
            })[0];
   
            formScope.bestBeforeDatepicker = singleObj['BestBeforeDate'];
            //formScope.ComplaintCategory = singleObj['CustomerComplaintCategory'];
            formScope.unitQuantity = singleObj['UnitQuantity'];
         });
      }
   */
   return {
      initializeForm,
      displayForm,
      initializeDraftForm
   };
})();

window.CustomerComplaintForm = CustomerComplaintForm;
