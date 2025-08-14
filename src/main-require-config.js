// require.onError = function (err) {
//   console.error("RequireJS error:", err.requireType);
//   console.error("Modules:", err.requireModules);
//   throw err;
// };
require.config({
   baseUrl: 'https://dynaq.sharepoint.com/TeamSite/im/SiteAssets/IncidentManagement/js/new',
   paths: {
      // Core libraries
      'jquery': 'https://dynaq.sharepoint.com/TeamSite/im/SiteAssets/IncidentManagement/scripts/jquery-1.10.2',
      'jqueryui': 'https://dynaq.sharepoint.com/TeamSite/im/SiteAssets/IncidentManagement/scripts/jquery-ui.min',
      'bootstrap': 'https://dynaq.sharepoint.com/TeamSite/im/SiteAssets/IncidentManagement/scripts/bootstrap.min',
      'angular': 'https://dynaq.sharepoint.com/TeamSite/im/SiteAssets/IncidentManagement/scripts/angular.min',
      'angularRoute': 'https://dynaq.sharepoint.com/TeamSite/im/SiteAssets/IncidentManagement/scripts/angular-route',

      // Application module
      'app': 'modules/app.module',

      // Constants
      'sharedConstants': 'constants/shared.constants',
      'customerComplaintConstants': 'forms/customerComplaint/customerComplaint.constants',
      'environmentalConstants': 'forms/environmental/environmental.constants',
      'ohasConstants': 'forms/ohas/ohas.constants',
      'internalNonConformanceConstants': 'forms/internalNonConformance/internalNonConformance.constants',
      'nonConformingProductConstants': 'forms/nonConformingProduct/nonConformingProduct.constants',
      'auditFindingConstants': 'forms/auditFinding/auditFinding.constants',

      // Helpers
      'formUtils': 'helpers/formUtils',
      'queryBuilder': 'helpers/queryBuilder',
      'context': 'helpers/context',

      // Services
      'instanceIdService': 'services/instanceId.service',
      'itemIdService': 'services/itemId.service',
      'emailService': 'services/email/emailService',
      'responseHandlerService': 'services/sharepoint/responseHandlerService',
      'listOperations': 'services/sharepoint/listOperations',
      'fileOperations': 'services/sharepoint/fileOperations',
      // 'formSelectorService': 'services/formSelector.service',
      'loaderService': 'services/loaderService',
      'workflowService': 'components/workflowStages/shared/workflow.service',
      'customerComplaintService': 'forms/customerComplaint/customerComplaint.service',
      'environmentalService': 'forms/environmental/environmental.service',
      'ohasService': 'forms/ohas/ohas.service',
      'internalNonConformanceService': 'forms/internalNonConformance/internalNonConformance.service',
      'nonConformingProductService': 'forms/nonConformingProduct/nonConformingProduct.service',
      'auditFindingService': 'forms/auditFinding/auditFinding.service',

      // Directives
      'formattedDateInput': 'directives/formatted-date-input.directive',
      'tinymceEditor': 'directives/tinymce.directive',
      'smartSelect': 'directives/smart-select.directive',
      'globalLoader': 'directives/globalLoader.directive',

      // Components
      'fileListSection': 'components/fileListSection/file-list-section.component',
      'peoplePicker': 'components/peoplePicker/people-picker.component',
      'incidentCommonFieldsSection': 'components/incidentCommonFieldsSection/incident-common-fields-section.component',
      'incidentFormActions': 'components/incidentFormActions/incident-form-actions.component',
      'incidentDescription': 'components/incidentDescription/incident-description.component',
      // 'stageNextAction': 'components/workflowStages/shared/stage-next-action.component',
      'workflowStages': 'components/workflowStages/workflow-stages.component',
      'investigatorStage': 'components/workflowStages/investigatorStage/investigator-stage.component',
      'cpaStage': 'components/workflowStages/cpaStage/cpa-stage.component',
      'managerStage': 'components/workflowStages/managerStage/manager-stage.component',
      'financeStage': 'components/workflowStages/financeStage/finance-stage.component',
      'qaStage': 'components/workflowStages/qaStage/qa-stage.component',
      'finalFinanceStage': 'components/workflowStages/finalFinanceStage/final-finance-stage.component',
      
      'workflowActionSelector': 'components/workflowStages/shared/workflow-action-selector.component',

      // Controllers
      'mainCtrl': 'controllers/main.controller',
      'customerComplaintCtrl': 'forms/customerComplaint/customerComplaint.controller',
      'environmentalCtrl': 'forms/environmental/environmental.controller',
      'ohasCtrl': 'forms/ohas/ohas.controller',
      'internalNonConformanceCtrl': 'forms/internalNonConformance/internalNonConformance.controller',
      'nonConformingProductCtrl': 'forms/nonConformingProduct/nonConformingProduct.controller',
      'auditFindingCtrl': 'forms/auditFinding/auditFinding.controller',

      // Mappers
      'customerComplaintMapper': 'forms/customerComplaint/customerComplaint.mapper',
      'environmentalMapper': 'forms/environmental/environmental.mapper',
      'ohasMapper': 'forms/ohas/ohas.mapper',
      'internalNonConformanceMapper': 'forms/internalNonConformance/internalNonConformance.mapper',
      'nonConformingProductMapper': 'forms/nonConformingProduct/nonConformingProduct.mapper',
      'auditFindingMapper': 'forms/auditFinding/auditFinding.mapper',
   },
   shim: {
      'jquery': { exports: '$' },
      'jqueryui': { deps: ['jquery'] },
      'bootstrap': { deps: ['jquery'] },
      'angular': { exports: 'angular' },
      'angularRoute': { deps: ['angular'] },
      'app': { deps: ['angular', 'context'], exports: 'app' },
      // 'angular': { exports: 'angular' },
      // 'angularRoute': { deps: ['angular'] },
      // 'app': { deps: ['angular'] },
      // 'mainCtrl': { deps: ['angular', 'app'] },
      // 'customerComplaintCtrl': { deps: ['app', 'workflowService'] },
      // 'loaderService': { deps: ['angular', 'app'] },
      // 'globalLoader': { deps: ['angular', 'app', 'loaderService'] },
      // 'jquery': { exports: '$' },
      // 'jqueryui': { deps: ['jquery'], exports: '$' },
      // 'bootstrap': { deps: ['jquery'], exports: 'bootstrap' },
      // 'queryBuilder': { deps: [] },
      // 'sharedConstants': { deps: ['angular', 'app'] },
      // 'formUtils': { deps: ['jquery'] },
      // 'emailService': { deps: ['jquery', 'formUtils'] },
      // 'responseHandlerService': { deps: ['angular', 'app', 'formUtils', 'emailService'] },
      // 'listOperations': { deps: ['angular', 'app'] },
      // 'fileOperations': { deps: ['jquery'] },
      // 'formattedDateInput': { deps: ['angular', 'app', 'formUtils'] },
      // 'tinymceEditor': { deps: ['angular', 'app'] },
      // 'smartSelect': { deps: ['angular', 'app'] },
      // 'incidentCommonFieldsSection': { deps: ['angular', 'app'] },
      // 'incidentFormActions': { deps: ['angular', 'app'] },
      // 'incidentDescription': { deps: ['angular', 'app', 'listOperations'] },
      // 'peoplePicker': { deps: ['angular', 'app'] },
      // 'customerComplaintConstants': { deps: ['angular', 'app'] },
      // 'customerComplaintMapper': { deps: ['angular', 'app'] },
      // 'customerComplaintService': { deps: ['angular', 'app', 'listOperations', 'responseHandlerService', 'sharedConstants', 'customerComplaintConstants', 'customerComplaintMapper'] },
      // 'workflowService': { deps: ['angular'] },
      // 'stageNextAction': { deps: ['angular'] },
      // 'investigatorStage': { deps: ['angular', 'listOperations'] },
      // ...existing code...
   }
});

