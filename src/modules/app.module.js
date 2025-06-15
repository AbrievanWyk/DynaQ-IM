angular.module('incidentManagementApp', []);'use strict';

var clientContext;
var website;
var SPuser;
var appWebUrl;//, hostWebUrl;
SP.SOD.executeFunc('sp.js', 'SP.ClientContext', initSharePoint);

function initSharePoint() {
   SharePointContext.sharePointReady().done(function (context) {
      console.log("Initialization successful.");
      // Use cached context
      clientContext = context.clientContext;
      website = context.website;
      SPuser = context.SPuser;

      appWebUrl = website.get_url();
   }).fail(function (error) {
      console.error("Error during SharePoint initialization: ", error);
   });
}