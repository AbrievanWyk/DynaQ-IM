'use strict';

const ResponseHandlerService = (function () {
   async function handleSuccess(successData) {
      try {
         const data = successData.d || successData;
         // TODO: This needs to go to a better place
         $('#saveLoaderImage').css("display", "block");

         if (!data) {
            RedirectToURL();
            return;
         }

         const userId = data.AssignedToId;
         const usr = clientContext.get_web().getUserById(userId);
         clientContext.load(usr);

         await new Promise((resolve, reject) => {
            clientContext.executeQueryAsync(
               () => resolve(),
               (sender, error) => reject(error)
            );
         });

         const url = website.get_url();
         const mailTo = usr.get_email();
         const usrName = usr.get_title();
         const mailSubject = "New Action Request: " + data.ARReason;

         await EmailService.getEmailItem("Incident Emails", mailTo, mailSubject, usrName, url, data.ID);

         const $scope = angular.element(myCtrl).scope();

         if ($scope.ARReason.toLowerCase() === "customer complaint" || $scope.ARReason.toLowerCase() === "complaint") {
            if ($scope.FormComplete) {
               await EmailService.sendCustomerComplaintCompleteEmail(data.ID);
            } else {
               await EmailService.sendCustomerComplainSubmitEmail(data.ID);
            }
         }

         RedirectToURL();
      } catch (error) {
         console.error('Error in handleSuccess:', error);
         RedirectToURL();
      }
   }

   function handleError(error) {
      console.error('Operation failed:', error);

      // TODO: This needs to go to a better place
      $("#dvMessage").text("Save unsuccessful");
      // TODO: Uncomment this when we have a way to redirect to the URL
      // RedirectToURL();
   }

   return {
      handleSuccess,
      handleError
   };
})();

window.ResponseHandlerService = ResponseHandlerService; 