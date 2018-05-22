import {Injectable} from '@angular/core';
import * as _ from 'lodash';
import {saveAs} from 'file-saver';
import {Zip} from './zip';


@Injectable()
export class ShapeFileService {

  constructor(private zip: Zip) {
  }

  download(geoJson, fileName) {
    const options = {
      folder: 'myshapes',
      types: {
        point: 'mypoints',
        multipolygon: 'mymultipolygons',
        polygon: 'mypolygons',
        line: 'mylines'
      }
    }
    this.zip.zip(geoJson, options).subscribe((content) => {
      saveAs(content, fileName + '.zip');
    });

  }
}
