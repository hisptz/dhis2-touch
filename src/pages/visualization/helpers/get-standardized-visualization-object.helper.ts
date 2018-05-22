import { Visualization } from '../models/visualization.model';
import * as _ from 'lodash';

export function getStandardizedVisualizationObject(visualizationItem: any): Visualization {
  return {
    id: visualizationItem.id,
    name: getVisualizationName(visualizationItem),
    type: visualizationItem.type,
    favorite: getFavoriteDetails(visualizationItem),
    created: visualizationItem.created,
    lastUpdated: visualizationItem.lastUpdated,
    progress: {
      statusCode: 200,
      statusText: 'OK',
      percent: 0,
      message: 'Loading..'
    },
    uiConfigId: `${visualizationItem.id}_ui_config`,
    visualizationConfigId: `${visualizationItem.id}_config`,
    layers: []
  };
}

function getVisualizationName(visualizationItem: any) {
  if (!visualizationItem) {
    return null;
  }

  switch (visualizationItem.type) {
    case 'APP':
      return visualizationItem.appKey;
    case 'MESSAGES':
      return 'Messages';
    case 'RESOURCES':
      return 'Resources';
    case 'REPORTS':
      return 'Reports';
    case 'USERS':
      return 'Users';
    default:
      return visualizationItem.type &&
      visualizationItem.hasOwnProperty(_.camelCase(visualizationItem.type))
        ? _.isPlainObject(visualizationItem[_.camelCase(visualizationItem.type)])
          ? visualizationItem[_.camelCase(visualizationItem.type)].displayName
          : null
        : null;
  }
}

function getFavoriteDetails(visualizationItem: any) {
  if(!visualizationItem) {
    return null;
  }
  const favoriteItem = visualizationItem[_.camelCase(visualizationItem.type)];
  return _.isPlainObject(favoriteItem) ? {
    id: favoriteItem.id,
    type: _.camelCase(visualizationItem.type),
    name: getVisualizationName(visualizationItem),
    useTypeAsBase: true,
    requireAnalytics: true
  } : {
    id: visualizationItem.id,
    name: getVisualizationName(visualizationItem),
    type: _.camelCase(visualizationItem.type)
  }
}

function getLayerDetailsForNonVisualizableObject(visualizationItem) {
  return visualizationItem.type === 'USERS' ||
  visualizationItem.type === 'REPORTS' ||
  visualizationItem.type === 'RESOURCES'
    ? [{rows: visualizationItem[_.camelCase(visualizationItem.type)]}]
    : [];
}
