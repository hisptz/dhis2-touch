export const DATABASE_STRUCTURE = {
  organisationUnits: {
    columns: [
      {value: 'id', type: 'TEXT'},
      {value: 'name', type: 'TEXT'},
      {value: 'level', type: 'TEXT'},
      {value: 'path', type: 'TEXT'},
      {value: 'openingDate', type: 'TEXT'},
      {value: 'closedDate', type: 'TEXT'},
      {value: 'ancestors', type: 'LONGTEXT'},
      {value: 'parent', type: 'LONGTEXT'},
      {value: 'children', type: 'LONGTEXT'}
    ],
    isMetadata: true,
    resourceType: "communication",
    batchSize : 500,
    displayName : "Organisation Units",
    dependentTable : []
  },

  dataSets: {
    columns: [
      {value: 'id', type: 'TEXT'},
      {value: 'name', type: 'TEXT'},
      {value: 'timelyDays', type: 'TEXT'},
      {value: 'formType', type: 'TEXT'},
      {value: 'periodType', type: 'TEXT'},
      {value: 'openFuturePeriods', type: 'TEXT'},
      {value: 'expiryDays', type: 'TEXT'},
      {value: 'categoryCombo', type: 'LONGTEXT'}
    ],
    fields: "",
    isMetadata: true,
    resourceType: "entryForm",
    batchSize : 20,
    displayName : "Data Sets",
    dependentTable : ['dataSetElements','dataSetIndicators','dataSetSource','dataSetSections','dataSetOperands']
  },
  dataSetElements: {
    columns: [
      {value: 'id', type: 'TEXT'},
      {value: 'dataSetId', type: 'TEXT'},
      {value: 'sortOrder', type: 'TEXT'},
      {value: 'dataElementId', type: 'TEXT'}
    ],
    isMetadata: false,
    resourceType: "",
    batchSize : 500,
    displayName : "Data Set Elements",
    dependentTable : []
  },
  dataSetIndicators: {
    columns: [
      {value: 'id', type: 'TEXT'},
      {value: 'dataSetId', type: 'TEXT'},
      {value: 'indicatorId', type: 'TEXT'}
    ],
    isMetadata: false,
    resourceType: "",
    batchSize : 500,
    displayName : "Data Set Indicators",
    dependentTable : []
  },
  dataSetSource: {
    columns: [
      {value: 'id', type: 'TEXT'},
      {value: 'dataSetId', type: 'TEXT'},
      {value: 'organisationUnitId', type: 'TEXT'}
    ],
    isMetadata: false,
    resourceType: "",
    batchSize : 500,
    displayName : "Data Set Source",
    dependentTable : []
  },
  dataSetSections: {
    columns: [
      {value: 'id', type: 'TEXT'},
      {value: 'dataSetId', type: 'TEXT'},
      {value: 'sectionId', type: 'TEXT'}
    ],
    isMetadata: false,
    resourceType: "",
    batchSize : 500,
    displayName : "Data Set Sections",
    dependentTable : []
  },
  dataSetOperands: {
    columns: [
      {value: 'id', type: 'TEXT'},
      {value: 'dataSetId', type: 'TEXT'},
      {value: 'name', type: 'TEXT'},
      {value: 'dimensionItemType', type: 'TEXT'},
      {value: 'dimensionItem', type: 'TEXT'}
    ],
    isMetadata: false,
    resourceType: "",
    batchSize : 500,
    displayName : "Data Set Operands",
    dependentTable : []
  },
  sections: {
    columns: [
      {value: 'id', type: 'TEXT'},
      {value: 'sortOrder', type: 'TEXT'},
      {value: 'name', type: 'TEXT'}
    ],
    fields: "",
    isMetadata: true,
    resourceType: "entryForm",
    batchSize : 500,
    displayName : "Sections",
    dependentTable : ['sectionDataElements','sectionIndicators']
  },
  sectionDataElements: {
    columns: [
      {value: 'id', type: 'TEXT'},
      {value: 'sectionId', type: 'TEXT'},
      {value: 'sortOrder', type: 'TEXT'},
      {value: 'dataElementId', type: 'TEXT'}
    ],
    isMetadata: false,
    resourceType: "",
    batchSize : 500,
    displayName : "Section data Elements",
    dependentTable : []
  },
  sectionIndicators: {
    columns: [
      {value: 'id', type: 'TEXT'},
      {value: 'sectionId', type: 'TEXT'},
      {value: 'indicatorId', type: 'TEXT'}
    ],
    isMetadata: false,
    resourceType: "",
    batchSize : 500,
    displayName : "Section Indicators",
    dependentTable : []
  },
  dataElements: {
    columns: [
      {value: 'id', type: 'TEXT'},
      {value: 'name', type: 'TEXT'},
      {value: 'displayName', type: 'TEXT'},
      {value: 'formName', type: 'TEXT'},
      {value: 'valueType', type: 'TEXT'},
      {value: 'description', type: 'LONGTEXT'},
      {value: 'attributeValues', type: 'LONGTEXT'},
      {value: 'optionSet', type: 'LONGTEXT'},
      {value: 'categoryCombo', type: 'LONGTEXT'}
    ],
    isMetadata: true,
    resourceType: "entryForm",
    batchSize : 30,
    displayName : "Data Elements",
    dependentTable : []
  },
  smsCommand: {
    columns: [
      {value: 'id', type: 'TEXT'},
      {value: 'commandName', type: 'TEXT'},
      {value: 'parserType', type: 'TEXT'},
      {value: 'separator', type: 'TEXT'},
      {value: 'smsCode', type: 'LONGTEXT'},
    ],
    isMetadata: true,
    resourceType: "entryForm",
    batchSize : 30,
    displayName : "Sms Command",
    dependentTable : []
  },
  indicators: {
    columns: [
      {value: 'id', type: 'TEXT'},
      {value: 'name', type: 'TEXT'},
      {value: 'denominatorDescription', type: 'TEXT'},
      {value: 'numeratorDescription', type: 'TEXT'},
      {value: 'numerator', type: 'TEXT'},
      {value: 'denominator', type: 'TEXT'},
      {value: 'indicatorType', type: 'LONGTEXT'}
    ],
    isMetadata: true,
    displayName : "Indicators",
    batchSize : 500,
    resourceType: "report",
    dependentTable : []
  },
  reports: {
    columns: [
      {value: 'id', type: 'TEXT'},
      {value: 'name', type: 'TEXT'},
      {value: 'created', type: 'TEXT'},
      {value: 'type', type: 'TEXT'},
      {value: 'relativePeriods', type: 'LONGTEXT'},
      {value: 'reportParams', type: 'LONGTEXT'},
    ],
    isMetadata: true,
    batchSize : 50,
    resourceType: "report",
    displayName : "Reports",
    dependentTable : []
  },
  reportDesign: {
    columns: [
      {value: 'id', type: 'TEXT'},
      {value: 'designContent', type: 'LONGTEXT'}
    ],
    isMetadata: false,
    resourceType: "",
    batchSize : 10,
    displayName : "Report Design",
    dependentTable : []
  },
  constants: {
    columns: [
      {value: 'id', type: 'TEXT'},
      {value: 'name', type: 'TEXT'},
      {value: 'value', type: 'TEXT'}
    ],
    isMetadata: true,
    batchSize : 500,
    resourceType: "report",
    displayName : "Constants",
    dependentTable : []
  },

  dataValues: {
    columns: [
      {value: 'id', type: 'TEXT'},
      {value: 'de', type: 'TEXT'},
      {value: 'co', type: 'TEXT'},
      {value: 'pe', type: 'TEXT'},
      {value: 'ou', type: 'TEXT'},
      {value: 'cc', type: 'TEXT'},
      {value: 'cp', type: 'TEXT'},
      {value: 'value', type: 'TEXT'},
      {value: 'period', type: 'TEXT'},
      {value: 'orgUnit', type: 'TEXT'},
      {value: 'syncStatus', type: 'TEXT'},
      {value: 'dataSetId', type: 'TEXT'}
    ],
    isMetadata: false,
    resourceType: "",
    batchSize : 500,
    displayName : "Data Values",
    dependentTable : []
  },

  events: {
    columns: [
      {value: 'id', type: 'TEXT'},
      {value: 'event', type: 'TEXT'},
      {value: 'program', type: 'TEXT'},
      {value: 'programName', type: 'TEXT'},
      {value: 'programStage', type: 'TEXT'},
      {value: 'orgUnit', type: 'TEXT'},
      {value: 'orgUnitName', type: 'TEXT'},
      {value: 'status', type: 'TEXT'},
      {value: 'eventDate', type: 'TEXT'},
      {value: 'completedDate', type: 'TEXT'},
      {value: 'attributeCategoryOptions', type: 'TEXT'},
      {value: 'dataValues', type: 'LONGTEXT'},
      {value: 'notes', type: 'TEXT'},
      {value: 'syncStatus', type: 'TEXT'}
    ],
    isMetadata: false,
    resourceType: "event",
    batchSize : 50,
    displayName : "Events",
    dependentTable : []
  },

  programs: {
    columns: [
      {value: 'id', type: 'TEXT'},
      {value: 'name', type: 'TEXT'},
      {value: 'withoutRegistration', type: 'TEXT'},
      {value: 'programType', type: 'TEXT'},
      {value: 'categoryCombo', type: 'LONGTEXT'},
      {value: 'programStages', type: 'LONGTEXT'},
      {value: 'programStageSections', type: 'LONGTEXT'},
      {value: 'programIndicators', type: 'LONGTEXT'},
      {value: 'translations', type: 'LONGTEXT'},
      {value: 'attributeValues', type: 'LONGTEXT'},
      {value: 'validationCriterias', type: 'LONGTEXT'},
      {value: 'programRuleVariables', type: 'LONGTEXT'},
      {value: 'programTrackedEntityAttributes', type: 'LONGTEXT'},
      {value: 'programRules', type: 'LONGTEXT'},
      {value: 'organisationUnits', type: 'LONGTEXT'}
    ],
    isMetadata: true,
    resourceType: "event",
    batchSize : 50,
    displayName : "Programs",
    dependentTable : []
  },

  programStageDataElements: {
    columns: [
      {value: 'id', type: 'TEXT'},
      {value: 'displayInReports', type: 'TEXT'},
      {value: 'compulsory', type: 'TEXT'},
      {value: 'allowProvidedElsewhere', type: 'TEXT'},
      {value: 'allowFutureDate', type: 'TEXT'},
      {value: 'dataElement', type: 'LONGTEXT'}
    ],
    isMetadata: false,
    resourceType: "",
    batchSize : 50,
    displayName : "Program Stage Data Elements",
    dependentTable : []
  },
  programStageSections: {
    columns: [
      {value: 'id', type: 'TEXT'},
      {value: 'name', type: 'TEXT'},
      {value: 'sortOrder', type: 'TEXT'},
      {value: 'programIndicators', type: 'LONGTEXT'},
      {value: 'programStageDataElements', type: 'LONGTEXT'}
    ],
    isMetadata: true,
    batchSize : 100,
    resourceType: "event",
    displayName : "Program Stage Sections",
    dependentTable : []
  }

};
