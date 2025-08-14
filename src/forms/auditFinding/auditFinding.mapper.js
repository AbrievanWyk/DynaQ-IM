define(['app'], function (app) {
   'use strict';

   return app.factory('AuditFindingMapper', function () {
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
               AssignedToId: mainData.AssignedTo?.Id || null,

               // Audit Finding Fields (from form and column-definitions)
               IMAuditCategoryId: mainData.IMAuditCategory?.Id || null,
               IMAuditAreaId: mainData.IMAuditArea?.Id || null,
               StandardofAuditAreaId: mainData.StandardofAuditArea?.Id || null,
               IMReferences: mainData.IMReferences || '',
               IMAuditPartyId: mainData.IMAuditParty?.Id || null,
               IMAuditFindingClassificationId: mainData.IMAuditFindingClassification?.Id || null,
               IMAuditFindingAreaId: mainData.IMAuditFindingArea?.Id || null
            };
            if(!mainData.IsDraft) {
               results.Created = formatISODateField(mainData.Created);
               results.Initiator = mainData.Initiator || null;
            }
            return results;
         }
      };
   });
});