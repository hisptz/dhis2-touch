/*
 *
 * Copyright 2019 HISP Tanzania
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
 * @since 2019
 * @author Joseph Chingalo <profschingalo@gmail.com>
 *
 */
export const DEFAULT_APP_METADATA = {
  organisationUnits: {
    resourceType: 'communication',
    displayName: 'Organisation Units',
    isOnLogin: true,
    defaultIds: []
  },
  validationRules: {
    resourceType: 'entryForm',
    displayName: 'Validation Rules',
    isOnLogin: true,
    defaultIds: []
  },
  dataStore: {
    resourceType: 'report',
    displayName: 'Data Store',
    isOnLogin: false,
    defaultIds: []
  },
  sections: {
    resourceType: 'entryForm',
    displayName: 'Sections',
    isOnLogin: true,
    defaultIds: []
  },
  dataElements: {
    resourceType: 'entryForm',
    displayName: 'Data Elements',
    isOnLogin: true,
    defaultIds: []
  },
  categoryCombos: {
    resourceType: 'entryForm',
    displayName: 'Category combos',
    isOnLogin: true,
    defaultIds: []
  },
  dataSets: {
    resourceType: 'entryForm',
    displayName: 'Data Sets',
    isOnLogin: true,
    defaultIds: []
  },
  smsCommand: {
    resourceType: 'entryForm',
    displayName: 'SMS Command',
    isOnLogin: true,
    defaultIds: []
  },
  indicators: {
    displayName: 'Indicators',
    resourceType: 'report',
    isOnLogin: true,
    defaultIds: []
  },
  reports: {
    resourceType: 'report',
    displayName: 'Reports',
    isOnLogin: true,
    defaultIds: []
  },
  constants: {
    resourceType: 'report',
    displayName: 'Constants',
    isOnLogin: true,
    defaultIds: []
  },
  programs: {
    resourceType: 'event',
    displayName: 'Programs',
    isOnLogin: true,
    defaultIds: []
  },
  programStageSections: {
    resourceType: 'event',
    displayName: 'Program Stage Sections',
    isOnLogin: true,
    defaultIds: []
  },
  programRules: {
    resourceType: 'event',
    displayName: 'Program Rules',
    isOnLogin: true,
    defaultIds: []
  },
  programRuleActions: {
    resourceType: 'event',
    displayName: 'Program Rule Actions',
    isOnLogin: true,
    defaultIds: []
  },
  programRuleVariables: {
    resourceType: 'event',
    displayName: 'Program Rules Variables',
    isOnLogin: true,
    defaultIds: []
  }
};
