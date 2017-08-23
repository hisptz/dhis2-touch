import {Injectable} from '@angular/core';
import * as _ from 'lodash';
import {Color} from '../color';
import {TileLayers} from '../../constants/tile-layers';
import {Visualization} from '../../model/visualization';
import {MapObject} from '../../model/map-object';
import {saveAs} from 'file-saver';
import {ColorInterpolationServiceProvider} from "../color-interpolation-service/color-interpolation-service";
import {LegendSetServiceProvider} from "../legend-set-service/legend-set-service";
import {MapFilesConversionProvider} from "../map-files-conversion/map-files-conversion";
import GJV from 'geojson-validation';

declare var html2canvas;
/*
 Generated class for the MapVisualizationServiceProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */
@Injectable()
export class MapVisualizationServiceProvider {

  private colorHigh: String;
  private colorLow: String;
  private colorType: String = 'Hex';
  private ends: Array<any> = [Color, Color];
  private step: Array<any> = [];
  public centeringLayer: null;
  private mapObjects: any[] = [];
  private operatingLayers: any[] = [];

  private visualizationObject: any = null;

  constructor(private tileLayers: TileLayers,
              private colorInterpolation: ColorInterpolationServiceProvider,
              private legendSet: LegendSetServiceProvider,
              private fileConversion: MapFilesConversionProvider) {
  }

  drawMap(L, visualizationObject: Visualization, prioritizeFilter?: boolean): MapObject {
    this.visualizationObject = visualizationObject;
    const mapObject: MapObject = this._getInitialMapObject(visualizationObject);
    const layers = this._getMapLayers(L, visualizationObject.layers, visualizationObject.details.mapConfiguration.basemap, mapObject.id, prioritizeFilter);
    mapObject.options.layers = layers[0];
    mapObject.operatingLayers = layers[1];
    mapObject.centeringLayer = layers[2];
    return mapObject;
  }

  downLoadMapAsFiles(fileFormat, data) {


    if (fileFormat === 'image') {
      html2canvas(data, {
        onrendered: (canvas) => {
          // canvas is the final rendered <canvas> element
          let img = canvas.toDataURL();
          // let hiddenElement = document.createElement('a');
          //
          // hiddenElement.href = 'data:image/png;charset=utf-8,' + encodeURI(img);
          // hiddenElement.target = '_blank';
          // hiddenElement.download = data.name + '.png';
          // hiddenElement.click();
          // window.open(img);
        }
      });
    }


    if (data && data.layers) {
      data.layers.forEach(layer => {
        let modifiedMapData: any = null;
        if (fileFormat === 'geojson') {
          const fileName: any = this._prepareFileNameForDownload(fileFormat, 'json', data, layer);
          modifiedMapData = this.convertToBinaryData(this._prepareGeoJsonDataForDownload(layer), fileFormat);
          if (modifiedMapData && fileName) {
            setTimeout(() => {
              saveAs(modifiedMapData, fileName);
            }, 10)
          } else {

          }
        }

        if (fileFormat === 'kml') {
          const fileName: any = this._prepareFileNameForDownload(fileFormat, 'kml', data, layer);
          const geoJsonObject = this._prepareGeoJsonDataForDownload(layer);
          const kml = this.fileConversion.toKML(geoJsonObject, {
            documentName: data.name,
            documentDescription: data.name,
            name: 'name',
            description: 'description',
            simplestyle: false,
            timestamp: 'timestamp'
          });
          modifiedMapData = this.convertToBinaryData(kml, fileFormat);
          if (modifiedMapData && fileName) {
            setTimeout(() => {
              saveAs(modifiedMapData, fileName);
            }, 10)
          } else {

          }
        }

        if (fileFormat === 'csv') {
          const fileName: any = this._prepareFileNameForDownload(fileFormat, 'csv', data, layer);
          const csv = this._prepareCSVDataForDownload(layer.analytics, layer.settings);

          const hiddenElement = document.createElement('a');
          hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
          hiddenElement.target = '_blank';
          hiddenElement.download = data.name + '.csv';
          hiddenElement.click();
        }


      })
    }


  }

  private _prepareFileNameForDownload(format, extension, data, layer) {
    const dataName = data.name ? data.name + ' ' + layer.settings.name : 'Data Download';
    const subtitle = data.subtitle ? data.subtitle : '';
    return dataName + ' - ' + subtitle + '.' + extension;
  }

  private convertToBinaryData(data, format) {
    return new Blob([data], {type: 'text/' + format + ';charset=utf-8'});
  }

  private _prepareGeoJsonDataForDownload(data) {
    let geoJsonData: any;

    if (data.settings.layer === 'event') {
      geoJsonData = JSON.stringify(this._prepareGeoJsonDataFromEvents(data.analytics));
    } else {
      geoJsonData = JSON.stringify(this._prepareGeoJsonDataFromGeoFeatures(data.settings.geoFeature, data.analytics));
    }

    return geoJsonData;
  }

