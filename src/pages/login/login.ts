import { Component, OnInit } from "@angular/core";
import { NavController } from "ionic-angular";
import { TabsPage } from "../tabs/tabs";
import { UserProvider } from "../../providers/user/user";
import { AppProvider } from "../../providers/app/app";
import { SqlLiteProvider } from "../../providers/sql-lite/sql-lite";
import { OrganisationUnitsProvider } from "../../providers/organisation-units/organisation-units";
import { IndicatorsProvider } from "../../providers/indicators/indicators";
import { SmsCommandProvider } from "../../providers/sms-command/sms-command";
import { DataElementsProvider } from "../../providers/data-elements/data-elements";
import { SectionsProvider } from "../../providers/sections/sections";
import { DataSetsProvider } from "../../providers/data-sets/data-sets";
import { StandardReportProvider } from "../../providers/standard-report/standard-report";
import { SettingsProvider } from "../../providers/settings/settings";
import { HttpClientProvider } from "../../providers/http-client/http-client";
import { ProgramsProvider } from "../../providers/programs/programs";
import { ProgramStageSectionsProvider } from "../../providers/program-stage-sections/program-stage-sections";
import { LocalInstanceProvider } from "../../providers/local-instance/local-instance";
import { AppTranslationProvider } from "../../providers/app-translation/app-translation";
import { CurrentUser } from "../../models/currentUser";
import { Store } from "@ngrx/store";
import { ApplicationState } from "../../store";
import { LoadedCurrentUser } from "../../store/actions/currentUser.actons";
import { EncryptionProvider } from "../../providers/encryption/encryption";

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: "page-login",
  templateUrl: "login.html"
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
    private localInstanceProvider: LocalInstanceProvider,
    private appTranslationProvider: AppTranslationProvider
  ) {}

  ngOnInit() {
    this.topThreeTranslationCodes = this.appTranslationProvider.getTopThreeSupportedTranslationCodes();
    this.translationCodes = this.appTranslationProvider.getSupportedTranslationObjects();
    this.isLocalInstancesListOpen = false;
    this.isTranslationListOpen = false;
    this.animationEffect = {
      loginForm: "animated slideInUp",
      progressBar: "animated fadeIn"
    };
    this.logoUrl = "assets/img/logo.png";
    this.offlineIcon = "assets/icon/offline.png";
    this.cancelIcon = "assets/icon/cancel.png";
    this.cancelLoginProcess(this.cancelLoginProcessData);
    this.progressTracker = {};
    this.completedTrackedProcess = [];
    this.currentUser = {
      serverUrl: "",
      username: "",
      password: "",
      currentLanguage: "en"
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
        currentUser.currentLanguage = "en";
      }
      this.currentUser = currentUser;
    } else {
      this.currentUser = {
        serverUrl: "play.hisptz.org/28",
        username: "admin",
        password: "district",
        currentLanguage: "en"
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
      this.AppProvider.setNormalNotification("fail to set translation");
      console.log(JSON.stringify(e));
    }
  }

  startLoginProcess() {
    this.hasUserAuthenticated = false;
    this.progressBar = "0";
    this.loggedInInInstance = this.currentUser.serverUrl;
    this.isLoginProcessActive = true;
    this.animationEffect.loginForm = "animated fadeOut";
    this.animationEffect.progressBar = "animated fadeIn";
    if (
      this.currentUser.serverUrl &&
      this.currentUser.username &&
      this.currentUser.password
    ) {
      let currentResourceType = "communication";
      this.progressTracker = {};
      let resource = "Authenticating user";
      this.currentUser.serverUrl = this.AppProvider.getFormattedBaseUrl(
        this.currentUser.serverUrl
      );
      this.loggedInInInstance = this.currentUser.serverUrl;
      this.reInitiateProgressTrackerObject(this.currentUser);
      this.progressTracker[currentResourceType].message =
        "establishing connection to server";
      this.UserProvider.authenticateUser(this.currentUser).subscribe(
        (response: any) => {
          response = this.getResponseData(response);
          this.currentUser = response.user;
          this.loggedInInInstance = this.currentUser.serverUrl;
          if (this.currentUser.serverUrl.split("://").length > 1) {
            this.loggedInInInstance = this.currentUser.serverUrl.split(
              "://"
            )[1];
          }
          this.currentUser.authorizationKey = btoa(
            this.currentUser.username + ":" + this.currentUser.password
          );
          this.currentUser.currentDatabase =
            this.AppProvider.getDataBaseName(this.currentUser.serverUrl) +
            " " +
            this.currentUser.username;
          this.reInitiateProgressTrackerObject(this.currentUser);
          this.updateProgressTracker(resource);
          this.UserProvider.setUserData(JSON.parse(response.data)).subscribe(
            userData => {
              resource = "Loading system information";
              if (this.isLoginProcessActive) {
                this.progressTracker[currentResourceType].message =
                  "loading system information";
                this.HttpClientProvider.get(
                  "/api/system/info",
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
                            "loading current user authorities";
                          this.UserProvider.getUserAuthorities(
                            this.currentUser
                          ).subscribe(
                            (response: any) => {
                              this.currentUser.id = response.id;
                              this.currentUser.name = response.name;
                              this.currentUser.authorities =
                                response.authorities;
                              this.currentUser.dataViewOrganisationUnits =
                                response.dataViewOrganisationUnits;
                              resource = "Preparing local storage";
                              this.progressTracker[
                                currentResourceType
                              ].message =
                                "preparing local storage";
                              this.sqlLite
                                .generateTables(
                                  this.currentUser.currentDatabase
                                )
                                .subscribe(
                                  () => {
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
                                  },
                                  error => {
                                    this.cancelLoginProcess(
                                      this.cancelLoginProcessData
                                    );
                                    this.AppProvider.setNormalNotification(
                                      "fail to prepare local storage"
                                    );
                                    console.error(
                                      "error : " + JSON.stringify(error)
                                    );
                                  }
                                );
                            },
                            error => {
                              this.cancelLoginProcess(
                                this.cancelLoginProcessData
                              );
                              this.AppProvider.setNormalNotification(
                                "fail to load user authorities"
                              );
                              console.error("error : " + JSON.stringify(error));
                            }
                          );
                        }
                      },
                      error => {
                        this.cancelLoginProcess(this.cancelLoginProcessData);
                        this.AppProvider.setNormalNotification(
                          "fail to load user authorities"
                        );
                        console.error("error : " + JSON.stringify(error));
                      }
                    );
                  },
                  error => {
                    this.cancelLoginProcess(this.cancelLoginProcessData);
                    this.AppProvider.setNormalNotification(
                      "fail to load system information"
                    );
                    console.error("error : " + JSON.stringify(error));
                  }
                );
              }
            },
            error => {
              this.cancelLoginProcess(this.cancelLoginProcessData);
              this.AppProvider.setNormalNotification(
                "fail to save current user information"
              );
              console.error("error : " + JSON.stringify(error));
            }
          );
        },
        (error: any) => {
          if (error.status == 0) {
            this.AppProvider.setNormalNotification(
              "please check your network connectivity"
            );
          } else if (error.status == 401) {
            this.AppProvider.setNormalNotification(
              "you have enter wrong username or password or server address"
            );
          } else if (error.status == 404) {
            console.log(JSON.stringify(error));
            this.AppProvider.setNormalNotification(
              "please check server address"
            );
          } else if (error.error) {
            this.AppProvider.setNormalNotification(error.error);
          } else {
            this.AppProvider.setNormalNotification(JSON.stringify(error));
          }
          this.cancelLoginProcess(this.cancelLoginProcessData);
        }
      );
    } else {
      this.cancelLoginProcess(this.cancelLoginProcessData);
      this.AppProvider.setNormalNotification(
        "please enter server address, username and password"
      );
    }
  }

  downloadingOrganisationUnits(userData) {
    if (this.isLoginProcessActive) {
      let resource = "organisationUnits";
      let currentResourceType = "communication";
      let orgUnitIds = [];
      this.progressTracker[currentResourceType].message =
        "loading assigned organisation units";
      userData.organisationUnits.forEach(organisationUnit => {
        if (organisationUnit.id) {
          orgUnitIds.push(organisationUnit.id);
        }
      });
      this.currentUser["userOrgUnitIds"] = orgUnitIds;
      if (this.completedTrackedProcess.indexOf(resource) > -1) {
        this.updateProgressTracker(resource);
        this.progressTracker[currentResourceType].message =
          "assigned organisation units have been loaded";
      } else {
        this.organisationUnitsProvider
          .downloadingOrganisationUnitsFromServer(orgUnitIds, this.currentUser)
          .subscribe(
            (orgUnits: any) => {
              if (this.isLoginProcessActive) {
                this.progressTracker[currentResourceType].message =
                  "saving assigned organisation units";
                this.organisationUnitsProvider
                  .savingOrganisationUnitsFromServer(orgUnits, this.currentUser)
                  .subscribe(
                    () => {
                      this.progressTracker[currentResourceType].message =
                        "assigned organisation units have been saved";
                      this.updateProgressTracker(resource);
                    },
                    error => {
                      this.cancelLoginProcess(this.cancelLoginProcessData);
                      console.log(JSON.stringify(error));
                      this.AppProvider.setNormalNotification(
                        "fail to save organisation data"
                      );
                    }
                  );
              }
            },
            error => {
              this.cancelLoginProcess(this.cancelLoginProcessData);
              console.log(JSON.stringify(error));
              this.AppProvider.setNormalNotification(
                "fail to load organisation data"
              );
            }
          );
      }
    }
  }

  downloadingDataSets() {
    if (this.isLoginProcessActive) {
      let resource = "dataSets";
      let currentResourceType = "entryForm";
      this.progressTracker[currentResourceType].message = "loading entry forms";
      if (this.completedTrackedProcess.indexOf(resource) > -1) {
        this.progressTracker[currentResourceType].message =
          "entry forms have been loaded";
        this.updateProgressTracker(resource);
      } else {
        this.dataSetsProvider
          .downloadDataSetsFromServer(this.currentUser)
          .subscribe(
            (dataSets: any) => {
              if (this.isLoginProcessActive) {
                this.progressTracker[currentResourceType].message =
                  "saving entry forms";
                this.dataSetsProvider
                  .saveDataSetsFromServer(dataSets, this.currentUser)
                  .subscribe(
                    () => {
                      this.progressTracker[currentResourceType].message =
                        "entry form have been saved";
                      this.updateProgressTracker(resource);
                    },
                    error => {
                      this.cancelLoginProcess(this.cancelLoginProcessData);
                      console.log(JSON.stringify(error));
                      this.AppProvider.setNormalNotification(
                        "fail to save entry form"
                      );
                    }
                  );
              }
            },
            error => {
              this.cancelLoginProcess(this.cancelLoginProcessData);
              console.log(JSON.stringify(error));
              this.AppProvider.setNormalNotification("fail to load entry form");
            }
          );
      }
    }
  }

  downloadingSections() {
    if (this.isLoginProcessActive) {
      let resource = "sections";
      let currentResourceType = "entryForm";
      this.progressTracker[currentResourceType].message =
        "loading entry form sections";
      if (this.completedTrackedProcess.indexOf(resource) > -1) {
        this.progressTracker[currentResourceType].message =
          "entry form sections have been loaded";
        this.updateProgressTracker(resource);
      } else {
        this.sectionsProvider
          .downloadSectionsFromServer(this.currentUser)
          .subscribe(
            (response: any) => {
              if (this.isLoginProcessActive) {
                this.progressTracker[currentResourceType].message =
                  "saving entry form sections";
                this.sectionsProvider
                  .saveSectionsFromServer(response[resource], this.currentUser)
                  .subscribe(
                    () => {
                      this.progressTracker[currentResourceType].message =
                        "entry form sections have been saved";
                      this.updateProgressTracker(resource);
                    },
                    error => {
                      this.cancelLoginProcess(this.cancelLoginProcessData);
                      console.log(JSON.stringify(error));
                      this.AppProvider.setNormalNotification(
                        "fail to save entry form's sections"
                      );
                    }
                  );
              }
            },
            error => {
              this.cancelLoginProcess(this.cancelLoginProcessData);
              console.log(JSON.stringify(error));
              this.AppProvider.setNormalNotification(
                "fail to load entry form's sections"
              );
            }
          );
      }
    }
  }

  downloadingDataElements() {
    if (this.isLoginProcessActive) {
      let resource = "dataElements";
      let currentResourceType = "entryForm";
      this.progressTracker[currentResourceType].message =
        "loading entry form fields";
      if (this.completedTrackedProcess.indexOf(resource) > -1) {
        this.progressTracker[currentResourceType].message =
          "entry form fields have been loaded";
        this.updateProgressTracker(resource);
      } else {
        this.dataElementsProvider
          .downloadDataElementsFromServer(this.currentUser)
          .subscribe(
            (response: any) => {
              if (this.isLoginProcessActive) {
                this.progressTracker[currentResourceType].message =
                  "saving entry form fields";
                this.dataElementsProvider
                  .saveDataElementsFromServer(
                    response[resource],
                    this.currentUser
                  )
                  .subscribe(
                    () => {
                      this.progressTracker[currentResourceType].message =
                        "entry form fields have been saved";
                      this.updateProgressTracker(resource);
                    },
                    error => {
                      this.cancelLoginProcess(this.cancelLoginProcessData);
                      console.log(JSON.stringify(error));
                      this.AppProvider.setNormalNotification(
                        "fail to save entry form's fields"
                      );
                    }
                  );
              }
            },
            error => {
              this.cancelLoginProcess(this.cancelLoginProcessData);
              console.log(JSON.stringify(error));
              this.AppProvider.setNormalNotification(
                "fail to load entry form's fields"
              );
            }
          );
      }
    }
  }

  downloadingSmsCommands() {
    if (this.isLoginProcessActive) {
      let resource = "smsCommand";
      let currentResourceType = "entryForm";
      this.progressTracker[currentResourceType].message =
        "loading sms commands";
      if (this.completedTrackedProcess.indexOf(resource) > -1) {
        this.progressTracker[currentResourceType].message =
          "sms commands have been loaded";
        this.updateProgressTracker(resource);
      } else {
        this.smsCommandProvider
          .getSmsCommandFromServer(this.currentUser)
          .subscribe(
            (smsCommands: any) => {
              if (this.isLoginProcessActive) {
                this.progressTracker[currentResourceType].message =
                  "saving sms commands";
                this.smsCommandProvider
                  .savingSmsCommand(
                    smsCommands,
                    this.currentUser.currentDatabase
                  )
                  .subscribe(
                    () => {
                      this.progressTracker[currentResourceType].message =
                        "sms commands have been saved";
                      this.updateProgressTracker(resource);
                    },
                    error => {
                      this.cancelLoginProcess(this.cancelLoginProcessData);
                      console.log(JSON.stringify(error));
                      this.AppProvider.setNormalNotification(
                        "fail to save SMS commands"
                      );
                    }
                  );
              }
            },
            error => {
              this.cancelLoginProcess(this.cancelLoginProcessData);
              console.log(JSON.stringify(error));
              this.AppProvider.setNormalNotification(
                "fail to load SMS commands"
              );
            }
          );
      }
    }
  }

  downloadingPrograms() {
    if (this.isLoginProcessActive) {
      let resource = "programs";
      let currentResourceType = "event";
      this.progressTracker[currentResourceType].message = " loading programs";
      if (this.completedTrackedProcess.indexOf(resource) > -1) {
        this.progressTracker[currentResourceType].message =
          "programs have been loaded";
        this.updateProgressTracker(resource);
      } else {
        this.programsProvider
          .downloadProgramsFromServer(this.currentUser)
          .subscribe(
            response => {
              if (this.isLoginProcessActive) {
                this.progressTracker[currentResourceType].message =
                  "saving programs";
                this.programsProvider
                  .saveProgramsFromServer(response[resource], this.currentUser)
                  .subscribe(
                    () => {
                      this.progressTracker[currentResourceType].message =
                        "programs have been saved";
                      this.updateProgressTracker(resource);
                    },
                    error => {
                      this.cancelLoginProcess(this.cancelLoginProcessData);
                      console.log(JSON.stringify(error));
                      this.AppProvider.setNormalNotification(
                        "fail to save programs"
                      );
                    }
                  );
              }
            },
            error => {
              this.cancelLoginProcess(this.cancelLoginProcessData);
              console.log(JSON.stringify(error));
              this.AppProvider.setNormalNotification("fail to load programs");
            }
          );
      }
    }
  }

  downloadingProgramStageSections() {
    if (this.isLoginProcessActive) {
      let resource = "programStageSections";
      let currentResourceType = "event";
      this.progressTracker[currentResourceType].message =
        "loading program stage section";
      if (this.completedTrackedProcess.indexOf(resource) > -1) {
        this.progressTracker[currentResourceType].message =
          "program stage section have been loaded";
        this.updateProgressTracker(resource);
      } else {
        this.programStageSectionProvider
          .downloadProgramsStageSectionsFromServer(this.currentUser)
          .subscribe(
            response => {
              if (this.isLoginProcessActive) {
                this.progressTracker[currentResourceType].message =
                  "saving program stage section";
                this.programStageSectionProvider
                  .saveProgramsStageSectionsFromServer(
                    response[resource],
                    this.currentUser
                  )
                  .subscribe(
                    () => {
                      this.progressTracker[currentResourceType].message =
                        "program stage section have been saved";
                      this.updateProgressTracker(resource);
                    },
                    error => {
                      this.cancelLoginProcess(this.cancelLoginProcessData);
                      console.log(JSON.stringify(error));
                      this.AppProvider.setNormalNotification(
                        "fail to save program stage sections"
                      );
                    }
                  );
              }
            },
            error => {
              this.cancelLoginProcess(this.cancelLoginProcessData);
              console.log(JSON.stringify(error));
              this.AppProvider.setNormalNotification(
                "fail to load program-stage-sections"
              );
            }
          );
      }
    }
  }

  downloadingIndicators() {
    if (this.isLoginProcessActive) {
      let resource = "indicators";
      let currentResourceType = "report";
      this.progressTracker[currentResourceType].message = "loading indicators";
      if (this.completedTrackedProcess.indexOf(resource) > -1) {
        this.progressTracker[currentResourceType].message =
          "indicators have been loaded";
        this.updateProgressTracker(resource);
      } else {
        this.indicatorsProvider
          .downloadingIndicatorsFromServer(this.currentUser)
          .subscribe(
            (response: any) => {
              if (this.isLoginProcessActive) {
                this.progressTracker[currentResourceType].message =
                  "saving sms indicators";
                this.indicatorsProvider
                  .savingIndicatorsFromServer(
                    response[resource],
                    this.currentUser
                  )
                  .subscribe(
                    () => {
                      this.progressTracker[currentResourceType].message =
                        "indicators have been saved";
                      this.updateProgressTracker(resource);
                    },
                    error => {
                      this.cancelLoginProcess(this.cancelLoginProcessData);
                      console.log(JSON.stringify(error));
                      this.AppProvider.setNormalNotification(
                        "fail to save indicators"
                      );
                    }
                  );
              }
            },
            error => {
              this.cancelLoginProcess(this.cancelLoginProcessData);
              console.log(JSON.stringify(error));
              this.AppProvider.setNormalNotification("fail to load indicators");
            }
          );
      }
    }
  }

  downloadingStandardReports() {
    if (this.isLoginProcessActive) {
      let resource = "reports";
      let currentResourceType = "report";
      this.progressTracker[currentResourceType].message = "loading reports";
      if (this.completedTrackedProcess.indexOf(resource) > -1) {
        this.progressTracker[currentResourceType].message =
          "reports have been loaded";
        this.updateProgressTracker(resource);
      } else {
        this.standardReports
          .downloadReportsFromServer(this.currentUser)
          .subscribe(
            (reports: any) => {
              if (this.isLoginProcessActive) {
                this.progressTracker[currentResourceType].message =
                  "saving reports";
                this.standardReports
                  .saveReportsFromServer(reports[resource], this.currentUser)
                  .subscribe(
                    () => {
                      this.progressTracker[currentResourceType].message =
                        "reports have been saved";
                      this.updateProgressTracker(resource);
                    },
                    error => {
                      this.cancelLoginProcess(this.cancelLoginProcessData);
                      console.log(JSON.stringify(error));
                      this.AppProvider.setNormalNotification(
                        "fail to save reports"
                      );
                    }
                  );
              }
            },
            error => {
              this.cancelLoginProcess(this.cancelLoginProcessData);
              console.log(JSON.stringify(error));
              this.AppProvider.setNormalNotification("fail to load reports");
            }
          );
      }
    }
  }

  downloadingConstants() {
    if (this.isLoginProcessActive) {
      let resource = "constants";
      let currentResourceType = "report";
      this.progressTracker[currentResourceType].message = "loading constants";
      if (this.completedTrackedProcess.indexOf(resource) > -1) {
        this.progressTracker[currentResourceType].message =
          "constants have been loaded";
        this.updateProgressTracker(resource);
      } else {
        this.standardReports
          .downloadConstantsFromServer(this.currentUser)
          .subscribe(
            (constants: any) => {
              if (this.isLoginProcessActive) {
                this.progressTracker[currentResourceType].message =
                  "saving constants";
                this.standardReports
                  .saveConstantsFromServer(constants, this.currentUser)
                  .subscribe(
                    () => {
                      this.progressTracker[currentResourceType].message =
                        "constants have been saved";
                      this.updateProgressTracker(resource);
                    },
                    error => {
                      this.cancelLoginProcess(this.cancelLoginProcessData);
                      console.log(JSON.stringify(error));
                      this.AppProvider.setNormalNotification(
                        "fail to save constants"
                      );
                    }
                  );
              }
            },
            error => {
              this.cancelLoginProcess(this.cancelLoginProcessData);
              console.log(JSON.stringify(error));
              this.AppProvider.setNormalNotification("fail to load constants");
            }
          );
      }
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
    this.animationEffect.progressBar = "animated fadeOut";
    this.animationEffect.loginForm = "animated fadeIn";
    if (this.currentUser && this.currentUser.serverUrl) {
      let url = this.currentUser.serverUrl.split("/dhis-web-commons")[0];
      url = url.split("/dhis-web-dashboard-integration")[0];
      this.currentUser.serverUrl = url;
    }
    setTimeout(() => {
      this.isLoginProcessActive = data.isProcessActive;
    }, 300);
  }

  setLandingPage(currentUser: CurrentUser) {
    currentUser.isLogin = true;
    this.reCheckingAppSetting(currentUser);
    this.smsCommandProvider
      .checkAndGenerateSmsCommands(currentUser)
      .subscribe(() => {}, error => {});
    currentUser.password = this.encryption.encode(currentUser.password);
    this.store.dispatch(new LoadedCurrentUser(currentUser));
    if (
      this.currentUser &&
      this.currentUser.serverUrl &&
      this.currentUser.username
    ) {
      this.currentUser["currentDatabase"] =
        this.AppProvider.getDataBaseName(this.currentUser.serverUrl) +
        " " +
        this.currentUser.username;
      this.localInstanceProvider
        .setLocalInstanceInstances(
          this.localInstances,
          currentUser,
          this.loggedInInInstance
        )
        .subscribe(() => {});
    }
    this.UserProvider.setCurrentUser(currentUser).subscribe(() => {
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

  resetPassSteps() {
    let noEmptyStep;
    this.progressTracker.communication.passStep.forEach((step: any) => {
      if (step.name == "organisationUnits") {
        step.hasBeenPassed = false;
        noEmptyStep = step;
      }
    });
    this.progressTracker.communication.passStep = [];
    if (noEmptyStep) {
      this.progressTracker.communication.passStep.push(noEmptyStep);
    }
    this.progressTracker.communication.passStepCount = 0;
    let dataBaseStructure = this.sqlLite.getDataBaseStructure();
    Object.keys(dataBaseStructure).forEach(key => {
      let table = dataBaseStructure[key];
      if (table.isMetadata && table.resourceType && table.resourceType != "") {
        if (this.progressTracker[table.resourceType]) {
          this.progressTracker[table.resourceType].passStepCount = 0;
          this.progressTracker[table.resourceType].message = "";
          this.progressTracker[table.resourceType].passStep.forEach(
            (passStep: any) => {
              passStep.hasBeenPassed = false;
            }
          );
        }
      }
    });
  }

  reInitiateProgressTrackerObject(user) {
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
      ] = this.getEmptyProgressTracker();
      this.progressTracker = this.currentUser.progressTracker[
        user.currentDatabase
      ];
    } else {
      this.currentUser["progressTracker"] = {};
      this.progressTracker = {};
      this.progressTracker = this.getEmptyProgressTracker();
    }
  }

  getEmptyProgressTracker() {
    let dataBaseStructure = this.sqlLite.getDataBaseStructure();
    let progressTracker = {};
    progressTracker["communication"] = {
      count: 3,
      passStep: [],
      passStepCount: 0,
      message: ""
    };
    Object.keys(dataBaseStructure).forEach(key => {
      let table = dataBaseStructure[key];
      if (table.isMetadata && table.resourceType && table.resourceType != "") {
        if (!progressTracker[table.resourceType]) {
          progressTracker[table.resourceType] = {
            count: 1,
            passStep: [],
            passStepCount: 0,
            message: ""
          };
        } else {
          progressTracker[table.resourceType].count += 1;
        }
      }
    });
    return progressTracker;
  }

  updateProgressTracker(resourceName) {
    let dataBaseStructure = this.sqlLite.getDataBaseStructure();
    let resourceType = "communication";
    if (dataBaseStructure[resourceName]) {
      let table = dataBaseStructure[resourceName];
      if (table.isMetadata && table.resourceType) {
        resourceType = table.resourceType;
      }
    }
    if (
      this.progressTracker[resourceType].passStep.length ==
      this.progressTracker[resourceType].count
    ) {
      this.progressTracker[resourceType].passStep.forEach((passStep: any) => {
        if (passStep.name == resourceName && passStep.hasBeenDownloaded) {
          passStep.hasBeenPassed = true;
        }
      });
    } else {
      this.progressTracker[resourceType].passStep.push({
        name: resourceName,
        hasBeenSaved: true,
        hasBeenDownloaded: true,
        hasBeenPassed: true
      });
    }
    this.progressTracker[resourceType].passStepCount =
      this.progressTracker[resourceType].passStepCount + 1;
    this.currentUser["progressTracker"][
      this.currentUser.currentDatabase
    ] = this.progressTracker;
    this.UserProvider.setCurrentUser(this.currentUser).subscribe(() => {});
    this.completedTrackedProcess = this.getCompletedTrackedProcess();
    this.updateProgressBarPercentage();
  }

  updateProgressBarPercentage() {
    let total = 0;
    let completed = 0;
    Object.keys(this.progressTracker).forEach(key => {
      let process = this.progressTracker[key];
      completed += process.passStepCount;
      total += process.count;
    });
    let value = completed / total * 100;
    this.progressBar = String(value);
    if (completed == total) {
      this.setLandingPage(this.currentUser);
    }
  }

  getCompletedTrackedProcess() {
    let completedTrackedProcess = [];
    Object.keys(this.progressTracker).forEach(key => {
      let process = this.progressTracker[key];
      process.passStep.forEach((passStep: any) => {
        if (passStep.name && passStep.hasBeenDownloaded) {
          if (completedTrackedProcess.indexOf(passStep.name) == -1) {
            completedTrackedProcess.push(passStep.name);
          }
        }
      });
    });
    return completedTrackedProcess;
  }
}
