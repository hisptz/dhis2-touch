/**
 * Created by mpande on 3/8/18.
 */
import {Injectable} from '@angular/core';
import {Extent} from './extent';
@Injectable()
export class Point {
  constructor(private ext: Extent) {
  }

  writePoints(coordinates, theExtent, shpView, shxView) {
    const contentLength = 28;
    let fileLength = 100;
    let shpI = 0;
    let shxI = 0;

    coordinates.forEach((coords, i) => {
      // HEADER
      // 4 record number
      // 4 content length in 16-bit words (20/2)
      shpView.setInt32(shpI, i);
      shpView.setInt32(shpI + 4, 10);

      // record
      // (8 + 8) + 4 = 20 content length
      shpView.setInt32(shpI + 8, 1, true); // POINT=1
      shpView.setFloat64(shpI + 12, coords[0], true); // X
      shpView.setFloat64(shpI + 20, coords[1], true); // Y

      // index
      shxView.setInt32(shxI, fileLength / 2); // length in 16-bit words
      shxView.setInt32(shxI + 4, 10);

      shxI += 8;
      shpI += contentLength;
      fileLength += contentLength;
    });
  }
}

export function extent(coordinates) {
  return coordinates.reduce((theExtent, coords) => {

    this.ext.enlarge(theExtent, coords);
  }, this.ext.blank());
}

export function parts(geometries, TYPE?) {
  return geometries.length;
}

export function shxLength(coordinates) {
  return coordinates.length * 8;
}