  private _prepareCSVDataForDownload(data, settings) {
    const classess = this.legendSet.generateLegendClassLimits(settings, data);

    if (data === null) {
      return null;
    }

    let result, ctr, keys, columnDelimiter, lineDelimiter;
    let uids = [];
    if (data.hasOwnProperty('headers')) {

      const orgIndex = _.findIndex(data.headers, ['name', 'ou']);
      const valueIndex = _.findIndex(data.headers, ['name', 'value']);

      columnDelimiter = ',';
      lineDelimiter = '\n';
      keys = ['Organisation Unit'];
      data.metaData.dx.forEach((dataElement, dataElementIndex) => {

        keys.push(data.metaData.names[dataElement]);
        uids.push(dataElement);
        if (dataElementIndex === data.metaData.dx.length - 1) {
          keys.push('Class Interval');
          keys.push('Frequency');
          keys.push('Color');
        }

      });
      result = '';
      result += keys.join(columnDelimiter);
      result += lineDelimiter;

      data.rows.forEach((item) => {
        ctr = 0;
        uids.forEach((key, keyIndex) => {
          result += data.metaData.names[item[orgIndex]];
          result += columnDelimiter;
          result += item[valueIndex];
          ctr++;
        });

        const classBelonged = this._getBelongedClassInterval(classess, item[valueIndex]);

        result += columnDelimiter;
        result += classBelonged ? classBelonged.min + ' - ' + classBelonged.max : '';
        result += columnDelimiter;
        result += classBelonged ? classBelonged.count : '';
        result += columnDelimiter;
        result += classBelonged ? classBelonged.color : '';
        result += lineDelimiter;
      });
    } else {
      return '';
    }


    return result;
  }

  private _getBelongedClassInterval(classess, dataValue) {
    let belongedClass = null;
    classess.forEach((classValue, classIndex) => {
      if (classValue.min <= dataValue && dataValue < classValue.max) {
        belongedClass = classess[classIndex];
        return;
      }
    })
    return belongedClass;
  }

  private _prepareGeoJsonDataFromEvents(eventAnalytics) {
    const geoJSONObject: any = [];
    if (eventAnalytics.hasOwnProperty('headers')) {
      const latitudeIndex = eventAnalytics.headers.indexOf(_.find(eventAnalytics.headers, ['name', 'latitude']));
      const longitudeIndex = eventAnalytics.headers.indexOf(_.find(eventAnalytics.headers, ['name', 'longitude']));
      const nameIndex = eventAnalytics.headers.indexOf(_.find(eventAnalytics.headers, ['name', 'ouname']));
      const codeIndex = eventAnalytics.headers.indexOf(_.find(eventAnalytics.headers, ['name', 'oucode']));
      if (eventAnalytics.rows.length > 0) {

        eventAnalytics.rows.forEach(row => {
          const sampleGeometry: any = {
            type: 'Feature',
            geometry: {type: '', coordinates: [row[latitudeIndex], row[longitudeIndex]]},
            properties: {id: row[codeIndex], name: row[nameIndex]}
          };

          sampleGeometry.geometry.type = 'Point';

          geoJSONObject.push(sampleGeometry);
        })
      }
    }
    return {'type': 'FeatureCollection', 'features': geoJSONObject};
  }

  private _prepareGeoJsonDataFromGeoFeatures(geoFeatures: any[], analytics: any[]): any {
    const features = this._getGeoJSONObject(geoFeatures, analytics);
    return {'type': 'FeatureCollection', 'features': features};
  }

  private _getInitialMapObject(visualizationObject: Visualization): MapObject {
    return {
      id: visualizationObject.id,
      mapLegend: null,
      centeringLayer: null,
      operatingLayers: null,
      options: {
        center: [visualizationObject.details.mapConfiguration.latitude, visualizationObject.details.mapConfiguration.longitude],
        zoom: visualizationObject.details.mapConfiguration.zoom,
        maxZoom: 18,
        minZoom: 2,
        zoomControl: true,
        scrollWheelZoom: false,
        layers: []
      }
    };
  }

