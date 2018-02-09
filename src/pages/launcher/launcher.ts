import {Component, OnInit} from '@angular/core';
import { NavController} from 'ionic-angular';
import {LoginPage} from "../login/login";
import {TabsPage} from "../tabs/tabs";
import {UserProvider} from "../../providers/user/user";
import {NetworkAvailabilityProvider} from "../../providers/network-availability/network-availability";
import {AppTranslationProvider} from "../../providers/app-translation/app-translation";
import {ApplicationState} from "../../store/reducers/index";
import {Store} from "@ngrx/store";
import { LoadedCurrentUser} from "../../store/actions/currentUser.actons";

/**
 * Generated class for the LauncherPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-launcher',
  templateUrl: 'launcher.html',
})
export class LauncherPage implements OnInit{
  logoUrl : string;

  constructor(private navCtrl: NavController,
              private UserProvider : UserProvider,
              private store : Store<ApplicationState>,
              private NetworkAvailabilityProvider : NetworkAvailabilityProvider,
              private appTranslationProvider : AppTranslationProvider) {
  }

  ngOnInit(){
    this.logoUrl = 'assets/img/logo.png';
    this.NetworkAvailabilityProvider.setNetworkStatusDetection();
    this.UserProvider.getCurrentUser().subscribe((user : any)=>{
      let currentLanguage = "en";
      if(user && user.currentLanguage){
        currentLanguage = user.currentLanguage;
      }
      this.appTranslationProvider.setAppTranslation(currentLanguage);
      if(user && user.isLogin){
        this.store.dispatch(new LoadedCurrentUser(user));
        this.navCtrl.setRoot(TabsPage);
      }else{
        this.navCtrl.setRoot(LoginPage);
      }
    },error=>{
    });
  }

}
