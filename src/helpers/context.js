'use strict';

var clientContext;
var website;
var SPuser;
var contextPromise;

function sharePointReady() {
   if (contextPromise) {
      return contextPromise;  // Return the cached promise if already initialized
   }

   var dfrd = $.Deferred();
   clientContext = SP.ClientContext.get_current();
   website = clientContext.get_web();
   SPuser = website.get_currentUser();
   clientContext.load(website);

   clientContext.executeQueryAsync(
      function () {
         console.log("SharePoint ready.");
         dfrd.resolve({
            clientContext,
            website,
            SPuser
         });
      },
      function (sender, args) {
         console.error("Failed to initialize SharePoint: " + args.get_message());
         dfrd.reject(args.get_message());
      }
   );

   contextPromise = dfrd.promise();  // Cache the promise for future use
   return contextPromise;
}

// Export globally
window.SharePointContext = {
   sharePointReady
};
