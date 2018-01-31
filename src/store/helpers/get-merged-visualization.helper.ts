import * as _ from 'lodash';
import {Visualization} from '../../models/visualization';
export function getMergedVisualization(visualizationObject: Visualization) {
  const newVisualizationObject: Visualization = {...visualizationObject};

  /**
   * Get visualization layers with removed undefined analytics
   */
  const initialVisualizationLayers = _.filter(newVisualizationObject.layers, (layer) => {
    return layer && layer.analytics;
  });

  if (initialVisualizationLayers) {
    const sanitizedVisualizationLayers = _.map(initialVisualizationLayers, (layer) => {
      const newLayer = _.clone(layer);
      if (newLayer.settings.layer) {
        switch (newLayer.settings.layer) {
          case 'event':
            if (newLayer.settings.eventClustering) {
              newLayer.analytics = _.assign(
                {},
                // this.analyticsService.mapEventClusteredAnalyticsToAggregate(newLayer.analytics)
              );
            }
            break;
          default:
            console.log('default');
            break;
        }
      }
      return newLayer;
    });
    newVisualizationObject.layers = _.assign([], sanitizedVisualizationLayers);
  }
  return newVisualizationObject;
}
