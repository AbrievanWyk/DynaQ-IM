define(['jquery', 'formUtils'], function ($, FormUtils) {
   // Email service functions
   function sendEmail(from, to, body, subject) {
      //Get the relative url of the site
      var siteurl = _spPageContextInfo.webServerRelativeUrl;
      var urlTemplate = "https://dynaq.sharepoint.com/TeamSite/im/_api/SP.Utilities.Utility.SendEmail";
      $.ajax({
         contentType: 'application/json',
         url: urlTemplate,
         type: "POST",
         data: JSON.stringify({
            'properties': {
               '__metadata': {
                  'type': 'SP.Utilities.EmailProperties'
               },
               'From': from,
               'To': {
                  'results': [to]
               },
               'Body': body,
               'Subject': subject
            }
         }),
         headers: {
            "Accept": "application/json;odata=verbose",
            "content-type": "application/json;odata=verbose",
            "X-RequestDigest": jQuery("#__REQUESTDIGEST").val()
         },
         success: function (data) {
            console.log('Email Sent Successfully');
            FormUtils.redirectToURL();
         },
         error: function (err) {
            console.log('Error in sending Email: ' + JSON.stringify(err));
            FormUtils.redirectToURL();
         }
      });
   }

   function getEmailItem(listTitle, mailTo, mailSubject, userName, siteURL, itemID) {
      var dfrd = $.Deferred();
      var list = website.get_lists().getByTitle(listTitle);
      var query = new SP.CamlQuery();
      var items = list.getItems(query);

      clientContext.load(list);
      clientContext.load(items);
      clientContext.executeQueryAsync(
         Function.createDelegate(this, function () {
            var itemInfo = '';
            var enumerator = items.getEnumerator();
            while (enumerator.moveNext()) {
               var currentListItem = enumerator.get_current();
               var mailBody = currentListItem.get_item('Email_x0020_Body');
               mailBody = mailBody.replace("#ItemID#", itemID);
               mailBody = mailBody.replace("#UserName#", userName);
               mailBody = mailBody.replace("#SiteURL#", siteURL);

               sendEmail("no-reply@sharepointonline.com", mailTo, mailBody, mailSubject);
               dfrd.resolve();
            }
         }),
         Function.createDelegate(failGetEmailItem)
      )
      return $.when(dfrd).done().promise();
   }

   function failGetEmailItem(sender, args) {
      alert(args.get_message());
   }

   function sendCustomerComplainSubmitEmail(itemId) {
      var $scopeGetID = angular.element(incidentManagementCtrl).scope();
      var list = website.get_lists().getByTitle("Incidents");
      var query = new SP.CamlQuery();
      query.set_viewXml("<View><Query><Where><Eq><FieldRef Name='ID' /><Value Type='Counter'>" + itemId + "</Value></Eq></Where></Query><ViewFields>" +
         "<FieldRef Name='ID' /><FieldRef Name='BusinessManagers' /><FieldRef Name='CustomerProblemDate' /><FieldRef Name='IMKpiDescription' /><FieldRef Name='CustomerName' /><FieldRef Name='ProductName' /><FieldRef Name='CustomerRepresentatives' />" +
         "</ViewFields></View>");

      var items = list.getItems(query);

      clientContext.load(list);
      clientContext.load(items);
      var singleObj = {}

      clientContext.executeQueryAsync(
         Function.createDelegate(this, function () {
            var itemInfo = '';
            var enumerator = items.getEnumerator();
            enumerator.moveNext();
            var currentListItem = enumerator.get_current();
            singleObj['id'] = currentListItem.get_item('ID');

            var problemDate = currentListItem.get_item('CustomerProblemDate');
            var newDate = $.datepicker.formatDate('dd/mm/yy', problemDate);
            singleObj['CustomerProblemDate'] = newDate;
            singleObj['IMKpiDescription'] = currentListItem.get_item('IMKpiDescription');

            if (currentListItem.get_item('CustomerName') != null) {
               singleObj['CustomerName'] = currentListItem.get_item('CustomerName').get_lookupValue();
            }

            if (currentListItem.get_item('ProductName') != null) {
               singleObj['ProductName'] = currentListItem.get_item('ProductName').get_lookupValue();
            }

            var mailSubject = "Customer Complaint Registration";
            var mailBody = "Dear Company Representative and/or Team member";
            mailBody += "<br/><br/>";
            mailBody += "Re.: Notification of Customer Complaint Registration";
            mailBody += "<br/><br/>";
            mailBody += "This serves as a notice of a new customer complaint that was registered at the business.";
            mailBody += "<br/>Complaint Ref.Nr.: " + singleObj['id'];
            mailBody += "<br/>Customer: " + singleObj['CustomerName'];
            mailBody += "<br/>Product: " + singleObj['ProductName'];
            mailBody += "<br/>Complaint Date: " + singleObj['CustomerProblemDate'];
            mailBody += "<br/>Description of Complaint: " + singleObj['IMKpiDescription'];
            mailBody += "<br/>";
            mailBody += "The complaint investigation is underway and a notification of completion will be e-mailed upon close-out.";

            var customerRepresentativeEmailList = [];

            var CustomerRepresentatives = currentListItem.get_item('CustomerRepresentatives');
            for (var Stressor = 0; Stressor < CustomerRepresentatives.length; Stressor++) {
               var rep = $.grep($scopeGetID.CustomerRepresentatives, function (e) {
                  return e.id == CustomerRepresentatives[Stressor].get_lookupId();
               });
               var email = rep[0].email;
               customerRepresentativeEmailList.push(email);
            }
            if (currentListItem.get_item('BusinessManagers') != null) {
               for (var x = 0; x < currentListItem.get_item('BusinessManagers').length; x++) {
                  var userEmail = currentListItem.get_item('BusinessManagers')[x].get_email();
                  customerRepresentativeEmailList.push(userEmail);
               }
            }

            for (var rep = 0; rep < customerRepresentativeEmailList.length; rep++) {
               sendEmail("no-reply@sharepointonline.com", customerRepresentativeEmailList[rep], mailBody, mailSubject);
            }
         }),
         Function.createDelegate(this, fail)
      );
   }

   function sendCustomerComplaintCompleteEmail(itemId) {
      var $scopeGetID = angular.element(incidentManagementCtrl).scope();
      var list = website.get_lists().getByTitle("Incidents");
      var query = new SP.CamlQuery();
      query.set_viewXml("<View><Query><Where><Eq><FieldRef Name='ID' /><Value Type='Counter'>" + itemId + "</Value></Eq></Where></Query><ViewFields>" +
         "<FieldRef Name='ID' /><FieldRef Name='CPA' /><FieldRef Name='BusinessManagers' /><FieldRef Name='CustomerProblemDate' /><FieldRef Name='IMKpiDescription' /><FieldRef Name='CustomerName' /><FieldRef Name='ProductName' /><FieldRef Name='CustomerRepresentatives' />" +
         "</ViewFields></View>");

      var items = list.getItems(query);

      clientContext.load(list);
      clientContext.load(items);
      var singleObj = {}

      clientContext.executeQueryAsync(
         Function.createDelegate(this, function () {
            var itemInfo = '';
            var enumerator = items.getEnumerator();
            enumerator.moveNext();
            var currentListItem = enumerator.get_current();
            singleObj['id'] = currentListItem.get_item('ID');

            var problemDate = currentListItem.get_item('CustomerProblemDate');
            var newDate = $.datepicker.formatDate('dd/mm/yy', problemDate);
            singleObj['CustomerProblemDate'] = newDate;
            singleObj['CPA'] = currentListItem.get_item('CPA');
            singleObj['IMKpiDescription'] = currentListItem.get_item('IMKpiDescription');

            if (currentListItem.get_item('CustomerName') != null) {
               singleObj['CustomerName'] = currentListItem.get_item('CustomerName').get_lookupValue();
            }

            if (currentListItem.get_item('ProductName') != null) {
               singleObj['ProductName'] = currentListItem.get_item('ProductName').get_lookupValue();
            }

            var mailSubject = "Customer Complaint Registration";
            var mailBody = "Dear Company Representative and/or Team member";
            mailBody += "<br/><br/>";
            mailBody += "Re.: Notification of Customer Complaint Completion";
            mailBody += "<br/><br/>";
            mailBody += "This serves as a notice of a registered customer complaint that has been completed.";
            mailBody += "<br/>Complaint Ref.Nr.: " + singleObj['id'];
            mailBody += "<br/>Customer: " + singleObj['CustomerName'];
            mailBody += "<br/>Complaint Date: " + singleObj['CustomerProblemDate'];
            mailBody += "<br/>Description of Complaint: " + singleObj['IMKpiDescription'];
            mailBody += "<br/>Corrective Action Taken: " + singleObj['CPA'];
            mailBody += "<br/>Complete Date: " + new Date();
            mailBody += "<br/>";

            var customerRepresentativeEmailList = [];

            if (currentListItem.get_item('BusinessManagers') != null) {
               for (var x = 0; x < currentListItem.get_item('BusinessManagers').length; x++) {
                  var userEmail = currentListItem.get_item('BusinessManagers')[x].get_email();
                  customerRepresentativeEmailList.push(userEmail);
               }
            }

            for (var rep = 0; rep < customerRepresentativeEmailList.length; rep++) {
               sendEmail("no-reply@sharepointonline.com", customerRepresentativeEmailList[rep], mailBody, mailSubject);
            }
         }),
         Function.createDelegate(this, fail)
      );
   }

   // Export the functions that need to be accessible
   return {
      sendEmail,
      getEmailItem,
      sendCustomerComplainSubmitEmail,
      sendCustomerComplaintCompleteEmail
   };
});