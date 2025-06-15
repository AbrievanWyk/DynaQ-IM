angular.module('incidentManagementApp')
   .component('peoplePicker', {
      bindings: {
         pickerId: '@',         // required: DOM ID
         model: '=',            // bound: selected user(s)
         required: '<?',        // optional: validation
         multiple: '<?',        // optional: allow multiple users
         spUserIds: '=?'        // optional: mapped SP user ID(s)
      },
      template: `
      <div class="ms-formbody">
        <div id="{{$ctrl.pickerId}}"></div>
        <span class="ms-error" ng-if="$ctrl.required && !$ctrl.model">
          This field is required.
        </span>
      </div>
    `,
      controller: function ($timeout) {
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

                        if (ctrl.spUserIds != null) {
                           try {
                              const list = ctrl.multiple ? users : [users[0]];
                              const ids = await Promise.all(list.map(u => SPUtils.getSPUserId(u.Key)));
                              
                              ctrl.spUserIds = (ctrl.multiple) ? { results: ids } : ids[0];
                           } catch (err) {
                              console.error('Error resolving SP user IDs:', err);
                           }
                        }

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

   // TODO: Possible scripts also required for the picker
// <script type="text/javascript" src="../../../_layouts/15/clienttemplates.js">  </script>
// <script type="text/javascript" src="../../../_layouts/15/clientforms.js">  </script>
// <script type="text/javascript" src="../../../_layouts/15/clientpeoplepicker.js">  </script>
// <script type="text/javascript" src="../../../_layouts/15/autofill.js">  </script>
// <script type="text/javascript" src="../../../_layouts/15/sp.core.js">  </script>