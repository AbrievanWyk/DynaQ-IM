define(['app'], function (app) {
   'use strict';

   return app.factory('NonConformingProductMapper', function () {
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

               // Product Fields
               ProductCategoryId: mainData.ProductCategory?.Id || null,
               ProductNameId: mainData.ProductName?.Id || null,
               UnitQuantity: mainData.UnitQuantity || null,
               UnitTypeId: mainData.UnitType?.Id || null,
               ProductionDate: mainData.ProductionDate,
               BestBeforeDate: mainData.BestBeforeDate,
               BatchNumberFiled: mainData.BatchNumberFiled || null,
               ProductSupplier: mainData.ProductSupplier || null,

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