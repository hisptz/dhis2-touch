/**
 * Created by mpande on 3/8/18.
 */
import {Injectable} from '@angular/core';
import {types} from './constants';
import {prj} from './constants';
import {Poly} from './poly';
import {Point} from './points';
import * as dbf from 'dbf';
import {MultiPoly} from './multipoly';
@Injectable()
export class Writer {
  writers = {POINT: null, POLYGON: null, MULTIPOLYGON: null}; //:TODO sophisticate this way of doing things

  constructor(private multiPoly: MultiPoly, private poly: Poly, private points: Point) {
    this.writers.POINT = this.points;
    this.writers.POLYGON = this.poly;
    this.writers.MULTIPOLYGON = this.multiPoly;
  }

  write(rows, geometry_type, geometries, callback) {
    console.log(geometry_type);
    console.log(this.writers[geometry_type]);
    const writer = this.writers[geometry_type],
      TYPE = types.geometries[geometry_type],
      parts = writer.parts(geometries),
      shpLength = 100 + (parts - geometries.length) * 4 + writer.shpLength(geometries),
      shxLength = 100 + writer.shxLength(geometries),
      shpBuffer = new ArrayBuffer(shpLength),
      shpView = new DataView(shpBuffer),
      shxBuffer = new ArrayBuffer(shxLength),
      shxView = new DataView(shxBuffer),
      extent = writer.extent(geometries);
      this.writeHeader(shpView, TYPE);
      this.writeHeader(shxView, TYPE);
      this.writeExtent(extent, shpView);
      this.writeExtent(extent, shxView);

    writer.write(geometries, extent,
      new DataView(shpBuffer, 100),
      new DataView(shxBuffer, 100),
      TYPE);

    shpView.setInt32(24, shpLength / 2);
    shxView.setInt32(24, (50 + geometries.length * 4));

    const dbfBuf = dbf.structure(rows);

    callback(null, {
      shp: shpView,
      shx: shxView,
      dbf: dbfBuf,
      prj: prj
    });

  }

  writeHeader(view, TYPE) {
    view.setInt32(0, 9994);
    view.setInt32(28, 1000, true);
    view.setInt32(32, TYPE, true);
}

  writeExtent(extent, view) {
    view.setFloat64(36, extent.xmin, true);
    view.setFloat64(44, extent.ymin, true);
    view.setFloat64(52, extent.xmax, true);
    view.setFloat64(60, extent.ymax, true);
}

}
