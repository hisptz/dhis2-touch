import { Component,OnInit } from '@angular/core';
import { NavController,ToastController } from 'ionic-angular';
import {User} from "../../providers/user";
import {HttpClient} from "../../providers/http-client";
import {SmsCommand} from "../../providers/sms-command";
import {Synchronization} from "../../providers/synchronization";
import {AppProvider} from "../../providers/app-provider";
import {SqlLite} from "../../providers/sql-lite";
import {TabsPage} from "../tabs/tabs";
import {OrganisationUnit} from "../../providers/organisation-unit";
import {NetworkAvailability} from "../../providers/network-availability";
import {DataSets} from "../../providers/data-sets";
import {DashboardService} from "../../providers/dashboard-service";
import {Program} from "../../providers/program";
import {PeriodService} from "../../providers/period-service";

/*
 Generated class for the Login page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage implements OnInit{

  public loginData : any ={};
  public loadingData : boolean = false;
  public isLoginProcessActive :boolean = false;
  public loadingMessages : any = [];
  public logoUrl : string;
  public loggedInInInstance : string = "";
  public isLoginProcessCancelled : boolean = false;

  //progress tracker object
  public progress : string = "0";
  public progressTracker : any;
  public completedTrackedProcess : any;
  public currentResourceType : string = "";
  //organisationUnit, entryForm,event
  constructor(public navCtrl: NavController,
              public synchronization:Synchronization,
              public DataSets : DataSets,
              public Program : Program,
              public PeriodService : PeriodService,
              public DashboardService: DashboardService,
              public toastCtrl: ToastController,public app : AppProvider,
              public SmsCommand : SmsCommand,public NetworkAvailability : NetworkAvailability,
              public httpClient : HttpClient,public OrganisationUnit : OrganisationUnit,
              public user : User,public sqlLite : SqlLite) {}

  ngOnInit() {
    this.logoUrl = 'assets/img/logo-2.png';
    this.completedTrackedProcess = [];
    this.user.getCurrentUser().then((user: any)=>{
      if(user){
        this.loginData = user
      }
      this.reInitiateProgressTrackerObject(this.loginData);
    });
  }


  reInitiateProgressTrackerObject(user){
    if(user.progressTracker && user.currentDatabase && user.progressTracker[user.currentDatabase]){
      this.progressTracker = user.progressTracker[user.currentDatabase];
      this.resetPassSteps();
    }else if(user.currentDatabase && user.progressTracker){
      this.loginData.progressTracker[user.currentDatabase] = this.getEmptyProgressTracker();
      this.progressTracker = this.loginData.progressTracker[user.currentDatabase]
    }else{
      this.loginData["progressTracker"] = {};
      this.progressTracker = {};
      this.progressTracker = this.getEmptyProgressTracker();
    }
  }

  resetPassSteps(){
    let dataBaseStructure =  this.sqlLite.getDataBaseStructure();
    this.progressTracker["communication"].passStepCount = 0;
    this.progressTracker["communication"].message = "";
    Object.keys(dataBaseStructure).forEach(key=>{
      let table = dataBaseStructure[key];
      if(table.canBeUpdated && table.resourceType){
        if(this.progressTracker[table.resourceType]){
          this.progressTracker[table.resourceType].passStepCount = 0;
          this.progressTracker[table.resourceType].message = "";
          this.progressTracker[table.resourceType].passStep.forEach((passStep : any)=>{
            passStep.hasPassed = false;
          })
        }
      }
    });
  }

  getEmptyProgressTracker(){
    let dataBaseStructure =  this.sqlLite.getDataBaseStructure();
    let progressTracker = {};
    progressTracker["communication"] = {count : 3,passStep :[],passStepCount : 0, message : ""};
    progressTracker["finalization"] = {count :0.5,passStep :[],passStepCount : 0, message : ""};
    Object.keys(dataBaseStructure).forEach(key=>{
      let table = dataBaseStructure[key];
      if(table.canBeUpdated && table.resourceType){
        if(!progressTracker[table.resourceType]){
          progressTracker[table.resourceType] = {count : 1,passStep :[],passStepCount : 0,message :""};
        }else{
          progressTracker[table.resourceType].count += 1;
        }
      }
    });
    return progressTracker;
  }

  updateProgressTracker(resourceName){
    let dataBaseStructure =  this.sqlLite.getDataBaseStructure();
    let resourceType = "communication";
    if(dataBaseStructure[resourceName]){
      let table = dataBaseStructure[resourceName];
      if(table.canBeUpdated && table.resourceType){
        resourceType = table.resourceType
      }
    }

    if(this.progressTracker[resourceType].passStep.length == this.progressTracker[resourceType].count){
      this.progressTracker[resourceType].passStep.forEach((passStep:any)=>{
        if(passStep.name == resourceName && passStep.hasDownloaded){
          passStep.hasPassed = true;
        }
      });
    }else{
      this.progressTracker[resourceType].passStep.push({name : resourceName,hasDownloaded : true,hasPassed : true});
    }
    this.progressTracker[resourceType].passStepCount = this.progressTracker[resourceType].passStepCount + 1;
    this.loginData["progressTracker"][this.loginData.currentDatabase] = this.progressTracker;
    this.user.setCurrentUser(this.loginData).then(()=>{});
    this.completedTrackedProcess = this.getCompletedTrackedProcess();
    this.updateProgressBarPercentage();
  }

  updateProgressBarPercentage(){
    let total = 0; let completed = 0;
    Object.keys(this.progressTracker).forEach(key=>{
      let process = this.progressTracker[key];
      process.passStep.forEach((passStep : any)=>{
        if(passStep.name && passStep.hasPassed){
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
        if(passStep.name && passStep.hasDownloaded){
          if(completedTrackedProcess.indexOf(passStep.name) == -1){
            completedTrackedProcess.push(passStep.name);
          }
        }
      });
    });
    return completedTrackedProcess;
  };

  resetFirstStep(){
    let hasOrgUnitProcessPass = false;
    for(let step of this.progressTracker.communication.passStep){
      if(step.name == "organisationUnits"){
        hasOrgUnitProcessPass = true;
      }
    }
    this.progressTracker.communication.passStep = [];
    this.progressTracker.communication.passStepCount = 0;
    if(hasOrgUnitProcessPass){
      this.progressTracker.communication.passStep.push(
        {name : "organisationUnits",hasDownloaded : true,hasPassed : true}
      );
      this.progressTracker.communication.passStepCount = 1;
    }

  }

  cancelLoginProcess(){
    this.isLoginProcessCancelled = true;
    this.loadingData = false;
    this.isLoginProcessActive = false;
  }

  login() {
    if (this.loginData.serverUrl) {
      if (!this.loginData.username) {
        this.setToasterMessage('Please Enter username');
      } else if (!this.loginData.password) {
        this.setToasterMessage('Please Enter password');
      } else {
        this.isLoginProcessCancelled = false;
        this.loggedInInInstance = "";
        let resource = "Authenticating user";
        this.progress = "0";
        //empty communication as well as organisation unit
        this.resetFirstStep();
        this.progressTracker.communication.message = "Establish connection to server";
        this.currentResourceType = "communication";
        this.loadingData = true;
        this.isLoginProcessActive = true;
        this.app.getFormattedBaseUrl(this.loginData.serverUrl)
          .then(formattedBaseUrl => {
            this.loginData.serverUrl = formattedBaseUrl;
            this.user.authenticateUser(this.loginData).then((response:any)=> {
              response = this.getResponseData(response);
              this.loginData = response.user;
              let url = this.loginData.serverUrl;
              this.loggedInInInstance = url.split("://")[1];
              //set authorization key and reset password
              this.loginData.authorizationKey = btoa(this.loginData.username + ':' + this.loginData.password);
              if(!this.isLoginProcessCancelled){
                this.user.setUserData(JSON.parse(response.data)).then(userData=>{
                  this.app.getDataBaseName(this.loginData.serverUrl).then(databaseName=>{
                    //update authenticate  process
                    databaseName = databaseName + "_"+this.loginData.username;
                    this.loginData.currentDatabase = databaseName;
                    this.reInitiateProgressTrackerObject(this.loginData);
                    this.currentResourceType = "communication";
                    this.updateProgressTracker(resource);
                    this.progressTracker[this.currentResourceType].message = "Establish connection to server";
                    resource = 'Opening database';
                    this.sqlLite.generateTables(databaseName).then(()=>{
                      //Establish connection to server
                      this.updateProgressTracker(resource);
                      resource = 'Loading system information';
                      this.currentResourceType = "communication";
                      this.progressTracker[this.currentResourceType].message = "Opening local storage";
                      if(!this.isLoginProcessCancelled){
                        this.httpClient.get('/api/system/info',this.loginData).subscribe(
                          data => {
                            data = data.json();
                            this.updateProgressTracker(resource);
                            this.progressTracker[this.currentResourceType].message = "Loading system information";
                            if(!this.isLoginProcessCancelled){
                              this.user.setCurrentUserSystemInformation(data).then(()=>{
                                if(!this.isLoginProcessCancelled){
                                  this.downloadingOrganisationUnits(userData);
                                }
                              },error=>{
                                this.loadingData = false;
                                this.isLoginProcessActive = false;
                                if(!this.isLoginProcessCancelled){
                                  this.setLoadingMessages('Fail to set system information');
                                }
                              });
                            }
                          },error=>{
                            this.loadingData = false;
                            this.isLoginProcessActive = false;
                            if(!this.isLoginProcessCancelled){
                              this.setLoadingMessages('Fail to load system information');
                            }
                          });
                      }
                    },error=>{
                      this.setToasterMessage('Fail to open database.');
                    })
                  })
                });
              }
            }, error=> {
              this.loadingData = false;
              this.isLoginProcessActive = false;
              let networkAvailability = this.NetworkAvailability.getNetWorkStatus();
              if (error.status == 0 || !networkAvailability.isAvailable) {
                this.setToasterMessage(networkAvailability.message);
              } else if (error.status == 401) {
                this.setToasterMessage('You have enter wrong username or password or server address');
              } else {
                console.log(JSON.stringify(error));
                this.setToasterMessage('Please check server address');
              }
            });
          });
      }
    } else {
      this.setToasterMessage('Please Enter server url');
    }
  }

  getResponseData(response){
    if(response.data.data){
      return this.getResponseData(response.data);
    }else{
      return response;
    }
  }

  downloadingOrganisationUnits(userData){
    if(!this.isLoginProcessCancelled){
      let resource = 'organisationUnits';
      this.currentResourceType = "communication";
      //this.currentResourceType = "organisationUnit";
      this.progressTracker[this.currentResourceType].message = "Loading assigned organisation unit";
      let orgUnitIds = [];
      userData.organisationUnits.forEach(organisationUnit=>{
        if(organisationUnit.id){
          orgUnitIds.push(organisationUnit.id);
        }
      });
      this.loginData["userOrgUnitIds"] = orgUnitIds;
      if(this.completedTrackedProcess.indexOf(resource) > -1){
        this.updateProgressTracker(resource);
        this.downloadingDataSets();
      }else{
        this.OrganisationUnit.downloadingOrganisationUnitsFromServer(orgUnitIds,this.loginData).then((orgUnits:any)=>{
          if(!this.isLoginProcessCancelled){
            this.progressTracker[this.currentResourceType].message = "Saving assigned organisation unit(s)";
            this.OrganisationUnit.savingOrganisationUnitsFromServer(orgUnits,this.loginData).then(()=>{
              this.updateProgressTracker(resource);
              this.downloadingDataSets();
            },error=>{
              this.loadingData = false;
              this.isLoginProcessActive = false;
              if(!this.isLoginProcessCancelled){
                this.setToasterMessage('Fail to save organisation data.');
              }
            });
          }
        },error=>{
          this.loadingData = false;
          this.isLoginProcessActive = false;
          console.log(resource);
          console.log(JSON.stringify(error));
          if(!this.isLoginProcessCancelled){
            this.setToasterMessage('Fail to download organisation data.');
          }
        });
      }

    }
  }

  downloadingDataSets(){
    if(!this.isLoginProcessCancelled){
      let resource = 'dataSets';
      this.currentResourceType = "entryForm";
      this.progressTracker[this.currentResourceType].message = "Loading entry forms";
      if(this.completedTrackedProcess.indexOf(resource) > -1){
        this.updateProgressTracker(resource);
        this.downloadingSections();
      }else{
        this.DataSets.downloadDataSetsFromServer(this.loginData).then((dataSets : any)=>{
          if(!this.isLoginProcessCancelled){
            this.progressTracker[this.currentResourceType].message = "Saving  entry forms";
            this.DataSets.saveDataSetsFromServer(dataSets,this.loginData).then(()=>{
              this.updateProgressTracker(resource);
              this.downloadingSections();
            },error=>{
              this.loadingData = false;
              this.isLoginProcessActive = false;
              if(!this.isLoginProcessCancelled){
                this.setToasterMessage('Fail to save data entry form.');
              }
            });
          }
        },error=>{
          this.loadingData = false;
          this.isLoginProcessActive = false;
          console.log(resource);
          console.log(JSON.stringify(error));
          if(!this.isLoginProcessCancelled){
            this.setToasterMessage('Fail to download data entry form.');
          }
        });
      }
    }
  }

  downloadingSections(){
    if(!this.isLoginProcessCancelled){
      let resource = 'sections';
      this.currentResourceType = "entryForm";
      this.progressTracker[this.currentResourceType].message = "Loading entry forms's sections";
      if(this.completedTrackedProcess.indexOf(resource) > -1){
        this.updateProgressTracker(resource);
        this.downloadingSmsCommand();
      }else{
        let tableMetadata = this.sqlLite.getDataBaseStructure()[resource];
        let fields = tableMetadata.fields;
        this.app.downloadMetadata(this.loginData,resource,null,fields,null).then(response=>{
          if(!this.isLoginProcessCancelled){
            this.progressTracker[this.currentResourceType].message = "Saving entry forms's sections";
            this.app.saveMetadata(resource,response[resource],this.loginData.currentDatabase).then(()=>{
              this.updateProgressTracker(resource);
              this.downloadingSmsCommand();
            },error=>{
              this.loadingData = false;
              this.isLoginProcessActive = false;
              if(!this.isLoginProcessCancelled){
                this.setToasterMessage('Fail to save data entry form sections.');
              }
            });
          }
        },error=>{
          this.loadingData = false;
          this.isLoginProcessActive = false;
          console.log(resource);
          console.log(JSON.stringify(error));
          if(!this.isLoginProcessCancelled){
            this.setToasterMessage('Fail to download data entry form sections.');
          }
        });
      }
    }
  }

  downloadingSmsCommand(){
    if(!this.isLoginProcessCancelled){
      let resource = "smsCommand";
      this.currentResourceType = "entryForm";
      this.progressTracker[this.currentResourceType].message = "Loading sms commands";
      if(this.completedTrackedProcess.indexOf(resource) > -1){
        this.updateProgressTracker(resource);
        this.downloadingPrograms();
      }else{
        this.SmsCommand.getSmsCommandFromServer(this.loginData).then((response:any)=>{
          if(!this.isLoginProcessCancelled){
            this.progressTracker[this.currentResourceType].message = "Saving sms commands";
            this.SmsCommand.savingSmsCommand(response,this.loginData.currentDatabase).then(()=>{
              this.updateProgressTracker(resource);
              this.downloadingPrograms();
            },error=>{
              this.loadingData = false;
              this.isLoginProcessActive = false;
              this.setToasterMessage('Fail to save metadata for send data via sms');
            });
          }
        },(error:any)=>{
          this.loadingData = false;
          this.isLoginProcessActive = false;
          console.log(resource);
          console.log(JSON.stringify(error));
          if(!this.isLoginProcessCancelled){
            this.setToasterMessage('Fail to download metadata for send data via sms');
          }
        });
      }
    }
  }

  downloadingPrograms(){
    if(!this.isLoginProcessCancelled){
      let resource = 'programs';
      this.currentResourceType = "event";
      this.progressTracker[this.currentResourceType].message = "Loading programs";
      if(this.completedTrackedProcess.indexOf(resource) > -1){
        this.updateProgressTracker(resource);
        this.downloadingProgramStageSections();
      }else{
        let tableMetadata = this.sqlLite.getDataBaseStructure()[resource];
        let fields = tableMetadata.fields;
        this.app.downloadMetadata(this.loginData,resource,null,fields,null).then(response=>{
          if(!this.isLoginProcessCancelled){
            this.progressTracker[this.currentResourceType].message = "Saving programs";
            this.app.saveMetadata(resource,response[resource],this.loginData.currentDatabase).then(()=>{
              this.updateProgressTracker(resource);
              this.downloadingProgramStageSections();
            },error=>{
              this.loadingData = false;
              this.isLoginProcessActive = false;
              this.setToasterMessage('Fail to save programs.');
            });
          }
        },error=>{
          this.loadingData = false;
          this.isLoginProcessActive = false;
          console.log(resource);
          console.log(JSON.stringify(error));
          if(!this.isLoginProcessCancelled){
            this.setToasterMessage('Fail to download programs.');
          }
        });
      }
    }
  }

  downloadingProgramStageSections(){
    if(!this.isLoginProcessCancelled){
      let resource = 'programStageSections';
      this.currentResourceType = "event";
      this.progressTracker[this.currentResourceType].message = "Loading program stage's sections";
      if(this.completedTrackedProcess.indexOf(resource) > -1){
        this.updateProgressTracker(resource);
        this.downloadingProgramStageDataElements();
      }else{
        let tableMetadata = this.sqlLite.getDataBaseStructure()[resource];
        let fields = tableMetadata.fields;
        this.app.downloadMetadata(this.loginData,resource,null,fields,null).then(response=>{
          if(!this.isLoginProcessCancelled){
            this.progressTracker[this.currentResourceType].message = "Saving program stage's sections";
            this.app.saveMetadata(resource,response[resource],this.loginData.currentDatabase).then(()=>{
              this.updateProgressTracker(resource);
              this.downloadingProgramStageDataElements();
            },error=>{
              this.loadingData = false;
              this.isLoginProcessActive = false;
              this.setToasterMessage('Fail to save program-stage sections.');
            });
          }
        },error=>{
          this.loadingData = false;
          this.isLoginProcessActive = false;
          console.log(resource);
          console.log(JSON.stringify(error));
          if(!this.isLoginProcessCancelled){
            this.setToasterMessage('Fail to download program-stage sections.');
          }
        });
      }
    }
  }

  downloadingProgramStageDataElements(){
    if(!this.isLoginProcessCancelled){
      let resource = 'programStageDataElements';
      this.currentResourceType = "event";
      this.progressTracker[this.currentResourceType].message = "Loading programstage data elements";
      if(this.completedTrackedProcess.indexOf(resource) > -1){
        this.updateProgressTracker(resource);
        this.downloadingReports();
      }else{
        let tableMetadata = this.sqlLite.getDataBaseStructure()[resource];
        let fields = tableMetadata.fields;
        this.app.downloadMetadata(this.loginData,resource,null,fields,null).then(response=>{
          if(!this.isLoginProcessCancelled){
            this.progressTracker[this.currentResourceType].message = "Saving programstage data elements";
            this.app.saveMetadata(resource,response[resource],this.loginData.currentDatabase).then(()=>{
              this.updateProgressTracker(resource);
              this.downloadingReports();
            },error=>{
              this.loadingData = false;
              this.isLoginProcessActive = false;
              this.setToasterMessage('Fail to save program-stage data-elements.');
            });
          }
        },error=>{
          this.loadingData = false;
          this.isLoginProcessActive = false;
          console.log(resource);
          console.log(JSON.stringify(error));
          if(!this.isLoginProcessCancelled){
            this.setToasterMessage('Fail to download program-stage data-elements.');
          }
        });
      }
    }
  }

  downloadingReports(){
    if(!this.isLoginProcessCancelled){
      let resource = 'reports';
      this.currentResourceType = "report";
      this.progressTracker[this.currentResourceType].message = "Loading reports";
      if(this.completedTrackedProcess.indexOf(resource) > -1){
        this.updateProgressTracker(resource);
        //this.downloadingIndicators();
        this.setLandingPage();
      }else{
        let tableMetadata = this.sqlLite.getDataBaseStructure()[resource];
        let fields = tableMetadata.fields;
        let filter = tableMetadata.filter;
        this.app.downloadMetadata(this.loginData,resource,null,fields,filter).then(response=>{
          if(!this.isLoginProcessCancelled){
            this.progressTracker[this.currentResourceType].message = "Saving reports";
            this.app.saveMetadata(resource,response[resource],this.loginData.currentDatabase).then(()=>{
              this.updateProgressTracker(resource);
              //this.downloadingIndicators();
              this.setLandingPage();
            },error=>{
              this.loadingData = false;
              this.isLoginProcessActive = false;
              this.setToasterMessage('Fail to save reports.');
            });
          }
        },error=>{
          this.loadingData = false;
          this.isLoginProcessActive = false;
          console.log(resource);
          console.log(JSON.stringify(error));
          if(!this.isLoginProcessCancelled){
            this.setToasterMessage('Fail to download reports.');
          }
        });
      }
    }
  }

  downloadingIndicators(){
    if(!this.isLoginProcessCancelled){
      let resource = 'indicators';
      this.currentResourceType = "report";
      this.progressTracker[this.currentResourceType].message = "Loading indicators";
      if(this.completedTrackedProcess.indexOf(resource) > -1){
        this.updateProgressTracker(resource);
        this.downloadingConstants();
      }else{
        let tableMetadata = this.sqlLite.getDataBaseStructure()[resource];
        let fields = tableMetadata.fields;
        this.app.downloadMetadata(this.loginData,resource,null,fields,null).then(response=>{
          if(!this.isLoginProcessCancelled){
            this.progressTracker[this.currentResourceType].message = "Saving indicators";
            this.app.saveMetadata(resource,response[resource],this.loginData.currentDatabase).then(()=>{
              this.updateProgressTracker(resource);
              this.downloadingConstants();
            },error=>{
              this.loadingData = false;
              this.isLoginProcessActive = false;
              this.setToasterMessage('Fail to save indicators.');
            });
          }
        },error=>{
          this.loadingData = false;
          this.isLoginProcessActive = false;
          console.log(resource);
          console.log(JSON.stringify(error));
          if(!this.isLoginProcessCancelled){
            this.setToasterMessage('Fail to download indicators.');
          }
        });
      }
    }
  }


  downloadingConstants(){
    if(!this.isLoginProcessCancelled){
      let resource = 'constants';
      this.currentResourceType = "report";
      this.progressTracker[this.currentResourceType].message = "Loading constants";
      if(this.completedTrackedProcess.indexOf(resource) > -1){
        this.updateProgressTracker(resource);
        this.setLandingPage();
      }else{
        let tableMetadata = this.sqlLite.getDataBaseStructure()[resource];
        let fields = tableMetadata.fields;
        this.app.downloadMetadata(this.loginData,resource,null,fields,null).then(response=>{
          if(!this.isLoginProcessCancelled){
            this.progressTracker[this.currentResourceType].message = "Saving constants";
            this.app.saveMetadata(resource,response[resource],this.loginData.currentDatabase).then(()=>{
              this.updateProgressTracker(resource);
              this.setLandingPage();
            },error=>{
              this.loadingData = false;
              this.setToasterMessage('Fail to save constants.');
            });
          }
        },error=>{
          this.loadingData = false;
          this.isLoginProcessActive = false;
          console.log(resource);
          console.log(JSON.stringify(error));
          if(!this.isLoginProcessCancelled){
            this.setToasterMessage('Fail to download constants.');
          }
        });
      }
    }
  }

  setLandingPage(){
    if(!this.isLoginProcessCancelled) {
      this.loginData.isLogin = true;
      this.loginData.password = "";
      this.user.setCurrentUser(this.loginData).then(()=> {
        this.synchronization.startSynchronization().then(()=> {
          this.OrganisationUnit.resetOrganisationUnit();
          this.DashboardService.resetDashboards();
          this.Program.resetPrograms();
          this.DataSets.resetDataSets();
          this.PeriodService.resetPeriod();
          this.navCtrl.setRoot(TabsPage);
          this.loadingData = false;
          this.isLoginProcessActive = false;
        });
      });
    }
  }

  setLoadingMessages(message){
    this.loadingMessages.push(message);
  }

  setToasterMessage(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3500
    });
    toast.present();
  }

  setNotificationToasterMessage(message){
    let toast = this.toastCtrl.create({
      message: message,
      position : 'top',
      duration: 3500
    })
    toast.present();
  }

}
