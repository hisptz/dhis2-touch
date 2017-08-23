import { Component, OnInit} from '@angular/core';
import { IonicPage, ModalController, MenuController } from 'ionic-angular';
import {NetworkAvailabilityProvider} from "../../providers/network-availability/network-availability";
import {UserProvider} from "../../providers/user/user";
import {AppProvider} from "../../providers/app/app";

/**
 * Generated class for the DashboardPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage implements OnInit{

  currentUser:any;
  isLoading : boolean;
  loadingMessage : string;

  constructor(public modalCtrl:ModalController,
              private appProvider:AppProvider, private userProvider:UserProvider,
              private NetworkAvailability:NetworkAvailabilityProvider,
              private menu:MenuController) {
  }

  ngOnInit() {
    this.menu.enable(true);
    this.isLoading = true;
    this.loadingMessage = "Loading current user information";
    this.userProvider.getCurrentUser().then(currentUser=> {
      this.currentUser = currentUser;
      this.loadingListOfAllDashboards(currentUser);
    }, error=> {
      this.isLoading = false;
      this.appProvider.setNormalNotification("Fail to loading current user information");
    });
  }

  loadingListOfAllDashboards(currentUser) {
    this.isLoading = true;
    let network = this.NetworkAvailability.getNetWorkStatus();
    console.log(JSON.stringify(currentUser));
    console.log(JSON.stringify(network));
  }


}