  private _getMapLayers(L, visualizationLayers, basemap, mapObjectId, prioritizeFilter): any {
    let mapLayers: any[] = [];
    const mapLayersWithNames: any[] = [];
    let centeringLayer: any = null;
    /**
     * Get tile layer from basemap configuration
     */
    const baseMap = this.prepareTileLayer(L, this.tileLayers.getTileLayer(basemap));
    if (baseMap != null) {
      mapLayers.push(baseMap);
      const layerObject = {};
      layerObject[basemap] = baseMap;
      mapLayersWithNames.push(layerObject);
    }


    /**
     * Get other layers as received from visualization Object
     */
    const layersObjectList = [];
    visualizationLayers.forEach((layer, layerIndex) => {
      if (layer.settings.hasOwnProperty('layer')) {

        if (layer.settings.layer === 'boundary') {
          const centerLayer = this._prepareGeoJSON(L, layer.settings, layer.analytics);
          if (centerLayer) {
            mapLayers[0] = centerLayer;
          }
          const layerObject = {};
          layerObject[layer.settings.name] = centerLayer;
          mapLayersWithNames.push(layerObject);
          /**
           * Also add centering
           * @type {L.GeoJSON}
           */
          centeringLayer = centerLayer;

        } else if (layer.settings.layer === 'facility') {
          const centerLayer = this._prepareGeoJSON(L, layer.settings, layer.analytics);
          if (centerLayer) {
            mapLayers[visualizationLayers.length - layerIndex] = centerLayer;
          }
          const layerObject = {};
          layerObject[layer.settings.name] = centerLayer;
          mapLayersWithNames.push(layerObject);
          /**
           * Also add centering
           * @type {L.GeoJSON}
           */
          centeringLayer = centerLayer;

        } else if (layer.settings.layer.indexOf('thematic') !== -1) {
          const centerLayer = this._prepareGeoJSON(L, layer.settings, layer.analytics);
          if (centerLayer) {
            mapLayers[visualizationLayers.length - layerIndex] = centerLayer;
          }

          const layerObject = {};
          layerObject[layer.settings.name] = centerLayer;
          mapLayersWithNames.push(layerObject);
          /**
           * Also add centering
           * @type {L.GeoJSON}
           */
          centeringLayer = centerLayer;

        } else if (layer.settings.layer === 'event') {
          if (layer.settings.eventClustering) {
            const markerClusters: any = !prioritizeFilter ? _.find(this.mapObjects, ['id', mapObjectId]) : undefined;
            let centerLayer: any = null;
            if (markerClusters && !prioritizeFilter) {
              centerLayer = markerClusters.layer;
            } else {
              centerLayer = this._prepareMarkerClusters(L, layer.settings, layer.analytics);
              this.mapObjects.push({id: mapObjectId, layer: centerLayer});
            }

            // mapLayers.push(centerLayer[0]);
            if (centerLayer[0]) {
              mapLayers[visualizationLayers.length - layerIndex] = centerLayer[0];
            }

            const layerObject = {};
            layerObject[layer.settings.name] = centerLayer[0];
            mapLayersWithNames.push(layerObject);
            centeringLayer = centerLayer[1];
          } else {
            const centerLayer = this._prepareMarkersLayerGroup(L, layer.settings, layer.analytics);
            // mapLayers.push(centerLayer[0]);
            if (centerLayer[0]) {
              mapLayers[visualizationLayers.length - layerIndex] = centerLayer[0];
            }

            const layerObject = {};
            layerObject[layer.settings.name] = centerLayer[0];
            mapLayersWithNames.push(layerObject);
            centeringLayer = centerLayer[1];
          }
        } else if (layer.settings.layer === 'external') {
          const external = this.prepareTileLayer(L, this._prepareExternalTileLayer(layer.settings.config));
          // mapLayers.push(external);

          if (external) {
            mapLayers[visualizationLayers.length - layerIndex] = external;
          }
          const layerObject = {};
          layerObject[layer.settings.name] = external;
          mapLayersWithNames.push(layerObject);
        } else if (layer.settings.layer === 'earthEngine') {

        }

      }
    });
    mapLayers = mapLayers.filter(function (element) {
      return element !== undefined;
    })
    return [mapLayers, mapLayersWithNames, centeringLayer];
  }

  prepareTileLayer(L, tileLayer): any {
    if (!tileLayer) {
      return null;
    }

    return L.tileLayer(tileLayer.url, {
      maxZoom: tileLayer.maxZoom,
      attribution: tileLayer.attribution
    });
  }

  private _prepareExternalTileLayer(layerConfig) {
    const layerConfiguration = (new Function('return' + layerConfig))();

    const tileLayer: any = {url: '', name: '', label: '', attribution: ''};
    if (layerConfig) {
      if (layerConfiguration.hasOwnProperty('url')) {
        tileLayer.url = layerConfiguration.url;
        tileLayer.name = layerConfiguration.name;
        tileLayer.label = layerConfiguration.name;
        tileLayer.attribution = layerConfiguration.attribution;
      }
    } else {
      return null;
    }

    return tileLayer;
  }

  private _prepareGeoJSON(L, visualizationLayerSettings, visualizationAnalytics) {
    let options: any = {};
    visualizationLayerSettings = this.legendSet.refineLegendSettings(visualizationLayerSettings);
    let mapLegend = this._prepareMapLegend(visualizationLayerSettings, visualizationAnalytics);
    let LayerEvents = null;

    if (visualizationLayerSettings.layer === 'boundary') {
      mapLegend = this.legendSet.boundaryLayerClasses(visualizationLayerSettings);
      options = this._prepareBoundaryLayerOptions(L, options, visualizationLayerSettings, this.visualizationObject, mapLegend);

    }


    if (visualizationLayerSettings.layer === 'facility') {
      const legendObject = this.legendSet.getFacilityLayerLegendClasses(visualizationLayerSettings, false);
      mapLegend = legendObject[0];
      visualizationLayerSettings = legendObject[1];
      options = this._prepareFacilityLayerOptions(L, options, visualizationLayerSettings, mapLegend);

    }


    if (visualizationLayerSettings.layer.indexOf('thematic') > -1) {
      options = this._prepareThematicLayerOptions(L, options, visualizationLayerSettings, visualizationAnalytics, mapLegend);
    }

    const layer = this._getGEOJSONLayer(L, visualizationLayerSettings, visualizationAnalytics, options);

    if (visualizationLayerSettings.layer === 'boundary') {
      LayerEvents = this._bindBoundaryLayerEvents(L, layer, this.visualizationObject);
    }

    if (visualizationLayerSettings.layer.indexOf('thematic') > -1) {
      LayerEvents = this._bindThematicLayerEvents(L, layer, visualizationAnalytics);
    }

    if (visualizationLayerSettings.layer.indexOf('facility') > -1) {
      LayerEvents = this._bindFacilityLayerEvents(L, layer, visualizationAnalytics);
    }

    if (LayerEvents) {
      layer.on({
          click: LayerEvents.click,
          mouseover: LayerEvents.mouseover,
          mouseout: LayerEvents.mouseout
        }
      )
    }


    return layer;
  }


