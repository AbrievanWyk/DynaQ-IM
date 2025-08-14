define(['angular', 'context'], function (angular) {
   'use strict';
   return angular.module('incidentManagementApp', []);
});

// ExecuteOrDelayUntilScriptLoaded(initializePage, "sp.js");
// function initializePage() {
//    var context = SP.ClientContext.get_current();
//    var user = context.get_web().get_currentUser();
//    $(document).ready(function () {
//       getUserName();
//    });
//    function getUserName() {
//       context.load(user);
//       context.executeQueryAsync(onGetUserNameSuccess, onGetUserNameFail);
//    }
//    function onGetUserNameSuccess() {
//       $('#message').text('Hi ' + user.get_title());
//    }
//    function onGetUserNameFail(sender, args) {
//       alert('Failed to get user name. Error:' + args.get_message());
//    }
// }