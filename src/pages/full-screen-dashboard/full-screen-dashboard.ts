import { Component , OnInit} from '@angular/core';
import { IonicPage, ViewController,NavParams } from 'ionic-angular';

/**
 * Generated class for the FullScreenDashboardPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-full-screen-dashboard',
  templateUrl: 'full-screen-dashboard.html',
})
export class FullScreenDashboardPage implements OnInit{

  data : any;
  dashboardItem : any;
  dashboardId : string;
  isInFullScreen : boolean;

  constructor(public viewCtrl: ViewController, public navParams: NavParams) {
  }

  ngOnInit(){
    this.isInFullScreen = true;
    this.dashboardItem = this.navParams.get('dashboardItem');
    this.dashboardId = this.navParams.get('dashboardId');
  }

  loadFullScreenDashboard(modalData){
    this.viewCtrl.dismiss();
  }

}