// Bootstrap AngularJS after all dependencies are loaded
require([
   'jquery',
   'jqueryui',
   'bootstrap',
   'angular',
   'angularRoute',
   'context',
   'app',

   'sharedConstants',
   'customerComplaintConstants',
   'environmentalConstants',
   'ohasConstants',
   'internalNonConformanceConstants',
   'nonConformingProductConstants',
   'auditFindingConstants',
   'formUtils',
   'queryBuilder',

   'instanceIdService',
   'itemIdService',
   'emailService',
   'responseHandlerService',
   'listOperations',
   'fileOperations',
   // 'formSelectorService',
   'loaderService',
   'workflowService',

   'customerComplaintMapper',
   'customerComplaintService',
   'environmentalMapper',
   'environmentalService',
   'ohasMapper',
   'ohasService',
   'internalNonConformanceMapper',
   'internalNonConformanceService',
   'nonConformingProductMapper',
   'nonConformingProductService',
   'auditFindingMapper',
   'auditFindingService',

   'formattedDateInput',
   'tinymceEditor',
   'smartSelect',
   'globalLoader',

   'fileListSection',
   'peoplePicker',
   'incidentCommonFieldsSection',
   'incidentFormActions',
   'incidentDescription',
   // 'stageNextAction',
   'workflowStages',
   'investigatorStage',
   'cpaStage',
   'managerStage',
   'financeStage',
   'qaStage',
   'finalFinanceStage',
   'workflowActionSelector',

   'mainCtrl',
   'customerComplaintCtrl',
   'environmentalCtrl',
   'ohasCtrl',
   'internalNonConformanceCtrl',
   'nonConformingProductCtrl',
   'auditFindingCtrl'
], function ($, jqueryui, bootstrap, angular) {
   angular.element(document).ready(function () {
      var root = document.getElementById('incidentManagementRoot');
      angular.bootstrap(root, ['incidentManagementApp']);

      // TODO: Don't know what this is for, but it was in the original code
      $('.ms-cui-group:first').css("display", "none");
      $('.ms-cui-group').eq(-2).css("display", "none");
   });
});