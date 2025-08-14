define(['app'], function (app) {
   'use strict';

   return app.constant('INTERNAL_NON_CONFORMANCE_CONSTANTS', {
      DROPDOWN_LOOKUP_LISTS: [
      ]
   }).constant('INTERNAL_NON_CONFORMANCE_LOOKUP_CONFIG', {
      MAIN: {
         [SP_FIELDS.COMMON.INITIATOR]: ["Id", "EMail", "Title"],
         [SP_FIELDS.COMMON.BUSINESS_AREA]: ["Id", "Title"],
         [SP_FIELDS.COMMON.DEPARTMENT_AREA]: ["Id", "Title"],
         [SP_FIELDS.COMMON.HAPPENED_BEFORE]: ["Id", "Title"],
         [SP_FIELDS.COMMON.INVESTIGATOR]: ["Id", "EMail"]
      },
      EXTENSION: {
      }
   });
});