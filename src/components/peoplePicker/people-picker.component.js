define(['app'], function (app) {
   return app.component('peoplePicker', {
      bindings: {
         pickerId: '@',         // required: DOM ID
         model: '=',            // bound: selected user(s)
         required: '<?',        // optional: validation
         multiple: '<?',        // optional: allow multiple users
         spUserIds: '=?',       // optional: mapped SP user ID(s)
         selectedUsers: '<?'    // NEW: array of users to prepopulate
      },
      templateUrl: `${srcFolderPath}/js/new/components/peoplePicker/people-picker.template.html`,
      controller: function ($timeout, $scope) {
         const ctrl = this;

         ctrl.$postLink = function () {
            // Delay to ensure Angular finished rendering DOM
            $timeout(() => {
               // Load both required scripts
               SP.SOD.loadMultiple(['sp.js', 'clientpeoplepicker.js'], function () {
                  initializePicker();
               });
            }, 0);
         };

         // Watch for changes to selectedUsers and set users in picker
         $scope.$watch(() => ctrl.selectedUsers, function (newVal) {
            if (Array.isArray(newVal) && newVal.length) {
               ctrl.setUsers(newVal);
            }
         }, true);

         // New: Allow external code to set users programmatically
         ctrl.setUsers = function (users) {
            $timeout(() => {
               const pickerKey = ctrl.pickerId + '_TopSpan';
               const dict = SPClientPeoplePicker.SPClientPeoplePickerDict;
               const picker = dict[pickerKey];
               if (!picker || !Array.isArray(users)) return;

               // Clear existing users
               picker.DeleteProcessedUser();

               users.forEach(function (user) {
                  // Prefer Email, fallback to LoginName or Title
                  var userKey = user.Email || user.EMail || user.LoginName || user.Title;
                  if (userKey) {
                     var usrObj = { 'Key': userKey };
                     picker.AddUnresolvedUser(usrObj, true);
                  }
               });
            }, 0);
         };

         function initializePicker() {
            const schema = {
               PrincipalAccountType: 'User,DL,SecGroup,SPGroup',
               SearchPrincipalSource: 15,
               ResolvePrincipalSource: 15,
               AllowMultipleValues: ctrl.multiple || false,
               MaximumEntitySuggestions: 50,
               Width: '280px'
            };

            try {
               SPClientPeoplePicker_InitStandaloneControlWrapper(ctrl.pickerId, null, schema);
            } catch (e) {
               console.error('Failed to init PeoplePicker:', e);
               return;
            }

            // Try resolving the picker from SharePoint dictionary
            const interval = setInterval(() => {
               const pickerKey = `${ctrl.pickerId}_TopSpan`;
               const dict = SPClientPeoplePicker.SPClientPeoplePickerDict;
               const picker = dict[pickerKey];

               // console.log(`[PeoplePicker] Checking for key: ${pickerKey}`);
               // console.log('[PeoplePicker] Dictionary keys:', Object.keys(dict));

               if (picker) {
                  clearInterval(interval);

                  picker.OnUserResolvedClientScript = function () {
                     // Delay to allow picker DOM state to update
                     $timeout(async () => {
                        const users = picker.GetAllUserInfo();

                        ctrl.model = ctrl.multiple ? users : users[0];

                        // if (ctrl.spUserIds != null) {
                           try {
                              let ids = [];
                              if (Array.isArray(users) && users.length > 0) {
                                 const list = ctrl.multiple ? users : [users[0]];
                                 ids = await Promise.all(list.map(u => SPUtils.getSPUserId(u.Key)));
                              }

                              ctrl.spUserIds = (ctrl.multiple) ? { results: ids } : ids[0];
                              console.log('Resolving SP user IDs:', ctrl.spUserIds);
                           } catch (err) {
                              console.error('Error resolving SP user IDs:', err);
                           }
                        // }

                        // Trigger Angular digest manually if needed
                        $timeout(() => { }, 0);
                     }, 100); // Allow SP to finalize UI and values
                  };

                  console.log(`[PeoplePicker] Initialized and ready: ${pickerKey}`);
               }
            }, 300);

            // Timeout after 5 seconds if not found
            setTimeout(() => clearInterval(interval), 5000);
         }
      }
   });
});