  /**
   *
   * @param visualizationLayerSettings
   * @param layerAnalytics
   * @returns {{name, layer: string}}
   */
  private _prepareFacilityLayerOptions(L, options, visualizationLayerSettings: any, legendObject: any) {

    options.pointToLayer = (geoJsonPoint, latlng) => {
      const featureImage = this._getFeatureImage(geoJsonPoint, visualizationLayerSettings.geoFeature);
      const icon = L.divIcon({
        className: 'map-marker',
        iconSize: new L.Point(10, 10),
        iconAnchor: [10, 27],
        html: featureImage
      });
      return L.marker(latlng, {icon: icon});
    }

    return options;
  }

  private _getFeatureImage(feature: any, geoFeatures: any) {
    let icon = '<i class="fa fa-home" aria-hidden="true" ></i>';

    const featureId = _.findIndex(geoFeatures, ['id', feature.properties.id]);
    if (featureId > -1) {
      icon = '<img src="../images/orgunitgroup/' + geoFeatures[featureId].dimensions.icon + '">';
    }

    return icon;
  }

  private _bindFacilityLayerEvents(L, layer, visualizationAnalytics) {
    return {
      click: (event) => {

      }, mouseover: (event) => {
        const hoveredFeature: any = event.layer.feature;
        const properties = hoveredFeature.properties;
        let toolTipContent: string = '<div style="color:#333!important;font-size: 10px">' +
          '<table>';

        toolTipContent += '<tr><td style="color:#333!important;font-weight:bold;" > ' + properties.name + ' </td></tr>';


        toolTipContent += '</table></div>';

        layer.bindTooltip(toolTipContent, {
          direction: 'auto',
          permanent: false,
          sticky: true,
          interactive: true,
          opacity: 1
        });

        const popUp = layer.getPopup();
        if (popUp && popUp.isOpen()) {
          layer.closePopup();
        }

      }, mouseout: (event) => {

        const hoveredFeature: any = event.layer.feature;
        layer.setStyle((feature: GeoJSON.Feature<GeoJSON.GeometryObject>) => {
          const properties: any = feature.properties;
          const featureStyle: any =
            {
              'stroke': true,
              'weight': 1
            }
          const hov: any = hoveredFeature.properties;
          if (hov.id === properties.id) {
            featureStyle.weight = 1;
          }
          return featureStyle;
        });
      }
    }
  }


  private _getGEOJSONLayer(L, visualizationLayerSettings, visualizationAnalytics, options) {
    const geoJsonFeatures = this._getGeoJSONObject(visualizationLayerSettings.geoFeature, visualizationAnalytics);
    const showLabels = visualizationLayerSettings.labels;
    let layer: any;
    let layerGroup: any;

    const geoJsonLayer: any = L.geoJSON(geoJsonFeatures, options);

    if (showLabels) {
      visualizationLayerSettings.geoFeature = geoJsonFeatures;
      const labels = this._getMapLabels(L, visualizationLayerSettings);
      layerGroup = L.layerGroup([geoJsonLayer, labels]);
    } else {
      layerGroup = geoJsonLayer;
    }

    layer = layerGroup;
    return layer;
  }

