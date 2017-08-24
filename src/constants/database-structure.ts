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
    batchSize : 500
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
    batchSize : 20
  },
  dataSetElement: {
    columns: [
      {value: 'id', type: 'TEXT'},
      {value: 'dataSetId', type: 'TEXT'},
      {value: 'dataElementId', type: 'TEXT'}
    ],
    isMetadata: false,
    resourceType: "",
    batchSize : 500
  },
  dataSetIndicators: {
    columns: [
      {value: 'id', type: 'TEXT'},
      {value: 'dataSetId', type: 'TEXT'},
      {value: 'indicatorId', type: 'TEXT'}
    ],
    isMetadata: false,
    resourceType: "",
    batchSize : 500
  },
  dataSetSource: {
    columns: [
      {value: 'id', type: 'TEXT'},
      {value: 'dataSetId', type: 'TEXT'},
      {value: 'organisationUnitId', type: 'TEXT'}
    ],
    isMetadata: false,
    resourceType: "",
    batchSize : 500
  },
  dataSetSections: {
    columns: [
      {value: 'id', type: 'TEXT'},
      {value: 'dataSetId', type: 'TEXT'},
      {value: 'sectionId', type: 'TEXT'}
    ],
    isMetadata: false,
    resourceType: "",
    batchSize : 500
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
    batchSize : 500
  },
  sections: {
    columns: [
      {value: 'id', type: 'TEXT'},
      {value: 'name', type: 'TEXT'}
    ],
    fields: "",
    isMetadata: true,
    resourceType: "entryForm",
    batchSize : 50
  },
  sectionDataElements: {
    columns: [
      {value: 'id', type: 'TEXT'},
      {value: 'sectionId', type: 'TEXT'},
      {value: 'dataElementId', type: 'TEXT'}
    ],
    isMetadata: false,
    resourceType: "",
    batchSize : 500
  },
  sectionIndicators: {
    columns: [
      {value: 'id', type: 'TEXT'},
      {value: 'sectionId', type: 'TEXT'},
      {value: 'indicatorId', type: 'TEXT'}
    ],
    isMetadata: false,
    resourceType: "",
    batchSize : 500
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
    batchSize : 30
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
    batchSize : 30
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
    batchSize : 500,
    resourceType: "report"
  }

};
