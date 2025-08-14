let WORKFLOW_CONSTANTS = {
   STATES: {
      DRAFT: 'Draft',
      NEW: 'New',
      RETURN_INVESTIGATION: 'Return to Investigation',
      CPA: 'CPA',
      RETURN_CPA: 'Return for CPA',
      FINANCE: 'Finance Approval',
      MANAGER: 'Manager Approval',
      QA: 'Quality Approval',
      FINAL_FINANCE: 'Final Finance Approval',
      COMPLETED: 'Completed'
   },
   STAGE_COMPONENT_MAP: {
      'New': ['investigatorStage'],
      'Return to Investigation': ['investigatorStage'],
      'CPA': ['cpaStage', 'investigatorStage'],
      'Return for CPA': ['cpaStage', 'investigatorStage'],
      'Finance Approval': ['financeStage', 'investigatorStage'],
      'Manager Approval': ['managerStage', 'cpaStage', 'investigatorStage'],
      'Quality Approval': ['qaStage', 'managerStage', 'cpaStage', 'investigatorStage'],
      'Final Finance Approval': ['finalFinanceStage', 'qaStage', 'managerStage', 'cpaStage', 'financeStage', 'investigatorStage'],
      'Completed': ['summaryStage', 'finalFinanceStage', 'qaStage', 'managerStage', 'cpaStage', 'financeStage', 'investigatorStage']
   },
   STAGE_SP_FIELDS: {
      COMMON: {
         IS_DRAFT: 'IsDraft',
         TASK_STATUS: 'TaskStat',
         ASSIGNED_TO: 'AssignedTo',
      },
      INVESTIGATION: {
         INVESTIGATOR: 'Investigator',
         FINANCIAL_APPROVAL_REQUIRED: 'FinancialApprovalRequired',
         INVESTIGATOR_APPROVAL_DATE: 'InvestigatorApprovalDate',
         SUGGESTED_CPA: 'SuggestedCPA',
         INVESTIGATION_PARTICIPANTS: 'InvestigationParticipants',
         INVESTIGATOR_DETAILS: 'InvestigatorDetails',
         PROCEDURE_NAME: 'ProcedureName',
         REVIEW_TRAINING_DATE: 'ReviewTrainingDate',
         IS_INCIDENT_COVERED: 'IsIncidentCovered',
         RISK_ASSESSMENT_DETAILS: 'RiskAssessmentDetails',
         ROOT_CAUSE_CATEGORY: 'RootCauseCategory',
         ROOT_CAUSE_AR: 'RootCauseAR',
         ACTION_REQUIRED: 'ActionRequired',
         IMMEDIATE_CORRECTION: 'ImmediateCorrection',
         PRIORITY: 'Priority',
         START_DATE: 'StartDate',
         TASK_DUE_DATE: 'TaskDueDate',
         COST_CLAIM: 'CostClaim',
         COST_TRANSPORT: 'CostTransport',
         COST_CONFORMANCE: 'CostConformance',
         COST_DIRECT_DAMAGE: 'CostDirectDamage',
         OPERATIONAL_IMPROVEMENTS: 'OperationalImprovements',
         COST_TRAINING: 'CostTraining',
         COST_OTHER: 'CostOther',
         COST_DETAILS: 'CostDetails',
         QUANTITY_OF_POLLUTANT: 'QuantityOfPollutant',
         ENVIRONMENTAL_IMPACT: 'EnvironmentalImpact',
         POLLUTION_DURATION: 'DurationOfPollution',
         SCOPE_OF_POLLUTION: 'ScopeOfPollution'
      },
      CPA: {
         COMMENTS: 'CPA',
         APPROVAL_DATE: 'CpaApprovalDate',
         PERSON: 'CPAPerson',
      },
      MANAGER: {
         COMMENTS: 'ManagerComments',
         APPROVAL_DATE: 'ManagerApprovalDate',
         PERSON: 'ApproverManager',
      },
      FINANCE: {
         COMMENTS: 'FinanceApprovalComments',
         APPROVAL_DATE: 'FinanceApprovalDate',
         PERSON: 'FinanceApprovalManager',
      },
      QA: {
         COMMENTS: 'QualityComments',
         APPROVAL_DATE: 'QualityApprovalDate',
         PERSON: 'QualityManager',
      },
      FINAL_FINANCE: {
         COMMENTS: 'FinalFinanceApprovalComments',
         APPROVAL_DATE: 'FinalFinanceApprovalDate',
         PERSON: 'FinalFinanceApprovalManager',
      }
   }
};

WORKFLOW_CONSTANTS.STAGE_LOOKUP_CONFIG = {
   COMMON: {
      [WORKFLOW_CONSTANTS.STAGE_SP_FIELDS.COMMON.ASSIGNED_TO]: ["Id", "EMail", "Title"],
   },
   INVESTIGATION: {
      [WORKFLOW_CONSTANTS.STAGE_SP_FIELDS.INVESTIGATION.INVESTIGATOR]: ["Id", "EMail", "Title"],
      [WORKFLOW_CONSTANTS.STAGE_SP_FIELDS.INVESTIGATION.ROOT_CAUSE_CATEGORY]: ["Id", "Title"],
      [WORKFLOW_CONSTANTS.STAGE_SP_FIELDS.INVESTIGATION.ROOT_CAUSE_AR]: ["Id", "Title"],
      [WORKFLOW_CONSTANTS.STAGE_SP_FIELDS.INVESTIGATION.ACTION_REQUIRED]: ["Id", "Title"],
      [WORKFLOW_CONSTANTS.STAGE_SP_FIELDS.INVESTIGATION.ENVIRONMENTAL_IMPACT]: ["Id", "Title"],
      [WORKFLOW_CONSTANTS.STAGE_SP_FIELDS.INVESTIGATION.POLLUTION_DURATION]: ["Id", "Title"],
      [WORKFLOW_CONSTANTS.STAGE_SP_FIELDS.INVESTIGATION.SCOPE_OF_POLLUTION]: ["Id", "Title"]
   },
   CPA: {
      [WORKFLOW_CONSTANTS.STAGE_SP_FIELDS.CPA.PERSON]: ["Id", "EMail", "Title"],
   },
   MANAGER: {
      [WORKFLOW_CONSTANTS.STAGE_SP_FIELDS.MANAGER.PERSON]: ["Id", "EMail", "Title"],
   },
   FINANCE: {
      [WORKFLOW_CONSTANTS.STAGE_SP_FIELDS.FINANCE.PERSON]: ["Id", "EMail", "Title"],
   },
   QA: {
      [WORKFLOW_CONSTANTS.STAGE_SP_FIELDS.QA.PERSON]: ["Id", "EMail", "Title"],
   },
   FINAL_FINANCE: {
      [WORKFLOW_CONSTANTS.STAGE_SP_FIELDS.FINAL_FINANCE.PERSON]: ["Id", "EMail", "Title"],
   },
}