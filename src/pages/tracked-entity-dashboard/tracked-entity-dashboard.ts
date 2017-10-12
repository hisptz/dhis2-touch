import {Component, OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the TrackedEntityDashboardPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tracked-entity-dashboard',
  templateUrl: 'tracked-entity-dashboard.html',
})
export class TrackedEntityDashboardPage implements OnInit{

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ngOnInit(){
    let trackedEntityInstancesId = this.navParams.get("trackedEntityInstancesId");
    console.log("trackedEntityInstancesId : " + trackedEntityInstancesId);
  }

  goBack(){
    this.navCtrl.pop().then(()=>{}).catch(error=>{});
  }

}
