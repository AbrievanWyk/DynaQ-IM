define(['app'], function (app) {
   'use strict';

   return app.factory('InternalNonConformanceMapper', function () {
      // TODO: Most likely going to inject FormUtils here than duplicate the formatDate function
      const formatDate = function (date, customFormat) {
         if (!date) return '';
         let format = customFormat ? customFormat : 'dd/mm/yy';
         return $.datepicker.formatDate(format, date);
      }
      const formatISODateField = function (dateValue) {
         if (!dateValue) return null;
         const dateObj = new Date(dateValue);
         if (isNaN(dateObj)) return null;
         return formatDate(dateObj);
      }
      return {
         mapFormData: function (mainData) {
            let results = {
               // Common Fields  
               ID: mainData.ID,
               Title: mainData.Title,
               ARReason: mainData.ARReason,
               TaskStat: mainData.TaskStat,
               ARStatus: mainData.ARStatus,
               AreaId: mainData.Area?.Id || null,
               DepartmentAreaofProblemId: mainData.DepartmentAreaofProblem?.Id || null,
               hasThisHappenedBeforeId: mainData.hasThisHappenedBefore?.Id || null,
               IMKpiDescription: mainData.IMKpiDescription,
               // TODO: Just remember:
               // INVESTIGATOR: 'AssignedTo', -> At the bottom
               // IS_DRAFT: 'IsDraft', -> Not needed?
               // Created: formatISODateField(mainData.Created),
               // INITIATOR: 'Initiator', -> Not needed?

               AssignedToId: mainData.AssignedTo?.Id || null
            };
            if(!mainData.IsDraft) {
               results.Created = formatISODateField(mainData.Created);
               results.Initiator = mainData.Initiator || null;
            };
            return results;
         }
      };
   });
});