

function ViewEnvironmental() {
   SPListOperations.populateScopeList("ShiftList");
   SPListOperations.populateScopeList("WhoWasEffectedList");
   SPListOperations.populateScopeList("Incident Classifications");
   SPListOperations.populateScopeList("ManMadeCauses");
   SPListOperations.populateScopeList("NaturalCauses");
   SPListOperations.populateScopeList("PermitConditions");
   SPListOperations.populateScopeList("PublicComplaint");
   SPListOperations.populateScopeList("NonConformance");
   SPListOperations.populateScopeList("ExcessiveResourceUse");
   SPListOperations.populateScopeList("WasteGeneration");
   SPListOperations.populateScopeList("EnvironmentSpillage");
   SPListOperations.populateScopeList("EnvironmentalImpact");

   SPListOperations.populateScopeList("PollutionDuration");
   SPListOperations.populateScopeList("ScopeOfPollution");

   SPListOperations.populateScopeList("Incident Subclassifications");
   $(function () {
      $("#datepicker").datepicker({ dateFormat: 'dd/mm/yy' });
   });
}

function createEnvironmental() {
   //var createContext = SP.ClientContext.get_current();
   //var hostUrl = website.get_url();
   //var hostContext = new SP.AppContextSite(createContext, hostUrl);
   //var createWeb = hostContext.get_web();

   var Investigator = getUserInfo();
   var $scope = angular.element(myCtrl).scope();

   var Title = $scope.listTitle;
   var BusinessAreaID = $scope.selBusinessArea.id;
   var DebtAreaOfProbelemID = $scope.selProbDebtArea.id;

   var $scopeEnvironment = angular.element(ViewEnvironment).scope();
   var ExactLocation = $scopeEnvironment.ExactLocation;
   var IncidentDate = $("#datepicker").datepicker("getDate");

   var ShiftID;
   if ($scope.IsDraft == false) {
      ShiftID = $scopeEnvironment.selShift.id;
   } else if ($scopeEnvironment.selShift != null) {
      ShiftID = $scopeEnvironment.selShift.id;
   }

   var selectedPermitConditions = $scopeEnvironment.ShowSelectedPermitConditions();
   var selectedPublicComplaints = $scopeEnvironment.ShowSelectedPublicComplaints();
   var selectedNonComformances = $scopeEnvironment.ShowSelectedNonConformances();
   var selectedExcessiveResourceUses = $scopeEnvironment.ShowSelectedExcessiveResourceUses();
   var selectedWasteGeneration = $scopeEnvironment.ShowSelectedWasteGeneration();
   var selectedEnvironmantalSpillage = $scopeEnvironment.ShowSelectedEnvironmentalSpillage();


   //var ShiftID = $scopeEnvironment.selShift.id;
   var InitialActionTaken = tinyMCE.get('InitialActionTakenTextArea').getContent({ format: 'raw' });
   var ReportedBy = $scopeEnvironment.ReportedBy;

   var WhoWasAffectedID;
   if ($scope.IsDraft == false) {
      WhoWasAffectedID = $scopeEnvironment.affectee.id;
   } else if ($scopeEnvironment.affectee != null) {
      WhoWasAffectedID = $scopeEnvironment.affectee.id;
   }
   //var WhoWasAffectedID = $scopeEnvironment.affectee.id;
   var HowDidItHappen = tinyMCE.get('HowDidItHappenTextArea').getContent({ format: 'raw' });
   var SupportingEvidence = tinyMCE.get('SupportingEvidenceTextArea').getContent({ format: 'raw' });
   var incidentClassificationID;
   if ($scope.IsDraft == false) {
      incidentClassificationID = $scopeEnvironment.selIncidentClassification.id;
   } else if ($scopeEnvironment.selIncidentClassification != null) {
      incidentClassificationID = $scopeEnvironment.selIncidentClassification.id;
   }
   //var incidentClassificationID = $scopeEnvironment.selIncidentClassification.id;

   var incidentSubClassificationID;
   if ($scope.IsDraft == false) {
      incidentSubClassificationID = $scopeEnvironment.selIncidentSubClassification.id;
   } else if ($scopeEnvironment.selIncidentSubClassification != null) {
      incidentSubClassificationID = $scopeEnvironment.selIncidentSubClassification.id;
   }
   //var incidentSubClassificationID = $scopeEnvironment.selIncidentSubClassification.id;
   var ManMadeCauseID;
   if ($scope.IsDraft == false) {
      ManMadeCauseID = $scopeEnvironment.ManMadeCause.id;
   } else if ($scopeEnvironment.ManMadeCause != null) {
      ManMadeCauseID = $scopeEnvironment.ManMadeCause.id;
   }
   //var ManMadeCauseID = $scopeEnvironment.ManMadeCause.id;

   var NaturalCauseID;
   if ($scope.IsDraft == false) {
      NaturalCauseID = $scopeEnvironment.NaturalCause.id;
   } else if ($scopeEnvironment.NaturalCause != null) {
      NaturalCauseID = $scopeEnvironment.NaturalCause.id;
   }
   //var NaturalCauseID = $scopeEnvironment.NaturalCause.id;


   var HasThisHappenedBeforeID;
   if ($scope.IsDraft == false) {
      HasThisHappenedBeforeID = $scopeEnvironment.selHasThisHappenedBefore.id;
   } else if ($scopeEnvironment.selHasThisHappenedBefore != null) {
      HasThisHappenedBeforeID = $scopeEnvironment.selHasThisHappenedBefore.id;
   }
   //var HasThisHappenedBeforeID = $scope.selHasThisHappenedBefore.id;
   var Description = tinyMCE.get('DescriptionTextArea').getContent({ format: 'raw' });
   var AssignedTo;
   var taskStat = "New";

   if ($scope.IsDraft == false) {
      var Investigator = getUserInfo();
      AssignedTo = Investigator['Key'];

   } else {
      taskStat = "Draft";
   }


   var itemProperties = {
      "TaskStat": taskStat,
      "ARReason": "Environmental",
      "ARStatus": "In Progress",
      "Title": Title,
      "ExactLocation": ExactLocation,
      "IncidentDate": IncidentDate,
      "InitialActionTaken": InitialActionTaken,
      "ReportedBy": ReportedBy,
      "Howdidithappen": HowDidItHappen,
      "Supportingevidence": SupportingEvidence,
      "IMKpiDescription": Description,
      "AreaId": BusinessAreaID,
      "DepartmentAreaofProblemId": DebtAreaOfProbelemID,
      "WhowaseffectedId": WhoWasAffectedID,
      "SubClassificationofIncidentId": incidentSubClassificationID,
      "ManMadeCauseId": ManMadeCauseID,
      "NaturalCauseId": NaturalCauseID,
      "NewShiftId": ShiftID,
      "hasThisHappenedBeforeId": HasThisHappenedBeforeID,
      "ClassificationofIncidentId": incidentClassificationID,
      //"AssignedToId": user.d.Id,
      "InitiatorId": SPuser.get_id(),
      "IsDraft": $scope.IsDraft,
      "PermitConditionId": { "results": selectedPermitConditions },
      "PublicComplaintId": { "results": selectedPublicComplaints },
      "NonComformanceId": { "results": selectedNonComformances },
      "ExcessiveResourceUseId": { "results": selectedExcessiveResourceUses },
      "WasteGenerationId": { "results": selectedWasteGeneration },
      "EnvironmentalSpillageId": { "results": selectedEnvironmantalSpillage }
   };

   if ($scope.IsDraft == true) {
      addListItem(appWebUrl, 'Incidents', itemProperties);
   }

   var getRevisor = GetUserId(AssignedTo);
   getRevisor.done(function (user) {
      //user.d.Id <-- This is your precious data
      itemProperties.AssignedToId = user.d.Id;
      addListItem(appWebUrl, 'Incidents', itemProperties
      );
   });

}

