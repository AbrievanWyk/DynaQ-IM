// formUtils.js
define(['app', 'jquery'], function (app, $) {
   'use strict';
   const formatDate = function (date, customFormat) {
      if (!date) return '';
      const format = customFormat || 'dd/mm/yy';
      return $.datepicker.formatDate(format, date);
   };
   return app.factory('FormUtils', function () {
      return {
         convertStringToDate: function (dateString) {
            const parts = dateString.split("/");
            const date = new Date(parts[2], parts[1] - 1, parts[0]);
            const gmtOffset = 2 * 60 * 60 * 1000;
            let resultDate = new Date(date.getTime() + gmtOffset);
            if (isNaN(resultDate.getTime())) return new Date(dateString);
            return resultDate;
         },
         formatDate: function (date, customFormat) {
            if (!date) return '';
            const format = customFormat || 'dd/mm/yy';
            return $.datepicker.formatDate(format, date);
         },
         formatISODateField(dateValue, includeTime) {
            if (!dateValue) return null;
            let dateObj;
            if (typeof dateValue === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(dateValue)) {
               dateObj = this.convertStringToDate(dateValue);
            } else {
               dateObj = new Date(dateValue);
            }
            if (isNaN(dateObj.getTime())) return null;
            if (includeTime) {
               // Format as dd/mm/yy HH:mm
               const pad = n => n < 10 ? '0' + n : n;
               const datePart = formatDate(dateObj);
               const timePart = pad(dateObj.getHours()) + ':' + pad(dateObj.getMinutes());
               return datePart + ' ' + timePart;
            }
            return formatDate(dateObj);
         },
         extractIdFromUrl: function (queryString) {
            if (!queryString) return null;
            const idIndex = queryString.search(/[?&]ID=/i);
            if (idIndex === -1) return null;
            const idParam = queryString.slice(idIndex);
            const valueStart = idParam.indexOf('=') + 1;
            const valueEnd = idParam.indexOf('&') > -1 ? idParam.indexOf('&') : idParam.length;
            return idParam.slice(valueStart, valueEnd);
         },
         redirectToURL() {
            let params = location.search;
            let pos = params.search("Source");
            let sourceParam = params.slice(pos);
            let secondPos = sourceParam.indexOf('&');
            if (secondPos < 0) secondPos = sourceParam.length;
            sourceParam = sourceParam.slice(sourceParam.indexOf("=") + 1, secondPos);
            let gotoURL = decodeURIComponent(sourceParam);
            window.location = gotoURL;
         }
      };
   });
});
