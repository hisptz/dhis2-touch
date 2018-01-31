import * as _ from 'lodash';
import { mapSettingsToVisualizationFilters } from './map-settings-to-visualization-filters';
import {Visualization} from '../../models/visualization';

export function updateVisualizationWithSettings(
  visualization: Visualization,
  settings: any
) {
  const newVisualization: Visualization = { ...visualization };

  const visualizationDetails: any = { ...newVisualization.details };
  if (settings.mapViews) {
    let visualizationFilters = [];
    let visualizationLayouts = [];
    if (visualizationDetails.currentVisualization === 'MAP') {
      visualizationDetails.basemap = settings.basemap;
      visualizationDetails.zoom = settings.zoom;
      visualizationDetails.latitude = settings.latitude;
      visualizationDetails.longitude = settings.longitude;
    }
    settings.mapViews.forEach((view: any) => {
      visualizationFilters = [
        ...visualizationFilters,
        { id: view.id, filters: mapSettingsToVisualizationFilters(view) }
      ];
      visualizationLayouts = [
        ...visualizationLayouts,
        { id: view.id, layout: getVisualizationLayout(view) }
      ];
    });

    visualizationDetails.filters = [...visualizationFilters];
    visualizationDetails.layouts = [...visualizationLayouts];

    newVisualization.layers = [
      ..._.map(settings.mapViews, (view: any) => {
        const newView: any = { ...view };
        return {
          settings: _.omit(newView, ['interpretations']),
          layout: getVisualizationLayout(view),
          filters: mapSettingsToVisualizationFilters(view),
          interpretation: {
            id: visualization.details.favorite.id,
            type: visualization.details.favorite.type,
            interpretations: view.interpretations || []
          }
        };
      })
    ];
  } else {
    const newSettings = { ...settings };
    visualizationDetails.filters = [
      { id: settings.id, filters: mapSettingsToVisualizationFilters(settings) }
    ];
    visualizationDetails.layouts = [
      { id: settings.id, layout: getVisualizationLayout(settings) }
    ];

    newVisualization.layers = settings.id
      ? [
          {
            settings: _.omit(newSettings, ['interpretations']),
            layout: getVisualizationLayout(newSettings),
            filters: mapSettingsToVisualizationFilters(newSettings),
            interpretation: {
              id: visualization.details.favorite.id,
              type: visualization.details.favorite.type,
              interpretations: newSettings.interpretations || []
            }
          }
        ]
      : _.map(visualization.layers, layer => {
          return {
            ...layer,
            interpretation: {
              id: visualization.details.favorite.id,
              type: visualization.details.favorite.type,
              interpretations: newSettings.interpretations || []
            }
          };
        });
  }

  visualizationDetails.metadataIdentifiers = newVisualization.layers
    .map(visualizationLayer =>
      _.find(visualizationLayer.filters, ['name', 'dx'])
    )
    .filter(dxObject => dxObject)
    .map(dxObject => dxObject.value.split('.')[0])
    .filter(dxValue => dxValue !== '')
    .join(';')
    .split(';')
    .filter(value => value !== '');

  newVisualization.details = { ...visualizationDetails };
  return newVisualization;
}

function getVisualizationLayout(visualizationSettings: any) {
  return {
    rows: getDimensionLayout(
      visualizationSettings.rows,
      visualizationSettings.dataElementDimensions
    ),
    columns: getDimensionLayout(
      visualizationSettings.columns,
      visualizationSettings.dataElementDimensions
    ),
    filters: getDimensionLayout(
      visualizationSettings.filters,
      visualizationSettings.dataElementDimensions
    )
  };
}

function getDimensionLayout(dimensionArray, dataElementDimensions) {
  const newDimensionLayoutArray: any[] = [];
  if (dimensionArray) {
    dimensionArray.forEach(dimensionObject => {
      if (dimensionObject.dimension !== 'dy') {
        const layoutValue = dimensionObject.dimension;
        const layoutName = getLayoutName(layoutValue, dataElementDimensions);
        newDimensionLayoutArray.push({ name: layoutName, value: layoutValue });
      }
    });
  }
  return newDimensionLayoutArray;
}

function getLayoutName(layoutValue, dataElementDimensions) {
  switch (layoutValue) {
    case 'ou': {
      return 'Organisation Unit';
    }

    case 'pe': {
      return 'Period';
    }

    case 'dx': {
      return 'Data';
    }

    default: {
      let layoutName = '';
      if (dataElementDimensions) {
        const compiledDimension = dataElementDimensions.map(
          dataElementDimension => {
            return dataElementDimension.dataElement;
          }
        );
        const layoutObject = _.find(compiledDimension, ['id', layoutValue]);
        if (layoutObject) {
          layoutName = layoutObject.name;
        }
      }
      return layoutName !== '' ? layoutName : 'Category Option';
    }
  }
}
