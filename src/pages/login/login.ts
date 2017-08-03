import { Component,OnInit } from '@angular/core';
import { IonicPage, NavController, MenuController } from 'ionic-angular';
import {HttpClientProvider} from "../../providers/http-client/http-client";
import {AppProvider} from "../../providers/app/app";
import {UserProvider} from "../../providers/user/user";
import {TabsPage} from "../tabs/tabs";

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage implements OnInit{

  logoUrl : string;
  currentUser : any;
  isLoginProcessActive : boolean;
  progress : string;
  loggedInInInstance : string;
  progressTracker : any;
  completedTrackedProcess : any;
  currentResourceType : string;

  constructor(public navCtrl: NavController,
              private menu : MenuController,
              private UserProvider : UserProvider,
              private AppProvider : AppProvider,
              private HttpClientProvider : HttpClientProvider,
              ) {

  }

  ngOnInit(){
    this.menu.enable(false);
    this.logoUrl = 'assets/img/logo.png';
    this.currentUser = {};
    this.isLoginProcessActive = false;
    this.progress = "0";
    this.loggedInInInstance = "";
    this.progressTracker = {};
    this.completedTrackedProcess = [];

    this.UserProvider.getCurrentUser().then((currentUser: any)=>{
      if(currentUser && currentUser.serverUrl){
        if(currentUser.password){
          delete currentUser.password;
        }
        this.currentUser = currentUser;
      }
    });
  }

  startLoginProcess(){
    if(this.currentUser.serverUrl && this.currentUser.username && this.currentUser.password){
      this.currentResourceType = "communication";
      this.progressTracker = {};
      let resource = "Authenticating user";
      this.progress = "0";
      this.currentUser.serverUrl = this.AppProvider.getFormattedBaseUrl(this.currentUser.serverUrl);
      this.isLoginProcessActive = true;
      this.loggedInInInstance = "";
      this.reInitiateProgressTrackerObject(this.currentUser);
      this.UserProvider.authenticateUser(this.currentUser).then((response : any)=>{
        response = this.getResponseData(response);
        this.progressTracker[this.currentResourceType].message = "Connection to server has been established";
        this.currentUser = response.user;
        this.loggedInInInstance = this.currentUser.serverUrl;
        if(this.currentUser.serverUrl.split("://").length > 1){
          this.loggedInInInstance = this.currentUser.serverUrl.split("://")[1];
        }
        this.currentUser.authorizationKey = btoa(this.currentUser.username + ':' + this.currentUser.password);
        this.currentUser.currentDatabase = this.AppProvider.getDataBaseName(this.currentUser.serverUrl) + "_"+this.currentUser.username;
        this.reInitiateProgressTrackerObject(this.currentUser);
        this.updateProgressTracker(resource);
        this.progressTracker[this.currentResourceType].message = "Saving current user information";
        this.UserProvider.setUserData(JSON.parse(response.data)).then(userData=>{
          this.progressTracker[this.currentResourceType].message = "Current user information has been saved";
          resource = 'Loading system information';
          this.progressTracker[this.currentResourceType].message = "Loading system information";
          if(this.isLoginProcessActive){
            this.HttpClientProvider.get('/api/system/info',this.currentUser).then((response : any)=>{
              this.progressTracker[this.currentResourceType].message = "System information has been saved";
              this.UserProvider.setCurrentUserSystemInformation(JSON.parse(response.data)).then((dhisVersion)=>{
                this.currentUser.dhisVersion = dhisVersion;
                this.progressTracker[this.currentResourceType].message = "Loading user authorities";
                this.updateProgressTracker(resource);
                if(this.isLoginProcessActive){
                  this.UserProvider.getUserAuthorities(this.currentUser).then((response:any)=>{
                    this.currentUser.authorities = response.authorities;
                    this.updateProgressTracker(resource);
                    this.progressTracker[this.currentResourceType].message= '';
                    this.setLandingPage(this.currentUser);
                  },error=>{
                    this.isLoginProcessActive = false;
                    this.AppProvider.setNormalNotification('Fail to load user authorities');
                    console.error("error : " + JSON.stringify(error));
                  })
                }
              },error=>{
                this.isLoginProcessActive = false;
                this.AppProvider.setNormalNotification('Fail to save system information');
                console.error("error : " + JSON.stringify(error));
              });
            },error=>{
              this.isLoginProcessActive = false;
              this.AppProvider.setNormalNotification('Fail to load system information');
              console.error("error : " + JSON.stringify(error));
            });
          }
        },error=>{
          this.isLoginProcessActive = false;
          this.AppProvider.setNormalNotification('Fail to save current user information');
          console.error("error : " + JSON.stringify(error));
        });
      },(error: any)=>{
        this.isLoginProcessActive = false;
        //fail to login to specified server address
        if (error.status == 0) {
          this.AppProvider.setNormalNotification('Please check your network connectivity');
        } else if (error.status == 401) {
          this.AppProvider.setNormalNotification('You have enter wrong username or password or server address');
        } else {
          console.log(JSON.stringify(error));
          this.AppProvider.setNormalNotification('Please check server address');
        }
        console.error(JSON.stringify(error));
      });
    }else{
      this.AppProvider.setNormalNotification("Please enter server address, username and password");
    }
  }

  getResponseData(response){
    if(response.data.data){
      return this.getResponseData(response.data);
    }else{
      return response;
    }
  }

  cancelLoginProcess(){
    this.isLoginProcessActive = false;
  }

  setLandingPage(currentUser){
    currentUser.isLogin = true;
    this.UserProvider.setCurrentUser(currentUser).then(()=>{
      this.navCtrl.setRoot(TabsPage)
    });
  }

  reInitiateProgressTrackerObject(user){
    if(user.progressTracker && user.currentDatabase && user.progressTracker[user.currentDatabase]){
      this.progressTracker = user.progressTracker[user.currentDatabase];
      this.resetPassSteps();
    }else if(user.currentDatabase && user.progressTracker){
      this.currentUser.progressTracker[user.currentDatabase] = this.getEmptyProgressTracker();
      this.progressTracker = this.currentUser.progressTracker[user.currentDatabase]
    }else{
      this.currentUser["progressTracker"] = {};
      this.progressTracker = {};
      this.progressTracker = this.getEmptyProgressTracker();
    }
  }

  getEmptyProgressTracker(){
    let progressTracker = {};
    progressTracker["communication"] = {count : 3,passStep :[],passStepCount : 0, message : ""};
    progressTracker["finalization"] = {count :0.5,passStep :[],passStepCount : 0, message : ""};
    return progressTracker;
  }

  updateProgressTracker(resourceName){
    let resourceType = "communication";
    if(this.progressTracker[resourceType].passStep.length == this.progressTracker[resourceType].count){
      this.progressTracker[resourceType].passStep.forEach((passStep:any)=>{
        if(passStep.name == resourceName && passStep.hasBeenDownloaded){
          passStep.hasBeenPassed = true;
        }
      });
    }else{
      this.progressTracker[resourceType].passStep.push({name : resourceName,hasBeenSaved : true,hasBeenDownloaded : true,hasBeenPassed : true});
    }
    this.progressTracker[resourceType].passStepCount = this.progressTracker[resourceType].passStepCount + 1;
    this.currentUser["progressTracker"][this.currentUser.currentDatabase] = this.progressTracker;
    this.UserProvider.setCurrentUser(this.currentUser).then(()=>{});
    this.completedTrackedProcess = this.getCompletedTrackedProcess();
    this.updateProgressBarPercentage();
  }

  updateProgressBarPercentage(){
    let total = 0; let completed = 0;
    Object.keys(this.progressTracker).forEach(key=>{
      let process = this.progressTracker[key];
      process.passStep.forEach((passStep : any)=>{
        if(passStep.name && passStep.hasBeenPassed){
          completed = completed + 1;
        }
      });
      total += process.count;
    });
    let value = (completed/total) * 100;
    this.progress = value.toFixed(2);
  }

  getCompletedTrackedProcess(){
    let completedTrackedProcess = [];
    Object.keys(this.progressTracker).forEach(key=>{
      let process = this.progressTracker[key];
      process.passStep.forEach((passStep : any)=>{
        if(passStep.name && passStep.hasBeenDownloaded){
          if(completedTrackedProcess.indexOf(passStep.name) == -1){
            completedTrackedProcess.push(passStep.name);
          }
        }
      });
    });
    return completedTrackedProcess;
  };

  resetPassSteps(){
    this.progressTracker.communication.passStep = [];
    this.progressTracker.communication.passStepCount = 0;
  }

}
