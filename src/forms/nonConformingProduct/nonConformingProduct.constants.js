define(['app'], function (app) {
   'use strict';

   return app.constant('NON_CONFORMING_PRODUCT_CONSTANTS', {
      DROPDOWN_LOOKUP_LISTS: [
         'Product Categories',
         'Unit Type List',
         'Products'
      ]
   }).constant('NON_CONFORMING_PRODUCT_LOOKUP_CONFIG', {
      MAIN: {
         [SP_FIELDS.COMMON.INITIATOR]: ["Id", "EMail", "Title"],
         [SP_FIELDS.COMMON.BUSINESS_AREA]: ["Id", "Title"],
         [SP_FIELDS.COMMON.DEPARTMENT_AREA]: ["Id", "Title"],
         [SP_FIELDS.COMMON.HAPPENED_BEFORE]: ["Id", "Title"],
         [SP_FIELDS.COMMON.INVESTIGATOR]: ["Id", "EMail"],
         [SP_FIELDS.PRODUCT.CATEGORY]: ["Id", "Title"],
         [SP_FIELDS.PRODUCT.NAME]: ["Id", "Title"],
         [SP_FIELDS.PRODUCT.UNIT_TYPE]: ["Id", "Title"]
      },
      EXTENSION: {
      }
   });
});