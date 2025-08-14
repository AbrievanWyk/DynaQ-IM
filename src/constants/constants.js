const srcFolderPath = '../../SiteAssets/IncidentManagement';
window.appWebUrl = 'https://dynaq.sharepoint.com/TeamSite/im';
// Constants for common SharePoint fields
const SP_FIELDS = {
   // Common fields used across multiple queries
   COMMON: {
      INSTANCE_ID: 'reqInstanceID',
      ID: 'ID',
      TITLE: 'Title',
      INVESTIGATOR: 'AssignedTo',
      AR_REASON: 'ARReason',
      BUSINESS_AREA: 'Area',
      DEPARTMENT_AREA: 'DepartmentAreaofProblem',
      DESCRIPTION: 'IMKpiDescription',
      HAPPENED_BEFORE: 'hasThisHappenedBefore',
      IS_DRAFT: 'IsDraft',
      CREATED: 'Created',
      INITIATOR: 'Initiator',
      TASK_STATUS: 'TaskStat',
      AR_STATUS: 'ARStatus'
   },
   // Customer specific fields
   CUSTOMER: {
      NAME: 'CustomerName',
      CATEGORY: 'CustomerComplaintCategory',
      LOCATION: 'CustomerLocation',
      PROVINCE: 'Province',
      STORE_OUTLET: 'StoreOutletRetailer',
      SOURCE_OF_COMPLAINT: 'SourceofComplaint',
      CONTACT_PERSON: 'CustomerContactPerson',
      CONTACT_PHONE: 'CustomerContactTelephone',
      CONTACT_EMAIL: 'CustomerContactEmail'
   },
   // Product specific fields
   PRODUCT: {
      CATEGORY: 'ProductCategory',
      NAME: 'ProductName',
      UNIT_QUANTITY: 'UnitQuantity',
      UNIT_TYPE: 'UnitType',
      PRODUCTION_DATE: 'ProductionDate',
      BEST_BEFORE_DATE: 'BestBeforeDate',
      BATCH_NUMBER: 'BatchNumberFiled'
   },
   // Complaint specific fields
   COMPLAINT: {
      TYPE: 'ComplaintType',
      CLASSIFICATION: 'CustomerComplaintService',
      EXISTING_REF: 'ExistingARReference',
      PROBLEM_DATE: 'CustomerProblemDate',
      IS_CLAIM: 'IsCustomerClaim',
      CLAIM_DETAIL: 'CustomerClaimDetail',
      REPRESENTATIVES: 'CustomerRepresentatives',
      BUSINESS_MANAGERS: 'BusinessManagers'
   },

   // Non-conforming product specific fields
   ENVIRONMENTAL: {
      EXACT_LOCATION: 'ExactLocation',
      INCIDENT_DATE: 'IncidentDate',
      SHIFT: 'NewShift',
      INITIAL_ACTION_TAKEN: 'InitialActionTaken',
      REPORTED_BY: 'ReportedBy',
      WHO_WAS_EFFECTED: 'Whowaseffected',
      HOW_DID_IT_HAPPEN: 'Howdidithappen',
      SUPPORTING_EVIDENCE: 'Supportingevidence',
      PERMIT_CONDITION: 'PermitCondition',
      PUBLIC_COMPLAINT: 'PublicComplaint',
      NON_CONFORMANCE: 'NonComformance',
      EXCESSIVE_RESOURCE_USE: 'ExcessiveResourceUse',
      WASTE_GENERATION: 'WasteGeneration',
      ENVIRONMENT_SPILLAGE: 'EnvironmentalSpillage',
      ENVIRONMENTAL_IMPACT: 'EnvironmentalImpact',
      POLLUTION_DURATION: 'DurationOfPollution',
      SCOPE_OF_POLLUTION: 'ScopeOfPollution',
      INCIDENT_CLASSIFICATION: 'ClassificationofIncident',
      INCIDENT_SUBCLASSIFICATION: 'SubClassificationofIncident',
      MAN_MADE_CAUSE: 'ManMadeCause',
      NATURAL_CAUSE: 'NaturalCause'
  },

   // Non-conforming product specific fields
   OHAS: {
      EXACT_LOCATION: 'ExactLocation',
      INCIDENT_DATE: 'IncidentDate',
      INITIAL_ACTION_TAKEN: 'InitialActionTaken',
      REPORTED_BY: 'ReportedBy',
      SUPPORTING_EVIDENCE: 'Supportingevidence',
      DRUG_REASON: 'DrugReason',
      DRUG_RESULTS: 'DrugResults',
      EMPLOYEE_NAME: 'EmployeeName',
      AGE: 'Age',
      IM_DEPARTMENT: 'IMDepartment',
      REGULAR_OCCUPATION: 'RegularOccupation',
      PERIOD_PRESENT_JOB: 'PeriodPresentJob',
      YEARS_COMPANY_SERVICE: 'YearsCompanyService',
      NAME_OF_SUPERVISOR: 'NameofSupervisor',
      DEPARTMENT_MANAGER: 'DepartmentManager',
      DRUG_TEST: 'DrugTest',
      EFFECT_ON_PERSON: 'EffectonPerson',
      RESULT_OF_INCIDENT: 'ResultofIncident',
      WHO_WAS_EFFECTED: 'Whowaseffected',
      SUB_CLASSIFICATION_OF_INCIDENT: 'SubClassificationofIncident',
      MAN_MADE_CAUSE: 'ManMadeCause',
      NATURAL_CAUSE: 'NaturalCause',
      NEW_SHIFT: 'NewShift',
      CLASSIFICATION_OF_INCIDENT: 'ClassificationofIncident',
      PART_OF_BODY_AFFECTED: 'PartofBodyAffected',
      OCCUPATIONAL_STRESSOR: 'OccupationalStressor',
      IMMEDIATE_CAUSE: 'ImmediateCause',
      NATURE_OF_INJURY: 'NatureOfInjury',
      SOURCE_OF_INJURY: 'SourceOfInjury',
      IMMEDIATE_CAUSE_OTHER: 'ImmediateCauseOther',
      NATURE_OF_INJURY_OTHER: 'NatureOfInjuryOther',
      SOURCE_OF_INJURY_OTHER: 'SourceOfInjuryOther',
      BODY_PARTS_ADDITIONAL_INFORMATION: 'BodyPartsAdditionalInformation',
      PRIMARY_INCIDENT_TYPE: 'PrimaryIncidentType'
  },

   // Non-conforming product specific fields
   NON_CONFORMING_PRODUCT: {
      SUPPLIER: 'ProductSupplier'
  },
  AUDIT_FINDING: {
      REFERENCES: 'IMReferences',
      AUDIT_FINDING_CLASSIFICATION: 'IMAuditFindingClassification',
      AUDIT_FINDING_AREA: 'IMAuditFindingArea',
      STANDARD_OF_AUDIT_AREA: 'StandardofAuditArea',
      AUDIT_CATEGORY: 'IMAuditCategory',
      AUDIT_AREA: 'IMAuditArea',
      AUDIT_PARTY: 'IMAuditParty'
  },
};

