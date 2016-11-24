import { Component } from '@angular/core';
import { NavController,ToastController } from 'ionic-angular';
import {User} from "../../providers/user/user";
import {HttpClient} from "../../providers/http-client/http-client";
import {AppProvider} from "../../providers/app-provider/app-provider";
import {TabsPage} from "../tabs/tabs";
import {SqlLite} from "../../providers/sql-lite/sql-lite";
import { Storage } from '@ionic/storage';
import {Synchronization} from "../../providers/synchronization";
import {DataValues} from "../../providers/data-values";
import {Setting} from "../../providers/setting";

/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers : [AppProvider,HttpClient,User,SqlLite,Synchronization,DataValues,Setting]
})
export class Login {

  public loginData : any ={};
  public loadingData : boolean = false;
  public loadingMessages : any = [];

  constructor(public navCtrl: NavController,private Storage : Storage,
              private Setting: Setting,
              private sqlLite : SqlLite,private synchronization:Synchronization,
              private toastCtrl: ToastController,private DataValues: DataValues,
              private app : AppProvider,private httpClient : HttpClient,private user : User) {
    this.loginData.logoUrl = 'assets/img/logo.png';
    this.user.getCurrentUser().then(user=>{
      this.reAuthenticateUser(user);
    });
  }

  ionViewDidLoad() {
    //console.log('Hello Login Page');
  }

  reAuthenticateUser(user){
    console.log(user);
    if(user){
      if(user.isLogin){
        this.synchronization.startSynchronization();
        this.navCtrl.setRoot(TabsPage);
      }else if(user.serverUrl){
        this.loginData.serverUrl = user.serverUrl;
        if(user.username){
          this.loginData.username = user.username;
        }
      }
    }
  }

  login(){
    if(this.loginData.serverUrl){
      this.app.getFormattedBaseUrl(this.loginData.serverUrl)
        .then(formattedBaseUrl => {
          this.loginData.serverUrl = formattedBaseUrl;
          if(!this.loginData.username){
            this.setToasterMessage('Please Enter username');
          }else if (!this.loginData.password){
            this.setToasterMessage('Please Enter password');
          }else{
            this.loadingData = true;
            this.loadingMessages = [];
            this.app.getDataBaseName(this.loginData.serverUrl).then(databaseName=>{
              this.setLoadingMessages('Opening database');
              this.sqlLite.generateTables(databaseName).then(()=>{
                this.loginData.currentDatabase = databaseName;
                //set authorization key and reset password
                this.loginData.authorizationKey = btoa(this.loginData.username + ':' + this.loginData.password);
                this.loginData.password = "";
                this.user.setCurrentUser(this.loginData).then(()=>{
                  this.setLoadingMessages('Authenticating user');
                  let fields = "fields=[:all],userCredentials[userRoles[name,dataSets[id,name],programs[id,name]]";
                  this.httpClient.get('/api/me.json?'+fields,this.loginData).subscribe(
                    data => {
                      data = data.json();
                      this.user.setUserData(data).then(userData=>{
                        this.setLoadingMessages('Loading system information');
                        this.httpClient.get('/api/system/info',this.loginData).subscribe(
                          data => {
                            data = data.json();
                            this.user.setCurrentUserSystemInformation(data).then(()=>{
                              this.downloadingOrganisationUnits(userData);
                            },error=>{
                              this.loadingData = false;
                              this.setLoadingMessages('Fail to set system information');
                            });
                          },error=>{
                            this.loadingData = false;
                            this.setLoadingMessages('Fail to load system information');
                          })
                      });
                    },err => {
                      this.loadingData = false;
                      this.setToasterMessage('Fail to login Fail to load System information, please checking your network connection or username and password');
                      console.log(err);
                    });
                });
              })
            });
          }
        });
    }else {
      this.setToasterMessage('Please Enter server url');
    }
  }

  downloadingOrganisationUnits(userData){
    this.setLoadingMessages('Downloading assigned organisation data');
    let resource = 'organisationUnits';
    let ids = [];
    userData.organisationUnits.forEach(organisationUnit=>{
      if(organisationUnit.id){
        ids.push(organisationUnit.id);
      }
    });
    let tableMetadata = this.sqlLite.getDataBaseStructure()[resource];
    let fields = tableMetadata.fields;
    this.app.downloadMetadataByResourceIds(this.loginData,resource,ids,fields,null).then(response=>{
      this.setLoadingMessages('Saving organisation data');
      this.app.saveMetadata(resource,response,this.loginData.currentDatabase).then(()=>{
        this.downloadingDataSets();
      },error=>{
        this.loadingData = false;
        this.setStickToasterMessage('Fail to save organisation data. ' + JSON.stringify(error));
      });
    },error=>{
      this.loadingData = false;
      this.setStickToasterMessage('Fail to download organisation data. ' + JSON.stringify(error));
    });
  }