  private _getMapLabels(L, visualizationLayerSettings) {
    const markerLabels = [];
    const sanitizeColor = (color: any) => {

      if (color && color.indexOf('#') > -1) {
        const colors = color.split('#');
        color = '#' + colors[colors.length - 1];
      }
      return color;
    }

    const features = visualizationLayerSettings.geoFeature;
    features.forEach(feature => {
      let center: any;
      if (feature.geometry.type === 'Point') {
        center = L.latLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]);
      } else {
        center = new L.LatLngBounds(feature.geometry.coordinates);
      }

      const label = L.marker(center, {
        icon: L.divIcon({
          iconSize: null,
          className: 'label',
          html: '<div  style="color:' + sanitizeColor(visualizationLayerSettings.labelFontColor) + '!important;font-size:' + visualizationLayerSettings.labelFontSize + '!important;;font-weight:bolder!important;;-webkit-text-stroke: 0.04em white!important;;">' + feature.properties.name + '</div>'
        })
      })

      markerLabels.push(label);

    });

    return L.layerGroup(markerLabels);
  }

  private _bindBoundaryLayerEvents(L, layer, visualizationObject) {

    let dataArrayByOrgUnitUid = this._prepareDataByArrayByOrgUnitUid(visualizationObject.layers);
    return {
      click: (event) => {
      }, mouseover: (event) => {
        let hoveredFeature: any = event.layer.feature;
        let data = _.find(dataArrayByOrgUnitUid, ['orgId', hoveredFeature.properties.id]);
        let toolTipContent: string = '<div style=\'color:#333!important;font-size: 10px\'>' +
          '<table>';

        if (data) {
          toolTipContent += '<tr><td style=\'color:#333!important;font-weight:bold;\'> ' + hoveredFeature.properties.name + ' </td><td style=\'color:#333!important;\' > ( ' + data.value + ' ) </td></tr>';
        } else {
          toolTipContent += '<tr><td style=\'color:#333!important;font-weight:bold;\' > ' + hoveredFeature.properties.name + ' </td></tr>';

        }

        toolTipContent += '</table></div>';

        layer.bindTooltip(toolTipContent, {
          direction: 'auto',
          permanent: false,
          sticky: true,
          interactive: true,
          opacity: 1
        });

        let popUp = layer.getPopup();
        if (popUp && popUp.isOpen()) {
          layer.closePopup();
        }
        layer.setStyle((feature: GeoJSON.Feature<GeoJSON.GeometryObject>) => {
          let properties: any = feature.properties;
          let featureStyle: any =
            {
              'stroke': true,
              'weight': 1
            }
          if (hoveredFeature.properties.id === properties.id) {
            featureStyle.weight = 3;
          }


          return featureStyle;
        });
      }, mouseout: (event) => {

        const hoveredFeature: any = event.layer.feature;
        layer.setStyle((feature: GeoJSON.Feature<GeoJSON.GeometryObject>) => {
          let properties: any = feature.properties;
          let featureStyle: any =
            {
              'stroke': true,
              'weight': 1
            }
          let hov: any = hoveredFeature.properties;
          if (hov.id === properties.id) {
            featureStyle.weight = 1;
          }
          return featureStyle;
        });
      }
    }
  }

  private _bindThematicLayerEvents(L, layer, visualizationAnalytics) {
    let totalValues: number = 0;
    const valueIndex = _.findIndex(visualizationAnalytics.headers, ['name', 'value']);
    visualizationAnalytics.rows.forEach(row => {
      totalValues += +(row[valueIndex]);
    });

    return {
      click: (event) => {

      }, mouseover: (event) => {
        const hoveredFeature: any = event.layer.feature;
        const properties = hoveredFeature.properties;
        let toolTipContent: string = '<div style="color:#333!important;font-size: 10px">' +
          '<div>';

        if (properties['dataElement.value']) {
          toolTipContent += '<p><span style="color:#333!important;font-weight:bold;"> ' + properties.name + ' </span><span style="color:#333!important;" > ( ' + properties['dataElement.value'] + ' ) ' + ((properties['dataElement.value'] / totalValues) * 100).toFixed(0) + '% </span></p>';
        } else {
          toolTipContent += '<p><span style="color:#333!important;font-weight:bold;" > ' + properties.name + ' </span></p>';

        }

        toolTipContent += '</div></div>';

        // layer.bindTooltip(toolTipContent, {
        //   direction: 'auto',
        //   permanent: false,
        //   sticky: true,
        //   interactive: true,
        //   opacity: 1
        // });

        const popUp = layer.getPopup();
        if (popUp && popUp.isOpen()) {
          layer.closePopup();
        }
        layer.setStyle((feature: GeoJSON.Feature<GeoJSON.GeometryObject>) => {
          const properties: any = feature.properties;
          const featureStyle: any =
            {
              'stroke': true,
              'weight': 1
            }
          if (hoveredFeature.properties.id === properties.id) {
            featureStyle.weight = 3;
          }


          return featureStyle;
        })
      }, mouseout: (event) => {

        const hoveredFeature: any = event.layer.feature;
        layer.setStyle((feature: GeoJSON.Feature<GeoJSON.GeometryObject>) => {
          const properties: any = feature.properties;
          const featureStyle: any =
            {
              'stroke': true,
              'weight': 1
            }
          const hov: any = hoveredFeature.properties;
          if (hov.id === properties.id) {
            featureStyle.weight = 1;
          }
          return featureStyle;
        });
      }
    }
  }

  private _prepareDataByArrayByOrgUnitUid(layers) {
    // TODO: this function has to be checked again for further improvement
    const thematicLayers = [];
    const thematicValues = [];
    layers.forEach(layer => {
      if (layer.settings.layer.indexOf('thematic') >= 0) {
        thematicLayers.push(layer.analytics);
      }
    })

    thematicLayers.forEach(layerValues => {
      const valueIndex = _.findIndex(layerValues.headers, ['name', 'value']);
      const orgIndex = _.findIndex(layerValues.headers, ['name', 'ou']);
      const dxIndex = _.findIndex(layerValues.headers, ['name', 'dx']);
      layerValues.rows.forEach(row => {
        thematicValues.push({
          data: layerValues.metaData.names[row[dxIndex]],
          orgId: row[orgIndex],
          value: row[valueIndex]
        });
      })
    });
    return thematicValues;
  }

  private _prepareThematicLayerOptions(L, options, visualizationLayerSettings, visualizationAnalytics, mapLegend) {
    let totalValues: number = 0;
    const valueIndex = _.findIndex(visualizationAnalytics.headers, ['name', 'value']);
    const legend = this.legendSet.getMapRadiusLegend(visualizationLayerSettings, visualizationAnalytics);
    visualizationAnalytics.rows.forEach(row => {
      totalValues += +(row[valueIndex]);
    });

    const showLabels = visualizationLayerSettings.labels;
    const labels = [];


    const sanitizeColor = (color: any) => {
      const colors = color.split('#');
      color = '#' + colors[colors.length - 1];
      return color;
    }


    options.style = (feature) => {
      return this._prepareFeatureStyle(feature, visualizationLayerSettings, mapLegend);
    }

    options.onEachFeature = (feature: any, layer: any) => {
      setTimeout(() => {
        const featureName = feature.properties.name;

        let toolTipContent: string =
          '<div style="color:#333!important;font-size: 10px">' +
          '<div>';
        toolTipContent += '<div><span style="color:#333!important;text-align: center;" ><b> ' + featureName + '</b></span></div>';
        if (feature.properties['dataElement.value']) {
          const fraction = (feature.properties['dataElement.value'] / totalValues);
          const percent = fraction ? ( fraction * 100).toFixed(0) + '%' : '';
          toolTipContent += '<div ><span style="color:#333!important;font-weight:bold;">Data: </span><span style="color:#333!important;" > ' + feature.properties['dataElement.name'] + '</span>' +
            '<div style="padding:0px!important;"><span style="color:#333!important;font-weight:bold;">Value: </span><span style="color:#333!important;" > ' + feature.properties['dataElement.value'] + '  (' + percent + ')</span>';
          toolTipContent += '<div><span style="color:#333!important;font-weight:bold;" ></span></div>';
        }
        '</div>' +
        '</div>';

        layer.bindPopup(toolTipContent);

        if (showLabels) {
          let center = null;
          if (feature.geometry.type === 'Point') {
            center = L.latLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]);
          } else {
            center = layer.getBounds().getCenter();
          }

          const label = L.marker(center, {
            icon: L.divIcon({
              iconSize: null,
              className: 'label',
              html: '<div  style="color:' + sanitizeColor(visualizationLayerSettings.labelFontColor) + '!important;font-size:' + visualizationLayerSettings.labelFontSize + '!important;;font-weight:bolder!important;;-webkit-text-stroke: 0.04em white!important;;">' + feature.properties.name + '</div>'
            })
          })
          labels.push(label);
        }

      }, 10);
    }

    options.pointToLayer = (feature, latlng) => {
      const geojsonMarkerOptions = {
        radius: this.legendSet.getFeatureRadius(legend, feature.properties['dataElement.value']),
        fillColor: '#ff7800',
        color: '#000',
        weight: 0.5,
        opacity: visualizationLayerSettings.opacity,
        fillOpacity: visualizationLayerSettings.opacity
      };
      const circleMarker = L.circleMarker(latlng, geojsonMarkerOptions);
      return circleMarker
    }


    return options;

  }

  private _prepareBoundaryLayerOptions(L, options, visualizationLayerSettings, visualizationObject, mapLegend) {
    let totalNumber: any = 0;
    const dataArrayByOrgUnitUid = this._prepareDataByArrayByOrgUnitUid(visualizationObject.layers);
    dataArrayByOrgUnitUid.forEach(data => {
      totalNumber += +(data.value);
    });
    options.style = (feature) => {
      return this._prepareBoundaryFeatureStyle(feature, visualizationLayerSettings, mapLegend);
    }

    options.onEachFeature = (feature: any, layer: any) => {
      setTimeout(() => {
        const featureName = feature.properties.name;
        const data = _.find(dataArrayByOrgUnitUid, ['orgId', feature.properties.id]);
        let toolTipContent: string =
          '<div style="color:#333!important;font-size: 10px">' +
          '<table>';
        toolTipContent += '<tr><td style="color:#333!important;font-weight:bold;"></td><td style="color:#333!important;" > ' + featureName + '</td>';
        if (data) {
          const fraction = (data.value / totalNumber);
          const percent = fraction ? '(' + (fraction * 100).toFixed(0) + '%)' : '';
          toolTipContent += '<tr><td style="color:#333!important;font-weight:bold;">Data: </td><td style="color:#333!important;" > ' + data.data + '</td>' + '<tr><td style="color:#333!important;font-weight:bold;">Value: </td><td style="color:#333!important;" > ' + data.value + ' (' + percent + ')</td>';
          toolTipContent += '<tr><td style="color:#333!important;font-weight:bold;" ></td></tr>';
        }
        toolTipContent += '</tr>' +
          '</table>' +
          '</div>';

        layer.bindPopup(toolTipContent);
      }, 10);
    }

    options.pointToLayer = (feature, latlng) => {
      const geojsonMarkerOptions = {
        radius: visualizationLayerSettings.radiusLow ? visualizationLayerSettings.radiusLow : 5,
        weight: 0.9,
        opacity: visualizationLayerSettings.opacity ? visualizationLayerSettings.opacity : 0.8,
        fillOpacity: visualizationLayerSettings.opacity ? visualizationLayerSettings.opacity : 0.8
      };
      const circleMarker = L.circleMarker(latlng, geojsonMarkerOptions);
      return circleMarker
    }

    return options;

  }

  private _getGeoJSONObject(geoFeatures: any[], analyticObject: any): any {
    const geoJSONObject: any = [];
    if (geoFeatures) {
      geoFeatures.forEach((geoFeature) => {
        const sampleGeometry: any = {
          'type': 'Feature',
          'le': geoFeature.le,
          'geometry': {'type': '', coordinates: JSON.parse(geoFeature.co)},
          'properties': {
            'id': geoFeature.id,
            'name': geoFeature.na,
            'dataElement.id': '',
            'dataElement.name': '',
            'dataElement.value': 0
          }
        };


        /**
         * Also get data if analytics is not empty
         */
        if (analyticObject) {
          const dataElement = this._getDataForGeoFeature(geoFeature.id, analyticObject);

          if (dataElement) {
            // sampleGeometry.properties.dataElement = dataElement;
            sampleGeometry.properties['dataElement.id'] = dataElement.id;
            sampleGeometry.properties['dataElement.name'] = dataElement.name;
            sampleGeometry.properties['dataElement.value'] = dataElement.value;
          }
        }

        // TODO:: FIND BEST WAY TO DETERMINE FEATURE TYPE
        if (geoFeature.le >= 4) {
          sampleGeometry.geometry.type = 'Point';
        } else if (geoFeature.le >= 1) {
          sampleGeometry.geometry.type = 'MultiPolygon';
        }

        geoJSONObject.push(sampleGeometry);
      });
      return geoJSONObject;
    }
  }

  private _getDataForGeoFeature(geoFeatureId: string, analyticObject: any): any {
    let data: any = {};
    const geoFeatureIndex = analyticObject.headers.indexOf(_.find(analyticObject.headers, ['name', 'ou']));
    const dataIndex = analyticObject.headers.indexOf(_.find(analyticObject.headers, ['name', 'value']));
    const metadataIndex = analyticObject.headers.indexOf(_.find(analyticObject.headers, ['name', 'dx']));

    analyticObject.rows.forEach(row => {
      if (geoFeatureId === row[geoFeatureIndex]) {
        data.id = row[metadataIndex];
        data.name = analyticObject.metaData.names[row[metadataIndex]];
        data.value = row[dataIndex]
      }
    });

    return data !== {} ? data : undefined;
  }

  private _prepareBoundaryFeatureStyle(feature, visualizationLayerSettings, legendSet) {
    const opacity = visualizationLayerSettings.opacity;
    let colorObject: any = _.find(legendSet, ['name', feature.le]);
    let featureStyle: any = {
      'color': colorObject.color,
      'fillColor': '#ffffff',
      'fillOpacity': 0,
      'weight': 1,
      'opacity': opacity,
      'stroke': true
    };
    return featureStyle;
  }

  private _prepareFeatureStyle(feature, visualizationLayerSettings, legendSet) {
    const opacity = visualizationLayerSettings.opacity;
    let featureStyle: any = {
      'color': '#000000',
      'fillColor': '#ffffff',
      'fillOpacity': 0,
      'weight': 1,
      'opacity': 0.8,
      'stroke': true
    }

    if (feature.properties['dataElement.id'] !== '') {
      featureStyle = this._updateFillColor(featureStyle, opacity, feature.properties['dataElement.value'], legendSet);
    }

    return featureStyle;
  }

  private _prepareMapLegend(visualizationLayerSettings, visualizationAnalytics) {
    const legendSettings: any = visualizationLayerSettings;
    const dataArray = [];

    let legendsFromLegendSet = null;
    let obtainedDataLegend = null;

    if (!legendSettings.colorScale && !legendSettings.legendSet) {
      legendSettings['colorScale'] = this.colorInterpolation.getColorScaleFromHigLow(visualizationLayerSettings);
    }

    if (!legendSettings.colorScale && legendSettings.legendSet) {
      legendsFromLegendSet = this.legendSet.getColorScaleFromLegendSet(legendSettings.legendSet);
      legendSettings['colorScale'] = legendsFromLegendSet.colorScale;
    }


    if (legendSettings.colorScale && legendSettings.legendSet) {
      legendsFromLegendSet = this.legendSet.getColorScaleFromLegendSet(legendSettings.legendSet);
      legendSettings['colorScale'] = legendsFromLegendSet.colorScale;
    }

    if (visualizationAnalytics) {
      visualizationAnalytics.rows.forEach((row) => {
        dataArray.push(+row[_.findIndex(visualizationAnalytics.headers, {'name': 'value'})]);
      })
      const sortedData = _(dataArray).sortBy().value();


      if (legendSettings.method === 1 && visualizationLayerSettings && visualizationAnalytics) {
        obtainedDataLegend = this.legendSet.prepareLegendSet(visualizationLayerSettings, legendsFromLegendSet, visualizationAnalytics);
      }

      if (legendSettings.method === 2 && visualizationLayerSettings && visualizationAnalytics) {
        if (legendSettings.legendSet) {
          obtainedDataLegend = this.legendSet.prepareLegendSet(visualizationLayerSettings, legendsFromLegendSet, visualizationAnalytics);
        } else {
          obtainedDataLegend = this.legendSet.generateLegendClassLimits(visualizationLayerSettings, visualizationAnalytics);
        }

      }

      if (legendSettings.method === 3 && visualizationLayerSettings && visualizationAnalytics) {
        if (legendsFromLegendSet) {
          obtainedDataLegend = this.legendSet.prepareLegendSet(visualizationLayerSettings, legendsFromLegendSet, visualizationAnalytics);
        } else {
          obtainedDataLegend = this.legendSet.generateLegendClassLimits(visualizationLayerSettings, visualizationAnalytics);
        }
      }

    }

    return obtainedDataLegend;
  }

  private _prepareMarkerClusters(L, visualizationLayerSettings: any, visualizationAnalytics: any): any {
    const markersCoordinates = [];
    const markers = new L.MarkerClusterGroup({
      spiderfyOnMaxZoom: false,
      showCoverageOnHover: false,
      iconCreateFunction: (cluster) => {
        const childMarkers = cluster.getAllChildMarkers();
        return this._iconCreateFunction(L, cluster, visualizationLayerSettings)
      }
    });

    if (visualizationAnalytics && visualizationAnalytics.hasOwnProperty('headers')) {
      const latitudeIndex = visualizationAnalytics.headers.indexOf(_.find(visualizationAnalytics.headers, ['name', 'latitude']));
      const longitudeIndex = visualizationAnalytics.headers.indexOf(_.find(visualizationAnalytics.headers, ['name', 'longitude']));
      const nameIndex = visualizationAnalytics.headers.indexOf(_.find(visualizationAnalytics.headers, ['name', 'ouname']));
      const codeIndex = visualizationAnalytics.headers.indexOf(_.find(visualizationAnalytics.headers, ['name', 'oucode']));

      if (visualizationAnalytics.rows.length > 0) {

        visualizationAnalytics.rows.forEach(row => {
          const title = '<b>' + row[nameIndex] + ' </b><br/>' + '<b>Coordinate:</b>' + row[longitudeIndex] + ',' +
            row[latitudeIndex] + '<br/>' + '<b>Code:</b>' + row[codeIndex];
          const latitude = row[latitudeIndex];
          const longitude = row[longitudeIndex];
          if (latitude && longitude) {
            markersCoordinates.push([latitude, longitude]);
            const icon = L.divIcon({
              iconSize: null,
              html: '<i class="fa fa-map-marker fa-2x" style="color:#276696"></i>'
            });
            markers.addLayer(L.marker([latitude, longitude], {
              icon: icon
            }).bindPopup(title).on({
              mouseover: (event) => {
              }
            }));
          }
        });
      }
    }

    return [markers, markersCoordinates];
  }

  private _iconCreateFunction(L: any, cluster: any, layerSettings: any) {
    const children = cluster.getAllChildMarkers();
    const iconSize = this._calculateClusterSize(cluster.getChildCount());

    layerSettings.eventPointColor = '#' + layerSettings.eventPointColor;
    return L.divIcon({
      html: this._createClusterIcon(iconSize, cluster, layerSettings),
      className: 'marker-cluster ' + layerSettings.id,
      iconSize: new L.Point(iconSize[0], iconSize[1])
    });
  }

  private _createClusterIcon(iconSize, cluster, layerSettings) {
    const marginTop = this._calculateMarginTop(iconSize);
    const height = iconSize[0];
    const width = iconSize[1];
    const htmlContent = '<div style="' +
      'color:#ffffff;text-align:center;' +
      'box-shadow: 0 1px 4px rgba(0, 0, 0, 0.65);' +
      'opacity:' + layerSettings.opacity + ';' +
      'background-color:' + this._eventColor(layerSettings.eventPointColor) + ';' +
      'height:' + height + 'px;width:' + width + 'px;' +
      'font-style:' + layerSettings.labelFontStyle + ';' +
      'font-size:' + layerSettings.labelFontSize + ';' +
      'border-radius:' + iconSize[0] + 'px;">' +
      '<span style="line-height:' + width + 'px;">' + this._writeInKNumberSystem(parseInt(cluster.getChildCount())) + '</span>' +
      '</div>';
    return htmlContent;
  }

  private _eventColor(color) {
    const colorArray = color.split('#');
    return '#' + colorArray[colorArray.length - 1];
  }

  private _writeInKNumberSystem(childCount: any): any {
    return childCount >= 1000 ? childCount = (childCount / 1000).toFixed(1) + 'k' : childCount;
  }

  private _calculateClusterSize(childCount: number): any {
    return childCount < 10 ? [16, 16] :
      (childCount >= 10 && childCount <= 40) ? [20, 20] :
        (childCount > 40 && childCount < 100) ? [30, 30] : [40, 40];
  }

  private _calculateMarginTop(iconSize: any) {
    const size = iconSize[0];
    return size === 30 ? 5 : size === 20 ? 2 : 10;
  }

  private _getSquareDimension(radius: number): number {
    if (!radius) {
      return 0;
    }
    return +(((0.5 * (+(radius)) * 3.14159) * 1.8).toFixed(0));
  }

  private _prepareMarkersLayerGroup(L, settings, visualizationAnalytics) {
    const markersCoordinates = [];
    const markersArray = [];
    if (visualizationAnalytics.hasOwnProperty('headers')) {
      const latitudeIndex = visualizationAnalytics.headers.indexOf(_.find(visualizationAnalytics.headers, ['name', 'latitude']));
      const longitudeIndex = visualizationAnalytics.headers.indexOf(_.find(visualizationAnalytics.headers, ['name', 'longitude']));
      const nameIndex = visualizationAnalytics.headers.indexOf(_.find(visualizationAnalytics.headers, ['name', 'ouname']));
      const codeIndex = visualizationAnalytics.headers.indexOf(_.find(visualizationAnalytics.headers, ['name', 'oucode']));
      if (visualizationAnalytics.rows.length > 0) {

        visualizationAnalytics.rows.forEach(row => {
          const title = '<b>' + row[nameIndex] + '</b><br/>' + '<b>Coordinate:</b>' + row[longitudeIndex] + ',' +
            row[latitudeIndex] + '<br/>' + '<b>Code:</b>' + row[codeIndex];
          const latitude = row[latitudeIndex];
          const longitude = row[longitudeIndex];
          if (latitude && longitude) {
            markersCoordinates.push([latitude, longitude]);
            const icon = L.divIcon({
              iconSize: null,
              html: '<i class="fa fa-map-marker fa-2x" style="color:#276696;-webkit-text-stroke: 1px white;"></i>'
            });
            markersArray.push(L.marker([latitude, longitude], {
              icon: icon
            }).bindPopup(title).on({
              mouseover: (event) => {
              }
            }));
          }
        })
      }
    }

    return [L.layerGroup(markersArray), markersCoordinates];
  }

  private _prepareEarthEngineLayer() {

  }

  private _updateFillColor(featureStyle, opacity, value, legendSet) {
    if (legendSet) {
      legendSet.forEach((legend, legendIndex) => {

        if (legend.min <= value && value < legend.max) {
          featureStyle.fillColor = legend.color;
          featureStyle.fillOpacity = opacity;
        }

        if (legendSet.length - 1 === legendIndex && value > legend.min && value === legend.max) {
          featureStyle.fillColor = legend.color;
          featureStyle.fillOpacity = opacity;
        }

      });
    }

    return featureStyle;
  }

  getRelativePeriodHumanReadableString(relative): string {

    return '';
  }

}
