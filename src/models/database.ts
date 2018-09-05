/*
 *
 * Copyright 2015 HISP Tanzania
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301, USA.
 *
 * @since 2015
 * @author Joseph Chingalo <profschingalo@gmail.com>
 *
 */
export const DATABASE_STRUCTURE = {
  organisationUnits: {
    columns: [
      { value: 'id', type: 'TEXT' },
      { value: 'name', type: 'TEXT' },
      { value: 'level', type: 'TEXT' },
      { value: 'path', type: 'TEXT' },
      { value: 'openingDate', type: 'TEXT' },
      { value: 'closedDate', type: 'TEXT' },
      { value: 'ancestors', type: 'LONGTEXT' },
      { value: 'parent', type: 'LONGTEXT' },
      { value: 'children', type: 'LONGTEXT' }
    ],
    isMetadata: true,
    shouldIncludeOnLogin: true,
    resourceType: 'communication',
    batchSize: 500,
    displayName: 'Organisation Units',
    dependentTable: []
  },
  LOCAL_INSTANCE_KEY: {
    columns: [
      { value: 'id', type: 'TEXT' },
      { value: 'name', type: 'TEXT' },
      { value: 'currentLanguage', type: 'TEXT' },
      { value: 'currentUser', type: 'LONGTEXT' }
    ],
    isMetadata: false,
    shouldIncludeOnLogin: false,
    resourceType: '',
    batchSize: 500,
    displayName: 'Local instance',
    dependentTable: []
  },
  dataSets: {
    columns: [
      { value: 'id', type: 'TEXT' },
      { value: 'name', type: 'TEXT' },
      { value: 'timelyDays', type: 'TEXT' },
      { value: 'formType', type: 'TEXT' },
      { value: 'periodType', type: 'TEXT' },
      { value: 'openFuturePeriods', type: 'TEXT' },
      { value: 'expiryDays', type: 'TEXT' },
      { value: 'categoryCombo', type: 'LONGTEXT' }
    ],
    fields: '',
    isMetadata: true,
    shouldIncludeOnLogin: true,
    resourceType: 'entryForm',
    batchSize: 20,
    displayName: 'Data Sets',
    dependentTable: [
      'dataSetElements',
      'dataSetIndicators',
      'dataSetDesign',
      'dataSetSource',
      'dataSetSections',
      'dataSetOperands'
    ]
  },
  dataSetDesign: {
    columns: [
      { value: 'id', type: 'TEXT' },
      { value: 'dataSetDesign', type: 'TEXT' }
    ],
    isMetadata: false,
    shouldIncludeOnLogin: false,
    resourceType: '',
    batchSize: 500,
    displayName: 'Data set entry form design',
    dependentTable: []
  },
  dataSetElements: {
    columns: [
      { value: 'id', type: 'TEXT' },
      { value: 'dataElementIds', type: 'LONGTEXT' }
    ],
    isMetadata: false,
    shouldIncludeOnLogin: false,
    resourceType: '',
    batchSize: 500,
    displayName: 'Data Set Elements',
    dependentTable: []
  },
  dataSetIndicators: {
    columns: [
      { value: 'id', type: 'TEXT' },
      { value: 'indicatorIds', type: 'LONGTEXT' }
    ],
    isMetadata: false,
    shouldIncludeOnLogin: false,
    resourceType: '',
    batchSize: 500,
    displayName: 'Data Set Indicators',
    dependentTable: []
  },
  dataSetSource: {
    columns: [
      { value: 'id', type: 'TEXT' },
      { value: 'organisationUnitIds', type: 'LONGTEXT' }
    ],
    isMetadata: false,
    shouldIncludeOnLogin: false,
    resourceType: '',
    batchSize: 500,
    displayName: 'Data Set Source',
    dependentTable: []
  },
  dataSetSections: {
    columns: [
      { value: 'id', type: 'TEXT' },
      { value: 'sectionIds', type: 'LONGTEXT' }
    ],
    isMetadata: false,
    shouldIncludeOnLogin: false,
    resourceType: '',
    batchSize: 500,
    displayName: 'Data Set Sections',
    dependentTable: []
  },
  dataSetOperands: {
    columns: [
      { value: 'id', type: 'TEXT' },
      { value: 'dataSetId', type: 'TEXT' },
      { value: 'name', type: 'TEXT' },
      { value: 'dimensionItemType', type: 'TEXT' },
      { value: 'dimensionItem', type: 'TEXT' }
    ],
    isMetadata: false,
    shouldIncludeOnLogin: false,
    resourceType: '',
    batchSize: 500,
    displayName: 'Data Set Operands',
    dependentTable: []
  },
  sections: {
    columns: [
      { value: 'id', type: 'TEXT' },
      { value: 'sortOrder', type: 'TEXT' },
      { value: 'name', type: 'TEXT' }
    ],
    fields: '',
    isMetadata: true,
    shouldIncludeOnLogin: true,
    resourceType: 'entryForm',
    batchSize: 500,
    displayName: 'Sections',
    dependentTable: ['sectionDataElements', 'sectionIndicators']
  },
  sectionDataElements: {
    columns: [
      { value: 'id', type: 'TEXT' },
      { value: 'dataElementIds', type: 'LONGTEXT' }
    ],
    isMetadata: false,
    shouldIncludeOnLogin: false,
    resourceType: '',
    batchSize: 500,
    displayName: 'Section data Elements',
    dependentTable: []
  },
  sectionIndicators: {
    columns: [
      { value: 'id', type: 'TEXT' },
      { value: 'indicatorIds', type: 'LONGTEXT' }
    ],
    isMetadata: false,
    shouldIncludeOnLogin: false,
    resourceType: '',
    batchSize: 500,
    displayName: 'Section Indicators',
    dependentTable: []
  },
  dataElements: {
    columns: [
      { value: 'id', type: 'TEXT' },
      { value: 'name', type: 'TEXT' },
      { value: 'displayName', type: 'TEXT' },
      { value: 'aggregationType', type: 'TEXT' },
      { value: 'formName', type: 'TEXT' },
      { value: 'valueType', type: 'TEXT' },
      { value: 'description', type: 'LONGTEXT' },
      { value: 'attributeValues', type: 'LONGTEXT' },
      { value: 'optionSet', type: 'LONGTEXT' },
      { value: 'categoryCombo', type: 'LONGTEXT' }
    ],
    isMetadata: true,
    shouldIncludeOnLogin: true,
    resourceType: 'entryForm',
    batchSize: 500,
    displayName: 'Data Elements',
    dependentTable: []
  },
  smsCommand: {
    columns: [
      { value: 'id', type: 'TEXT' },
      { value: 'commandName', type: 'TEXT' },
      { value: 'parserType', type: 'TEXT' },
      { value: 'separator', type: 'TEXT' },
      { value: 'smsCode', type: 'LONGTEXT' }
    ],
    isMetadata: true,
    shouldIncludeOnLogin: true,
    resourceType: 'entryForm',
    batchSize: 30,
    displayName: 'SMS Command',
    dependentTable: []
  },
  indicators: {
    columns: [
      { value: 'id', type: 'TEXT' },
      { value: 'name', type: 'TEXT' },
      { value: 'denominatorDescription', type: 'LONGTEXT' },
      { value: 'numeratorDescription', type: 'LONGTEXT' },
      { value: 'numerator', type: 'LONGTEXT' },
      { value: 'denominator', type: 'LONGTEXT' },
      { value: 'indicatorType', type: 'LONGTEXT' }
    ],
    isMetadata: true,
    displayName: 'Indicators',
    batchSize: 500,
    shouldIncludeOnLogin: true,
    resourceType: 'report',
    dependentTable: []
  },
  reports: {
    columns: [
      { value: 'id', type: 'TEXT' },
      { value: 'name', type: 'TEXT' },
      { value: 'created', type: 'TEXT' },
      { value: 'type', type: 'TEXT' },
      { value: 'relativePeriods', type: 'LONGTEXT' },
      { value: 'reportParams', type: 'LONGTEXT' }
    ],
    isMetadata: true,
    batchSize: 50,
    shouldIncludeOnLogin: true,
    resourceType: 'report',
    displayName: 'Reports',
    dependentTable: []
  },
  reportDesign: {
    columns: [
      { value: 'id', type: 'TEXT' },
      { value: 'designContent', type: 'LONGTEXT' }
    ],
    isMetadata: false,
    shouldIncludeOnLogin: false,
    resourceType: '',
    batchSize: 10,
    displayName: 'Report Design',
    dependentTable: []
  },
  constants: {
    columns: [
      { value: 'id', type: 'TEXT' },
      { value: 'name', type: 'TEXT' },
      { value: 'value', type: 'TEXT' }
    ],
    isMetadata: true,
    batchSize: 500,
    shouldIncludeOnLogin: true,
    resourceType: 'report',
    displayName: 'Constants',
    dependentTable: []
  },
  dataValues: {
    columns: [
      { value: 'id', type: 'TEXT' },
      { value: 'de', type: 'TEXT' },
      { value: 'co', type: 'TEXT' },
      { value: 'pe', type: 'TEXT' },
      { value: 'ou', type: 'TEXT' },
      { value: 'cc', type: 'TEXT' },
      { value: 'cp', type: 'TEXT' },
      { value: 'value', type: 'TEXT' },
      { value: 'period', type: 'TEXT' },
      { value: 'orgUnit', type: 'TEXT' },
      { value: 'syncStatus', type: 'TEXT' },
      { value: 'dataSetId', type: 'TEXT' }
    ],
    isMetadata: false,
    shouldIncludeOnLogin: false,
    resourceType: '',
    batchSize: 500,
    displayName: 'Data Values',
    dependentTable: []
  },
  dataSetCompleteness: {
    columns: [
      { value: 'id', type: 'TEXT' },
      { value: 'dataSetId', type: 'TEXT' },
      { value: 'period', type: 'TEXT' },
      { value: 'orgUnitId', type: 'TEXT' },
      { value: 'storedBy', type: 'TEXT' },
      { value: 'date', type: 'TEXT' },
      { value: 'isDeleted', type: 'TEXT' },
      { value: 'dataDimension', type: 'LONGTEXT' }
    ],
    isMetadata: false,
    shouldIncludeOnLogin: false,
    resourceType: '',
    batchSize: 500,
    displayName: 'Entry form completeness',
    dependentTable: []
  },
  events: {
    columns: [
      { value: 'id', type: 'TEXT' },
      { value: 'program', type: 'TEXT' },
      { value: 'programName', type: 'TEXT' },
      { value: 'programStage', type: 'TEXT' },
      { value: 'orgUnit', type: 'TEXT' },
      { value: 'orgUnitName', type: 'TEXT' },
      { value: 'status', type: 'TEXT' },
      { value: 'eventDate', type: 'TEXT' },
      { value: 'dueDate', type: 'TEXT' },
      { value: 'deleted', type: 'TEXT' },
      { value: 'trackedEntityInstance', type: 'TEXT' },
      { value: 'completedDate', type: 'TEXT' },
      { value: 'attributeCategoryOptions', type: 'TEXT' },
      { value: 'attributeCc', type: 'TEXT' },
      { value: 'eventType', type: 'TEXT' },
      { value: 'syncStatus', type: 'TEXT' },
      { value: 'notes', type: 'LONGTEXT' },
      { value: 'coordinate', type: 'LONGTEXT' },
      { value: 'dataValues', type: 'LONGTEXT' }
    ],
    isMetadata: false,
    shouldIncludeOnLogin: false,
    resourceType: 'event',
    batchSize: 50,
    displayName: 'Events',
    dependentTable: []
  },
  programs: {
    columns: [
      { value: 'id', type: 'TEXT' },
      { value: 'name', type: 'TEXT' },
      { value: 'displayName', type: 'TEXT' },
      { value: 'programType', type: 'TEXT' },
      { value: 'displayIncidentDate', type: 'TEXT' },
      { value: 'withoutRegistration', type: 'TEXT' },
      { value: 'ignoreOverdueEvents', type: 'TEXT' },
      { value: 'skipOffline', type: 'TEXT' },
      { value: 'captureCoordinates', type: 'TEXT' },
      { value: 'enrollmentDateLabel', type: 'TEXT' },
      { value: 'onlyEnrollOnce', type: 'TEXT' },
      { value: 'selectIncidentDatesInFuture', type: 'TEXT' },
      { value: 'incidentDateLabel', type: 'TEXT' },
      { value: 'useFirstStageDuringRegistration', type: 'TEXT' },
      { value: 'completeEventsExpiryDays', type: 'TEXT' },
      { value: 'displayFrontPageList', type: 'TEXT' },
      { value: 'categoryCombo', type: 'LONGTEXT' },
      { value: 'trackedEntity', type: 'LONGTEXT' },
      { value: 'attributeValues', type: 'LONGTEXT' },
      { value: 'validationCriterias', type: 'LONGTEXT' },
      { value: 'translations', type: 'LONGTEXT' }
    ],
    isMetadata: true,
    shouldIncludeOnLogin: true,
    resourceType: 'event',
    batchSize: 50,
    displayName: 'Programs',
    dependentTable: [
      'programProgramRuleVariables',
      'programProgramRules',
      'programProgramTrackedEntityAttributes',
      'trackedEntityAttribute',
      'programIndicators',
      'programProgramStages',
      'programOrganisationUnits',
      'trackerRegistrationForm',
      'programStageEntryForm'
    ]
  },
  trackerRegistrationForm: {
    columns: [
      { value: 'id', type: 'TEXT' },
      { value: 'dataEntryForm', type: 'TEXT' }
    ],
    isMetadata: false,
    shouldIncludeOnLogin: false,
    resourceType: '',
    batchSize: 50,
    displayName: 'Tracker registration entry form design',
    dependentTable: []
  },
  programStageEntryForm: {
    columns: [
      { value: 'id', type: 'TEXT' },
      { value: 'dataEntryForm', type: 'TEXT' }
    ],
    isMetadata: false,
    shouldIncludeOnLogin: false,
    resourceType: '',
    batchSize: 50,
    displayName: 'Program stage entry form design',
    dependentTable: []
  },
  programProgramRuleVariables: {
    columns: [
      { value: 'id', type: 'TEXT' },
      { value: 'programRuleVariableIds', type: 'LONGTEXT' }
    ],
    isMetadata: false,
    shouldIncludeOnLogin: false,
    resourceType: '',
    batchSize: 500,
    displayName: '',
    dependentTable: []
  },
  programProgramRules: {
    columns: [
      { value: 'id', type: 'TEXT' },
      { value: 'programRuleIds', type: 'LONGTEXT' }
    ],
    isMetadata: false,
    shouldIncludeOnLogin: false,
    resourceType: '',
    batchSize: 500,
    displayName: '',
    dependentTable: []
  },
  programTrackedEntityAttributes: {
    columns: [
      { value: 'id', type: 'TEXT' },
      { value: 'programId', type: 'TEXT' },
      { value: 'sortOrder', type: 'TEXT' },
      { value: 'mandatory', type: 'TEXT' },
      { value: 'externalAccess', type: 'TEXT' },
      { value: 'displayInList', type: 'TEXT' }
    ],
    isMetadata: false,
    shouldIncludeOnLogin: false,
    resourceType: '',
    batchSize: 200,
    displayName: '',
    dependentTable: []
  },
  trackedEntityAttribute: {
    columns: [
      { value: 'id', type: 'TEXT' },
      { value: 'programTrackedEntityAttributeId', type: 'TEXT' },
      { value: 'trackedEntityAttribute', type: 'LONGTEXT' }
    ],
    isMetadata: false,
    shouldIncludeOnLogin: false,
    resourceType: '',
    batchSize: 200,
    displayName: '',
    dependentTable: []
  },
  trackedEntityInstances: {
    columns: [
      { value: 'id', type: 'TEXT' },
      { value: 'trackedEntity', type: 'TEXT' },
      { value: 'orgUnit', type: 'TEXT' },
      { value: 'orgUnitName', type: 'TEXT' },
      { value: 'trackedEntityInstance', type: 'TEXT' },
      { value: 'deleted', type: 'TEXT' },
      { value: 'inactive', type: 'TEXT' },
      { value: 'enrollments', type: 'LONGTEXT' },
      { value: 'relationships', type: 'LONGTEXT' },
      { value: 'syncStatus', type: 'TEXT' }
    ],
    isMetadata: false,
    shouldIncludeOnLogin: false,
    resourceType: '',
    batchSize: 100,
    displayName: '',
    dependentTable: []
  },
  trackedEntityAttributeValues: {
    columns: [
      { value: 'id', type: 'TEXT' },
      { value: 'trackedEntityInstance', type: 'TEXT' },
      { value: 'attribute', type: 'TEXT' },
      { value: 'value', type: 'TEXT' }
    ],
    isMetadata: false,
    shouldIncludeOnLogin: false,
    resourceType: '',
    batchSize: 100,
    displayName: '',
    dependentTable: []
  },
  enrollments: {
    columns: [
      { value: 'id', type: 'TEXT' },
      { value: 'trackedEntity', type: 'TEXT' },
      { value: 'orgUnit', type: 'TEXT' },
      { value: 'program', type: 'TEXT' },
      { value: 'enrollment', type: 'TEXT' },
      { value: 'trackedEntityInstance', type: 'TEXT' },
      { value: 'enrollmentDate', type: 'TEXT' },
      { value: 'incidentDate', type: 'TEXT' },
      { value: 'status', type: 'TEXT' },
      { value: 'attributes', type: 'LONGTEXT' },
      { value: 'coordinate', type: 'LONGTEXT' },
      { value: 'events', type: 'LONGTEXT' },
      { value: 'syncStatus', type: 'TEXT' }
    ],
    isMetadata: false,
    shouldIncludeOnLogin: false,
    resourceType: '',
    batchSize: 100,
    displayName: '',
    dependentTable: []
  },
  programIndicators: {
    columns: [
      { value: 'id', type: 'TEXT' },
      { value: 'programId', type: 'TEXT' },
      { value: 'name', type: 'TEXT' },
      { value: 'expression', type: 'LONGTEXT' }
    ],
    isMetadata: false,
    shouldIncludeOnLogin: false,
    resourceType: '',
    batchSize: 100,
    displayName: '',
    dependentTable: []
  },
  programProgramStages: {
    columns: [
      { value: 'id', type: 'TEXT' },
      { value: 'programId', type: 'TEXT' },
      { value: 'name', type: 'TEXT' },
      { value: 'executionDateLabel', type: 'TEXT' },
      { value: 'formType', type: 'TEXT' },
      { value: 'blockEntryForm', type: 'TEXT' },
      { value: 'hideDueDate', type: 'TEXT' },
      { value: 'repeatable', type: 'TEXT' },
      { value: 'allowGenerateNextVisit', type: 'TEXT' },
      { value: 'sortOrder', type: 'TEXT' },
      { value: 'standardInterval', type: 'TEXT' },
      { value: 'minDaysFromStart', type: 'TEXT' },
      { value: 'generatedByEnrollmentDate', type: 'TEXT' },
      { value: 'autoGenerateEvent', type: 'TEXT' },
      { value: 'captureCoordinates', type: 'TEXT' },
      { value: 'dueDateLabel', type: 'TEXT' },
      { value: 'programStageDataElements', type: 'LONGTEXT' },
      { value: 'programStageSections', type: 'LONGTEXT' }
    ],
    isMetadata: false,
    shouldIncludeOnLogin: false,
    resourceType: '',
    batchSize: 100,
    displayName: '',
    dependentTable: []
  },
  programOrganisationUnits: {
    columns: [
      { value: 'id', type: 'TEXT' },
      { value: 'orgUnitIds', type: 'LONGTEXT' }
    ],
    isMetadata: false,
    shouldIncludeOnLogin: false,
    resourceType: '',
    batchSize: 500,
    displayName: '',
    dependentTable: []
  },
  programStageSections: {
    columns: [
      { value: 'id', type: 'TEXT' },
      { value: 'name', type: 'TEXT' },
      { value: 'displayName', type: 'TEXT' },
      { value: 'sortOrder', type: 'TEXT' },
      { value: 'programStageId', type: 'TEXT' },
      { value: 'attributeValues', type: 'LONGTEXT' },
      { value: 'translations', type: 'LONGTEXT' },
      { value: 'dataElements', type: 'LONGTEXT' }
    ],
    isMetadata: true,
    batchSize: 100,
    shouldIncludeOnLogin: true,
    resourceType: 'event',
    displayName: 'Program Stage Sections',
    dependentTable: []
  },
  programRules: {
    columns: [
      { value: 'id', type: 'TEXT' },
      { value: 'name', type: 'TEXT' },
      { value: 'displayName', type: 'TEXT' },
      { value: 'condition', type: 'TEXT' },
      { value: 'description', type: 'TEXT' },
      { value: 'program', type: 'LONGTEXT' },
      { value: 'programRuleActions', type: 'LONGTEXT' }
    ],
    isMetadata: true,
    batchSize: 100,
    shouldIncludeOnLogin: true,
    resourceType: 'event',
    displayName: 'Program Rules',
    dependentTable: []
  },
  programRuleActions: {
    columns: [
      { value: 'id', type: 'TEXT' },
      { value: 'data', type: 'TEXT' },
      { value: 'content', type: 'TEXT' },
      { value: 'programRuleActionType', type: 'TEXT' },
      { value: 'location', type: 'TEXT' },
      { value: 'programRule', type: 'LONGTEXT' },
      { value: 'dataElement', type: 'LONGTEXT' },
      { value: 'trackedEntityAttribute', type: 'LONGTEXT' },
      { value: 'programStageSection', type: 'LONGTEXT' },
      { value: 'programStage', type: 'LONGTEXT' }
    ],
    isMetadata: true,
    batchSize: 200,
    shouldIncludeOnLogin: true,
    resourceType: 'event',
    displayName: 'Program Rule Actions',
    dependentTable: []
  },
  programRuleVariables: {
    columns: [
      { value: 'id', type: 'TEXT' },
      { value: 'name', type: 'TEXT' },
      { value: 'displayName', type: 'TEXT' },
      { value: 'programRuleVariableSourceType', type: 'TEXT' },
      { value: 'program', type: 'LONGTEXT' },
      { value: 'dataElement', type: 'LONGTEXT' },
      { value: 'trackedEntityAttribute', type: 'LONGTEXT' },
      { value: 'programStageSection', type: 'LONGTEXT' },
      { value: 'programStage', type: 'LONGTEXT' }
    ],
    isMetadata: true,
    batchSize: 200,
    shouldIncludeOnLogin: true,
    resourceType: 'event',
    displayName: 'Program Rules Variables',
    dependentTable: []
  }
};
