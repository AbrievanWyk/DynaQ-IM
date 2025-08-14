define(['app'], function(app) {
'use strict';

return app.constant('SHARED_CONSTANTS', {
      INCIDENT_LIST_NAME: "Incidents",
      LIST_TO_SCOPE_MAPPINGS: {
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
         "Area of Problem Departments": "ProblemDepartmentAreas",
         "HasThisHappenedBefore": "HasThisHappenedBeforeList",
         "Root Cause Categories": "RootCauseCategories",
         "Action Required List": "ActionsRequired"
      }
   });
});
