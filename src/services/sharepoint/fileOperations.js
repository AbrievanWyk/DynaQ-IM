'use strict';

const SPFileOperations = (function () {
   function uploadFile(editor, inputID) {

      // Define the folder path for this example.  
      var url = _spPageContextInfo.webServerRelativeUrl + "/DocumentLibrary";
      //sites/Development/angularvalidations/Lists/doclibrary
      // url = window.location.protocol;
      // url = window.location.host;
      // url = _spPageContextInfo.siteServerRelativeUrl + "/Shared Documents";

      //url = _spPageContextInfo.webServerRelativeUrl
      var serverRelativeUrlToFolder = url;

      // Get test values from the file input and text input page controls.  
      // The display name must be unique every time you run the example.  
      var fileInput = $('#' + inputID);
      var newName = $('#displayName').val();

      // Initiate method calls using jQuery promises.  
      // Get the local file as an array buffer.  
      var getFile = getFileBuffer();
      getFile.done(function (arrayBuffer) {

         // Add the file to the SharePoint folder.  
         var addFile = addFileToFolder(arrayBuffer, editor);
         addFile.done(function (file, status, xhr) {

            console.log('file uploaded successfully in Library');

         });
         addFile.fail((error) => { console.log(error.responseText) });
      });
      getFile.fail((error) => { console.log(error.responseText) });

      // Get the local file as an array buffer.  
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

      // Add the file to the file collection in the Shared Documents folder.  
      function addFileToFolder(arrayBuffer, editor) {
         // Get the file name from the file input control on the page.  
         var parts = fileInput[0].value.split('\\');
         var fileName = parts[parts.length - 1];
         var extension = fileName.split('.').pop();
         var displayFileName = fileName;
         fileName = fileName.split('.').slice(0, -1);


         //if (fileName.length > 8) {
         //fileName = fileName.substring(fileName.length - 8, fileName.length);
         //}

         var newDate = new Date();
         var displayMonth = newDate.getMonth() + 1;
         var saveDate = newDate.getFullYear() + "" + displayMonth + "" + newDate.getDate() + "-" + newDate.getHours() + "h" + newDate.getMinutes() + "m" + newDate.getSeconds() + "s" + newDate.getMilliseconds();
         fileName = fileName + "_" + saveDate + "." + extension;
         // Construct the endpoint.  
         var fileCollectionEndpoint = String.format(
            "{0}/_api/web/getfolderbyserverrelativeurl('{1}')/files" +
            "/add(overwrite=true, url='{2}')'",
            appWebUrl, serverRelativeUrlToFolder, fileName, appWebUrl);
         var imgOrFile = "img";
         var fileSrc = appWebUrl + "/DocumentLibrary/" + fileName;
         console.log('file uploaded successfully in Library');
         var ed = tinyMCE.get(editor);                // get editor instance
         var range = ed.selection.getRng();                  // get range
         //var newNode = ed.getDoc().createElement(imgOrFile);  // create img node
         //newNode.src = fileSrc;                           // add src attribute
         var newNode = ed.getDoc().createElement('a');
         var linkText = document.createTextNode(displayFileName);
         newNode.setAttribute("text-decoration", "underline")
         newNode.appendChild(linkText);
         newNode.href = fileSrc;
         newNode.title = displayFileName;
         range.insertNode(newNode);
         // Send the request and return the response.  
         // This call returns the SharePoint file.  
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
   }

   return {
      uploadFile
   };
})();

window.SPFileOperations = SPFileOperations;