  downloadingDataSets(){
    this.setLoadingMessages('Downloading data entry forms');
    let resource = 'dataSets';
    let tableMetadata = this.sqlLite.getDataBaseStructure()[resource];
    let fields = tableMetadata.fields;
    this.app.downloadMetadata(this.loginData,resource,null,fields,null).then(response=>{
      this.setLoadingMessages('Saving '+response[resource].length+' data entry form');
      this.app.saveMetadata(resource,response[resource],this.loginData.currentDatabase).then(()=>{
        this.downloadingSections();
      },error=>{
        this.loadingData = false;
        this.setStickToasterMessage('Fail to save data entry form. ' + JSON.stringify(error));
      });
    },error=>{
      this.loadingData = false;
      this.setStickToasterMessage('Fail to download data entry form. ' + JSON.stringify(error));
    });
  }

  downloadingSections(){
    this.setLoadingMessages('Downloading data entry form sections');
    let resource = 'sections';
    let tableMetadata = this.sqlLite.getDataBaseStructure()[resource];
    let fields = tableMetadata.fields;
    this.app.downloadMetadata(this.loginData,resource,null,fields,null).then(response=>{
      this.setLoadingMessages('Saving '+response[resource].length+' data entry form sections');
      this.app.saveMetadata(resource,response[resource],this.loginData.currentDatabase).then(()=>{
        this.downloadingIndicators();
      },error=>{
        this.loadingData = false;
        this.setStickToasterMessage('Fail to save data entry form sections. ' + JSON.stringify(error));
      });
    },error=>{
      this.loadingData = false;
      this.setStickToasterMessage('Fail to download data entry form sections. ' + JSON.stringify(error));
    });
  }

  downloadingIndicators(){
    this.setLoadingMessages('Downloading indicators');
    let resource = 'indicators';
    let tableMetadata = this.sqlLite.getDataBaseStructure()[resource];
    let fields = tableMetadata.fields;
    this.app.downloadMetadata(this.loginData,resource,null,fields,null).then(response=>{
      this.setLoadingMessages('Saving '+response[resource].length+' indicators');
      this.app.saveMetadata(resource,response[resource],this.loginData.currentDatabase).then(()=>{
        this.downloadingPrograms();
      },error=>{
        this.loadingData = false;
        this.setStickToasterMessage('Fail to save indicators. ' + JSON.stringify(error));
      });
    },error=>{
      this.loadingData = false;
      this.setStickToasterMessage('Fail to download indicators. ' + JSON.stringify(error));
    });
  }

  downloadingPrograms(){
    this.setLoadingMessages('Downloading programs');
    let resource = 'programs';
    let tableMetadata = this.sqlLite.getDataBaseStructure()[resource];
    let fields = tableMetadata.fields;
    this.app.downloadMetadata(this.loginData,resource,null,fields,null).then(response=>{
      this.setLoadingMessages('Saving '+response[resource].length+' programs');
      this.app.saveMetadata(resource,response[resource],this.loginData.currentDatabase).then(()=>{
        this.downloadingReports();
      },error=>{
        this.loadingData = false;
        this.setStickToasterMessage('Fail to save programs. ' + JSON.stringify(error));
      });
    },error=>{
      this.loadingData = false;
      this.setStickToasterMessage('Fail to download programs. ' + JSON.stringify(error));
    });
  }

  downloadingReports(){
    this.setLoadingMessages('Downloading reports');
    let resource = 'reports';
    let tableMetadata = this.sqlLite.getDataBaseStructure()[resource];
    let fields = tableMetadata.fields;
    let filter = tableMetadata.filter;
    this.app.downloadMetadata(this.loginData,resource,null,fields,filter).then(response=>{
      this.setLoadingMessages('Saving '+response[resource].length+' reports');
      this.app.saveMetadata(resource,response[resource],this.loginData.currentDatabase).then(()=>{
        this.downloadingConstants();
      },error=>{
        this.loadingData = false;
        this.setStickToasterMessage('Fail to save reports. ' + JSON.stringify(error));
      });
    },error=>{
      this.loadingData = false;
      this.setStickToasterMessage('Fail to download reports. ' + JSON.stringify(error));
    });
  }

  downloadingConstants(){
    this.setLoadingMessages('Downloading constants');
    let resource = 'constants';
    let tableMetadata = this.sqlLite.getDataBaseStructure()[resource];
    let fields = tableMetadata.fields;
    this.app.downloadMetadata(this.loginData,resource,null,fields,null).then(response=>{
      this.setLoadingMessages('Saving '+response[resource].length+' constants');
      this.app.saveMetadata(resource,response[resource],this.loginData.currentDatabase).then(()=>{
        this.setLandingPage();
      },error=>{
        this.loadingData = false;
        this.setStickToasterMessage('Fail to save constants. ' + JSON.stringify(error));
      });
    },error=>{
      this.loadingData = false;
      this.setStickToasterMessage('Fail to download constants. ' + JSON.stringify(error));
    });
  }

  setLandingPage(){
    this.loginData.isLogin = true;
    this.user.setCurrentUser(this.loginData).then(()=>{
      this.synchronization.startSynchronization().then(()=>{
        this.navCtrl.setRoot(TabsPage);
      });
    });
  }

  setLoadingMessages(message){
    this.loadingMessages.push(message);
  }

  setToasterMessage(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  setStickToasterMessage(message){
    let toast = this.toastCtrl.create({
      message: message,
      showCloseButton : true
    });
    toast.present();
  }


}
