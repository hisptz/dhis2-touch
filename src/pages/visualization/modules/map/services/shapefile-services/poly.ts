/**
 * Created by mpande on 3/8/18.
 */
import {Injectable} from '@angular/core';
import {types} from './constants';
import {Extent} from './extent';
@Injectable()
export class Poly {
  constructor(private ext: Extent) {

  }

  write(geometries, theExent, shpView, shxView, TYPE) {
    let shpI = 0,
      shxI = 0,
      shxOffset = 100;

    geometries.forEach((coordinates, index) => {
      const flattened = this._justCoords(coordinates),
        noParts = this.parts([coordinates], TYPE),
        contentLength = (flattened.length * 16) + 48 + (noParts - 1) * 4;

      const featureExtent = flattened.reduce((extent, c) => {
        return this.ext.enlarge(extent, c);
      }, this.ext.blank());

      // INDEX
      shxView.setInt32(shxI, shxOffset / 2); // offset
      shxView.setInt32(shxI + 4, contentLength / 2); // offset length

      shxI += 8;
      shxOffset += contentLength + 8;

      shpView.setInt32(shpI, index + 1); // record number
      shpView.setInt32(shpI + 4, contentLength / 2); // length
      shpView.setInt32(shpI + 8, TYPE, true); // POLYLINE=3
      shpView.setFloat64(shpI + 12, featureExtent.xmin, true); // EXTENT
      shpView.setFloat64(shpI + 20, featureExtent.ymin, true);
      shpView.setFloat64(shpI + 28, featureExtent.xmax, true);
      shpView.setFloat64(shpI + 36, featureExtent.ymax, true);
      shpView.setInt32(shpI + 44, noParts, true);
      shpView.setInt32(shpI + 48, flattened.length, true); // POINTS
      shpView.setInt32(shpI + 52, 0, true); // The first part - index zero

      const onlyParts = coordinates.reduce((arr, coords) => {
        if (Array.isArray(coords[0][0])) {
          arr = arr.concat(coords);
        } else {
          arr.push(coords);
        }
        return arr;
      }, []);
      for (let p = 1; p < noParts; p++) {
        shpView.setInt32( // set part index
          shpI + 52 + (p * 4),
          onlyParts.reduce((a, b, idx) => {
            return idx < p ? a + b.length : a;
          }, 0),
          true
        );
      }

      flattened.forEach((coords, i) => {
        shpView.setFloat64(shpI + 56 + (i * 16) + (noParts - 1) * 4, coords[0], true); // X
        shpView.setFloat64(shpI + 56 + (i * 16) + (noParts - 1) * 4 + 8, coords[1], true); // Y
      });

      shpI += contentLength + 8;
    });
  }

  shpLength(geometries) {
    return (geometries.length * 56) +
      // points
      (this._justCoords(geometries).length * 16);
  }

  shxLength(geometries) {
    return geometries.length * 8;
  }

  extent(coordinates) {
    return this._justCoords < (coordinates).reduce((extent, c) => {
        return this.ext.enlarge(extent, c);
      }, this.ext.blank());
  }


  parts(geometries, TYPE) {
    let no = 1;

    if (TYPE === types.geometries.POLYGON || TYPE === types.geometries.POLYLINE) {
      no = geometries.reduce((counts, coords) => {
        counts += coords.length;
        if (Array.isArray(coords[0][0][0])) { // multi
          counts += coords.reduce((countsTwo, rings) => {
            return countsTwo + rings.length - 1; // minus outer
          }, 0);
        }
        return counts;
      }, 0);
    }
    return no;
  }

  private _totalPoints(geometries) {
    let sum = 0;
    geometries.forEach((g) => {
      sum += g.length;
    });
    return sum;
  }

  private _justCoords(coords, l?) {
    if (l === undefined) {
      l = [];
    }

    if (typeof coords[0][0] === 'object') {
      return coords.reduce((memo, c) => {
        return memo.concat(this._justCoords(c));
      }, l);
    } else {
      return coords;
    }
  }
}
