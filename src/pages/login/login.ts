import {Component, OnInit} from '@angular/core';
import { NavController} from 'ionic-angular';
import {TabsPage} from "../tabs/tabs";
import {UserProvider} from "../../providers/user/user";
import {AppProvider} from "../../providers/app/app";
import {SqlLiteProvider} from "../../providers/sql-lite/sql-lite";
import {OrganisationUnitsProvider} from "../../providers/organisation-units/organisation-units";
import {IndicatorsProvider} from "../../providers/indicators/indicators";
import {SmsCommandProvider} from "../../providers/sms-command/sms-command";
import {DataElementsProvider} from "../../providers/data-elements/data-elements";
import {SectionsProvider} from "../../providers/sections/sections";
import {DataSetsProvider} from "../../providers/data-sets/data-sets";
import {StandardReportProvider} from "../../providers/standard-report/standard-report";
import {SettingsProvider} from "../../providers/settings/settings";
import {HttpClientProvider} from "../../providers/http-client/http-client";
import {ProgramsProvider} from "../../providers/programs/programs";
import {ProgramStageSectionsProvider} from "../../providers/program-stage-sections/program-stage-sections";
import {BackgroundMode} from "@ionic-native/background-mode";
import {LocalInstanceProvider} from "../../providers/local-instance/local-instance";
import {AppTranslationProvider} from "../../providers/app-translation/app-translation";

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage implements OnInit {

  logoUrl: string;
  offlineIcon : string;
  cancelIcon : string;
  progressBar: string;
  loggedInInInstance: string;
  isLoginProcessActive: boolean;
  currentUser: any = {};
  animationEffect: any = {};
  cancelLoginProcessData : any = {isProcessActive : false};
  progressTracker : any;
  completedTrackedProcess : any;
  hasUserAuthenticated : boolean;
  currentResourceType : string;
  localInstances : any;
  currentLanguage : string;
  isLocalInstancesListOpen : boolean;

  constructor(public navCtrl: NavController,
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
              private backgroundMode: BackgroundMode,
              private localInstanceProvider : LocalInstanceProvider,
              private appTranslationProvider : AppTranslationProvider

  ) {

  }

  ngOnInit() {
    this.isLocalInstancesListOpen = false;
    this.backgroundMode.disable();
    this.animationEffect = {
      loginForm: "animated slideInUp",
      progressBar: "animated fadeIn"
    };
    this.logoUrl = 'assets/img/logo.png';
    this.offlineIcon = "assets/icon/offline.png";
    this.cancelIcon = "assets/icon/cancel.png";
    this.cancelLoginProcess(this.cancelLoginProcessData);
    this.progressTracker = {};
    this.completedTrackedProcess = [];
    this.UserProvider.getCurrentUser().then((currentUser: any)=>{
      this.localInstanceProvider.getLocalInstances().then((localInstances : any)=>{
        this.localInstances = localInstances;
        this.setUpCurrentUser(currentUser);
      });
    });
  }

  setUpCurrentUser(currentUser){
    if(currentUser && currentUser.serverUrl){
      if(currentUser.password){
        delete currentUser.password;
      }
      if(!currentUser.currentLanguage){
        currentUser.currentLanguage = "en";
      }
      this.currentUser = currentUser;
    }else{
      this.currentUser = {
        serverUrl: "play.hisptz.org/27",
        username: "admin",
        password: "district",
        currentLanguage : "en"
      };
    }
    this.currentLanguage = this.currentUser.currentLanguage;
    this.appTranslationProvider.setAppTranslation(this.currentUser.currentLanguage);
  }

  changeCurrentUser(data){
    if(data && data.currentUser){
      this.setUpCurrentUser(data.currentUser)
    }
    this.toggleLoginFormAndLocalInstances();

  }

  toggleLoginFormAndLocalInstances(){
    this.isLocalInstancesListOpen = !this.isLocalInstancesListOpen;
  }

  updateTranslationLanguage(language : string){
    try{
      this.appTranslationProvider.setAppTranslation(language);
      this.currentLanguage = language;
      this.currentUser.currentLanguage = language;
      this.UserProvider.setCurrentUser(this.currentUser).then(()=>{});
      this.localInstanceProvider.setLocalInstanceInstances(this.localInstances,this.currentUser,this.loggedInInInstance).then(()=>{});
    }catch (e){
      this.AppProvider.setNormalNotification("Fail to set translation ");
      console.log(JSON.stringify(e));
    }
  }

  startLoginProcess() {
    this.hasUserAuthenticated = false;
    this.backgroundMode.enable();
    this.progressBar = "0";
    this.loggedInInInstance = this.currentUser.serverUrl;
    this.isLoginProcessActive = true;
    this.animationEffect.loginForm = "animated fadeOut";
    this.animationEffect.progressBar = "animated fadeIn";
    if(this.currentUser.serverUrl && this.currentUser.username && this.currentUser.password){
      let currentResourceType = "communication";
      this.progressTracker = {};
      let resource = "Authenticating user";
      this.currentUser.serverUrl = this.AppProvider.getFormattedBaseUrl(this.currentUser.serverUrl);
      this.loggedInInInstance = this.currentUser.serverUrl;
      this.reInitiateProgressTrackerObject(this.currentUser);
      this.progressTracker[currentResourceType].message = "establishing_connection_to_server";
      this.UserProvider.authenticateUser(this.currentUser).then((response : any)=>{
        response = this.getResponseData(response);
        this.currentUser = response.user;
        this.loggedInInInstance = this.currentUser.serverUrl;
        if(this.currentUser.serverUrl.split("://").length > 1){
          this.loggedInInInstance = this.currentUser.serverUrl.split("://")[1];
        }
        this.currentUser.authorizationKey = btoa(this.currentUser.username + ':' + this.currentUser.password);
        this.currentUser.currentDatabase = this.AppProvider.getDataBaseName(this.currentUser.serverUrl) + "_"+this.currentUser.username;
        this.reInitiateProgressTrackerObject(this.currentUser);
        this.updateProgressTracker(resource);
        this.UserProvider.setUserData(JSON.parse(response.data)).then(userData=>{
          resource = 'Loading system information';
          if(this.isLoginProcessActive){
            this.progressTracker[currentResourceType].message = "loading_system_information";
            this.HttpClientProvider.get('/api/system/info',this.currentUser).then((response : any)=>{
              this.UserProvider.setCurrentUserSystemInformation(JSON.parse(response.data)).then((dhisVersion)=>{
                this.currentUser.dhisVersion = dhisVersion;
                this.updateProgressTracker(resource);
                if(this.isLoginProcessActive){
                  this.progressTracker[currentResourceType].message = "loading_current_user_authorities";
                  this.UserProvider.getUserAuthorities(this.currentUser).then((response:any)=>{
                    this.currentUser.authorities = response.authorities;
                    resource = "Preparing local storage";
                    this.progressTracker[currentResourceType].message = "preparing_local_storage";
                    this.sqlLite.generateTables(this.currentUser.currentDatabase).then(()=>{
                      this.updateProgressTracker(resource);
                      this.hasUserAuthenticated = true;
                      this.downloadingOrganisationUnits(userData);
                      this.downloadingDataSets();
                      this.downloadingSections();
                      this.downloadingDataElements();
                      this.downloadingSmsCommands();
                      this.downloadingPrograms();
                      this.downloadingProgramStageSections();
                      this.downloadingIndicators();
                      this.downloadingStandardReports();
                      this.downloadingConstants();
                    }).catch(error=>{
                      this.cancelLoginProcess(this.cancelLoginProcessData);
                      this.AppProvider.setNormalNotification('Fail to prepare local storage');
                      console.error("error : " + JSON.stringify(error));
                    });
                  }).catch(error=>{
                    this.cancelLoginProcess(this.cancelLoginProcessData);
                    this.AppProvider.setNormalNotification('Fail to load user authorities');
                    console.error("error : " + JSON.stringify(error));
                  });
                }
              }).catch(error=>{
                this.cancelLoginProcess(this.cancelLoginProcessData);
                this.AppProvider.setNormalNotification('Fail to load user authorities');
                console.error("error : " + JSON.stringify(error));
              });
            }).catch(error=>{
              this.cancelLoginProcess(this.cancelLoginProcessData);
              this.AppProvider.setNormalNotification('Fail to load system information');
              console.error("error : " + JSON.stringify(error));
            });
          }
        }).catch((error)=>{
          this.cancelLoginProcess(this.cancelLoginProcessData);
          this.AppProvider.setNormalNotification('Fail to save current user information');
          console.error("error : " + JSON.stringify(error));
        });
      }).catch((error: any)=>{
        if (error.status == 0) {
          this.AppProvider.setNormalNotification('Please check your network connectivity');
        } else if (error.status == 401) {
          this.AppProvider.setNormalNotification('You have enter wrong username or password or server address');
        } else if(404){
          console.log(JSON.stringify(error));
          this.AppProvider.setNormalNotification('Please check server address');
        }else if(error.error){
          this.AppProvider.setNormalNotification(error.error);
        }else{
          this.AppProvider.setNormalNotification(JSON.stringify(error));
        }
        this.cancelLoginProcess(this.cancelLoginProcessData);
      })
    }else{
      this.cancelLoginProcess(this.cancelLoginProcessData);
      this.AppProvider.setNormalNotification("Please enter server address, username and password");
    }
  }

  downloadingOrganisationUnits(userData){
    if(this.isLoginProcessActive){
      let resource = 'organisationUnits';
      let currentResourceType = "communication";
      let orgUnitIds = [];
      this.progressTracker[currentResourceType].message = "loading_assigned_organisation_units";
      userData.organisationUnits.forEach(organisationUnit=>{
        if(organisationUnit.id){
          orgUnitIds.push(organisationUnit.id);
        }
      });
      this.currentUser["userOrgUnitIds"] = orgUnitIds;
      if(this.completedTrackedProcess.indexOf(resource) > -1){
        this.updateProgressTracker(resource);
        this.progressTracker[currentResourceType].message = "assigned_organisation_units_have_been_loaded";
      }else{
        this.organisationUnitsProvider.downloadingOrganisationUnitsFromServer(orgUnitIds,this.currentUser).then((orgUnits:any)=>{
          if(this.isLoginProcessActive){
            this.progressTracker[currentResourceType].message = "saving_assigned_organisation_units";
            this.organisationUnitsProvider.savingOrganisationUnitsFromServer(orgUnits,this.currentUser).then(()=>{
              this.progressTracker[currentResourceType].message = "assigned_organisation_units_have_been_saved";
              this.updateProgressTracker(resource);
            },error=>{
              this.cancelLoginProcess(this.cancelLoginProcessData);
              console.log(JSON.stringify(error));
              this.AppProvider.setNormalNotification('Fail to save organisation data.');
            });
          }
        },error=>{
          this.cancelLoginProcess(this.cancelLoginProcessData);
          console.log(JSON.stringify(error));
          this.AppProvider.setNormalNotification('Fail to load organisation data.');
        });
      }

    }
  }

  downloadingDataSets(){
    if(this.isLoginProcessActive){
      let resource = 'dataSets';
      let currentResourceType = "entryForm";
      this.progressTracker[currentResourceType].message = "loading_entry_forms";
      if(this.completedTrackedProcess.indexOf(resource) > -1){
        this.progressTracker[currentResourceType].message = "entry_forms_have_been_loaded";
        this.updateProgressTracker(resource);
      }else{
        this.dataSetsProvider.downloadDataSetsFromServer(this.currentUser).then((dataSets: any)=>{
          if(this.isLoginProcessActive){
            this.progressTracker[currentResourceType].message = "saving_entry_forms";
            this.dataSetsProvider.saveDataSetsFromServer(dataSets,this.currentUser).then(()=>{
              this.progressTracker[currentResourceType].message = "entry_form_have_been_saved";
              this.updateProgressTracker(resource);
            },error=>{
              this.cancelLoginProcess(this.cancelLoginProcessData);
              console.log(JSON.stringify(error));
              this.AppProvider.setNormalNotification('Fail to s ave entry form.');
            });
          }
        },error=>{
          this.cancelLoginProcess(this.cancelLoginProcessData);
          console.log(JSON.stringify(error));
          this.AppProvider.setNormalNotification('Fail to load entry form.');
        });
      }
    }
  }

  downloadingSections(){
    if(this.isLoginProcessActive){
      let resource = "sections";
      let currentResourceType = "entryForm";
      this.progressTracker[currentResourceType].message = "loading_entry_form_sections";
      if(this.completedTrackedProcess.indexOf(resource) > -1){
        this.progressTracker[currentResourceType].message = "entry_form_sections_have_been_loaded";
        this.updateProgressTracker(resource);
      }else{
        this.sectionsProvider.downloadSectionsFromServer(this.currentUser).then((response : any)=>{
          if(this.isLoginProcessActive){
            this.progressTracker[currentResourceType].message = "saving_entry_form_sections";
            this.sectionsProvider.saveSectionsFromServer(response[resource],this.currentUser).then(()=>{
              this.progressTracker[currentResourceType].message = "entry_form_sections_have_been_saved";
              this.updateProgressTracker(resource);
            },error=>{
              this.cancelLoginProcess(this.cancelLoginProcessData);
              console.log(JSON.stringify(error));
              this.AppProvider.setNormalNotification("Fail to save entry form's sections.");
            });
          }
        },error=>{
          this.cancelLoginProcess(this.cancelLoginProcessData);
          console.log(JSON.stringify(error));
          this.AppProvider.setNormalNotification("Fail to load entry form's sections.");
        });
      }
    }
  }

  downloadingDataElements(){
    if(this.isLoginProcessActive){
      let resource = "dataElements";
      let currentResourceType = "entryForm";
      this.progressTracker[currentResourceType].message = "loading_entry_form_fields";
      if(this.completedTrackedProcess.indexOf(resource) > -1){
        this.progressTracker[currentResourceType].message = "entry_form_fields_have_been_loaded";
        this.updateProgressTracker(resource);
      }else{
        this.dataElementsProvider.downloadDataElementsFromServer(this.currentUser).then((response : any)=>{
          if(this.isLoginProcessActive){
            this.progressTracker[currentResourceType].message = "saving_entry_form_fields";
            this.dataElementsProvider.saveDataElementsFromServer(response[resource],this.currentUser).then(()=>{
              this.progressTracker[currentResourceType].message = "entry_form_fields_have_been_saved";
              this.updateProgressTracker(resource);
            },error=>{
              this.cancelLoginProcess(this.cancelLoginProcessData);
              console.log(JSON.stringify(error));
              this.AppProvider.setNormalNotification("Fail to save entry form's fields");
            });
          }
        },error=>{
          this.cancelLoginProcess(this.cancelLoginProcessData);
          console.log(JSON.stringify(error));
          this.AppProvider.setNormalNotification("Fail to load entry form's fields");
        });
      }
    }
  }

  downloadingSmsCommands(){
    if(this.isLoginProcessActive){
      let resource = "smsCommand";
      let currentResourceType = "entryForm";
      this.progressTracker[currentResourceType].message = "loading_sms_commands";
      if(this.completedTrackedProcess.indexOf(resource) > -1){
        this.progressTracker[currentResourceType].message = "sms_commands_have_been_loaded";
        this.updateProgressTracker(resource);
      }else{
        this.smsCommandProvider.getSmsCommandFromServer(this.currentUser).then((smsCommands : any)=>{
          if(this.isLoginProcessActive){
            this.progressTracker[currentResourceType].message = "saving_sms_commands";
            this.smsCommandProvider.savingSmsCommand(smsCommands,this.currentUser.currentDatabase).then(()=>{
              this.progressTracker[currentResourceType].message = "sms_commands_have_been_saved";
              this.updateProgressTracker(resource);
            },error=>{
              this.cancelLoginProcess(this.cancelLoginProcessData);
              console.log(JSON.stringify(error));
              this.AppProvider.setNormalNotification("Fail to save SMS commands");
            });
          }
        },error=>{
          this.cancelLoginProcess(this.cancelLoginProcessData);
          console.log(JSON.stringify(error));
          this.AppProvider.setNormalNotification("Fail to load SMS commands");
        });
      }
    }
  }

  downloadingPrograms(){
    if(this.isLoginProcessActive){
      let resource = 'programs';
      let currentResourceType = "event";
      this.progressTracker[currentResourceType].message = "loading_sms_programs";
      if(this.completedTrackedProcess.indexOf(resource) > -1){
        this.progressTracker[currentResourceType].message = "programs_have_been_loaded";
        this.updateProgressTracker(resource);
      }else{
        this.programsProvider.downloadProgramsFromServer(this.currentUser).then(response=>{
          if(this.isLoginProcessActive){
            this.progressTracker[currentResourceType].message = "saving_programs";
            this.programsProvider.saveProgramsFromServer(response[resource],this.currentUser).then(()=>{
              this.progressTracker[currentResourceType].message = "programs_have_been_saved";
              this.updateProgressTracker(resource);
            },error=>{
              this.cancelLoginProcess(this.cancelLoginProcessData);
              console.log(JSON.stringify(error));
              this.AppProvider.setNormalNotification('Fail to save programs');
            });
          }
        },error=>{
          this.cancelLoginProcess(this.cancelLoginProcessData);
          console.log(JSON.stringify(error));
          this.AppProvider.setNormalNotification('Fail to load programs');
        });
      }
    }
  }

  downloadingProgramStageSections(){
    if(this.isLoginProcessActive){
      let resource = 'programStageSections';
      let currentResourceType = "event";
      this.progressTracker[currentResourceType].message = "loading_program_stage_section";
      if(this.completedTrackedProcess.indexOf(resource) > -1){
        this.progressTracker[currentResourceType].message = "program_stage_section_have_been_loaded";
        this.updateProgressTracker(resource);
      }else{
        this.programStageSectionProvider.downloadProgramsStageSectionsFromServer(this.currentUser).then(response=>{
          if(this.isLoginProcessActive){
            this.progressTracker[currentResourceType].message = "saving_program_stage_section";
            this.programStageSectionProvider.saveProgramsStageSectionsFromServer(response[resource],this.currentUser).then(()=>{
              this.progressTracker[currentResourceType].message = "program_stage_section_have_been_saved";
              this.updateProgressTracker(resource);
            },error=>{
              this.cancelLoginProcess(this.cancelLoginProcessData);
              console.log(JSON.stringify(error));
              this.AppProvider.setNormalNotification('Fail to save program stage sections');
            });
          }
        },error=>{
          this.cancelLoginProcess(this.cancelLoginProcessData);
          console.log(JSON.stringify(error));
          this.AppProvider.setNormalNotification('Failed to load program-stage-sections');
        });
      }
    }
  }

  downloadingIndicators(){
    if(this.isLoginProcessActive){
      let resource = 'indicators';
      let currentResourceType = "report";
      this.progressTracker[currentResourceType].message = "loading_indicators";
      if(this.completedTrackedProcess.indexOf(resource) > -1){
        this.progressTracker[currentResourceType].message = "indicators_have_been_loaded";
        this.updateProgressTracker(resource);
      }else{
        this.indicatorsProvider.downloadingIndicatorsFromServer(this.currentUser).then((response:any)=>{
          if(this.isLoginProcessActive){
            this.progressTracker[currentResourceType].message = "saving_sms_indicators";
            this.indicatorsProvider.savingIndicatorsFromServer(response[resource],this.currentUser).then(()=>{
              this.progressTracker[currentResourceType].message = "indicators_have_been_saved";
              this.updateProgressTracker(resource);
            },error=>{
              this.cancelLoginProcess(this.cancelLoginProcessData);
              console.log(JSON.stringify(error));
              this.AppProvider.setNormalNotification('Fail to save indicators');
            });
          }
        },error=>{
          this.cancelLoginProcess(this.cancelLoginProcessData);
          console.log(JSON.stringify(error));
          this.AppProvider.setNormalNotification('Fail to load indicators');
        });
      }
    }
  }

  downloadingStandardReports(){
    if(this.isLoginProcessActive){
      let resource = "reports";
      let currentResourceType = "report";
      this.progressTracker[currentResourceType].message = "loading_reports";
      if(this.completedTrackedProcess.indexOf(resource) > -1){
        this.progressTracker[currentResourceType].message = "reports_have_been_loaded";
        this.updateProgressTracker(resource);
      }else{
        this.standardReports.downloadReportsFromServer(this.currentUser).then((reports : any)=>{
          if(this.isLoginProcessActive){
            this.progressTracker[currentResourceType].message = "saving_reports";
            this.standardReports.saveReportsFromServer(reports[resource],this.currentUser).then(()=>{
              this.progressTracker[currentResourceType].message = "reports_have_been_saved";
              this.updateProgressTracker(resource);
            },error=>{
              this.cancelLoginProcess(this.cancelLoginProcessData);
              console.log(JSON.stringify(error));
              this.AppProvider.setNormalNotification("Fail to save reports");
            });
          }
        },error=>{
          this.cancelLoginProcess(this.cancelLoginProcessData);
          console.log(JSON.stringify(error));
          this.AppProvider.setNormalNotification("Fail to load reports");
        });
      }
    }
  }

  downloadingConstants(){
    if(this.isLoginProcessActive){
      let resource = "constants";
      let currentResourceType = "report";
      this.progressTracker[currentResourceType].message = "loading_constants";
      if(this.completedTrackedProcess.indexOf(resource) > -1){
        this.progressTracker[currentResourceType].message = "constants_have_been_loaded";
        this.updateProgressTracker(resource);
      }else{
        this.standardReports.downloadConstantsFromServer(this.currentUser).then((constants : any)=>{
          if(this.isLoginProcessActive){
            this.progressTracker[currentResourceType].message = "saving_constants";
            this.standardReports.saveConstantsFromServer(constants,this.currentUser).then(()=>{
              this.progressTracker[currentResourceType].message = "constants_have_been_saved";
              this.updateProgressTracker(resource);
            },error=>{
              this.cancelLoginProcess(this.cancelLoginProcessData);
              console.log(JSON.stringify(error));
              this.AppProvider.setNormalNotification("Fail to save constants");
            });
          }
        },error=>{
          this.cancelLoginProcess(this.cancelLoginProcessData);
          console.log(JSON.stringify(error));
          this.AppProvider.setNormalNotification("Fail to load constants");
        });
      }
    }
  }

  getResponseData(response){
    if(response.data.data){
      return this.getResponseData(response.data);
    }else{
      return response;
    }
  }

  cancelLoginProcess(data) {
    this.animationEffect.progressBar = "animated fadeOut";
    this.animationEffect.loginForm = "animated fadeIn";
    if(this.currentUser && this.currentUser.serverUrl){
      let url = this.currentUser.serverUrl.split("/dhis-web-commons")[0];
      url = url.split("/dhis-web-dashboard-integration")[0];
      this.currentUser.serverUrl = url;
    }
    setTimeout(() => {
      this.isLoginProcessActive = data.isProcessActive;
    }, 300);
    this.backgroundMode.disable();
  }

  setLandingPage(currentUser){
    currentUser.isLogin = true;
    this.reCheckingAppSetting(currentUser);
    this.localInstanceProvider.setLocalInstanceInstances(this.localInstances,currentUser,this.loggedInInInstance).then(()=>{});
    this.UserProvider.setCurrentUser(currentUser).then(()=>{
      this.navCtrl.setRoot(TabsPage);
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
      completed += process.passStepCount;
      total += process.count;
    });
    let value = (completed/total) * 100;
    this.progressBar = String(value);
    if(completed == total){
      this.setLandingPage(this.currentUser);
    }
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
  }

}
