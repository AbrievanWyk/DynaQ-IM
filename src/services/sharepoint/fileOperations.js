define(['app'], function (app) {
   'use strict';

   const DOCUMENT_LIBRARY = 'DocumentLibrary'; // Configurable constant

   app.factory('SPFileOperations', function () {
      /**
       * Uploads a file to SharePoint in the structure: /DocumentLibrary/{instanceID}/{sectionName}/
       * @param {string} instanceID - The unique instance ID for the folder
       * @param {string} sectionName - The section/subfolder name (e.g., 'incidentDescription')
       */
      function uploadFile(instanceID, sectionName) {
         var deferred = $.Deferred();

         var url = _spPageContextInfo.webServerRelativeUrl + `/${DOCUMENT_LIBRARY}/${instanceID}/${sectionName}`;
         var serverRelativeUrlToFolder = url;
         var inputId = `fileInput_${sectionName}`;
         var fileInput = $('#' + inputId);

         // Ensure folders exist before uploading
         ensureFoldersExist(instanceID, sectionName)
            .done(function () {
               var getFile = getFileBuffer();
               getFile.done(function (arrayBuffer) {
                  var addFile = addFileToFolder(arrayBuffer);
                  addFile.done(function (file, status, xhr) {
                     var uploadedFileName = file.d && file.d.Name ? file.d.Name : null;
                     var fileUrl = file.d && file.d.ServerRelativeUrl
                        ? _spPageContextInfo.webAbsoluteUrl.replace(_spPageContextInfo.webServerRelativeUrl, '') + file.d.ServerRelativeUrl
                        : null;
                     deferred.resolve({ name: uploadedFileName, url: fileUrl });
                  });
                  addFile.fail(function (error) {
                     deferred.reject(error);
                  });
               });
               getFile.fail(function (error) {
                  deferred.reject(error);
               });
            })
            .fail(function (error) {
               deferred.reject(error);
            });

         function ensureFoldersExist(instanceID, sectionName) {
            var deferred = $.Deferred();
            var rootFolder = `${DOCUMENT_LIBRARY}`;
            var instanceFolder = `${DOCUMENT_LIBRARY}/${instanceID}`;
            var sectionFolder = `${DOCUMENT_LIBRARY}/${instanceID}/${sectionName}`;

            // Helper to create folder if not exists
            function createFolderIfNotExists(folderUrl) {
               return $.ajax({
                  url: _spPageContextInfo.webServerRelativeUrl + "/_api/web/folders",
                  type: "POST",
                  contentType: "application/json;odata=verbose",
                  data: JSON.stringify({ '__metadata': { 'type': 'SP.Folder' }, 'ServerRelativeUrl': _spPageContextInfo.webServerRelativeUrl + '/' + folderUrl }),
                  headers: {
                     "accept": "application/json;odata=verbose",
                     "X-RequestDigest": jQuery("#__REQUESTDIGEST").val()
                  }
               });
            }

            // Try to create instance folder, then section folder
            createFolderIfNotExists(instanceFolder)
               .always(function () {
                  createFolderIfNotExists(sectionFolder)
                     .always(function () {
                        deferred.resolve();
                     })
                     .fail(function (err) { deferred.reject(err); });
               })
               .fail(function (err) {
                  // If instance folder creation fails, still try section folder
                  createFolderIfNotExists(sectionFolder)
                     .always(function () {
                        deferred.resolve();
                     })
                     .fail(function (err2) { deferred.reject(err2); });
               });

            return deferred.promise();
         }
         function getFileBuffer() {
            var deferred = jQuery.Deferred();
            var reader = new FileReader();
            reader.onloadend = function (e) {
               deferred.resolve(e.target.result);
            }
            reader.onerror = function (e) {
               deferred.reject(e.target.error);
            }
            reader.readAsArrayBuffer(fileInput[0].files[0]);
            return deferred.promise();
         }

         function addFileToFolder(arrayBuffer) {
            var parts = fileInput[0].value.split('\\');
            var fileName = parts[parts.length - 1];
            var extension = fileName.split('.').pop();
            fileName = fileName.split('.').slice(0, -1);

            var newDate = new Date();
            var displayMonth = newDate.getMonth() + 1;
            var saveDate = newDate.getFullYear() + "" + displayMonth + "" + newDate.getDate() + "-" + newDate.getHours() + "h" + newDate.getMinutes() + "m" + newDate.getSeconds() + "s" + newDate.getMilliseconds();
            fileName = fileName + "_" + saveDate + "." + extension;

            var fileCollectionEndpoint = String.format(
               "{0}/_api/web/getfolderbyserverrelativeurl('{1}')/files" +
               "/add(overwrite=true, url='{2}')'",
               appWebUrl, serverRelativeUrlToFolder, fileName, appWebUrl);

            return $.ajax({
               url: fileCollectionEndpoint,
               type: "POST",
               data: arrayBuffer,
               processData: false,
               headers: {
                  "accept": "application/json;odata=verbose",
                  "X-RequestDigest": jQuery("#__REQUESTDIGEST").val(),
                  "content-length": arrayBuffer.byteLength
               }
            });
         }
         return deferred.promise();
      }

      /**
       * Retrieves all files for a given instanceID and sectionName.
       * @param {string} instanceID - The unique instance ID for the folder
       * @param {string} sectionName - The section/subfolder name
       * @returns {Promise} Resolves to an array of { name, url }
       */
      function getFiles(instanceID, sectionName) {
         var deferred = $.Deferred();
         var folderUrl = `${DOCUMENT_LIBRARY}/${instanceID}/${sectionName}`;
         var endpoint = _spPageContextInfo.webServerRelativeUrl +
            `/_api/web/getfolderbyserverrelativeurl('${folderUrl}')/files`;

         $.ajax({
            url: endpoint,
            type: "GET",
            headers: { "accept": "application/json;odata=verbose" }
         })
            .done(function (data) {
               var results = [];
               if (data.d && data.d.results) {
                  results = data.d.results.map(function (file) {
                     return {
                        name: file.Name,
                        url: _spPageContextInfo.webAbsoluteUrl.replace(_spPageContextInfo.webServerRelativeUrl, '') + file.ServerRelativeUrl
                     };
                  });
               }
               deferred.resolve(results);
            })
            .fail(function (err) {
               deferred.reject(err);
            });

         return deferred.promise();
      }

      return {
         uploadFile: uploadFile,
         getFiles: getFiles
      };
   });

});