define(['app', 'fileOperations', 'instanceIdService'], function (app) {
   'use strict';

   app.component('fileListSection', {
      bindings: {
         requestId: '<', // ID of the request to fetch files for
         mode: '@' // 'edit' or 'readonly'
      },
      templateUrl: `${srcFolderPath}/js/new/components/fileListSection/file-list-section.template.html`,
      controller: ['$scope', '$element', '$attrs', '$timeout', 'SPFileOperations', 'InstanceIdService', function ($scope, $element, $attrs, $timeout, SPFileOperations, InstanceIdService) {
         var ctrl = this;
         ctrl.files = [];
         ctrl.uploading = false;
         ctrl.error = null;
         ctrl.id = $attrs.id;

         ctrl.$onInit = function () {
            ctrl.instanceID = InstanceIdService.get();
            ctrl.fetchFiles();
         };

         ctrl.fetchFiles = function () {
            ctrl.error = null;
            ctrl.instanceID = InstanceIdService.get();
            SPFileOperations.getFiles(ctrl.instanceID, $attrs.id)
               .done(function (files) {
                  $timeout(function () {
                     ctrl.files = files || [];
                  });
               })
               .fail(function (err) {
                  $timeout(function () {
                     ctrl.error = 'Failed to load files';
                     ctrl.files = [];
                  });
               });
         };

         ctrl.uploadFile = function () {
            ctrl.uploading = true;
            ctrl.error = null;
            var sectionName = $attrs.id;
            // Ensure instanceID is present before upload
            if (!ctrl.instanceID) {
               ctrl.error = 'Instance ID not available. Please try again later.';
               ctrl.uploading = false;
               return;
            }
            SPFileOperations.uploadFile(ctrl.instanceID, sectionName)
               .done(function (result) {
                  $timeout(function () {
                     ctrl.uploading = false;
                     // Add the new file to the list immediately
                     if (result && result.name && result.url) {
                        ctrl.files.push({ name: result.name, url: result.url });
                     }
                     // Clear the file input after successful upload
                     var fileInput = $element[0].querySelector('input[type="file"]');
                     if (fileInput) fileInput.value = '';
                  });
               })
               .fail(function (err) {
                  $timeout(function () {
                     ctrl.uploading = false;
                     ctrl.error = 'Upload failed';
                  });
               });
         };
      }]
   });

});
