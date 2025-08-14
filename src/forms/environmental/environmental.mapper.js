define(['app'], function (app) {
   'use strict';

   return app.factory('EnvironmentalMapper', function () {
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
               ExactLocation: extensionData.ExactLocation,
               IncidentDate: extensionData.IncidentDate,
               NewShiftId: extensionData.NewShift?.Id || null,
               InitialActionTaken: extensionData.InitialActionTaken,
               ReportedBy: extensionData.ReportedBy,
               WhowaseffectedId: extensionData.Whowaseffected?.Id || null,
               Howdidithappen: extensionData.Howdidithappen,
               Supportingevidence: extensionData.Supportingevidence,

               AssignedToId: mainData.AssignedTo?.Id || null,
               
               PermitConditionId: {
                  results: Array.isArray(extensionData.PermitCondition?.results)
                     ? extensionData.PermitCondition.results.map(u => u.Id)
                     : []
               },
               PublicComplaintId: {
                  results: Array.isArray(extensionData.PublicComplaint?.results)
                     ? extensionData.PublicComplaint.results.map(u => u.Id)
                     : []
               },
               NonComformanceId: {
                  results: Array.isArray(extensionData.NonComformance?.results)
                     ? extensionData.NonComformance.results.map(u => u.Id)
                     : []
               },
               ExcessiveResourceUseId: {
                  results: Array.isArray(extensionData.ExcessiveResourceUse?.results)
                     ? extensionData.ExcessiveResourceUse.results.map(u => u.Id)
                     : []
               },
               WasteGenerationId: {
                  results: Array.isArray(extensionData.WasteGeneration?.results)
                     ? extensionData.WasteGeneration.results.map(u => u.Id)
                     : []
               },
               EnvironmentalSpillageId: {
                  results: Array.isArray(extensionData.EnvironmentalSpillage?.results)
                     ? extensionData.EnvironmentalSpillage.results.map(u => u.Id)
                     : []
               },
               ClassificationofIncidentId: extensionData.ClassificationofIncident?.Id || null,
               SubClassificationofIncidentId: extensionData.SubClassificationofIncident?.Id || null,
               ManMadeCauseId: extensionData.ManMadeCause?.Id || null,
               NaturalCauseId: extensionData.NaturalCause?.Id || null,
               
               // Investigation stage specific
               QuantityOfPollutant: extensionData.QuantityOfPollutant,
               DurationOfPollutionId: extensionData.DurationOfPollution?.Id || null,
               ScopeOfPollutionId: extensionData.ScopeOfPollution?.Id || null,
               EnvironmentalImpactId: {
                  results: Array.isArray(extensionData.EnvironmentalImpact?.results)
                     ? extensionData.EnvironmentalImpact.results.map(u => u.Id)
                     : []
               },
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