function updateEnvironmental() {
   //var createContext = SP.ClientContext.get_current();
   //var hostUrl = website.get_url();
   //var hostContext = new SP.AppContextSite(createContext, hostUrl);
   //var createWeb = hostContext.get_web();

   var Investigator = getUserInfo();
   var $scope = angular.element(myCtrl).scope();

   //var Title = $scope.listTitle;
   //var BusinessAreaID = $scope.selBusinessArea.id;
   //var DebtAreaOfProbelemID = $scope.selProbDebtArea.id;

   var $scopeEnvironment = angular.element(ViewEnvironment).scope();
   var ExactLocation = $scopeEnvironment.ExactLocation;
   var IncidentDate = $("#datepicker").datepicker("getDate");
   var itemId = $scope.itemID;
   var ShiftID;
   if ($scope.IsDraft == false) {
      ShiftID = $scopeEnvironment.selShift.id;
   } else if ($scopeEnvironment.selShift != null) {
      ShiftID = $scopeEnvironment.selShift.id;
   }


   //var ShiftID = $scopeEnvironment.selShift.id;
   var InitialActionTaken = tinyMCE.get('InitialActionTakenTextArea').getContent({ format: 'raw' });
   var ReportedBy = $scopeEnvironment.ReportedBy;

   var WhoWasAffectedID;
   if ($scope.IsDraft == false) {
      WhoWasAffectedID = $scopeEnvironment.affectee.id;
   } else if ($scopeEnvironment.affectee != null) {
      WhoWasAffectedID = $scopeEnvironment.affectee.id;
   }
   //var WhoWasAffectedID = $scopeEnvironment.affectee.id;
   var HowDidItHappen = tinyMCE.get('HowDidItHappenTextArea').getContent({ format: 'raw' });
   var SupportingEvidence = tinyMCE.get('SupportingEvidenceTextArea').getContent({ format: 'raw' });
   var incidentClassificationID;
   if ($scope.IsDraft == false) {
      incidentClassificationID = $scopeEnvironment.selIncidentClassification.id;
   } else if ($scopeEnvironment.selIncidentClassification != null) {
      incidentClassificationID = $scopeEnvironment.selIncidentClassification.id;
   }
   //var incidentClassificationID = $scopeEnvironment.selIncidentClassification.id;

   var selectedPermitConditions = $scopeEnvironment.ShowSelectedPermitConditions();
   var selectedPublicComplaints = $scopeEnvironment.ShowSelectedPublicComplaints();
   var selectedNonComformances = $scopeEnvironment.ShowSelectedNonConformances();
   var selectedExcessiveResourceUses = $scopeEnvironment.ShowSelectedExcessiveResourceUses();
   var selectedWasteGeneration = $scopeEnvironment.ShowSelectedWasteGeneration();
   var selectedEnvironmantalSpillage = $scopeEnvironment.ShowSelectedEnvironmentalSpillage();

   var incidentSubClassificationID;
   if ($scope.IsDraft == false) {
      incidentSubClassificationID = $scopeEnvironment.selIncidentSubClassification.id;
   } else if ($scopeEnvironment.selIncidentSubClassification != null) {
      incidentSubClassificationID = $scopeEnvironment.selIncidentSubClassification.id;
   }
   //var incidentSubClassificationID = $scopeEnvironment.selIncidentSubClassification.id;
   var ManMadeCauseID;
   if ($scope.IsDraft == false) {
      ManMadeCauseID = $scopeEnvironment.ManMadeCause.id;
   } else if ($scopeEnvironment.ManMadeCause != null) {
      ManMadeCauseID = $scopeEnvironment.ManMadeCause.id;
   }
   //var ManMadeCauseID = $scopeEnvironment.ManMadeCause.id;

   var NaturalCauseID;
   if ($scope.IsDraft == false) {
      NaturalCauseID = $scopeEnvironment.NaturalCause.id;
   } else if ($scopeEnvironment.NaturalCause != null) {
      NaturalCauseID = $scopeEnvironment.NaturalCause.id;
   }
   //var NaturalCauseID = $scopeEnvironment.NaturalCause.id;


   //var HasThisHappenedBeforeID = $scope.selHasThisHappenedBefore.id;
   //var Description = tinyMCE.get('DescriptionTextArea').getContent({format : 'raw'});
   var AssignedTo;
   var taskStat = "New";

   if ($scope.IsDraft == false) {
      var Investigator = getUserInfo();
      AssignedTo = Investigator['Key'];

   } else {
      taskStat = "Draft";
   }


   var itemProperties = {
      "TaskStat": taskStat,
      "ARReason": "Environmental",
      "ARStatus": "In Progress",
      "ExactLocation": ExactLocation,
      "IncidentDate": IncidentDate,
      "InitialActionTaken": InitialActionTaken,
      "ReportedBy": ReportedBy,
      "Howdidithappen": HowDidItHappen,
      "Supportingevidence": SupportingEvidence,
      //"IMKpiDescription": Description,
      //"AreaId": BusinessAreaID,
      //"DepartmentAreaofProblemId": DebtAreaOfProbelemID,
      "WhowaseffectedId": WhoWasAffectedID,
      "SubClassificationofIncidentId": incidentSubClassificationID,
      "ManMadeCauseId": ManMadeCauseID,
      "NaturalCauseId": NaturalCauseID,
      "NewShiftId": ShiftID,
      //"hasThisHappenedBeforeId": HasThisHappenedBeforeID,
      "ClassificationofIncidentId": incidentClassificationID,
      //"AssignedToId": user.d.Id,
      "InitiatorId": SPuser.get_id(),
      "IsDraft": $scope.IsDraft,
      "PermitConditionId": { "results": selectedPermitConditions },
      "PublicComplaintId": { "results": selectedPublicComplaints },
      "NonComformanceId": { "results": selectedNonComformances },
      "ExcessiveResourceUseId": { "results": selectedExcessiveResourceUses },
      "WasteGenerationId": { "results": selectedWasteGeneration },
      "EnvironmentalSpillageId": { "results": selectedEnvironmantalSpillage }
   };

   if ($scope.IsDraft == true) {
      updateListItem(appWebUrl, 'Incidents', itemId, itemProperties, null);
   }

   var getRevisor = GetUserId(AssignedTo);
   getRevisor.done(function (user) {
      //user.d.Id <-- This is your precious data
      itemProperties.AssignedToId = user.d.Id;

      var mailProperties =
      {
         "d":
         {
            "AssignedToId": user.d.Id,
            "ARReason": "Environmental",
            "ID": itemId
         }
      }
      updateListItem(appWebUrl, 'Incidents', itemId, itemProperties, mailProperties);

   });

}