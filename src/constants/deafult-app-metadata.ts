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
    isOnLogin: false,
    defaultIds: []
  },
  validationRules: {
    resourceType: 'entryForm',
    displayName: 'Validation Rules',
    isOnLogin: false,
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
    isOnLogin: false,
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
    isOnLogin: false,
    defaultIds: []
  },
  dataSets: {
    resourceType: 'entryForm',
    displayName: 'Data Sets',
    isOnLogin: true,
    defaultIds: ['lyLU2wR22tC']
  },
  smsCommand: {
    resourceType: 'entryForm',
    displayName: 'SMS Command',
    isOnLogin: false,
    defaultIds: []
  },
  indicators: {
    displayName: 'Indicators',
    resourceType: 'report',
    isOnLogin: false,
    defaultIds: []
  },
  reports: {
    resourceType: 'report',
    displayName: 'Reports',
    isOnLogin: false,
    defaultIds: []
  },
  constants: {
    resourceType: 'report',
    displayName: 'Constants',
    isOnLogin: false,
    defaultIds: []
  },
  programs: {
    resourceType: 'event',
    displayName: 'Programs',
    isOnLogin: false,
    defaultIds: ['eBAyeGv0exc', 'IpHINAT79UW']
  },
  programStageSections: {
    resourceType: 'event',
    displayName: 'Program Stage Sections',
    isOnLogin: false,
    defaultIds: []
  },
  programRules: {
    resourceType: 'event',
    displayName: 'Program Rules',
    isOnLogin: false,
    defaultIds: []
  },
  programRuleActions: {
    resourceType: 'event',
    displayName: 'Program Rule Actions',
    isOnLogin: false,
    defaultIds: []
  },
  programRuleVariables: {
    resourceType: 'event',
    displayName: 'Program Rules Variables',
    isOnLogin: false,
    defaultIds: []
  }
};
