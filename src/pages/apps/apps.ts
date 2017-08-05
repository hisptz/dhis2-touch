import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

/**
 * Generated class for the AppsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-apps',
  templateUrl: 'apps.html',
})
export class AppsPage {

  constructor(public navCtrl: NavController) {
  }


  goToView(viewName){
    this.navCtrl.push(viewName);
  }

}
