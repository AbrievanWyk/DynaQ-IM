define(['app', 'listOperations', 'responseHandlerService', 'sharedConstants'], function (app) {
   'use strict';

   return app.factory('WorkflowService', ['$q', '$rootScope', 'SPListOperations', 'ResponseHandlerService', 'SHARED_CONSTANTS', function ($q, $rootScope, SPListOperations, ResponseHandlerService, SHARED_CONSTANTS) {
      const STATES = WORKFLOW_CONSTANTS.STATES;
      const COMPONENT_MAP = WORKFLOW_CONSTANTS.STAGE_COMPONENT_MAP;
      const ALL_FIELD_MAPPINGS = WORKFLOW_CONSTANTS.STAGE_SP_FIELDS;
      const ALL_LOOKUP_CONFIG = WORKFLOW_CONSTANTS.STAGE_LOOKUP_CONFIG;

      const workflowStatusCache = {};

      function getVisibleStages(taskStat) {
         return COMPONENT_MAP[taskStat] || [];
      }

      function isEditable(stageName, taskStat) {
         return taskStat !== STATES.COMPLETED;
      }

      function isStageVisible(stageName, taskStat) {
         const visibleStages = getVisibleStages(taskStat);
         return visibleStages.includes(stageName);
      }

      function getFormWorkflowStatus(listName, itemId, forms = []) {
         const cacheKey = `${listName}_${itemId}`;
         if (workflowStatusCache[cacheKey]) {
            // Return a resolved promise with the cached properties
            return Promise.resolve(workflowStatusCache[cacheKey]);
         }
         return SPListOperations.getListItem(listName, itemId, ['ARReason', 'IsDraft', 'TaskStat', 'reqInstanceID'])
            .then(function (item) {
               let result = null;
               if (item && item.ARReason) {
                  var form = forms.find(f => f.alternativeLabel === item.ARReason);
                  var workflowStage = item.TaskStat;
                  var displayMode = item.IsDraft ? 'edit' : 'view';
                  var instanceID = item.reqInstanceID || null;
                  result = { form, displayMode, workflowStage, instanceID } || null;
               }
               // Store only the properties, not the whole item
               workflowStatusCache[cacheKey] = result;
               return result;
            });
      };

      /**
       * Maps actions to TaskStat and IsDraft values.
       * @param {string} action - The selected action (label or value).
       * @returns {{TaskStat: string, IsDraft: boolean}|null}
       */
      function getActionStatus(action) {
         switch (action) {
            case 'Return to Initiator':
               return { TaskStat: 'Draft', IsDraft: true };
            case 'Send to CPA':
            case 'Submit for CPA':
               return { TaskStat: 'CPA', IsDraft: false };
            case 'Submit for Finance Approval':
               return { TaskStat: 'Finance Approval', IsDraft: false };
            case 'Send for Manager Approval':
               return { TaskStat: 'Manager Approval', IsDraft: false };
            case 'Return to Investigator':
               return { TaskStat: 'Return to Investigation', IsDraft: false };
            case "Return to CPA":
               return { TaskStat: 'Return for CPA', IsDraft: false };
            case "Send for Quality Approval":
               return { TaskStat: 'Quality Approval', IsDraft: false };
            case "Financial Review and Closeout":
               return { TaskStat: 'Final Finance Approval', IsDraft: false };
            case "Complete":
               return { TaskStat: 'Complete', IsDraft: false };
            default:
               return null;
         }
      }

      // Initialize dropdown options
      // function initializeDropdownOptions() {

      //    const DROPDOWN_LOOKUP_LISTS = [
      //       'Root Cause Categories',
      //       'Incident Root Causes',
      //       'Action Required List'
      //    ];

      //    const LIST_TO_SCOPE_MAPPINGS = {
      //       "Incident Root Causes": "RootCauses",
      //       "Root Cause Categories": "RootCauseCategories",
      //       "Action Required List": "ActionsRequired"
      //    }

      //    const dropdownLookupLists = DROPDOWN_LOOKUP_LISTS;

      //    const lookupPromises = dropdownLookupLists.map(list => {
      //       let parentIdColumnName = null;
      //       if (list == "Incident Root Causes") parentIdColumnName = "Root_x0020_Cause_x0020_Category";
      //       return SPListOperations.getLookupColumnOptions(list, parentIdColumnName).then(options => {
      //          $rootScope.$apply(() => {
      //             const scopeProperty = LIST_TO_SCOPE_MAPPINGS[list];
      //             if (scopeProperty) {
      //                $rootScope[scopeProperty] = options;
      //             }
      //          });
      //       });
      //    });

      //    const choicePromise = SPListOperations.getChoiceColumnOptions(SHARED_CONSTANTS.INCIDENT_LIST_NAME, "Priority")
      //       .then(options => {
      //          $rootScope.$apply(() => {
      //             $rootScope.Priorities = options;
      //          });
      //       });
      //    // const actionStepOptions = await SPListOperations.getChoiceColumnOptions('Incidents', 'Priority');
      //    // const approvalStepOptions = await SPListOperations.getChoiceColumnOptions('Incidents', 'Priority');

      //    return $q.all([...lookupPromises, choicePromise])
      //       .then(() => {
      //          // $rootScope.$apply(() => {
      //          $rootScope.formReady = true;
      //          // });
      //       })
      //       .catch(err => {
      //          console.error("Error loading lists:", err);
      //       });
      // };

      function initializeDropdownOptions() {
         const DROPDOWN_LOOKUP_LISTS = [
            'Root Cause Categories',
            'Incident Root Causes',
            'Action Required List'
         ];

         const LIST_TO_SCOPE_MAPPINGS = {
            "Incident Root Causes": "RootCauses",
            "Root Cause Categories": "RootCauseCategories",
            "Action Required List": "ActionsRequired"
         };

         const dropdownLookupLists = DROPDOWN_LOOKUP_LISTS;

         const lookupPromises = dropdownLookupLists.map(list => {
            let parentIdColumnName = null;
            if (list == "Incident Root Causes") parentIdColumnName = "Root_x0020_Cause_x0020_Category";
            return SPListOperations.getLookupColumnOptions(list, parentIdColumnName).then(options => {
               return { key: LIST_TO_SCOPE_MAPPINGS[list], options };
            });
         });

         const choicePromise = SPListOperations.getChoiceColumnOptions(SHARED_CONSTANTS.INCIDENT_LIST_NAME, "Priority")
            .then(options => ({ key: "Priorities", options }));

         return Promise.all([...lookupPromises, choicePromise])
            .then(results => {
               const dropdowns = {};
               results.forEach(({ key, options }) => {
                  dropdowns[key] = options;
               });
               return dropdowns;
            })
            .catch(err => {
               console.error("Error loading lists:", err);
               return {};
            });
      }

      // Update an existing request stage details
      async function updateStageDetails(itemID, formModel) {
         try {
            const result = await SPListOperations.updateListItem(SHARED_CONSTANTS.INCIDENT_LIST_NAME, itemID, formModel);
            await ResponseHandlerService.handleSuccess(result);
            return result;
         } catch (error) {
            ResponseHandlerService.handleError(error);
            throw error;
         }
      };

      const loadInvestigationStageData = async function (itemID) {
         const mainFields = [
            ...Object.values(ALL_FIELD_MAPPINGS.COMMON),
            ...Object.values(ALL_FIELD_MAPPINGS.INVESTIGATION),
         ];

         const lookupFields = {
            ...ALL_LOOKUP_CONFIG.COMMON,
            ...ALL_LOOKUP_CONFIG.INVESTIGATION
         };

         return await SPListOperations.getListItem(
            SHARED_CONSTANTS.INCIDENT_LIST_NAME,
            itemID,
            mainFields,
            lookupFields);
      };

      const loadOtherStagesData = async function (itemID) {
         const mainFields = [
            ...Object.values(ALL_FIELD_MAPPINGS.CPA),
            ...Object.values(ALL_FIELD_MAPPINGS.MANAGER),
            ...Object.values(ALL_FIELD_MAPPINGS.FINANCE),
            ...Object.values(ALL_FIELD_MAPPINGS.QA),
            ...Object.values(ALL_FIELD_MAPPINGS.FINAL_FINANCE)
         ];

         const lookupFields = {
            ...ALL_LOOKUP_CONFIG.CPA,
            ...ALL_LOOKUP_CONFIG.MANAGER,
            ...ALL_LOOKUP_CONFIG.FINANCE,
            ...ALL_LOOKUP_CONFIG.QA,
            ...ALL_LOOKUP_CONFIG.FINAL_FINANCE
         };

         return await SPListOperations.getListItem(
            SHARED_CONSTANTS.INCIDENT_LIST_NAME,
            itemID,
            mainFields,
            lookupFields);
      };

      const getStageConstantName = function (stageName) {
         let currentStageName = '';
         switch (stageName) {
            case 'investigatorStage':
               return currentStageName = 'INVESTIGATION';
            case 'cpaStage':
               return currentStageName = 'CPA';
            case 'managerStage':
               return currentStageName = 'MANAGER';
            case 'financeStage':
               return currentStageName = 'FINANCE';
            case 'qaStage':
               return currentStageName = 'QA';
            case 'finalFinanceStage':
               return currentStageName = 'FINAL_FINANCE';
            default:
               return currentStageName;
         }
      }

      async function getStageDetails(itemID, stageName = 'investigatorStage') {
         const stageConstantName = getStageConstantName(stageName);
         const investigationData = await loadInvestigationStageData(itemID);
         const otherStagesData = await loadOtherStagesData(itemID);

         return {
            ...investigationData,
            ...otherStagesData,
            RootCauseCategoryId: investigationData.RootCauseCategory?.Id || null,
            RootCauseARId: investigationData.RootCauseAR?.Id || null,
            ActionRequiredId: investigationData.ActionRequired?.Id || null,

            ScopeOfPollutionId: investigationData.ScopeOfPollution?.Id || null,
            DurationOfPollutionId: investigationData.DurationOfPollution?.Id || null,
            EnvironmentalImpactId: {
               results: Array.isArray(investigationData.EnvironmentalImpact?.results)
                  ? investigationData.EnvironmentalImpact.results.map(u => u.Id)
                  : []
            },
         };
      };

      return {
         STATES,
         getVisibleStages,
         isEditable,
         isStageVisible,
         getFormWorkflowStatus,
         getActionStatus,
         updateStageDetails,
         getStageDetails,
         initializeDropdownOptions
      };
   }]);
});




// const loadStageData = async function (itemID, stageName = 'INVESTIGATION') {
//    const mainFields = [
//       ...Object.values(ALL_FIELD_MAPPINGS.COMMON),
//       ...Object.values(ALL_FIELD_MAPPINGS[stageName.toUpperCase()]),
//    ];
//    return await SPListOperations.getListItem(
//       SHARED_CONSTANTS.INCIDENT_LIST_NAME,
//       itemID,
//       mainFields,
//       ALL_LOOKUP_CONFIG[stageName.toUpperCase()]);
// };