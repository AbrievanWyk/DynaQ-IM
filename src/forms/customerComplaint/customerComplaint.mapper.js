define(['app'], function (app) {
   'use strict';

   return app.factory('CustomerComplaintMapper', function () {
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
         mapFormData: function (mainData, extensionData) {
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

               // Customer Fields
               CustomerNameId: mainData.CustomerName?.Id || null,
               CustomerComplaintCategory: mainData.CustomerComplaintCategory || null,
               CustomerLocation: mainData.CustomerLocation || null,
               ProvinceId: mainData.Province?.Id || null,
               StoreOutletRetailerId: mainData.StoreOutletRetailer?.Id || null,
               SourceofComplaintId: mainData.SourceofComplaint?.Id || null,
               CustomerContactPerson: mainData.CustomerContactPerson || null,
               CustomerContactTelephone: mainData.CustomerContactTelephone || null,
               CustomerContactEmail: mainData.CustomerContactEmail || null,

               // Complaint Fields
               IsCustomerClaim: extensionData.IsCustomerClaim || false,
               CustomerClaimDetail: extensionData.CustomerClaimDetail || null,
               ComplaintTypeId: extensionData.ComplaintType?.Id || null,
               CustomerComplaintServiceId: extensionData.CustomerComplaintService?.Id || null,
               ExistingARReference: extensionData.ExistingARReference || null,
               CustomerProblemDate: extensionData.CustomerProblemDate,

               // Product Fields
               ProductCategoryId: extensionData.ProductCategory?.Id || null,
               ProductNameId: extensionData.ProductName?.Id || null,
               UnitQuantity: extensionData.UnitQuantity || null,
               UnitTypeId: extensionData.UnitType?.Id || null,
               ProductionDate: extensionData.ProductionDate,
               BestBeforeDate: extensionData.BestBeforeDate,
               BatchNumberFiled: extensionData.BatchNumberFiled || null,

               // Assignment Fields
               CustomerRepresentativesId: {
                  results: Array.isArray(extensionData.CustomerRepresentatives?.results)
                     ? extensionData.CustomerRepresentatives.results.map(u => u.Id)
                     : []
               },
               BusinessManagersId: {
                  results: Array.isArray(extensionData.BusinessManagers?.results)
                     ? extensionData.BusinessManagers.results.map(u => u.Id)
                     : []
               },
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