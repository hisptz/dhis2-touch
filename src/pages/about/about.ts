import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import {AboutProvider} from "../../providers/about/about";
import {AppProvider} from "../../providers/app/app";
import {DataValuesProvider} from "../../providers/data-values/data-values";
import {UserProvider} from "../../providers/user/user";

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
  currentUser: any;

  appInformation : any;
  systemInfo : any;

  loadingMessage : string;
  isLoading : boolean = true;

  aboutContents : Array<any>;
  isAboutContentOpen : any = {};

  dataValuesStorage : any = { online : 0,offline : 0};



  constructor(public navCtrl: NavController,
              private appProvider : AppProvider,
              private aboutProvider : AboutProvider, private dataValuesProvider: DataValuesProvider, private userProvider: UserProvider) {
  }

  ngOnInit() {
    this.loadingMessage = 'Loading app information';
    this.isLoading = true;
    this.logoUrl = 'assets/img/logo.png';
    this.aboutContents = this.aboutProvider.getAboutContentDetails();
    this.userProvider.getCurrentUser().then((currentUser: any) => {
      this.currentUser = currentUser;
      this.aboutProvider.getAppInformation().then(appInformation => {
        this.appInformation = appInformation;
        this.loadingMessage = 'Loading system information';
        this.aboutProvider.getSystemInformation().then(systemInfo => {
          this.systemInfo = systemInfo;
          if (this.aboutContents.length > 0) {
            this.toggleAboutContents(this.aboutContents[0]);
          }
          this.loadingDataValueStatus();

          this.isLoading = false;
          this.loadingMessage = '';
        }).catch(error => {
          this.isLoading = false;
          this.loadingMessage = '';
          console.log(JSON.stringify(error));
          this.appProvider.setNormalNotification('Fail to load system information');
        });
      }).catch(error => {
        this.isLoading = false;
        this.loadingMessage = '';
        console.log(JSON.stringify(error));
        this.appProvider.setNormalNotification('Fail to load app information');
      })

    }, error => {
      this.isLoading = false;
      this.appProvider.setNormalNotification("Fail to load user information");
    })
  }

  ionViewDidEnter(){
    this.ngOnInit();
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


  loadingDataValueStatus(ionRefresher?){
    this.loadingMessage = 'Loading data values storage status';
    this.isLoading = true;
    this.dataValuesProvider.getDataValuesByStatus("synced",this.currentUser).then((syncedDataValues : any)=>{

      this.dataValuesProvider.getDataValuesByStatus("not-synced",this.currentUser).then((unSyncedDataValues : any)=>{
        this.dataValuesStorage.offline = unSyncedDataValues.length;
        this.dataValuesStorage.online = syncedDataValues.length;
        this.dataValuesStorage["synced"] = syncedDataValues;
        this.dataValuesStorage["not-synced"] = unSyncedDataValues;

      },error=>{
        if(ionRefresher){
          ionRefresher.complete();
        }
        this.appProvider.setNormalNotification('Fail to loading data values storage status');
        this.isLoading = false;
      });
    },error=>{
      if(ionRefresher){
        ionRefresher.complete();
      }
      this.appProvider.setNormalNotification('Fail to loading data values storage status');
      this.isLoading = false;
    });
  }


  viewDataValuesSynchronisationStatusByDataSets(syncStatus){
    if(this.dataValuesStorage[syncStatus].length > 0){
      this.navCtrl.push('DataValuesSyncContainerPage',{dataValues : this.dataValuesStorage[syncStatus],syncStatus:syncStatus});
    }else{
      this.appProvider.setNormalNotification("There is nothing to view");
    }
  }


}
