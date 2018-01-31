import {getISOFormatFromRelativePeriod} from './get-iso-format-from-relative-period.helper';
import {getSplitedAnalytics} from './get-splited-analytics.helper';
import {getSplitedFavorite} from './get-splited-favorite.helper';
import {Visualization} from '../../models/visualization';

export function getSplitedVisualization(visualization: Visualization) {
  const visualizationObject: Visualization = {...visualization};

  const newSplitedLayers: any[] = [];
  const favoriteObjectArray = visualizationObject.layers.map(layer => {
    return getISOFormatFromRelativePeriod(layer.settings);
  });

  const analyticsObjectArray = visualizationObject.layers.map(layer => {
    return layer.analytics;
  });
  let splitedFavorites: any[] = [];
  let splitedAnalytics: any[] = [];

  /**
   * Split analytics
   */
  if (analyticsObjectArray.length === 1) {
    splitedAnalytics = getSplitedAnalytics(analyticsObjectArray[0], ['dx', 'pe']);

  }

  /**
   * Split favorite
   */
  if (favoriteObjectArray.length === 1) {
    splitedFavorites = getSplitedFavorite(favoriteObjectArray[0], ['dx', 'pe']);

    if (splitedFavorites) {
      splitedFavorites.forEach(favoriteObject => {
        if (splitedAnalytics) {
          splitedAnalytics.forEach(analytics => {
            const dataDimension = analytics.metaData['dx'][0];
            const periodDimension = analytics.metaData['pe'][0];
            const analyticsId = favoriteObject.analyticsIdentifier;
            if (analyticsId === dataDimension + '_' + periodDimension || analyticsId === periodDimension + '_' + dataDimension) {
              newSplitedLayers.push({
                settings: favoriteObject,
                analytics: analytics
              });
            }
          });
        }
      });
    }
  }

  visualizationObject.layers = [...newSplitedLayers];

  return visualizationObject;
}
