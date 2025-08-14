define(['app'], function (app) {
   'use strict';

   return app.constant('CUSTOMER_COMPLAINT_CONSTANTS', {
      DROPDOWN_LOOKUP_LISTS: [
         'Customers',
         'ComplaintType',
         'Product Categories',
         'Province List',
         'Store Outlet Retailer List',
         'Source of Complaint',
         'Unit Type List',
         'Service Categories',
         'Products'
      ],
      CUSTOMER_COMPLAINT_CATEGORY_FIELD: 'CustomerComplaintCategory'
   }).constant('CUSTOMER_COMPLAINT_LOOKUP_CONFIG', {
      MAIN: {
         [SP_FIELDS.COMMON.INITIATOR]: ["Id", "EMail", "Title"],
         [SP_FIELDS.COMMON.BUSINESS_AREA]: ["Id", "Title"],
         [SP_FIELDS.COMMON.DEPARTMENT_AREA]: ["Id", "Title"],
         [SP_FIELDS.COMMON.HAPPENED_BEFORE]: ["Id", "Title"],
         [SP_FIELDS.COMMON.INVESTIGATOR]: ["Id", "EMail"],
         [SP_FIELDS.CUSTOMER.NAME]: ["Id", "Title"],
         [SP_FIELDS.CUSTOMER.PROVINCE]: ["Id", "Title"],
         [SP_FIELDS.CUSTOMER.STORE_OUTLET]: ["Id", "Title"],
         [SP_FIELDS.CUSTOMER.SOURCE_OF_COMPLAINT]: ["Id", "Title"]
      },
      EXTENSION: {
         [SP_FIELDS.PRODUCT.CATEGORY]: ["Id", "Title"],
         [SP_FIELDS.PRODUCT.NAME]: ["Id", "Title"],
         [SP_FIELDS.PRODUCT.UNIT_TYPE]: ["Id", "Title"],
         [SP_FIELDS.COMPLAINT.TYPE]: ["Id", "Title"],
         [SP_FIELDS.COMPLAINT.CLASSIFICATION]: ["Id", "Title"],
         [SP_FIELDS.COMPLAINT.BUSINESS_MANAGERS]: ["Id", "EMail", "Title"],
         [SP_FIELDS.COMPLAINT.REPRESENTATIVES]: ["Id", "Title"]
      }
   });
});