import { Component } from '@angular/core';

/**
 * Generated class for the DownloadDataValuesComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'download-data-values',
  templateUrl: 'download-data-values.html'
})
export class DownloadDataValuesComponent {

  text: string;

  constructor() {
    console.log('Hello DownloadDataValuesComponent Component');
    this.text = 'Hello World';
  }

}
