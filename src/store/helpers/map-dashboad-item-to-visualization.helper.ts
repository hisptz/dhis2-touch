import * as _ from 'lodash';
import { getVisualizationWidthFromShape } from './get-visualization-width-from-shape.helper';
import {CurrentUser} from '../../models/currentUser';
import {Visualization} from '../../models/visualization';

export function mapDashboardItemToVisualization(
  dashboardItem: any,
  dashboardId: string,
  currentUser: CurrentUser
): Visualization {
  return {
    id: dashboardItem.id,
    name: getVisualizationObjectName(dashboardItem),
    type: dashboardItem.type,
    created: dashboardItem.created,
    lastUpdated: dashboardItem.lastUpdated,
    shape: dashboardItem.shape || 'NORMAL',
    dashboardId: dashboardId,
    subtitle: null,
    description: null,
    details: {
      shape: dashboardItem.shape || 'NORMAL',
      loaded: getLoadedStatus(dashboardItem),
      hasError: false,
      errorMessage: '',
      appKey: dashboardItem.appKey,
      hideCardBorders: false,
      showCardHeader: true,
      showCardFooter: true,
      showChartOptions: true,
      showFilter: true,
      cardHeight: '450px',
      itemHeight: '430px',
      width: getVisualizationWidthFromShape(dashboardItem.shape),
      fullScreen: false,
      type: getSanitizedCurrentVisualizationType(dashboardItem.type),
      currentVisualization: getSanitizedCurrentVisualizationType(
        dashboardItem.type
      ),
      favorite: getFavoriteDetails(dashboardItem),
      externalDimensions: {},
      filters: [],
      layouts: [],
      analyticsStrategy: 'normal',
      rowMergingStrategy: 'normal',
      userOrganisationUnit: getUserOrganisationUnit(currentUser),
      nonVisualizable: checkIfIsNonVisualizable(dashboardItem)
    },
    layers: getLayerDetailsForNonVisualizableObject(dashboardItem),
    operatingLayers: []
  };
}

function getVisualizationObjectName(dashboardItem: any) {
  return dashboardItem.type !== null &&
    dashboardItem.hasOwnProperty(_.camelCase(dashboardItem.type))
    ? _.isPlainObject(dashboardItem[_.camelCase(dashboardItem.type)])
      ? dashboardItem[_.camelCase(dashboardItem.type)].displayName
      : null
    : null;
}

function getLoadedStatus(dashboardItem: any) {
  return (
    dashboardItem.type === 'USERS' ||
    dashboardItem.type === 'REPORTS' ||
    dashboardItem.type === 'RESOURCES' ||
    dashboardItem.type === 'APP' ||
    dashboardItem.type === 'MESSAGES'
  );
}

function getSanitizedCurrentVisualizationType(
  visualizationType: string
): string {
  let sanitizedVisualization: string = null;

  if (visualizationType === 'CHART' || visualizationType === 'EVENT_CHART') {
    sanitizedVisualization = 'CHART';
  } else if (
    visualizationType === 'TABLE' ||
    visualizationType === 'EVENT_REPORT' ||
    visualizationType === 'REPORT_TABLE'
  ) {
    sanitizedVisualization = 'TABLE';
  } else if (visualizationType === 'MAP') {
    sanitizedVisualization = 'MAP';
  } else {
    sanitizedVisualization = visualizationType;
  }
  return sanitizedVisualization;
}

function getFavoriteDetails(dashboardItem: any) {
  const favoriteId = _.isPlainObject(
    dashboardItem[_.camelCase(dashboardItem.type)]
  )
    ? dashboardItem[_.camelCase(dashboardItem.type)].id
    : undefined;

  return dashboardItem.type &&
    dashboardItem.hasOwnProperty(_.camelCase(dashboardItem.type))
    ? {
        id: favoriteId,
        type: _.camelCase(dashboardItem.type)
      }
    : {};
}

function getUserOrganisationUnit(currentUser: CurrentUser): any[] {
  if (!currentUser.dataViewOrganisationUnits) {
    return [];
  }
  return currentUser.dataViewOrganisationUnits;
}

function getLayerDetailsForNonVisualizableObject(dashboardItem) {
  return dashboardItem.type === 'USERS' ||
    dashboardItem.type === 'REPORTS' ||
    dashboardItem.type === 'RESOURCES' ||
    dashboardItem.type === 'APP'
    ? [{ settings: dashboardItem, analytics: {} }]
    : [];
}

function checkIfIsNonVisualizable(dashboardItem: any) {
  return dashboardItem.type === 'USERS' ||
    dashboardItem.type === 'REPORTS' ||
    dashboardItem.type === 'RESOURCES' ||
    dashboardItem.type === 'APP' ||
    dashboardItem.type === 'MESSAGES'
    ? true
    : false;
}
