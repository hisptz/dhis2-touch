import {Injectable} from '@angular/core';
/**
 * Created by mpande on 3/8/18.
 */
@Injectable()
export class GeoJson {
  point() {
    return this.justType('Point', 'POINT');
  }

  line() {
    return this.justType('LineString', 'POLYLINE');
  }


  polygon() {
    return this.justType('Polygon', 'POLYGON');
  }


  private justType(type, TYPE) {
    return (geoJson) => {
      const ofType = geoJson.features.filter(this.isType(type));

      return {
        geometries: (TYPE === 'POLYGON' || TYPE === 'POLYLINE') ? [ofType.map(this.justCoordinates)] : ofType.map(this.justCoordinates),
        properties: ofType.map(this.justProps),
        type: TYPE
      };
    };
  }

  private justCoordinates(feature) {
    if (feature.geometry.coordinates[0] !== undefined && feature.geometry.coordinates[0][0] !== undefined && feature.geometry.coordinates[0][0][0] !== undefined) {
      return feature.geometry.coordinates[0];
    } else {
      return feature.geometry.coordinates;
    }
  }

  isType(type) {
    return (feature) => {
      console.log(feature.geometry.type, type);
      return feature.geometry.type === type;
    };
  }

  justProps(type) {
    return type.properties;
  }
}
