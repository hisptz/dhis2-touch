import { Component } from '@angular/core';

/**
 * Generated class for the OrganisationUnitTreeComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'organisation-unit-tree',
  templateUrl: 'organisation-unit-tree.html'
})
export class OrganisationUnitTreeComponent {

  text: string;

  constructor() {
    console.log('Hello OrganisationUnitTreeComponent Component');
    this.text = 'Hello World';
  }

}
