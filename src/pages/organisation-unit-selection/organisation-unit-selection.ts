import { Component } from '@angular/core';
import {IonicPage,NavParams, ViewController} from 'ionic-angular';

/**
 * Generated class for the OrganisationUnitSelectionPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-organisation-unit-selection',
  templateUrl: 'organisation-unit-selection.html',
})
export class OrganisationUnitSelectionPage {

  constructor(private viewCtrl : ViewController, private navParams: NavParams) {
  }

  dismiss(){
    this.viewCtrl.dismiss({});
  }

}
