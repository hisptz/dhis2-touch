import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { UserProvider } from '../../providers/user/user';
import { AppProvider } from '../../providers/app/app';
import { SqlLiteProvider } from '../../providers/sql-lite/sql-lite';
import { OrganisationUnitsProvider } from '../../providers/organisation-units/organisation-units';
import { IndicatorsProvider } from '../../providers/indicators/indicators';
import { SmsCommandProvider } from '../../providers/sms-command/sms-command';
import { DataElementsProvider } from '../../providers/data-elements/data-elements';
import { SectionsProvider } from '../../providers/sections/sections';
import { DataSetsProvider } from '../../providers/data-sets/data-sets';
import { StandardReportProvider } from '../../providers/standard-report/standard-report';
import { SettingsProvider } from '../../providers/settings/settings';
import { HttpClientProvider } from '../../providers/http-client/http-client';
import { ProgramsProvider } from '../../providers/programs/programs';
import { ProgramStageSectionsProvider } from '../../providers/program-stage-sections/program-stage-sections';
import { BackgroundMode } from '@ionic-native/background-mode';
import { LocalInstanceProvider } from '../../providers/local-instance/local-instance';
import { AppTranslationProvider } from '../../providers/app-translation/app-translation';
import { CurrentUser } from '../../models/currentUser';
import { QueueManager } from '../../models/queueManager';
import { Store } from '@ngrx/store';
import { ApplicationState } from '../../store';
import { LoadedCurrentUser } from '../../store/actions/currentUser.actons';
import { EncryptionProvider } from '../../providers/encryption/encryption';
import { NetworkAvailabilityProvider } from '../../providers/network-availability/network-availability';
import { ProgramRulesProvider } from '../../providers/program-rules/program-rules';
import * as _ from 'lodash';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage implements OnInit {
  logoUrl: string;
  offlineIcon: string;
  cancelIcon: string;
  progressBar: string;
  loggedInInInstance: string;
  isLoginProcessActive: boolean;
  currentUser: CurrentUser;
  animationEffect: any = {};
  cancelLoginProcessData: any = { isProcessActive: false };
  progressTracker: any;
  completedTrackedProcess: any;
  hasUserAuthenticated: boolean;
  currentResourceType: string;
  localInstances: any;
  currentLanguage: string;
  topThreeTranslationCodes: Array<string> = [];
  translationCodes: Array<any> = [];
  isTranslationListOpen: boolean;
  isLocalInstancesListOpen: boolean;
  isNetworkAvailable: boolean;
  downloadingQueueManager: QueueManager;
  savingingQueueManager: QueueManager;

  constructor(
    public navCtrl: NavController,
    private store: Store<ApplicationState>,
    private encryption: EncryptionProvider,
    private UserProvider: UserProvider,
    private AppProvider: AppProvider,
    private sqlLite: SqlLiteProvider,
    private organisationUnitsProvider: OrganisationUnitsProvider,
    private indicatorsProvider: IndicatorsProvider,
    private smsCommandProvider: SmsCommandProvider,
    private dataElementsProvider: DataElementsProvider,
    private sectionsProvider: SectionsProvider,
    private dataSetsProvider: DataSetsProvider,
    private standardReports: StandardReportProvider,
    private settingsProvider: SettingsProvider,
    private HttpClientProvider: HttpClientProvider,
    private programsProvider: ProgramsProvider,
    private programStageSectionProvider: ProgramStageSectionsProvider,
    private backgroundMode: BackgroundMode,
    private localInstanceProvider: LocalInstanceProvider,
    private appTranslationProvider: AppTranslationProvider,
    private networkProvider: NetworkAvailabilityProvider,
    private programRulesProvider: ProgramRulesProvider
  ) {
    this.savingingQueueManager = {
      enqueuedProcess: [],
      dequeuingLimit: 1,
      denqueuedProcess: [],
      data: {}
    };
    this.downloadingQueueManager = {
      totalProcess: 13,
      enqueuedProcess: [],
      dequeuingLimit: 3,
      denqueuedProcess: []
    };
  }

  ngOnInit() {
    this.topThreeTranslationCodes = this.appTranslationProvider.getTopThreeSupportedTranslationCodes();
    this.translationCodes = this.appTranslationProvider.getSupportedTranslationObjects();
    this.isLocalInstancesListOpen = false;
    this.isTranslationListOpen = false;
    this.backgroundMode.disable();
    this.animationEffect = {
      loginForm: 'animated slideInUp',
      progressBar: 'animated fadeIn'
    };
    this.logoUrl = 'assets/img/logo.png';
    this.offlineIcon = 'assets/icon/offline.png';
    this.cancelIcon = 'assets/icon/cancel.png';
    this.cancelLoginProcess(this.cancelLoginProcessData);
    this.progressTracker = {};
    this.completedTrackedProcess = [];
    this.currentUser = {
      serverUrl: '',
      username: '',
      password: '',
      currentLanguage: 'en'
    };
    this.UserProvider.getCurrentUser().subscribe((currentUser: any) => {
      this.localInstanceProvider
        .getLocalInstances()
        .subscribe((localInstances: any) => {
          this.localInstances = localInstances;
          this.setUpCurrentUser(currentUser);
        });
    });
  }

  setUpCurrentUser(currentUser) {
    if (currentUser && currentUser.serverUrl) {
      if (currentUser.password) {
        delete currentUser.password;
      }
      if (!currentUser.currentLanguage) {
        currentUser.currentLanguage = 'en';
      }
      this.currentUser = currentUser;
    } else {
      this.currentUser = {
        serverUrl: 'play.dhis2.org/2.29',
        username: 'admin',
        password: 'district',
        currentLanguage: 'en'
      };
    }
    this.currentLanguage = this.currentUser.currentLanguage;
    this.appTranslationProvider.setAppTranslation(
      this.currentUser.currentLanguage
    );
  }

  changeCurrentUser(data) {
    if (data && data.currentUser) {
      this.setUpCurrentUser(data.currentUser);
    }
    this.toggleLocalInstancesList();
  }

  toggleLocalInstancesList() {
    this.isLocalInstancesListOpen = !this.isLocalInstancesListOpen;
  }

  changeLanguageFromList(language: string) {
    if (language) {
      this.updateTranslationLanguage(language);
    }
    this.toggleTransalationCodesSelectionList();
  }

  toggleTransalationCodesSelectionList() {
    if (!this.isLoginProcessActive) {
      this.isTranslationListOpen = !this.isTranslationListOpen;
      this.isLocalInstancesListOpen = false;
    }
  }

  updateTranslationLanguage(language: string) {
    try {
      this.appTranslationProvider.setAppTranslation(language);
      this.currentLanguage = language;
      this.currentUser.currentLanguage = language;
      this.UserProvider.setCurrentUser(this.currentUser).subscribe(() => {});
    } catch (e) {
      this.AppProvider.setNormalNotification('Failed to set translation');
      console.log(JSON.stringify(e));
    }
  }

  startLoginProcess() {
    this.hasUserAuthenticated = false;
    this.backgroundMode.enable();
    this.progressBar = '0';
    this.loggedInInInstance = this.currentUser.serverUrl;
    this.isLoginProcessActive = true;
    this.animationEffect.loginForm = 'animated fadeOut';
    this.animationEffect.progressBar = 'animated fadeIn';
    if (
      this.currentUser.serverUrl &&
      this.currentUser.username &&
      this.currentUser.password
    ) {
      this.isNetworkAvailable = this.networkProvider.getNetWorkStatus().isAvailable;
      let currentResourceType = 'communication';
      this.progressTracker = {};
      let resource = 'Authenticating user';
      this.currentUser.serverUrl = this.AppProvider.getFormattedBaseUrl(
        this.currentUser.serverUrl
      );
      this.loggedInInInstance = this.currentUser.serverUrl;
      this.reInitiateProgressTrackerObject(this.currentUser);
      this.progressTracker[currentResourceType].message =
        'Establishing connection to server';
      if (!this.isNetworkAvailable) {
        this.UserProvider.offlineUserAuthentication(this.currentUser).subscribe(
          (user: CurrentUser) => {
            this.currentUser.authorizationKey = btoa(
              this.currentUser.username + ':' + this.currentUser.password
            );
            this.setLandingPage(this.currentUser);
          },
          error => {
            this.cancelLoginProcess(this.cancelLoginProcessData);
            this.AppProvider.setNormalNotification(error.error);
          }
        );
      } else {
        delete this.currentUser.dhisVersion;
        this.UserProvider.authenticateUser(this.currentUser).subscribe(
          (response: any) => {
            response = this.getResponseData(response);
            this.currentUser = response.user;
            this.loggedInInInstance = this.currentUser.serverUrl;
            if (this.currentUser.serverUrl.split('://').length > 1) {
              this.loggedInInInstance = this.currentUser.serverUrl.split(
                '://'
              )[1];
            }
            this.currentUser.authorizationKey = btoa(
              this.currentUser.username + ':' + this.currentUser.password
            );
            this.currentUser.currentDatabase = this.AppProvider.getDataBaseName(
              this.currentUser.serverUrl,
              this.currentUser.username
            );
            this.reInitiateProgressTrackerObject(this.currentUser);
            this.updateProgressTracker(resource);
            resource = 'Discovering system information';
            if (this.isLoginProcessActive) {
              this.progressTracker[currentResourceType].message =
                'Discovering system information';
              this.HttpClientProvider.get(
                '/api/system/info',
                false,
                this.currentUser
              ).subscribe(
                (response: any) => {
                  this.UserProvider.setCurrentUserSystemInformation(
                    JSON.parse(response.data)
                  ).subscribe(
                    (dhisVersion: string) => {
                      this.currentUser.dhisVersion = dhisVersion;
                      this.updateProgressTracker(resource);
                      if (this.isLoginProcessActive) {
                        this.progressTracker[currentResourceType].message =
                          'Discovering current user authorities';
                        this.UserProvider.getUserAuthorities(
                          this.currentUser
                        ).subscribe(
                          (response: any) => {
                            this.currentUser.id = response.id;
                            this.currentUser.name = response.name;
                            this.currentUser.authorities = response.authorities;
                            this.currentUser.dataViewOrganisationUnits =
                              response.dataViewOrganisationUnits;
                            resource = 'Preparing local storage';
                            this.progressTracker[currentResourceType].message =
                              'Preparing local storage';
                            this.sqlLite
                              .generateTables(this.currentUser.currentDatabase)
                              .subscribe(
                                () => {
                                  this.UserProvider.getUserDataFromServer(
                                    this.currentUser,
                                    true
                                  ).subscribe(
                                    (response: any) => {
                                      response = this.getResponseData(response);
                                      this.UserProvider.setUserData(
                                        JSON.parse(response.data)
                                      ).subscribe(
                                        userData => {
                                          this.updateProgressTracker(resource);
                                          this.hasUserAuthenticated = true;
                                          this.currentUser[
                                            'userOrgUnitIds'
                                          ] = _.map(
                                            userData.organisationUnits,
                                            (organisationUnit: any) => {
                                              return organisationUnit.id;
                                            }
                                          );

                                          console.log(
                                            'this.currentUser.userOrgUnitIds ' +
                                              JSON.stringify(
                                                this.currentUser.userOrgUnitIds
                                              )
                                          );

                                          // this.downloadingOrganisationUnits(
                                          //   userData
                                          // );
                                          // this.downloadingDataSets();
                                          // this.downloadingSections();
                                          // this.downloadingDataElements();
                                          // this.downloadingSmsCommands();
                                          // this.downloadingPrograms();
                                          // this.downloadingProgramStageSections();
                                          // this.downloadingProgramRuleActions();
                                          // this.downloadingProgramRules();
                                          // this.downloadingProgramRuleVariables();
                                          // this.downloadingIndicators();
                                          // this.downloadingStandardReports();
                                          // this.downloadingConstants();
                                        },
                                        error => {}
                                      );
                                    },
                                    error => {
                                      this.cancelLoginProcess(
                                        this.cancelLoginProcessData
                                      );
                                      this.AppProvider.setNormalNotification(
                                        'Failed to save current user information'
                                      );
                                      console.error(
                                        'error : ' + JSON.stringify(error)
                                      );
                                    }
                                  );
                                },
                                error => {
                                  this.cancelLoginProcess(
                                    this.cancelLoginProcessData
                                  );
                                  this.AppProvider.setNormalNotification(
                                    'Failed to prepare local storage'
                                  );
                                  console.error(
                                    'error : ' + JSON.stringify(error)
                                  );
                                }
                              );
                          },
                          error => {
                            this.cancelLoginProcess(
                              this.cancelLoginProcessData
                            );
                            this.AppProvider.setNormalNotification(
                              'Failed to discover user authorities'
                            );
                            console.error('error : ' + JSON.stringify(error));
                          }
                        );
                      }
                    },
                    error => {
                      this.cancelLoginProcess(this.cancelLoginProcessData);
                      this.AppProvider.setNormalNotification(
                        'Failed to discover user authorities'
                      );
                      console.error('error : ' + JSON.stringify(error));
                    }
                  );
                },
                error => {
                  this.cancelLoginProcess(this.cancelLoginProcessData);
                  this.AppProvider.setNormalNotification(
                    'Failed to discover system information'
                  );
                  console.error('error : ' + JSON.stringify(error));
                }
              );
            }
          },
          (error: any) => {
            if (error.status == 0) {
              this.AppProvider.setNormalNotification(
                'Please check your network connectivity'
              );
            } else if (error.status == 401) {
              this.AppProvider.setNormalNotification(
                'You have enter wrong username or password or server address'
              );
            } else if (error.status == 404) {
              console.log(JSON.stringify(error));
              this.AppProvider.setNormalNotification(
                'Please check server address, or contact your help desk'
              );
            } else if (error.error) {
              this.AppProvider.setNormalNotification(error.error);
            } else {
              this.AppProvider.setNormalNotification(JSON.stringify(error));
            }
            this.cancelLoginProcess(this.cancelLoginProcessData);
          }
        );
      }
    } else {
      this.cancelLoginProcess(this.cancelLoginProcessData);
      this.AppProvider.setNormalNotification(
        'Please enter server address, username and password'
      );
    }
  }

  getResponseData(response) {
    if (response.data.data) {
      return this.getResponseData(response.data);
    } else {
      return response;
    }
  }

  cancelLoginProcess(data) {
    this.animationEffect.progressBar = 'animated fadeOut';
    this.animationEffect.loginForm = 'animated fadeIn';
    if (this.currentUser && this.currentUser.serverUrl) {
      let url = this.currentUser.serverUrl.split('/dhis-web-commons')[0];
      url = url.split('/dhis-web-dashboard')[0];
      this.currentUser.serverUrl = url;
    }
    setTimeout(() => {
      this.isLoginProcessActive = data.isProcessActive;
    }, 300);
    this.backgroundMode.disable();
  }

  setLandingPage(currentUser: CurrentUser) {
    currentUser.isLogin = true;
    this.reCheckingAppSetting(currentUser);
    this.smsCommandProvider
      .checkAndGenerateSmsCommands(currentUser)
      .subscribe(() => {}, error => {});
    currentUser.hashedKeyForOfflineAuthentication = this.encryption.getHashedKeyForOfflineAuthentication(
      currentUser
    );
    currentUser.password = this.encryption.encode(currentUser.password);
    this.store.dispatch(new LoadedCurrentUser(currentUser));
    if (
      this.currentUser &&
      this.currentUser.serverUrl &&
      this.currentUser.username
    ) {
      this.currentUser['currentDatabase'] = this.AppProvider.getDataBaseName(
        this.currentUser.serverUrl,
        this.currentUser.username
      );
      this.localInstanceProvider
        .setLocalInstanceInstances(
          this.localInstances,
          currentUser,
          this.loggedInInInstance
        )
        .subscribe(() => {});
    }
    this.UserProvider.setCurrentUser(currentUser).subscribe(() => {
      this.backgroundMode.disable();
      this.navCtrl.setRoot(TabsPage);
    });
  }

  reCheckingAppSetting(currentUser) {
    let defaultSetting = this.settingsProvider.getDefaultSettings();
    this.settingsProvider
      .getSettingsForTheApp(currentUser)
      .subscribe((appSettings: any) => {
        if (!appSettings) {
          let time = defaultSetting.synchronization.time;
          let timeType = defaultSetting.synchronization.timeType;
          defaultSetting.synchronization.time = this.settingsProvider.getDisplaySynchronizationTime(
            time,
            timeType
          );
          this.settingsProvider
            .setSettingsForTheApp(currentUser, defaultSetting)
            .subscribe(() => {}, error => {});
        }
      });
  }

  addIntoQueue(process: string, type?: string, data?: any) {
    if (type && type == 'saving') {
      this.savingingQueueManager.enqueuedProcess = _.concat(
        this.savingingQueueManager.enqueuedProcess,
        process
      );
      if (data) {
        this.savingingQueueManager.data[process] = data;
      }
      this.checkingAndStartSavingProcess();
    } else if (type && type == 'dowmloading') {
      this.downloadingQueueManager.enqueuedProcess = _.concat(
        this.downloadingQueueManager.enqueuedProcess,
        process
      );
      if (data) {
        this.downloadingQueueManager.data[process] = data;
      }
      this.checkingAndStartDownloadProcess();
    }
  }

  removeFromQueue(process: string, type: string) {
    if (type && type == 'saving') {
      _.remove(
        this.savingingQueueManager.denqueuedProcess,
        denqueuedProcess => {
          return process == denqueuedProcess;
        }
      );
      this.checkingAndStartSavingProcess();
    } else if (type && type == 'dowmloading') {
      _.remove(
        this.downloadingQueueManager.denqueuedProcess,
        denqueuedProcess => {
          return process == denqueuedProcess;
        }
      );
      this.checkingAndStartDownloadProcess();
    }
  }

  checkingAndStartSavingProcess() {
    if (
      this.savingingQueueManager.denqueuedProcess.length <
      this.savingingQueueManager.dequeuingLimit
    ) {
      const process = _.head(this.savingingQueueManager.enqueuedProcess);
      if (process) {
        const data = this.savingingQueueManager.data[process];
        delete this.savingingQueueManager.data[process];
        this.savingingQueueManager.denqueuedProcess = _.concat(
          this.savingingQueueManager.denqueuedProcess,
          process
        );
        _.remove(
          this.savingingQueueManager.enqueuedProcess,
          enqueuedProcess => {
            return process == enqueuedProcess;
          }
        );
        this.startSavingProcess(process, data);
      }
    }
  }

  checkingAndStartDownloadProcess() {
    if (
      this.downloadingQueueManager.denqueuedProcess.length <
      this.downloadingQueueManager.dequeuingLimit
    ) {
      const process = _.head(this.downloadingQueueManager.enqueuedProcess);
      if (process) {
        this.downloadingQueueManager.denqueuedProcess = _.concat(
          this.downloadingQueueManager.denqueuedProcess,
          process
        );
        _.remove(
          this.downloadingQueueManager.enqueuedProcess,
          enqueuedProcess => {
            return process == enqueuedProcess;
          }
        );
        this.startDownloadProcess(process);
      }
    }
  }

  startDownloadProcess(process: string) {}

  startSavingProcess(process, data) {}

  reInitiateProgressTrackerObject(user) {
    const emptyProcessTracker = this.getEmptyProgressTracker();
    if (
      user.progressTracker &&
      user.currentDatabase &&
      user.progressTracker[user.currentDatabase]
    ) {
      this.progressTracker = user.progressTracker[user.currentDatabase];
      this.resetPassSteps();
    } else if (user.currentDatabase && user.progressTracker) {
      this.currentUser.progressTracker[
        user.currentDatabase
      ] = emptyProcessTracker;
      this.progressTracker = emptyProcessTracker;
    } else {
      this.currentUser['progressTracker'] = {};
      this.progressTracker = emptyProcessTracker;
    }
  }

  getEmptyProgressTracker() {
    const dataBaseStructure = this.sqlLite.getDataBaseStructure();
    let progressTracker = {};
    progressTracker['communication'] = {
      expectedProcesses: 3,
      totalPassedProcesses: 0,
      passedProcesses: [],
      message: ''
    };
    Object.keys(dataBaseStructure).map(key => {
      const tableObject = dataBaseStructure[key];
      if (
        tableObject.isMetadata &&
        tableObject.resourceType &&
        tableObject.resourceType != ''
      ) {
        if (!progressTracker[tableObject.resourceType]) {
          progressTracker[tableObject.resourceType] = {
            expectedProcesses: 0,
            totalPassedProcesses: 0,
            passedProcesses: [],
            message: ''
          };
        }
        progressTracker[tableObject.resourceType].expectedProcesses += 1;
      }
    });
    return progressTracker;
  }

  resetPassSteps() {
    const nonEmptyCommunicationStep = _.filter(
      this.progressTracker.communication.passedProcesses,
      process => {
        return process.name == 'organisationUnits';
      }
    );
    this.progressTracker.communication.passedProcesses = _.concat(
      [],
      nonEmptyCommunicationStep
    );
    Object.keys(this.progressTracker).map((resourceType: string) => {
      this.progressTracker[resourceType].message = '';
      this.progressTracker[resourceType].totalPassedProcesses = 0;
      this.progressTracker[resourceType].passedProcesses.forEach(
        (passedProcess: any) => {
          passedProcess.hasBeenPassed = false;
        }
      );
    });
  }

  updateProgressTracker(resourceName) {
    const dataBaseStructure = this.sqlLite.getDataBaseStructure();
    let resourceType = 'communication';
    if (dataBaseStructure[resourceName]) {
      const tableObject = dataBaseStructure[resourceName];
      if (tableObject.isMetadata && tableObject.resourceType) {
        resourceType = tableObject.resourceType;
      }
    }
    if (
      this.progressTracker[resourceType].passedProcesses.length ==
      this.progressTracker[resourceType].expectedProcesses
    ) {
      Object.keys(this.progressTracker).map((resourceType: string) => {
        this.progressTracker[resourceType].passedProcesses.forEach(
          (passedProcess: any) => {
            passedProcess.hasBeenPassed = true;
          }
        );
      });
    } else {
      const currentProcess = _.find(
        this.progressTracker[resourceType].passedProcesses,
        { name: resourceName }
      );
      if (currentProcess) {
        _.remove(
          this.progressTracker[resourceType].passedProcesses,
          process => {
            return process.name == resourceName;
          }
        );
      }
      this.progressTracker[resourceType].passedProcesses = _.concat(
        this.progressTracker[resourceType].passedProcesses,
        {
          name: resourceName,
          hasBeenSaved: true,
          hasBeenPassed: true
        }
      );
    }
    this.progressTracker[resourceType].totalPassedProcesses += 1;
    this.currentUser['progressTracker'][
      this.currentUser.currentDatabase
    ] = this.progressTracker;
    this.UserProvider.setCurrentUser(this.currentUser).subscribe(() => {});
    this.completedTrackedProcess = this.getCompletedTrackedProcess();
    this.updateProgressBarPercentage();
  }

  getCompletedTrackedProcess() {
    let completedTrackedProcess = [];
    Object.keys(this.progressTracker).map((resourceType: string) => {
      this.progressTracker[resourceType].passedProcesses.map(
        (passedProcess: any) => {
          if (passedProcess.name && passedProcess.hasBeenSaved) {
            completedTrackedProcess = _.concat(
              completedTrackedProcess,
              passedProcess.name
            );
          }
        }
      );
    });
    return completedTrackedProcess;
  }

  updateProgressBarPercentage() {
    let total = 0;
    let completed = 0;
    Object.keys(this.progressTracker).map(key => {
      const trackedProcess = this.progressTracker[key];
      const completedProcess = _.filter(
        trackedProcess.passedProcesses,
        process => {
          return process && process.hasBeenPassed;
        }
      );
      completed += completedProcess.length;
      total += trackedProcess.expectedProcesses;
    });
    let value = completed / total * 100;
    this.progressBar = String(value);
    if (completed == total) {
      this.setLandingPage(this.currentUser);
    }
  }
}
