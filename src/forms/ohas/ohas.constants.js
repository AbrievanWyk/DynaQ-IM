define(['app'], function (app) {
   'use strict';

   return app.constant('OHAS_CONSTANTS', {
      DROPDOWN_LOOKUP_LISTS: [
         "ShiftList",
         "Drug Test",
         "BodyPartList",
         "OccupationalStressorList",
         "WhoWasEffectedList",
         "ManMadeCauses",
         "EffectonPersonList",
         "ResultofIncidentList",
         "NaturalCauses",
         "PrimaryIncidentType",
         "Incident Classifications",
         'Incident Subclassifications',
         "ImmediateCauses",
         "NatureOfInjury",
         "SourceOfInjury"
      ]
   }).constant('OHAS_LOOKUP_CONFIG', {
      MAIN: {
         [SP_FIELDS.COMMON.INITIATOR]: ["Id", "EMail", "Title"],
         [SP_FIELDS.COMMON.BUSINESS_AREA]: ["Id", "Title"],
         [SP_FIELDS.COMMON.DEPARTMENT_AREA]: ["Id", "Title"],
         [SP_FIELDS.COMMON.HAPPENED_BEFORE]: ["Id", "Title"],
         [SP_FIELDS.COMMON.INVESTIGATOR]: ["Id", "EMail", "Title"]
      },
      EXTENSION: {
         [SP_FIELDS.OHAS.NEW_SHIFT]: ["Id", "Title"],
         [SP_FIELDS.OHAS.DRUG_TEST]: ["Id", "Title"],
         [SP_FIELDS.OHAS.PART_OF_BODY_AFFECTED]: ["Id", "Title"],
         [SP_FIELDS.OHAS.OCCUPATIONAL_STRESSOR]: ["Id", "Title"],
         [SP_FIELDS.OHAS.WHO_WAS_EFFECTED]: ["Id", "Title"],
         [SP_FIELDS.OHAS.MAN_MADE_CAUSE]: ["Id", "Title"],
         [SP_FIELDS.OHAS.EFFECT_ON_PERSON]: ["Id", "Title"],
         [SP_FIELDS.OHAS.RESULT_OF_INCIDENT]: ["Id", "Title"],
         [SP_FIELDS.OHAS.NATURAL_CAUSE]: ["Id", "Title"],
         [SP_FIELDS.OHAS.PRIMARY_INCIDENT_TYPE]: ["Id", "Title"],


         [SP_FIELDS.OHAS.CLASSIFICATION_OF_INCIDENT]: ["Id", "Title"],
         [SP_FIELDS.OHAS.SUB_CLASSIFICATION_OF_INCIDENT]: ["Id", "Title"],
         [SP_FIELDS.OHAS.IMMEDIATE_CAUSE]: ["Id", "Title"],
         [SP_FIELDS.OHAS.NATURE_OF_INJURY]: ["Id", "Title"],
         [SP_FIELDS.OHAS.SOURCE_OF_INJURY]: ["Id", "Title"]
      }
   });
});