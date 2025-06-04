// Constants for common SharePoint fields
const SP_FIELDS = {
   // Common fields used across multiple queries
   COMMON: {
      ID: 'ID',
      TITLE: 'Title',
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
   NON_CONFORMING_PRODUCT: {
      SUPPLIER: 'ProductSupplier'
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

   // Audit mappings
   "Audit Categories": "AuditCategories",
   "Audit Areas": "AuditAreas",
   "Audit Area Standards": "AuditAreaStandards",
   "Audit Parties": "AuditParties",
   "Audit Finding Classifications": "AuditFindingClasses",
   "Audit Finding Areas": "AuditFindingAreas",

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
   "Area of Problem Departments": "ProbDebtAreas",
   "HasThisHappenedBefore": "HasThisHappendBeforeList",
   "Root Cause Categories": "RootCauseCategories",
   "Action Required List": "ActionsRequired"
};