const LIST_TO_SCOPE_MAPPINGS = {
   // Customer Complaint mappings
   "Customers": "CustomerNames",
   "ComplaintType": "ComplaintTypes",
   "Product Categories": "ComplaintProductCategories",
   "Province List": "ProvinceList",
   "Store Outlet Retailer List": "StoreOutletRetailerList",
   "Source of Complaint": "SourceOfComplaintList",
   "Unit Type List": "UnitTypeList",
   "Service Categories": "ComplaintClassifications",
   "Products": "ComplaintProductNames",

   // Audit mappings
   "Audit Finding Classifications": "AuditFindingClasses",
   "Audit Finding Areas": "AuditFindingAreas",
   "Audit Area Standards": "AuditAreaStandards",
   "Audit Categories": "AuditCategories",
   "Audit Areas": "AuditAreas",
   "Audit Parties": "AuditParties",

   // OHaS mappings
   "ShiftList": "Shifts",
   "Drug Test": "DrugTest",
   "BodyPartList": "bodyparts",
   "OccupationalStressorList": "OccupationalStressors",
   "WhoWasEffectedList": "affectees",
   "ManMadeCauses": "ManMadeCauses",
   "EffectonPersonList": "EffectOnPersons",
   "ResultofIncidentList": "ResultofIncidents",
   "NaturalCauses": "NaturalCauses",
   "PrimaryIncidentType": "incidentTypes",
   "Incident Classifications": "IncidentClassifications",
   "ImmediateCauses": "immediateCauses",
   "NatureOfInjury": "natureOfInjuries",
   "SourceOfInjury": "sourcesOfInjury",

   // Environmental mappings
   "PermitConditions": "permitConditions",
   "PublicComplaint": "publicComplaints",
   "NonConformance": "nonConformances",
   "ExcessiveResourceUse": "resourcesUses",
   "WasteGeneration": "wasteGeneration",
   "EnvironmentSpillage": "environmentSpillage",
   "EnvironmentalImpact": "environmentalImpacts",
   "PollutionDuration": "PollutionDurations",
   "ScopeOfPollution": "PollutionScopes",
   "Incident Subclassifications": "IncidentSubClassifications",

   // Main/Common mappings
   "Business Area": "BusinessAreas",
   "Area of Problem Departments": "ProblemDepartmentAreas",
   "HasThisHappenedBefore": "HasThisHappenedBeforeList",
   "Root Cause Categories": "RootCauseCategories",
   "Action Required List": "ActionsRequired"
};