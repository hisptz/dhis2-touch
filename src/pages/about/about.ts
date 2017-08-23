import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import {AboutProvider} from "../../providers/about/about";
import {AppProvider} from "../../providers/app/app";

/**
 * Generated class for the AboutPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage implements OnInit{

  logoUrl : string;

  appInformation : any;
  systemInfo : any;

  loadingMessage : string;
  isLoading : boolean = true;

  aboutContents : Array<any>;
  isAboutContentOpen : any = {};

  constructor(public navCtrl: NavController,
              private appProvider : AppProvider,
              private aboutProvider : AboutProvider) {
  }

  ngOnInit(){
    this.loadingMessage = 'Loading app information';
    this.isLoading = true;
    this.logoUrl = 'assets/img/logo.png';
    this.aboutContents = this.aboutProvider.getAboutContentDetails();
    this.aboutProvider.getAppInformation().then(appInformation=>{
      this.appInformation = appInformation;
      this.loadingMessage = 'Loading system information';
      this.aboutProvider.getSystemInformation().then(systemInfo=>{
        this.systemInfo = systemInfo;
        if(this.aboutContents.length > 0 ){
          this.toggleAboutContents(this.aboutContents[0]);
        }
        this.isLoading = false;
        this.loadingMessage = '';
      }).catch(error=>{
        this.isLoading = false;
        this.loadingMessage = '';
        console.log(JSON.stringify(error));
        this.appProvider.setNormalNotification('Fail to load system information');
      });
    }).catch(error=>{
      this.isLoading = false;
      this.loadingMessage = '';
      console.log(JSON.stringify(error));
      this.appProvider.setNormalNotification('Fail to load app information');
    })
  }

  toggleAboutContents(content){
    if(content && content.id){
      if(this.isAboutContentOpen[content.id]){
        this.isAboutContentOpen[content.id] = false;
      }else{
        Object.keys(this.isAboutContentOpen).forEach(id=>{
          this.isAboutContentOpen[id] = false;
        });
        this.isAboutContentOpen[content.id] = true;
      }
    }
  }

}
