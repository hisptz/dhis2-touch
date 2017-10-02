import { Component,OnInit } from '@angular/core';
import { IonicPage, NavController, MenuController } from 'ionic-angular';
import {HttpClientProvider} from "../../providers/http-client/http-client";
import {AppProvider} from "../../providers/app/app";
import {UserProvider} from "../../providers/user/user";
import {TabsPage} from "../tabs/tabs";
import {SqlLiteProvider} from "../../providers/sql-lite/sql-lite";
import {OrganisationUnitsProvider} from "../../providers/organisation-units/organisation-units";
import {IndicatorsProvider} from "../../providers/indicators/indicators";
import {SmsCommandProvider} from "../../providers/sms-command/sms-command";
import {DataElementsProvider} from "../../providers/data-elements/data-elements";
import {SectionsProvider} from "../../providers/sections/sections";
import {DataSetsProvider} from "../../providers/data-sets/data-sets";
import {StandardReportProvider} from "../../providers/standard-report/standard-report";
import {ProgramsProvider} from "../../providers/programs/programs";
import {ProgramStageSectionsProvider} from "../../providers/program-stage-sections/program-stage-sections";
import {SettingsProvider} from "../../providers/settings/settings";

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
              private sqlLite : SqlLiteProvider,
              private organisationUnitsProvider : OrganisationUnitsProvider,
              private indicatorsProvider : IndicatorsProvider, private smsCommandProvider : SmsCommandProvider,
              private dataElementsProvider : DataElementsProvider,
              private sectionsProvider : SectionsProvider,
              private dataSetsProvider : DataSetsProvider,
              private standardReports : StandardReportProvider,
              private settingsProvider : SettingsProvider,
              private HttpClientProvider : HttpClientProvider,
              private programsProvider: ProgramsProvider,
              private programStageSectionProvider: ProgramStageSectionsProvider,
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
      }else{
        this.currentUser.serverUrl = 'play.dhis2.org/demo';
        this.currentUser.username = 'admin';
        this.currentUser.password = 'district';
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
                    resource = "Preparing local storage";
                    this.progressTracker[this.currentResourceType].message = resource;
                    this.sqlLite.generateTables(this.currentUser.currentDatabase).then(()=>{
                      this.updateProgressTracker(resource);
                      this.downloadingOrganisationUnits(userData);
                    },(error)=>{
                      this.isLoginProcessActive = false;
                      this.AppProvider.setNormalNotification('Fail to prepare local storage');
                      console.error("error : " + JSON.stringify(error));
                    });
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

  downloadingOrganisationUnits(userData){
    if(this.isLoginProcessActive){
      let resource = 'organisationUnits';
      this.currentResourceType = "communication";
      this.progressTracker[this.currentResourceType].message = "Loading assigned organisation unit";
      let orgUnitIds = [];
      userData.organisationUnits.forEach(organisationUnit=>{
        if(organisationUnit.id){
          orgUnitIds.push(organisationUnit.id);
        }
      });

      this.currentUser["userOrgUnitIds"] = orgUnitIds;
      if(this.completedTrackedProcess.indexOf(resource) > -1){
        this.progressTracker[this.currentResourceType].message = "Assigned organisation unit(s) have been loaded";
        this.updateProgressTracker(resource);
        this.downloadingDataSets();
      }else{
        this.organisationUnitsProvider.downloadingOrganisationUnitsFromServer(orgUnitIds,this.currentUser).then((orgUnits:any)=>{
          if(this.isLoginProcessActive){
            this.progressTracker[this.currentResourceType].message = "Saving assigned organisation unit(s)";
            this.organisationUnitsProvider.savingOrganisationUnitsFromServer(orgUnits,this.currentUser).then(()=>{
              this.progressTracker[this.currentResourceType].message = "Assigned organisation unit(s) have been saved";
              this.updateProgressTracker(resource);
              this.downloadingDataSets();
            },error=>{
              this.isLoginProcessActive = false;
              console.log(JSON.stringify(error));
              this.AppProvider.setNormalNotification('Fail to save organisation data.');
            });
          }
        },error=>{
          this.isLoginProcessActive = false;
          console.log(JSON.stringify(error));
          this.AppProvider.setNormalNotification('Fail to load organisation data.');
        });
      }

    }
  }

  downloadingDataSets(){
    if(this.isLoginProcessActive){
      let resource = 'dataSets';
      this.currentResourceType = "entryForm";
      this.progressTracker[this.currentResourceType].message = "Loading entry forms";
      if(this.completedTrackedProcess.indexOf(resource) > -1){
        this.progressTracker[this.currentResourceType].message = "Entry forms have been loaded";
        this.updateProgressTracker(resource);
        this.downloadingSections();
      }else{
        this.dataSetsProvider.downloadDataSetsFromServer(this.currentUser).then((dataSets: any)=>{
          if(this.isLoginProcessActive){
            this.progressTracker[this.currentResourceType].message = "Saving entry forms";
            this.dataSetsProvider.saveDataSetsFromServer(dataSets,this.currentUser).then(()=>{
              this.progressTracker[this.currentResourceType].message = "Entry forms have been saved";
              this.updateProgressTracker(resource);
              this.downloadingSections();
            },error=>{
              this.isLoginProcessActive = false;
              console.log(JSON.stringify(error));
              this.AppProvider.setNormalNotification('Fail to s ave entry form.');
            });
          }
        },error=>{
          this.isLoginProcessActive = false;
          console.log(JSON.stringify(error));
          this.AppProvider.setNormalNotification('Fail to load entry form.');
        });
      }
    }
  }

  downloadingSections(){
    if(this.isLoginProcessActive){
      let resource = "sections";
      this.currentResourceType = "entryForm";
      this.progressTracker[this.currentResourceType].message = "Loading entry form's sections";
      if(this.completedTrackedProcess.indexOf(resource) > -1){
        this.progressTracker[this.currentResourceType].message = "Entry form's sections have been loaded";
        this.updateProgressTracker(resource);
        this.downloadingDataElements();
      }else{
        this.sectionsProvider.downloadSectionsFromServer(this.currentUser).then((response : any)=>{
          if(this.isLoginProcessActive){
            this.progressTracker[this.currentResourceType].message = "Saving entry form's sections";
            this.sectionsProvider.saveSectionsFromServer(response[resource],this.currentUser).then(()=>{
              this.progressTracker[this.currentResourceType].message = "Entry form's sections have been saved";
              this.updateProgressTracker(resource);
              this.downloadingDataElements();
            },error=>{
              this.isLoginProcessActive = false;
              console.log(JSON.stringify(error));
              this.AppProvider.setNormalNotification("Fail to save entry form's sections.");
            });
          }
        },error=>{
          this.isLoginProcessActive = false;
          console.log(JSON.stringify(error));
          this.AppProvider.setNormalNotification("Fail to load entry form's sections.");
        });
      }
    }
  }

  downloadingDataElements(){
    if(this.isLoginProcessActive){
      let resource = "dataElements";
      this.currentResourceType = "entryForm";
      this.progressTracker[this.currentResourceType].message = "Loading data elements";
      if(this.completedTrackedProcess.indexOf(resource) > -1){
        this.progressTracker[this.currentResourceType].message = "Data elements have been loaded";
        this.updateProgressTracker(resource);
        this.downloadingSmsCommands();
      }else{
        this.dataElementsProvider.downloadDataElementsFromServer(this.currentUser).then((response : any)=>{
          if(this.isLoginProcessActive){
            this.progressTracker[this.currentResourceType].message = "Saving data elements";
            this.dataElementsProvider.saveDataElementsFromServer(response[resource],this.currentUser).then(()=>{
              this.progressTracker[this.currentResourceType].message = "Data elements have been saved";
              this.updateProgressTracker(resource);
              this.downloadingSmsCommands();
            },error=>{
              this.isLoginProcessActive = false;
              console.log(JSON.stringify(error));
              this.AppProvider.setNormalNotification("Fail to save data elements.");
            });
          }
        },error=>{
          this.isLoginProcessActive = false;
          console.log(JSON.stringify(error));
          this.AppProvider.setNormalNotification("Fail to load data elements.");
        });
      }
    }
  }

  downloadingSmsCommands(){
    if(this.isLoginProcessActive){
      let resource = "sections";
      this.currentResourceType = "entryForm";
      this.progressTracker[this.currentResourceType].message = "Loading SMS configurations";
      if(this.completedTrackedProcess.indexOf(resource) > -1){
        this.progressTracker[this.currentResourceType].message = "SMS configurations have been loaded";
        this.updateProgressTracker(resource);
        this.downloadingPrograms();
      }else{
        this.smsCommandProvider.getSmsCommandFromServer(this.currentUser).then((smsCommands : any)=>{
          if(this.isLoginProcessActive){
            this.progressTracker[this.currentResourceType].message = "Saving SMS configurations";
            this.smsCommandProvider.savingSmsCommand(smsCommands,this.currentUser.currentDatabase).then(()=>{
              this.progressTracker[this.currentResourceType].message = "SMS configurations have been saved";
              this.updateProgressTracker(resource);
              this.downloadingPrograms();
            },error=>{
              this.isLoginProcessActive = false;
              console.log(JSON.stringify(error));
              this.AppProvider.setNormalNotification("Fail to save SMS configurations.");
            });
          }
        },error=>{
          this.isLoginProcessActive = false;
          console.log(JSON.stringify(error));
          this.AppProvider.setNormalNotification("Fail to load SMS configurations.");
        });
      }
    }
  }

  downloadingPrograms(){
    if(this.isLoginProcessActive){
      let resource = 'programs';
      this.currentResourceType = "event";
      this.progressTracker[this.currentResourceType].message = "Loading programs";
      if(this.completedTrackedProcess.indexOf(resource) > -1){
        this.progressTracker[this.currentResourceType].message = "Programs have been loaded";
        this.updateProgressTracker(resource);
        this.downloadingProgramStageSections();
      }else{
        this.programsProvider.downloadProgramsFromServer(this.currentUser).then(response=>{
          if(this.isLoginProcessActive){
            this.progressTracker[this.currentResourceType].message = "Saving programs";
            this.programsProvider.saveProgramsFromServer(response[resource],this.currentUser).then(()=>{
              this.progressTracker[this.currentResourceType].message = "Programs have been saved";
              this.updateProgressTracker(resource);
              this.downloadingProgramStageSections();
            },error=>{
              this.isLoginProcessActive = false;
              console.log(JSON.stringify(error));
              this.AppProvider.setNormalNotification('Fail to save programs.');
            });
          }
        },error=>{
          this.isLoginProcessActive = false;
          console.log(JSON.stringify(error));
          this.AppProvider.setNormalNotification('Fail to load programs.');
        });
      }
    }
  }

  downloadingProgramStageSections(){
    if(this.isLoginProcessActive){
      let resource = 'programStageSections';
      this.currentResourceType = "event";
      this.progressTracker[this.currentResourceType].message = "Loading program stage sections";
      if(this.completedTrackedProcess.indexOf(resource) > -1){
        this.progressTracker[this.currentResourceType].message = "Program stage sections have been loaded";
        this.updateProgressTracker(resource);
        this.downloadingIndicators();
      }else{
        this.programStageSectionProvider.downloadProgramsStageSectionsFromServer(this.currentUser).then(response=>{
          if(this.isLoginProcessActive){
            this.progressTracker[this.currentResourceType].message = "Saving program stage sections";
            this.programStageSectionProvider.saveProgramsStageSectionsFromServer(response[resource],this.currentUser).then(()=>{
              this.progressTracker[this.currentResourceType].message = "Program stage sections have been saved";
              this.updateProgressTracker(resource);
              this.downloadingIndicators();
            },error=>{
              this.isLoginProcessActive = false;
              console.log(JSON.stringify(error));
              this.AppProvider.setNormalNotification('Fail to save program stage sections.');
            });
          }
        },error=>{
          this.isLoginProcessActive = false;
          console.log(JSON.stringify(error));
          this.AppProvider.setNormalNotification('Failed to load program-stage-sections');
        });
      }
    }
  }

  downloadingIndicators(){
    if(this.isLoginProcessActive){
      let resource = 'indicators';
      this.currentResourceType = "report";
      this.progressTracker[this.currentResourceType].message = "Loading indicators";
      if(this.completedTrackedProcess.indexOf(resource) > -1){
        this.progressTracker[this.currentResourceType].message = "Indicators have been loaded";
        this.updateProgressTracker(resource);
        this.downloadingStandardReports();
      }else{
        this.indicatorsProvider.downloadingIndicatorsFromServer(this.currentUser).then((response:any)=>{
          if(this.isLoginProcessActive){
            this.progressTracker[this.currentResourceType].message = "Saving indicators";
            this.indicatorsProvider.savingIndicatorsFromServer(response[resource],this.currentUser).then(()=>{
              this.progressTracker[this.currentResourceType].message = "Indicators have been saved";
              this.updateProgressTracker(resource);
              this.downloadingStandardReports();
            },error=>{
              this.isLoginProcessActive = false;
              console.log(JSON.stringify(error));
              this.AppProvider.setNormalNotification('Fail to save indicators.');
            });
          }
        },error=>{
          this.isLoginProcessActive = false;
          console.log(JSON.stringify(error));
          this.AppProvider.setNormalNotification('Fail to load indicators.');
        });
      }
    }
  }

  downloadingStandardReports(){
    if(this.isLoginProcessActive){
      let resource = "reports";
      this.currentResourceType = "report";
      this.progressTracker[this.currentResourceType].message = "Loading reports";
      if(this.completedTrackedProcess.indexOf(resource) > -1){
        this.progressTracker[this.currentResourceType].message = "Reports have been loaded";
        this.updateProgressTracker(resource);
        this.downloadingConstants();
      }else{
        this.standardReports.downloadReportsFromServer(this.currentUser).then((reports : any)=>{
          if(this.isLoginProcessActive){
            this.progressTracker[this.currentResourceType].message = "Saving reports";
            this.standardReports.saveReportsFromServer(reports[resource],this.currentUser).then(()=>{
              this.progressTracker[this.currentResourceType].message = "Reports have been saved";
              this.updateProgressTracker(resource);
              this.downloadingConstants();
            },error=>{
              this.isLoginProcessActive = false;
              console.log(JSON.stringify(error));
              this.AppProvider.setNormalNotification("Fail to save reports.");
            });
          }
        },error=>{
          this.isLoginProcessActive = false;
          console.log(JSON.stringify(error));
          this.AppProvider.setNormalNotification("Fail to load reports.");
        });
      }
    }
  }

  downloadingConstants(){
    if(this.isLoginProcessActive){
      let resource = "reports";
      this.currentResourceType = "report";
      this.progressTracker[this.currentResourceType].message = "Loading constants";
      if(this.completedTrackedProcess.indexOf(resource) > -1){
        this.progressTracker[this.currentResourceType].message = "Constants have been loaded";
        this.updateProgressTracker(resource);
        //this.downloadingPrograms();
        this.setLandingPage(this.currentUser);
      }else{
        this.standardReports.downloadConstantsFromServer(this.currentUser).then((reports : any)=>{
          if(this.isLoginProcessActive){
            this.progressTracker[this.currentResourceType].message = "Constants constants";
            this.standardReports.saveConstantsFromServer(reports[resource],this.currentUser).then(()=>{
              this.progressTracker[this.currentResourceType].message = "Constants have been saved";
              this.updateProgressTracker(resource);
              //this.downloadingPrograms();
              this.setLandingPage(this.currentUser);
            },error=>{
              this.isLoginProcessActive = false;
              console.log(JSON.stringify(error));
              this.AppProvider.setNormalNotification("Fail to save constants.");
            });
          }
        },error=>{
          this.isLoginProcessActive = false;
          console.log(JSON.stringify(error));
          this.AppProvider.setNormalNotification("Fail to load constants.");
        });
      }
    }
  }

  setLandingPage(currentUser){
    currentUser.isLogin = true;
    this.reCheckingAppSetting(currentUser);
    this.UserProvider.setCurrentUser(currentUser).then(()=>{
      this.navCtrl.setRoot(TabsPage)
    });
  }

  reCheckingAppSetting(currentUser){
    let defaultSetting  = this.settingsProvider.getDefaultSettings();
    this.settingsProvider.getSettingsForTheApp(currentUser).then((appSettings : any)=>{
      if(!appSettings){
        let time = defaultSetting.synchronization.time;
        let timeType = defaultSetting.synchronization.timeType;
        defaultSetting.synchronization.time = this.settingsProvider.getDisplaySynchronizationTime(time,timeType);
        this.settingsProvider.setSettingsForTheApp(currentUser,defaultSetting).then(()=>{},error=>{})
      }
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
    let dataBaseStructure =  this.sqlLite.getDataBaseStructure();
    let progressTracker = {};
    progressTracker["communication"] = {count : 3,passStep :[],passStepCount : 0, message : ""};
    progressTracker["finalization"] = {count :0.5,passStep :[],passStepCount : 0, message : ""};
    Object.keys(dataBaseStructure).forEach(key=>{
      let table = dataBaseStructure[key];
      if(table.isMetadata && table.resourceType && table.resourceType !=""){
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
      if(table.isMetadata && table.resourceType){
        resourceType = table.resourceType
      }
    }
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
    let noEmptyStep;
    this.progressTracker.communication.passStep.forEach((step : any)=>{
      if(step.name == "organisationUnits"){
        step.hasBeenPassed = false;
        noEmptyStep = step;
      }
    });
    this.progressTracker.communication.passStep = [];
    if(noEmptyStep){
      this.progressTracker.communication.passStep.push(noEmptyStep);
    }
    this.progressTracker.communication.passStepCount = 0;
    let dataBaseStructure =  this.sqlLite.getDataBaseStructure();
    Object.keys(dataBaseStructure).forEach(key=>{
      let table = dataBaseStructure[key];
      if(table.isMetadata && table.resourceType && table.resourceType != ""){
        if(this.progressTracker[table.resourceType]){
          this.progressTracker[table.resourceType].passStepCount = 0;
          this.progressTracker[table.resourceType].message = "";
          this.progressTracker[table.resourceType].passStep.forEach((passStep : any)=>{
            passStep.hasBeenPassed = false;
          })
        }
      }
    });
  }

}
