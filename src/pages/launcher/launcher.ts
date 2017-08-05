import { Component,OnInit } from '@angular/core';
import { IonicPage, NavController,MenuController } from 'ionic-angular';
import { BackgroundMode } from '@ionic-native/background-mode';
import {UserProvider} from "../../providers/user/user";
import {NetworkAvailabilityProvider} from "../../providers/network-availability/network-availability";
import {DashboardServiceProvider} from "../../providers/dashboard-service/dashboard-service";
import {TabsPage} from "../tabs/tabs";
/**
 * Generated class for the LauncherPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-launcher',
  templateUrl: 'launcher.html',
})
export class LauncherPage implements OnInit{

  logoUrl : string;

  constructor(private navCtrl: NavController,
              private menu : MenuController,
              private UserProvider : UserProvider,
              private DashboardServiceProvider : DashboardServiceProvider,
              private NetworkAvailabilityProvider : NetworkAvailabilityProvider,
              private backgroundMode: BackgroundMode) {
  }

  ngOnInit(){
    this.logoUrl = 'assets/img/logo.png';
    this.backgroundMode.enable();
    this.menu.enable(false);
    this.NetworkAvailabilityProvider.setNetworkStatusDetection();
    this.DashboardServiceProvider.resetDashboards();
    this.UserProvider.getCurrentUser().then((user : any)=>{
      if(user && user.isLogin){
        this.navCtrl.setRoot(TabsPage);
      }else{
        this.navCtrl.setRoot("LoginPage");
        //this.navCtrl.push('SyncPage')
      }
    },error=>{
    });
  }

}
