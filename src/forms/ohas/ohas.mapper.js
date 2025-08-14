define(['app'], function (app) {
   'use strict';

   return app.factory('OhasMapper', function () {
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

               // Ohas Fields
               ExactLocation: extensionData.ExactLocation,
               IncidentDate: extensionData.IncidentDate,
               NewShiftId: extensionData.NewShift?.Id || null,
               InitialActionTaken: extensionData.InitialActionTaken,
               ReportedBy: extensionData.ReportedBy,
               WhowaseffectedId: extensionData.Whowaseffected?.Id || null,
               Supportingevidence: extensionData.Supportingevidence,

               DrugTestId: extensionData.DrugTest?.Id || null,
               EffectonPersonId: extensionData.EffectonPerson?.Id || null,
               ResultofIncidentId: extensionData.ResultofIncident?.Id || null,
               PrimaryIncidentTypeId: extensionData.PrimaryIncidentType?.Id || null,


               DrugReason: extensionData.DrugReason,
               DrugResults: extensionData.DrugResults,
               EmployeeName: extensionData.EmployeeName,
               Age: extensionData.Age,
               IMDepartment: extensionData.IMDepartment,
               RegularOccupation: extensionData.RegularOccupation,
               PeriodPresentJob: extensionData.PeriodPresentJob,
               YearsCompanyService: extensionData.YearsCompanyService,
               NameofSupervisor: extensionData.NameofSupervisor,
               DepartmentManager: extensionData.DepartmentManager,
               ImmediateCauseOther: extensionData.ImmediateCauseOther,
               NatureOfInjuryOther: extensionData.NatureOfInjuryOther,
               SourceOfInjuryOther: extensionData.SourceOfInjuryOther,
               BodyPartsAdditionalInformation: extensionData.BodyPartsAdditionalInformation,


               AssignedToId: mainData.AssignedTo?.Id || null,
               
               PartofBodyAffectedId: {
                  results: Array.isArray(extensionData.PartofBodyAffected?.results)
                     ? extensionData.PartofBodyAffected.results.map(u => u.Id)
                     : []
               },
               OccupationalStressorId: {
                  results: Array.isArray(extensionData.OccupationalStressor?.results)
                     ? extensionData.OccupationalStressor.results.map(u => u.Id)
                     : []
               },
               ImmediateCauseId: {
                  results: Array.isArray(extensionData.ImmediateCause?.results)
                     ? extensionData.ImmediateCause.results.map(u => u.Id)
                     : []
               },
               NatureOfInjuryId: {
                  results: Array.isArray(extensionData.NatureOfInjury?.results)
                     ? extensionData.NatureOfInjury.results.map(u => u.Id)
                     : []
               },
               SourceOfInjuryId: {
                  results: Array.isArray(extensionData.SourceOfInjury?.results)
                     ? extensionData.SourceOfInjury.results.map(u => u.Id)
                     : []
               },



               ClassificationofIncidentId: extensionData.ClassificationofIncident?.Id || null,
               SubClassificationofIncidentId: extensionData.SubClassificationofIncident?.Id || null,
               ManMadeCauseId: extensionData.ManMadeCause?.Id || null,
               NaturalCauseId: extensionData.NaturalCause?.Id || null
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