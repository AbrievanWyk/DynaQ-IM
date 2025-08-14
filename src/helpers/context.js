define(['jquery'], function ($) {
  'use strict';

  var contextPromise;

  function sharePointReady() {
    if (contextPromise) return contextPromise;

    var deferred = $.Deferred();

    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function () {
      window.clientContext = SP.ClientContext.get_current();
      window.website = clientContext.get_web();
      window.SPuser = website.get_currentUser();

      clientContext.load(website);
      clientContext.load(SPuser);

      clientContext.executeQueryAsync(
        function () {
          window.appWebUrl = website.get_url();
          console.log("SharePoint context ready");
          deferred.resolve(); // Only signal completion
        },
        function (sender, args) {
          console.error("Failed to load SharePoint context:", args.get_message());
          deferred.reject(args.get_message());
        }
      );
    });

    contextPromise = deferred.promise();
    return contextPromise;
  }

sharePointReady(); // <--- trigger immediately when this module loads

return {}; // no need to export anything
});
