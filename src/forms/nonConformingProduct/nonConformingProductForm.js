'use strict';

const NonConformingProductForm = (function () {
   // Private variables
   let formScope = null;

   // Form Initialization
   function initializeForm() {
      FormInitializationService.initializeMainLists();
      initializeCustomLists();
      initializeDatePickers();
   }

   function initializeCustomLists() {
      const customLists = [
         "Product Categories",
         "Unit Type List"
      ];

      customLists.forEach(list => SPListOperations.populateScopeList(list));
   }

   function initializeDatePickers() {
      FormInitializationService.initializeDatePickers([
         'productionDateDatepicker',
         'bestBeforeDatepicker'
      ]);
   }

   // Form Display
   async function displayForm(itemId) {
      try {
         formScope = angular.element(incidentManagementCtrl).scope();
         // await CustomerComplaintService.populateCustomerRepresentativeList();
         initializeDatePickers();
         const formData = await loadFormData(itemId);
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
      
      return NonConformingProductMapper.mapModelToView(mainData);
   }

   function getMainQuery(itemId) {
      const mainFields = [
         ...Object.values(SP_FIELDS.COMMON),
         ...Object.values(SP_FIELDS.PRODUCT),
         ...Object.values(SP_FIELDS.NON_CONFORMING_PRODUCT)
      ];
      return QueryBuilder.buildListItemQuery(itemId, mainFields);
   }

   // This is called from displayForm
   function updateFormView(formData) {
      if (!formScope) return;

      formScope.$apply(() => {
         updateScopeWithFormData(formData);
         initializeTinyMCEEditors([
            { id: 'DisplayDescriptionTextArea', content: formData.common?.description }
         ]);
      });
   }

   // This is called from updateFormView -> displayForm
   function updateScopeWithFormData(formData) {
      updateCommonDisplayFields(formData.common);
      updateProductDisplayFields(formData.product);
      updateNonConformingProductDisplayFields(formData.nonConformingProduct);
   }

   // This is called from updateScopeWithFormData -> updateFormView -> displayForm
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

   // This is called from updateScopeWithFormData -> updateFormView -> displayForm
   function updateProductDisplayFields(productData) {
      Object.assign(formScope, {
         ProductCategory: productData.category,
         ProductName: productData.name,
         CustomerComplaintCategory: productData.category,
         CustomerComplaintProductName: productData.name,
         UnitQuantity: productData.unitQuantity,
         UnitType: productData.unitType,
         productionDate: FormUtils.formatDate(productData.productionDate),
         bestBeforeDate: FormUtils.formatDate(productData.bestBeforeDate),
         batchNumberFiled: productData.batchNumber
      });
   }

   // This is called from updateScopeWithFormData -> updateFormView -> displayForm
   function updateNonConformingProductDisplayFields(nonConformingData) {
      Object.assign(formScope, {
         ProductSupplier: nonConformingData.supplier
      });
   }

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

   // Helper Function that needs to move to formUtils.js
   function findInScopeList(list, value) {
      if (!list || !value) return null;
      return list.find(item => item.value === value) || null;
   }

   async function initializeDraftForm(itemId) {
      try {
         initializeForm();
         formScope = angular.element(incidentManagementCtrl).scope();
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

   // This is called from initializeDraftForm
   function updateDraftFormView(formData) {
      if (!formScope) return;
      updateCommonEditFields(formData.common);
      updateProductEditFields(formData.product);
      updateNonConformingProductEditFields(formData.nonConformingProduct);
   }

   // This is called from updateDraftFormView -> initializeDraftForm
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

   // This is called from updateDraftFormView -> initializeDraftForm
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
         NonConformingProductService.updateProductNames(productData.category)
            .then(products => {
               formScope.$apply(() => {
                  formScope.ComplaintProductNames = products;
                  formScope.selComplaintProductName = findInScopeList(
                     products,
                     productData.name
                  );
               });
            });
      }
   }

   // This is called from updateDraftFormView -> initializeDraftForm
   function updateNonConformingProductEditFields(nonConformingData) {
      Object.assign(formScope, {
         ProductSupplier: nonConformingData.supplier
      });
   }
   
   return {
      initializeForm,
      displayForm,
      initializeDraftForm
   };
})();

window.NonConformingProductForm = NonConformingProductForm;
