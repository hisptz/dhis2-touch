/**
 * Created by mpande on 3/8/18.
 */
import * as JSZip from 'jszip';
import {Injectable} from '@angular/core';
import {GeoJson} from './geojson';
import {prj} from './constants';
import {Writer} from './write';
import {Observable} from 'rxjs/Observable';
// declare var JSzip;
@Injectable()
export class Zip {
  zipIt: JSZip;

  constructor(private geoJson: GeoJson, private writer: Writer) {

  }

  zip(gj, options): Observable<any> {
    this.zipIt = new JSZip();
    return new Observable(observer => {


      // const layers = this.zipIt.folder(options.folder);
      [this.geoJson.point()(gj), this.geoJson.line()(gj), this.geoJson.polygon()(gj)]
        .forEach((feature) => {
          if (feature.geometries.length && feature.geometries[0].length) {
            this.writer.write(
              feature.properties,
              feature.type,
              feature.geometries,
              (err, files) => {
                const fileName = options && options.types[feature.type.toLowerCase()] ?
                  options.types[feature.type.toLowerCase()] : feature.type;
                this.zipIt.file(fileName + '.shp', files.shp.buffer, {binary: true});
                this.zipIt.file(fileName + '.shx', files.shx.buffer, {binary: true});
                this.zipIt.file(fileName + '.dbf', files.dbf.buffer, {binary: true});
                this.zipIt.file(fileName + '.prj', prj);
              }
            );
          }
        });

      const generateOptions = {compression: 'STORE', type: 'blob'};

      // if (!process.browser) {
      //   generateOptions.type = 'nodebuffer';
      // }

      return this.zipIt.generateAsync({type: 'blob'})
        .then(function (content) {
          observer.next(content);
          observer.complete();
        });

    });


  }
}
