define(['app'], function (app) {
   'use strict';

   return app.constant('ENVIRONMENTAL_CONSTANTS', {
      DROPDOWN_LOOKUP_LISTS: [
         'ShiftList',
         'WhoWasEffectedList',
         'PermitConditions',
         'PublicComplaint',
         'NonConformance',
         'ExcessiveResourceUse',
         'WasteGeneration',
         'EnvironmentSpillage',
         'EnvironmentalImpact',
         'PollutionDuration',
         'ScopeOfPollution',
         'Incident Classifications',
         'Incident Subclassifications',
         'ManMadeCauses',
         'NaturalCauses',
      ]
   }).constant('ENVIRONMENTAL_LOOKUP_CONFIG', {
      MAIN: {
         [SP_FIELDS.COMMON.INITIATOR]: ["Id", "EMail", "Title"],
         [SP_FIELDS.COMMON.BUSINESS_AREA]: ["Id", "Title"],
         [SP_FIELDS.COMMON.DEPARTMENT_AREA]: ["Id", "Title"],
         [SP_FIELDS.COMMON.HAPPENED_BEFORE]: ["Id", "Title"],
         [SP_FIELDS.COMMON.INVESTIGATOR]: ["Id", "EMail", "Title"]
      },
      EXTENSION: {
         [SP_FIELDS.ENVIRONMENTAL.SHIFT]: ["Id", "Title"],
         [SP_FIELDS.ENVIRONMENTAL.WHO_WAS_EFFECTED]: ["Id", "Title"],
         [SP_FIELDS.ENVIRONMENTAL.PERMIT_CONDITION]: ["Id", "Title"],
         [SP_FIELDS.ENVIRONMENTAL.PUBLIC_COMPLAINT]: ["Id", "Title"],
         [SP_FIELDS.ENVIRONMENTAL.NON_CONFORMANCE]: ["Id", "Title"],
         [SP_FIELDS.ENVIRONMENTAL.EXCESSIVE_RESOURCE_USE]: ["Id", "Title"],
         [SP_FIELDS.ENVIRONMENTAL.WASTE_GENERATION]: ["Id", "Title"],
         [SP_FIELDS.ENVIRONMENTAL.ENVIRONMENT_SPILLAGE]: ["Id", "Title"],

         [SP_FIELDS.ENVIRONMENTAL.ENVIRONMENTAL_IMPACT]: ["Id", "Title"],
         [SP_FIELDS.ENVIRONMENTAL.POLLUTION_DURATION]: ["Id", "Title"],
         [SP_FIELDS.ENVIRONMENTAL.SCOPE_OF_POLLUTION]: ["Id", "Title"],

         [SP_FIELDS.ENVIRONMENTAL.INCIDENT_CLASSIFICATION]: ["Id", "Title"],
         [SP_FIELDS.ENVIRONMENTAL.INCIDENT_SUBCLASSIFICATION]: ["Id", "Title"],

         [SP_FIELDS.ENVIRONMENTAL.MAN_MADE_CAUSE]: ["Id", "Title"],
         [SP_FIELDS.ENVIRONMENTAL.NATURAL_CAUSE]: ["Id", "Title"]
      }
   });
});