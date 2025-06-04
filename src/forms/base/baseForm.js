'use strict';

const BaseForm = (function() {
    let formScope = null;

    // Common initialization methods
    function initializeForm() {
        FormInitializationService.initializeMainLists();
      //   initializeCustomLists();
        initializeDatePickers();
    }

    function initializeDatePickers(datePickerIds) {
        FormInitializationService.initializeDatePickers(datePickerIds);
    }

    // Common display methods
    async function displayForm(itemId, mapper, loadDataCallback) {
        try {
            formScope = angular.element(myCtrl).scope();
            initializeDatePickers();
            
            const formData = await loadDataCallback(itemId);
            updateFormView(formData);

            $('#loaderImage').hide();
            $('#editForm').show();
        } catch (error) {
            console.error('Error loading form:', error);
            ResponseHandlerService.handleError(error);
        }
    }

    // Common helper methods
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

    function findInScopeList(list, value) {
        if (!list || !value) return null;
        return list.find(item => item.value === value) || null;
    }

    return {
        initializeForm,
        initializeDatePickers,
        displayForm,
        initializeTinyMCEEditors,
        findInScopeList,
        getFormScope: () => formScope
    };
})(); 