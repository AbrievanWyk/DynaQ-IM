'use strict';

const FormUtils = (function () {
   return {
      convertStringToDate: function (dateString) {
         const parts = dateString.split("/");
         const date = new Date(parts[2], parts[1] - 1, parts[0]);
         // Adjust for GMT+2 (in milliseconds)
         const gmtOffset = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
         const adjustedDate = new Date(date.getTime() + gmtOffset);

         return adjustedDate;
      },
      formatDate: function (date, customFormat) {
         if (!date) return '';
         let format = customFormat ? customFormat : 'dd/mm/yy';
         return $.datepicker.formatDate(format, date);
      },
      extractIdFromUrl: function (queryString) {
         // Handle cases where queryString might be undefined or null
         if (!queryString) return null;

         // Find the ID parameter
         const idIndex = queryString.search(/[?&]ID=/i);
         if (idIndex === -1) return null;

         // Extract everything after "ID="
         const idParam = queryString.slice(idIndex);

         // Find the value boundaries
         const valueStart = idParam.indexOf('=') + 1;
         const valueEnd = idParam.indexOf('&') > -1 ? idParam.indexOf('&') : idParam.length;

         // Extract and return the value
         return idParam.slice(valueStart, valueEnd);
      }
   };
})();

// Export for use in other modules
window.FormUtils = FormUtils; 