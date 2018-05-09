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
  hasUserSuccessLogin: boolean;

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
    this.resetQueueManager();
    this.hasUserSuccessLogin = false;
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
        serverUrl: 'play.dhis2.org/2.28',
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
    this.hasUserSuccessLogin = false;
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
            this.resetQueueManager();
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
                                          const metadataList = [
                                            'organisationUnits',
                                            'sections',
                                            'dataElements',
                                            'smsCommand',
                                            'programs',
                                            'programStageSections',
                                            'programRules',
                                            'indicators',
                                            'programRuleActions',
                                            'programRuleVariables',
                                            'dataSets',
                                            'reports',
                                            'constants'
                                          ];
                                          metadataList.map(
                                            (process: string) => {
                                              this.addIntoQueue(
                                                process,
                                                'dowmloading'
                                              );
                                            }
                                          );
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
    this.hasUserSuccessLogin = true;
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
      if (!this.hasUserSuccessLogin) {
        this.setLandingPage(this.currentUser);
      }
    }
  }

  resetQueueManager() {
    this.savingingQueueManager = {
      enqueuedProcess: [],
      dequeuingLimit: 1,
      denqueuedProcess: [],
      data: {}
    };
    this.downloadingQueueManager = {
      totalProcess: 13,
      enqueuedProcess: [],
      dequeuingLimit: 5,
      denqueuedProcess: []
    };
  }

  addIntoQueue(process: string, type?: string, data?: any) {
    if (type && type == 'saving') {
      if (data) {
        this.savingingQueueManager.enqueuedProcess = _.concat(
          this.savingingQueueManager.enqueuedProcess,
          process
        );
        this.savingingQueueManager.data[process] = data;
      }
      this.checkingAndStartSavingProcess();
    } else if (type && type == 'dowmloading') {
      this.downloadingQueueManager.enqueuedProcess = _.concat(
        this.downloadingQueueManager.enqueuedProcess,
        process
      );
      this.checkingAndStartDownloadProcess();
    }
  }

  removeFromQueue(process: string, type: string, data?: any) {
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
      if (data) {
        this.addIntoQueue(process, 'saving', data);
      }
      this.checkingAndStartDownloadProcess();
    }
  }

  startDownloadProcess(process: string) {
    if (this.isLoginProcessActive) {
      if (process == 'organisationUnits') {
        const currentResourceType = 'communication';
        this.progressTracker[currentResourceType].message =
          'Discovering assigned organisation units';
        if (this.completedTrackedProcess.indexOf(process) > -1) {
          this.progressTracker[currentResourceType].message =
            'Assigned organisation units have been discovered';
          this.updateProgressTracker(process);
          this.removeFromQueue(process, 'dowmloading');
        } else {
          this.organisationUnitsProvider
            .downloadingOrganisationUnitsFromServer(this.currentUser)
            .subscribe(
              (orgUnits: any) => {
                this.removeFromQueue(process, 'dowmloading', orgUnits);
              },
              error => {
                this.cancelLoginProcess(this.cancelLoginProcessData);
                console.log(JSON.stringify(error));
                this.AppProvider.setNormalNotification(
                  'Failed to discover organisation data'
                );
              }
            );
        }
      } else if (process == 'dataSets') {
        const currentResourceType = 'entryForm';
        this.progressTracker[currentResourceType].message =
          'Discovering entry forms';
        if (this.completedTrackedProcess.indexOf(process) > -1) {
          this.progressTracker[currentResourceType].message =
            'Entry forms have been discovered';
          this.updateProgressTracker(process);
          this.removeFromQueue(process, 'dowmloading');
        } else {
          this.dataSetsProvider
            .downloadDataSetsFromServer(this.currentUser)
            .subscribe(
              (dataSets: any) => {
                this.removeFromQueue(process, 'dowmloading', dataSets);
              },
              error => {
                this.cancelLoginProcess(this.cancelLoginProcessData);
                console.log(JSON.stringify(error));
                this.AppProvider.setNormalNotification(
                  'Failed to discover entry form'
                );
              }
            );
        }
      } else if (process == 'sections') {
        const currentResourceType = 'entryForm';
        this.progressTracker[currentResourceType].message =
          'Discovering entry form sections';
        if (this.completedTrackedProcess.indexOf(process) > -1) {
          this.progressTracker[currentResourceType].message =
            'Entry form sections have been discovered';
          this.updateProgressTracker(process);
          this.removeFromQueue(process, 'dowmloading');
        } else {
          this.sectionsProvider
            .downloadSectionsFromServer(this.currentUser)
            .subscribe(
              (response: any) => {
                const { sections } = response;
                this.removeFromQueue(process, 'dowmloading', sections);
              },
              error => {
                this.cancelLoginProcess(this.cancelLoginProcessData);
                console.log(JSON.stringify(error));
                this.AppProvider.setNormalNotification(
                  'Failed to discover entry form sections'
                );
              }
            );
        }
      } else if (process == 'dataElements') {
        const currentResourceType = 'entryForm';
        this.progressTracker[currentResourceType].message =
          'Discovering entry form fields';
        if (this.completedTrackedProcess.indexOf(process) > -1) {
          this.progressTracker[currentResourceType].message =
            'Entry form fields have been discovered';
          this.updateProgressTracker(process);
          this.removeFromQueue(process, 'dowmloading');
        } else {
          this.dataElementsProvider
            .downloadDataElementsFromServer(this.currentUser)
            .subscribe(
              (response: any) => {
                const { dataElements } = response;
                this.removeFromQueue(process, 'dowmloading', dataElements);
              },
              error => {
                this.cancelLoginProcess(this.cancelLoginProcessData);
                console.log(JSON.stringify(error));
                this.AppProvider.setNormalNotification(
                  'Failed to discover entry form fields'
                );
              }
            );
        }
      } else if (process == 'smsCommand') {
        const currentResourceType = 'entryForm';
        this.progressTracker[currentResourceType].message =
          'Discovering SMS commands';
        if (this.completedTrackedProcess.indexOf(process) > -1) {
          this.progressTracker[currentResourceType].message =
            'SMS commands have been discovered';
          this.updateProgressTracker(process);
          this.removeFromQueue(process, 'dowmloading');
        } else {
          this.smsCommandProvider
            .getSmsCommandFromServer(this.currentUser)
            .subscribe(
              (smsCommands: any) => {
                this.removeFromQueue(process, 'dowmloading', smsCommands);
              },
              error => {
                this.cancelLoginProcess(this.cancelLoginProcessData);
                console.log(JSON.stringify(error));
                this.AppProvider.setNormalNotification(
                  'Failed to discover SMS commands'
                );
              }
            );
        }
      } else if (process == 'programs') {
        const currentResourceType = 'event';
        this.progressTracker[currentResourceType].message =
          'Discovering programs';
        if (this.completedTrackedProcess.indexOf(process) > -1) {
          this.progressTracker[currentResourceType].message =
            'Programs have been discovered';
          this.updateProgressTracker(process);
          this.removeFromQueue(process, 'dowmloading');
        } else {
          this.programsProvider
            .downloadProgramsFromServer(this.currentUser)
            .subscribe(
              response => {
                const { programs } = response;
                this.removeFromQueue(process, 'dowmloading', programs);
              },
              error => {
                this.cancelLoginProcess(this.cancelLoginProcessData);
                console.log(JSON.stringify(error));
                this.AppProvider.setNormalNotification(
                  'Failed to discover programs'
                );
              }
            );
        }
      } else if (process == 'programStageSections') {
        const currentResourceType = 'event';
        this.progressTracker[currentResourceType].message =
          'Discovering program stage section';
        if (this.completedTrackedProcess.indexOf(process) > -1) {
          this.progressTracker[currentResourceType].message =
            'Program stage section have been discovered';
          this.updateProgressTracker(process);
          this.removeFromQueue(process, 'dowmloading');
        } else {
          this.programStageSectionProvider
            .downloadProgramsStageSectionsFromServer(this.currentUser)
            .subscribe(
              response => {
                const { programStageSections } = response;
                this.removeFromQueue(
                  process,
                  'dowmloading',
                  programStageSections
                );
              },
              error => {
                this.cancelLoginProcess(this.cancelLoginProcessData);
                console.log(JSON.stringify(error));
                this.AppProvider.setNormalNotification(
                  'Failed to discover program stage sections'
                );
              }
            );
        }
      } else if (process == 'programRules') {
        const currentResourceType = 'event';
        this.progressTracker[currentResourceType].message =
          'Discovering program rules';
        if (this.completedTrackedProcess.indexOf(process) > -1) {
          this.progressTracker[currentResourceType].message =
            'Program Rules have been discovered';
          this.updateProgressTracker(process);
          this.removeFromQueue(process, 'dowmloading');
        } else {
          if (this.isLoginProcessActive) {
            this.programRulesProvider
              .downloadingProgramRules(this.currentUser)
              .subscribe(
                data => {
                  this.removeFromQueue(process, 'dowmloading', data);
                },
                error => {
                  this.cancelLoginProcess(this.cancelLoginProcessData);
                  console.log(JSON.stringify(error));
                  this.AppProvider.setNormalNotification(
                    'Failed to discover program rules'
                  );
                }
              );
          }
        }
      } else if (process == 'programRuleActions') {
        const currentResourceType = 'event';
        this.progressTracker[currentResourceType].message =
          'Discovering program rules actions';
        if (this.completedTrackedProcess.indexOf(process) > -1) {
          this.progressTracker[currentResourceType].message =
            'Program rules actions have been discovered';
          this.updateProgressTracker(process);
          this.removeFromQueue(process, 'dowmloading');
        } else {
          if (this.isLoginProcessActive) {
            this.programRulesProvider
              .downloadingProgramRuleActions(this.currentUser)
              .subscribe(
                data => {
                  this.removeFromQueue(process, 'dowmloading', data);
                },
                error => {
                  this.cancelLoginProcess(this.cancelLoginProcessData);
                  console.log(JSON.stringify(error));
                  this.AppProvider.setNormalNotification(
                    'Failed to discover program rules actions'
                  );
                }
              );
          }
        }
      } else if (process == 'programRuleVariables') {
        const currentResourceType = 'event';
        this.progressTracker[currentResourceType].message =
          'Discovering program rules variables';
        if (this.completedTrackedProcess.indexOf(process) > -1) {
          this.progressTracker[currentResourceType].message =
            'Program rules variables have been discovered';
          this.updateProgressTracker(process);
          this.removeFromQueue(process, 'dowmloading');
        } else {
          if (this.isLoginProcessActive) {
            this.programRulesProvider
              .downloadingProgramRuleVariables(this.currentUser)
              .subscribe(
                data => {
                  this.removeFromQueue(process, 'dowmloading', data);
                },
                error => {
                  this.cancelLoginProcess(this.cancelLoginProcessData);
                  console.log(JSON.stringify(error));
                  this.AppProvider.setNormalNotification(
                    'Failed to discover program rules variables'
                  );
                }
              );
          }
        }
      } else if (process == 'indicators') {
        const currentResourceType = 'report';
        this.progressTracker[currentResourceType].message =
          'Discovering indicators';
        if (this.completedTrackedProcess.indexOf(process) > -1) {
          this.progressTracker[currentResourceType].message =
            'Indicators have been discovered';
          this.updateProgressTracker(process);
          this.removeFromQueue(process, 'dowmloading');
        } else {
          this.indicatorsProvider
            .downloadingIndicatorsFromServer(this.currentUser)
            .subscribe(
              (response: any) => {
                const { indicators } = response;
                this.removeFromQueue(process, 'dowmloading', indicators);
              },
              error => {
                this.cancelLoginProcess(this.cancelLoginProcessData);
                console.log(JSON.stringify(error));
                this.AppProvider.setNormalNotification(
                  'Failed to discover indicators'
                );
              }
            );
        }
      } else if (process == 'reports') {
        const currentResourceType = 'report';
        this.progressTracker[currentResourceType].message =
          'Discovering reports';
        if (this.completedTrackedProcess.indexOf(process) > -1) {
          this.progressTracker[currentResourceType].message =
            'Reports have been discovered';
          this.updateProgressTracker(process);
          this.removeFromQueue(process, 'dowmloading');
        } else {
          this.standardReports
            .downloadReportsFromServer(this.currentUser)
            .subscribe(
              (response: any) => {
                const { reports } = response;
                this.removeFromQueue(process, 'dowmloading', reports);
              },
              error => {
                this.cancelLoginProcess(this.cancelLoginProcessData);
                console.log(JSON.stringify(error));
                this.AppProvider.setNormalNotification(
                  'Failed to discover reports'
                );
              }
            );
        }
      } else if (process == 'constants') {
        const currentResourceType = 'report';
        this.progressTracker[currentResourceType].message =
          'Discovering constants';
        if (this.completedTrackedProcess.indexOf(process) > -1) {
          this.progressTracker[currentResourceType].message =
            'Constants have been discovered';
          this.updateProgressTracker(process);
          this.removeFromQueue(process, 'dowmloading');
        } else {
          this.standardReports
            .downloadConstantsFromServer(this.currentUser)
            .subscribe(
              (constants: any) => {
                this.removeFromQueue(process, 'dowmloading', constants);
              },
              error => {
                this.cancelLoginProcess(this.cancelLoginProcessData);
                console.log(JSON.stringify(error));
                this.AppProvider.setNormalNotification(
                  'Failed to discover constants'
                );
              }
            );
        }
      }
    }
  }

  startSavingProcess(process, data) {
    if (this.isLoginProcessActive) {
      if (process == 'organisationUnits') {
        const currentResourceType = 'communication';
        this.progressTracker[currentResourceType].message =
          'Saving assigned organisation units';
        this.organisationUnitsProvider
          .savingOrganisationUnitsFromServer(data, this.currentUser)
          .subscribe(
            () => {
              this.progressTracker[currentResourceType].message =
                'Assigned organisation units have been saved';
              this.updateProgressTracker(process);
              this.removeFromQueue(process, 'saving');
            },
            error => {
              this.cancelLoginProcess(this.cancelLoginProcessData);
              console.log(JSON.stringify(error));
              this.AppProvider.setNormalNotification(
                'Failed to save organisation data'
              );
            }
          );
      } else if (process == 'dataSets') {
        const currentResourceType = 'entryForm';
        this.progressTracker[currentResourceType].message =
          'Saving entry forms';
        this.dataSetsProvider
          .saveDataSetsFromServer(data, this.currentUser)
          .subscribe(
            () => {
              this.progressTracker[currentResourceType].message =
                'Entry form have been saved';
              this.updateProgressTracker(process);
              this.removeFromQueue(process, 'saving');
            },
            error => {
              this.cancelLoginProcess(this.cancelLoginProcessData);
              console.log(JSON.stringify(error));
              this.AppProvider.setNormalNotification(
                'Failed to save entry form'
              );
            }
          );
      } else if (process == 'sections') {
        const currentResourceType = 'entryForm';
        this.progressTracker[currentResourceType].message =
          'Saving entry form sections';
        this.sectionsProvider
          .saveSectionsFromServer(data, this.currentUser)
          .subscribe(
            () => {
              this.progressTracker[currentResourceType].message =
                'Entry form sections have been saved';
              this.updateProgressTracker(process);
              this.removeFromQueue(process, 'saving');
            },
            error => {
              this.cancelLoginProcess(this.cancelLoginProcessData);
              console.log(JSON.stringify(error));
              this.AppProvider.setNormalNotification(
                'Failed to save entry form sections'
              );
            }
          );
      } else if (process == 'dataElements') {
        const currentResourceType = 'entryForm';
        this.progressTracker[currentResourceType].message =
          'Saving entry form fields';
        this.dataElementsProvider
          .saveDataElementsFromServer(data, this.currentUser)
          .subscribe(
            () => {
              this.progressTracker[currentResourceType].message =
                'Entry form fields have been saved';
              this.updateProgressTracker(process);
              this.removeFromQueue(process, 'saving');
            },
            error => {
              this.cancelLoginProcess(this.cancelLoginProcessData);
              console.log(JSON.stringify(error));
              this.AppProvider.setNormalNotification(
                'Failed to save entry form fields'
              );
            }
          );
      } else if (process == 'smsCommand') {
        const currentResourceType = 'entryForm';
        this.progressTracker[currentResourceType].message =
          'Saving SMS commands';
        this.smsCommandProvider
          .savingSmsCommand(data, this.currentUser.currentDatabase)
          .subscribe(
            () => {
              this.progressTracker[currentResourceType].message =
                'SMS commands have been saved';
              this.updateProgressTracker(process);
              this.removeFromQueue(process, 'saving');
            },
            error => {
              this.cancelLoginProcess(this.cancelLoginProcessData);
              console.log(JSON.stringify(error));
              this.AppProvider.setNormalNotification(
                'Failed to save SMS commands'
              );
            }
          );
      } else if (process == 'programs') {
        const currentResourceType = 'event';
        this.progressTracker[currentResourceType].message = 'Saving programs';
        this.programsProvider
          .saveProgramsFromServer(data, this.currentUser)
          .subscribe(
            () => {
              this.progressTracker[currentResourceType].message =
                'Programs have been saved';
              this.updateProgressTracker(process);
              this.removeFromQueue(process, 'saving');
            },
            error => {
              this.cancelLoginProcess(this.cancelLoginProcessData);
              console.log(JSON.stringify(error));
              this.AppProvider.setNormalNotification('Failed to save programs');
            }
          );
      } else if (process == 'programStageSections') {
        const currentResourceType = 'event';
        this.progressTracker[currentResourceType].message =
          'Saving program stage section';
        this.programStageSectionProvider
          .saveProgramsStageSectionsFromServer(data, this.currentUser)
          .subscribe(
            () => {
              this.progressTracker[currentResourceType].message =
                'Program stage section have been saved';
              this.updateProgressTracker(process);
              this.removeFromQueue(process, 'saving');
            },
            error => {
              this.cancelLoginProcess(this.cancelLoginProcessData);
              console.log(JSON.stringify(error));
              this.AppProvider.setNormalNotification(
                'Failed to save program stage sections'
              );
            }
          );
      } else if (process == 'programRules') {
        const currentResourceType = 'event';
        this.progressTracker[currentResourceType].message =
          'Saving program rules';
        this.programRulesProvider
          .savingProgramRules(data, this.currentUser)
          .subscribe(
            () => {
              this.progressTracker[currentResourceType].message =
                'Program rules have been saved successfully';
              this.updateProgressTracker(process);
              this.removeFromQueue(process, 'saving');
            },
            error => {
              this.cancelLoginProcess(this.cancelLoginProcessData);
              console.log(JSON.stringify(error));
              this.AppProvider.setNormalNotification(
                'Failed to save program rules'
              );
            }
          );
      } else if (process == 'programRuleActions') {
        const currentResourceType = 'event';
        this.progressTracker[currentResourceType].message =
          'Saving program rules actions';
        this.programRulesProvider
          .savingProgramRuleActions(data, this.currentUser)
          .subscribe(
            () => {
              this.progressTracker[currentResourceType].message =
                'Program rules actions have been saved successfully';
              this.updateProgressTracker(process);
              this.removeFromQueue(process, 'saving');
            },
            error => {
              this.cancelLoginProcess(this.cancelLoginProcessData);
              console.log(JSON.stringify(error));
              this.AppProvider.setNormalNotification(
                'Failed to save program rules actions'
              );
            }
          );
      } else if (process == 'programRuleVariables') {
        const currentResourceType = 'event';
        this.progressTracker[currentResourceType].message =
          'Saving program rules variables';
        this.programRulesProvider
          .savingProgramRuleVariables(data, this.currentUser)
          .subscribe(
            () => {
              this.progressTracker[currentResourceType].message =
                'Program rules variables have been saved successfully';
              this.updateProgressTracker(process);
              this.removeFromQueue(process, 'saving');
            },
            error => {
              this.cancelLoginProcess(this.cancelLoginProcessData);
              console.log(JSON.stringify(error));
              this.AppProvider.setNormalNotification(
                'Failed to save program rules variables'
              );
            }
          );
      } else if (process == 'indicators') {
        const currentResourceType = 'report';
        this.progressTracker[currentResourceType].message = 'Saving indicators';
        this.indicatorsProvider
          .savingIndicatorsFromServer(data, this.currentUser)
          .subscribe(
            () => {
              this.progressTracker[currentResourceType].message =
                'Indicators have been saved';
              this.updateProgressTracker(process);
              this.removeFromQueue(process, 'saving');
            },
            error => {
              this.cancelLoginProcess(this.cancelLoginProcessData);
              console.log(JSON.stringify(error));
              this.AppProvider.setNormalNotification(
                'Failed to save indicators'
              );
            }
          );
      } else if (process == 'reports') {
        const currentResourceType = 'report';
        this.progressTracker[currentResourceType].message = 'Saving reports';
        this.standardReports
          .saveReportsFromServer(data, this.currentUser)
          .subscribe(
            () => {
              this.progressTracker[currentResourceType].message =
                'Reports have been saved';
              this.updateProgressTracker(process);
              this.removeFromQueue(process, 'saving');
            },
            error => {
              this.cancelLoginProcess(this.cancelLoginProcessData);
              console.log(JSON.stringify(error));
              this.AppProvider.setNormalNotification('Failed to save reports');
            }
          );
      } else if (process == 'constants') {
        const currentResourceType = 'report';
        this.progressTracker[currentResourceType].message = 'Saving constants';
        this.standardReports
          .saveConstantsFromServer(data, this.currentUser)
          .subscribe(
            () => {
              this.progressTracker[currentResourceType].message =
                'Constants have been saved';
              this.updateProgressTracker(process);
              this.removeFromQueue(process, 'saving');
            },
            error => {
              this.cancelLoginProcess(this.cancelLoginProcessData);
              console.log(JSON.stringify(error));
              this.AppProvider.setNormalNotification(
                'Failed to save constants'
              );
            }
          );
      }
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
}
