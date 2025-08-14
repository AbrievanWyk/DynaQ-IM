define(['app'], function (app) {
   'use strict';

   return app.constant('AUDIT_FINDING_CONSTANTS', {
      DROPDOWN_LOOKUP_LISTS: [
         "Audit Finding Classifications",
         "Audit Finding Areas",
         "Audit Area Standards",
         "Audit Categories",
         "Audit Areas",
         "Audit Parties",
      ]
   }).constant('AUDIT_FINDING_LOOKUP_CONFIG', {
      MAIN: {
         [SP_FIELDS.COMMON.INITIATOR]: ["Id", "EMail", "Title"],
         [SP_FIELDS.COMMON.BUSINESS_AREA]: ["Id", "Title"],
         [SP_FIELDS.COMMON.DEPARTMENT_AREA]: ["Id", "Title"],
         [SP_FIELDS.COMMON.HAPPENED_BEFORE]: ["Id", "Title"],
         [SP_FIELDS.COMMON.INVESTIGATOR]: ["Id", "EMail"],
         [SP_FIELDS.AUDIT_FINDING.AUDIT_FINDING_CLASSIFICATION]: ["Id", "Title"],
         [SP_FIELDS.AUDIT_FINDING.AUDIT_FINDING_AREA]: ["Id", "Title"],
         [SP_FIELDS.AUDIT_FINDING.STANDARD_OF_AUDIT_AREA]: ["Id", "Title"],
         [SP_FIELDS.AUDIT_FINDING.AUDIT_CATEGORY]: ["Id", "Title"],
         [SP_FIELDS.AUDIT_FINDING.AUDIT_AREA]: ["Id", "Title"],
         [SP_FIELDS.AUDIT_FINDING.AUDIT_PARTY]: ["Id", "Title"]
      },
      EXTENSION: {
      }
   });
});