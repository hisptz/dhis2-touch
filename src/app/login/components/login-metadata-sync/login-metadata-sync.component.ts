import {
  Component,
  OnDestroy,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import {
  QueueManager,
  CurrentUser,
  SystemSettings,
  OrganisationUnit
} from 'src/models';
import {
  getEmptyProcessTracker,
  getCompletedTrackedProcess,
  getPercetage,
  getProgressMessage,
  getFormattedBaseUrl,
  getDataBaseName
} from '../../helpers';
import { UserAuthorizationService } from 'src/app/services/user-authorization.service';
import { NetworkService } from 'src/app/services/network.service';
import { SystemInformationService } from 'src/app/services/system-information.service';
import { SystemSettingService } from 'src/app/services/system-setting.service';
import { AppColorService } from 'src/app/services/app-color.service';
import { UserService } from 'src/app/services/user.service';
import { AppConfigService } from 'src/app/services/app-config.service';
import { DEFAULT_APP_METADATA } from 'src/constants';
import { OrganisationUnitService } from 'src/app/services/organisation-unit.service';
import { DataSetService } from 'src/app/services/data-set.service';
import { SectionService } from 'src/app/services/section.service';
import { DataElementService } from 'src/app/services/data-element.service';
import { CategoryComboService } from 'src/app/services/category-combo.service';
import { SmsCommandService } from 'src/app/services/sms-command.service';
import { ProgramService } from 'src/app/services/program.service';
import { ProgramStageSectionService } from 'src/app/services/program-stage-section.service';
import { ProgramRuleEngineService } from 'src/app/services/program-rule-engine.service';
import { IndicatorService } from 'src/app/services/indicator.service';
import { StandardResportService } from 'src/app/services/standard-resport.service';
import { ValidationRuleService } from 'src/app/services/validation-rule.service';
import { DataStoreManagerService } from 'src/app/services/data-store-manager.service';
@Component({
  selector: 'app-login-metadata-sync',
  templateUrl: './login-metadata-sync.component.html',
  styleUrls: ['./login-metadata-sync.component.scss']
})
export class LoginMetadataSyncComponent implements OnInit, OnDestroy {
  @Input()
  currentUser: CurrentUser;
  @Input()
  processes: string[];
  @Input()
  isOnLogin: boolean;
  @Input()
  overAllMessage: string;
  @Input()
  showOverallProgressBar: boolean;
  @Input() color: string;
  @Output()
  cancelProgress = new EventEmitter();
  @Output()
  successOnLoginAndSyncMetadata = new EventEmitter();
  @Output()
  systemSettingLoaded = new EventEmitter();
  @Output()
  updateCurrentUser = new EventEmitter();
  @Output()
  failOnLogin = new EventEmitter();
  savingingQueueManager: QueueManager;
  downloadingQueueManager: QueueManager;
  subscriptions: Subscription;
  showCancelButton: boolean;
  showPercentage: boolean;
  showLoader: boolean;
  trackedResourceTypes: string[];
  progressTrackerPacentage: any;
  progressTrackerMessage: any;
  trackedProcessWithLoader: any;
  completedTrackedProcess: string[];
  progressTrackerBackup: any;
  failedProcesses: any;
  failedProcessesErrors: any;
  constructor(
    private userAuthorizationService: UserAuthorizationService,
    private networkService: NetworkService,
    private systemInformationService: SystemInformationService,
    private systemSettingService: SystemSettingService,
    private appColorService: AppColorService,
    private userService: UserService,
    private appConfigService: AppConfigService,
    private organisationUnitService: OrganisationUnitService,
    private dataSetService: DataSetService,
    private sectionService: SectionService,
    private dataElementService: DataElementService,
    private categoryComboService: CategoryComboService,
    private smsCommandService: SmsCommandService,
    private programService: ProgramService,
    private programStageSectionService: ProgramStageSectionService,
    private programRuleEngineService: ProgramRuleEngineService,
    private indicatorService: IndicatorService,
    private standardResportService: StandardResportService,
    private validationRuleService: ValidationRuleService,
    private dataStoreManagerService: DataStoreManagerService
  ) {
    this.showCancelButton = true;
    this.showPercentage = true;
    this.showLoader = true;
    this.subscriptions = new Subscription();
    this.progressTrackerPacentage = {
      overall: 0
    };
    this.progressTrackerMessage = {};
    this.trackedProcessWithLoader = {};
    this.completedTrackedProcess = [];
    this.failedProcesses = [];
    this.failedProcessesErrors = [];
  }

  ngOnInit() {
    this.processes = this.processes ? this.processes : [];
    if (this.processes) {
      this.resetQueueManager();
    }
    if (this.currentUser) {
      this.resetCUrrentUserOptionalvalues();
    } else {
      const error = 'Missing current user data';
      this.onFailToLogin({ error });
    }
  }

  resetCUrrentUserOptionalvalues() {
    this.currentUser = _.omit(this.currentUser, [
      'authorities',
      'dhisVersion',
      'id',
      'isPasswordEncode',
      'userOrgUnitIds',
      'dataSets',
      'programs',
      'dataViewOrganisationUnits',
      'name',
      'authorizationKey',
      'currentDatabase'
    ]);
    this.authenticateUser(this.currentUser, this.processes);
  }

  async authenticateUser(currentUser: CurrentUser, processes: string[]) {
    const { isAvailable } = this.networkService.getNetWorkStatus();
    const { serverUrl, progressTracker } = currentUser;
    if (progressTracker && !this.isOnLogin) {
      this.progressTrackerBackup = progressTracker;
    }
    currentUser = {
      ...currentUser,
      serverUrl: getFormattedBaseUrl(serverUrl)
    };
    if (!isAvailable) {
      this.offlineAuthenication(currentUser);
    } else {
      this.onlineAuthentication(currentUser, processes);
    }
  }

  async offlineAuthenication(currentUser: CurrentUser) {
    try {
      const user = await this.userAuthorizationService.offlineUserAuthentication(
        currentUser
      );
      this.successOnLoginAndSyncMetadata.emit({ currentUser: user });
    } catch (error) {
      this.onFailToLogin(error);
    }
  }

  onlineAuthentication(currentUser: CurrentUser, processes: string[]) {
    const currentResouceType = 'communication';
    this.resetProgressTracker(currentUser, processes);
    // Authenicate current user
    this.subscriptions.add(
      this.userAuthorizationService
        .onlineUserAuthentication(currentUser)
        .subscribe(
          (user: CurrentUser) => {
            const { serverUrl, username, password } = user;
            const currentDatabase = getDataBaseName(user);
            const authorizationKey = btoa(`${username}:${password}`);
            user = { ...user, currentDatabase, authorizationKey };
            const { progressTracker } = this.currentUser;
            this.currentUser = _.assign({}, user);
            this.currentUser['progressTracker'] = progressTracker
              ? progressTracker
              : {};
            this.overAllMessage = serverUrl;
            this.resetProgressTracker(this.currentUser, processes);
            const processTracker = this.getProgressTracker(
              this.currentUser,
              processes
            );
            this.currentUser.progressTracker[currentDatabase] = processTracker;
            this.updateCurrentUser.emit(this.currentUser);
            this.updateProgressTrackerObject(
              'Discovering system info',
              null,
              currentResouceType
            );
            // Discovering system information
            this.subscriptions.add(
              this.systemInformationService
                .getCurrentUserSystemInformationFromServer(this.currentUser)
                .subscribe(
                  systemInformation => {
                    this.subscriptions.add(
                      this.systemInformationService
                        .setUserSystemInformation(systemInformation)
                        .subscribe(
                          (dhisVersion: string) => {
                            this.currentUser = {
                              ...this.currentUser,
                              dhisVersion
                            };
                            // Discovering system settings
                            this.updateProgressTrackerObject(
                              'Discovering system settings',
                              null,
                              currentResouceType
                            );
                            this.subscriptions.add(
                              this.systemSettingService
                                .getSystemSettingsFromServer(this.currentUser)
                                .subscribe(
                                  (systemSettings: SystemSettings) => {
                                    const { currentStyle } = systemSettings;
                                    // Discovering user authorities
                                    this.updateProgressTrackerObject(
                                      'Discovering user authorities',
                                      null,
                                      currentResouceType
                                    );
                                    this.subscriptions.add(
                                      this.userAuthorizationService
                                        .getUserAuthorities(this.currentUser)
                                        .subscribe(
                                          (response: any) => {
                                            const {
                                              id,
                                              name,
                                              authorities,
                                              dataViewOrganisationUnits,
                                              settings
                                            } = response;
                                            const { keyStyle } = settings;
                                            const colorSettings = this.appColorService.getCurrentUserColorObject(
                                              currentStyle,
                                              keyStyle
                                            );
                                            this.currentUser = {
                                              ...this.currentUser,
                                              id,
                                              name,
                                              authorities,
                                              dataViewOrganisationUnits,
                                              colorSettings
                                            };
                                            // Discovering user data
                                            this.updateProgressTrackerObject(
                                              'Discovering user data',
                                              null,
                                              currentResouceType
                                            );
                                            this.subscriptions.add(
                                              this.userAuthorizationService
                                                .getUserDataOnAuthenticatedServer(
                                                  this.currentUser
                                                )
                                                .subscribe(
                                                  (userDataResponse: any) => {
                                                    const {
                                                      organisationUnits
                                                    } = userDataResponse;
                                                    const userOrgUnitIds = _.map(
                                                      organisationUnits,
                                                      (
                                                        organisationUnit: any
                                                      ) => {
                                                        return organisationUnit.id;
                                                      }
                                                    );
                                                    this.currentUser = {
                                                      ...this.currentUser,
                                                      userOrgUnitIds
                                                    };
                                                    this.subscriptions.add(
                                                      this.userService
                                                        .setCurrentUserUserData(
                                                          userDataResponse
                                                        )
                                                        .subscribe(
                                                          (userData: any) => {
                                                            const {
                                                              dataSets,
                                                              programs
                                                            } = userData;
                                                            this.currentUser = {
                                                              ...this
                                                                .currentUser,
                                                              programs,
                                                              dataSets
                                                            };
                                                            this.completedTrackedProcess = getCompletedTrackedProcess(
                                                              this.currentUser
                                                                .progressTracker[
                                                                currentDatabase
                                                              ]
                                                            );
                                                            // Initate storega and discovering of other metadata
                                                            this.intiateStorageAndProcess(
                                                              this.isOnLogin,
                                                              processes
                                                            );
                                                          },
                                                          error => {
                                                            this.onFailToLogin(
                                                              error
                                                            );
                                                          }
                                                        )
                                                    );
                                                  },
                                                  error => {
                                                    this.onFailToLogin(error);
                                                  }
                                                )
                                            );
                                          },
                                          error => {
                                            this.onFailToLogin(error);
                                          }
                                        )
                                    );
                                  },
                                  error => {
                                    this.onFailToLogin(error);
                                  }
                                )
                            );
                          },
                          error => {
                            this.onFailToLogin(error);
                          }
                        )
                    );
                  },
                  error => {
                    this.onFailToLogin(error);
                  }
                )
            );
          },
          error => {
            this.onFailToLogin(error);
          }
        )
    );
  }

  async intiateStorageAndProcess(isOnLogin: boolean, processes: string[]) {
    if (isOnLogin) {
      const { currentDatabase } = this.currentUser;
      const currentResouceType = 'communication';
      // Preparing local storage
      this.updateProgressTrackerObject(
        'Preparing local storage',
        null,
        currentResouceType
      );
      await this.appConfigService.initateDataBaseConnection(currentDatabase);
    }
    setTimeout(() => {
      this.startSyncMetadataProcesses(processes);
    }, 1000);
  }

  startSyncMetadataProcesses(processes: string[]) {
    processes.map((process: string) => {
      this.addIntoQueue(process, 'dowmloading');
    });
  }

  resetProgressTracker(currentUser: CurrentUser, processes: string[]) {
    const processTracker = this.getProgressTracker(currentUser, processes);
    this.trackedResourceTypes = Object.keys(processTracker);
    this.calculateAndSetProgressPercentage(
      this.trackedResourceTypes,
      processTracker
    );
  }

  getProgressTracker(currentUser: CurrentUser, processes: string[]) {
    const emptyProgressTracker = getEmptyProcessTracker(
      processes,
      this.isOnLogin
    );
    const progressTrackerObject =
      currentUser &&
      currentUser.currentDatabase &&
      currentUser.progressTracker &&
      currentUser.progressTracker[currentUser.currentDatabase]
        ? !this.isOnLogin
          ? emptyProgressTracker
          : currentUser.progressTracker[currentUser.currentDatabase]
        : emptyProgressTracker;
    try {
      Object.keys(progressTrackerObject).map((key: string) => {
        progressTrackerObject[key].expectedProcesses =
          emptyProgressTracker[key].expectedProcesses;
        progressTrackerObject[key].totalPassedProcesses = 0;
        this.trackedProcessWithLoader[key] = false;
        if (key === 'communication') {
          this.progressTrackerMessage[key] =
            'Establishing connection to server';
          this.trackedProcessWithLoader[key] = true;
        } else if (key === 'entryForm') {
          this.progressTrackerMessage[key] = 'Aggregate metadata';
        } else if (key === 'event') {
          this.progressTrackerMessage[key] = 'Event and tracker metadata';
        } else if (key === 'report') {
          this.progressTrackerMessage[key] = 'Reports metadata';
        }
      });
    } catch (e) {}
    return progressTrackerObject;
  }

  updateProgressTrackerObject(
    process: string,
    processMessage?: string,
    currentResouceType?: string
  ) {
    const dataBaseStructure = DEFAULT_APP_METADATA;
    const typeOfProcess =
      process.split('-').length > 1 ? process.split('-')[1] : 'saving';
    process = process.split('-')[0];
    processMessage = processMessage ? processMessage : process;
    currentResouceType =
      process &&
      dataBaseStructure &&
      dataBaseStructure[process] &&
      dataBaseStructure[process].resourceType
        ? dataBaseStructure[process].resourceType
        : currentResouceType;
    const { currentDatabase } = this.currentUser;
    const progressTracker = this.currentUser.progressTracker[currentDatabase];
    if (progressTracker) {
      if (progressTracker[currentResouceType]) {
        this.progressTrackerMessage[currentResouceType] = processMessage;
        this.trackedProcessWithLoader[currentResouceType] = true;
        progressTracker[currentResouceType].totalPassedProcesses++;
        if (
          progressTracker[currentResouceType].passedProcesses.indexOf(
            process + '-' + typeOfProcess
          ) === -1
        ) {
          progressTracker[currentResouceType].passedProcesses.push(
            process + '-' + typeOfProcess
          );
        }
      }
      this.calculateAndSetProgressPercentage(
        this.trackedResourceTypes,
        progressTracker
      );
    }
  }
  getTotalExpectedAndCompletedProcess(
    trackedResourceTypes: string[],
    progressTracker: any
  ) {
    let totalProcesses = 0;
    let totalExpectedProcesses = 0;
    trackedResourceTypes.map((trackedResourceType: string) => {
      const trackedResource = progressTracker[trackedResourceType];
      const { expectedProcesses } = trackedResource;
      const { totalPassedProcesses } = trackedResource;
      totalProcesses += totalPassedProcesses;
      totalExpectedProcesses += expectedProcesses;
      this.progressTrackerPacentage[trackedResourceType] = getPercetage(
        totalPassedProcesses,
        expectedProcesses
      );
    });
    return { totalExpectedProcesses, totalProcesses };
  }
  calculateAndSetProgressPercentage(
    trackedResourceTypes: string[],
    progressTracker: any
  ) {
    const {
      totalExpectedProcesses,
      totalProcesses
    } = this.getTotalExpectedAndCompletedProcess(
      trackedResourceTypes,
      progressTracker
    );
    this.progressTrackerPacentage['overall'] = getPercetage(
      totalProcesses,
      totalExpectedProcesses
    );
    const { currentDatabase } = this.currentUser;
    if (currentDatabase) {
      this.currentUser.progressTracker[currentDatabase] = progressTracker;
      this.updateCurrentUser.emit(this.currentUser);
    }
    if (totalProcesses === totalExpectedProcesses) {
      if (this.progressTrackerBackup) {
        this.currentUser = {
          ...this.currentUser,
          progressTracker: this.progressTrackerBackup
        };
      }
      this.successOnLoginAndSyncMetadata.emit({
        currentUser: this.currentUser
      });
    } else {
      this.checkingIfAllProcessHavePassed();
    }
  }

  onFailToLogin(error: any, process?: string) {
    if (process) {
      if (_.indexOf(this.failedProcesses, process) === -1) {
        this.failedProcesses.push(process);
        this.failedProcessesErrors.push(error);
      }
      this.removeFromQueue(process, 'dowmloading', true);
    } else {
      if (this.progressTrackerBackup) {
        this.currentUser = {
          ...this.currentUser,
          progressTracker: this.progressTrackerBackup
        };
      }
      this.clearAllSubscriptions();
      this.failOnLogin.emit({ error });
    }
  }

  checkingIfAllProcessHavePassed() {
    const { currentDatabase } = this.currentUser;
    if (currentDatabase) {
      const progressTracker = this.currentUser.progressTracker[currentDatabase];
      const {
        totalExpectedProcesses,
        totalProcesses
      } = this.getTotalExpectedAndCompletedProcess(
        this.trackedResourceTypes,
        progressTracker
      );
      if (
        totalExpectedProcesses ===
        totalProcesses + this.failedProcesses.length
      ) {
        this.failOnLogin.emit({
          failedProcesses: this.failedProcesses,
          failedProcessesErrors: this.failedProcessesErrors
        });
        this.clearAllSubscriptions();
      }
    }
  }

  onCancelProgess() {
    if (this.progressTrackerBackup) {
      this.currentUser = {
        ...this.currentUser,
        progressTracker: this.progressTrackerBackup
      };
    }
    this.clearAllSubscriptions();
    this.cancelProgress.emit();
  }

  resetQueueManager() {
    this.savingingQueueManager = {
      enqueuedProcess: [],
      dequeuingLimit: 1,
      denqueuedProcess: [],
      data: {}
    };
    this.downloadingQueueManager = {
      totalProcess: this.processes.length,
      enqueuedProcess: [],
      dequeuingLimit: 4,
      denqueuedProcess: []
    };
  }

  addIntoQueue(process: string, type?: string, data?: any) {
    if (type && type === 'saving') {
      if (data) {
        this.savingingQueueManager.enqueuedProcess = _.concat(
          this.savingingQueueManager.enqueuedProcess,
          process
        );
        this.savingingQueueManager.data[process] = data;
      }
      this.checkingAndStartSavingProcess();
    } else if (type && type === 'dowmloading') {
      this.downloadingQueueManager.enqueuedProcess = _.concat(
        this.downloadingQueueManager.enqueuedProcess,
        process
      );
      this.checkingAndStartDownloadProcess();
    }
  }

  removeFromQueue(
    process: string,
    type: string,
    shouldPassProces: boolean,
    data?: any
  ) {
    if (type && type === 'saving') {
      _.remove(
        this.savingingQueueManager.denqueuedProcess,
        (denqueuedProcess: string) => {
          return process === denqueuedProcess;
        }
      );
      if (
        this.savingingQueueManager &&
        this.savingingQueueManager.data &&
        this.savingingQueueManager.data[process]
      ) {
        this.savingingQueueManager.data[process] = [];
      }
      const { currentDatabase } = this.currentUser;
      this.completedTrackedProcess = getCompletedTrackedProcess(
        this.currentUser.progressTracker[currentDatabase]
      );
      const processType = 'saving';
      const progressMessage = getProgressMessage(process, processType);
      this.updateProgressTrackerObject(
        process + '-' + processType,
        progressMessage
      );
      this.checkingAndStartSavingProcess();
    } else if (type && type === 'dowmloading') {
      _.remove(
        this.downloadingQueueManager.denqueuedProcess,
        (denqueuedProcess: string) => {
          return process === denqueuedProcess;
        }
      );
      if (data) {
        this.addIntoQueue(process, 'saving', data);
      } else {
        let processType = 'start-saving';
        let progressMessage = getProgressMessage(process, processType);
        this.updateProgressTrackerObject(
          process + '-' + processType,
          progressMessage
        );
        if (!shouldPassProces) {
          processType = 'saving';
          progressMessage = getProgressMessage(process, processType);
          this.updateProgressTrackerObject(
            process + '-' + processType,
            progressMessage
          );
        }
      }
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
          (enqueuedProcess: string) => {
            return process === enqueuedProcess;
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
          (enqueuedProcess: string) => {
            return process === enqueuedProcess;
          }
        );
        this.startDownloadProcess(process);
      }
    }
  }

  startDownloadProcess(process: string) {
    const type = 'dowmloading';
    const progressMessage = getProgressMessage(process, type);
    this.updateProgressTrackerObject(process + '-' + type, progressMessage);
    if (this.completedTrackedProcess.indexOf(process) === -1) {
      if (process === 'organisationUnits') {
        this.discoveringOrganisationUnitsFromServer(process);
      } else if (process === 'dataSets') {
        this.discoveringDataSetsFromServer(process);
      } else if (process === 'sections') {
        this.discoveringSectionsFromServer(process);
      } else if (process === 'dataElements') {
        this.discoveringDataElementsFromServer(process);
      } else if (process === 'categoryCombos') {
        this.discoveringCategoryCombosFromServer(process);
      } else if (process === 'smsCommand') {
        this.discoveringSmsCommandsFromServer(process);
      } else if (process === 'programs') {
        this.discoveringProgramsFromServer(process);
      } else if (process === 'programStageSections') {
        this.discoveringProgramStageSectionsFromServer(process);
      } else if (process === 'programRules') {
        this.discoveringProgramRulesFromServer(process);
      } else if (process === 'programRuleActions') {
        this.discoveringProgramRuleActionsFromServer(process);
      } else if (process === 'programRuleVariables') {
        this.discoveringProgramRuleVariablesFromServer(process);
      } else if (process === 'indicators') {
        this.discoveringIndicatorsFromServer(process);
      } else if (process === 'reports') {
        this.discoveringReportsFromServer(process);
      } else if (process === 'constants') {
        this.discoveringConstantsFromServer(process);
      } else if (process === 'validationRules') {
        this.discoveringValidationRulesFromServer(process);
      } else if (process === 'dataStore') {
        this.discoveringDataStoreFromServer(process);
      } else {
        setTimeout(() => {
          this.removeFromQueue(process, 'dowmloading', false);
        }, 1000);
      }
    } else {
      this.removeFromQueue(process, 'dowmloading', false);
    }
  }

  discoveringOrganisationUnitsFromServer(process: string) {
    this.subscriptions.add(
      this.organisationUnitService
        .discoveringOrganisationUnitsFromServer(this.currentUser)
        .subscribe(
          (response: OrganisationUnit[]) => {
            this.removeFromQueue(process, 'dowmloading', false, response);
          },
          error => {
            this.onFailToLogin(error);
          }
        )
    );
  }

  discoveringDataSetsFromServer(process: string) {
    this.subscriptions.add(
      this.dataSetService
        .discoveringDataSetsFromServer(this.currentUser)
        .subscribe(
          (response: any[]) => {
            this.removeFromQueue(process, 'dowmloading', false, response);
          },
          error => {
            this.onFailToLogin(error);
          }
        )
    );
  }

  discoveringSectionsFromServer(process: string) {
    this.subscriptions.add(
      this.sectionService
        .downloadSectionsFromServer(this.currentUser)
        .subscribe(
          (response: any[]) => {
            this.removeFromQueue(process, 'dowmloading', false, response);
          },
          error => {
            this.onFailToLogin(error);
          }
        )
    );
  }

  discoveringDataElementsFromServer(process: string) {
    this.subscriptions.add(
      this.dataElementService
        .downloaddataElementsFromServer(this.currentUser)
        .subscribe(
          (response: any[]) => {
            this.removeFromQueue(process, 'dowmloading', false, response);
          },
          error => {
            this.onFailToLogin(error);
          }
        )
    );
  }

  discoveringCategoryCombosFromServer(process: string) {
    this.subscriptions.add(
      this.categoryComboService
        .discoveringCategoryCombosFromServer(this.currentUser)
        .subscribe(
          (response: any[]) => {
            this.removeFromQueue(process, 'dowmloading', false, response);
          },
          error => {
            this.onFailToLogin(error);
          }
        )
    );
  }

  discoveringSmsCommandsFromServer(process: string) {
    this.subscriptions.add(
      this.smsCommandService
        .discoveringSmsCommandsFromServer(this.currentUser)
        .subscribe(
          (response: any[]) => {
            this.removeFromQueue(process, 'dowmloading', false, response);
          },
          error => {
            this.onFailToLogin(error);
          }
        )
    );
  }

  discoveringProgramsFromServer(process: string) {
    this.subscriptions.add(
      this.programService
        .discoveringProgramsFromServer(this.currentUser)
        .subscribe(
          (response: any[]) => {
            this.removeFromQueue(process, 'dowmloading', false, response);
          },
          error => {
            this.onFailToLogin(error);
          }
        )
    );
  }

  discoveringProgramStageSectionsFromServer(process: string) {
    this.subscriptions.add(
      this.programStageSectionService
        .discoveringProgramStageSectionsFromServer(this.currentUser)
        .subscribe(
          (response: any[]) => {
            this.removeFromQueue(process, 'dowmloading', false, response);
          },
          error => {
            this.onFailToLogin(error);
          }
        )
    );
  }

  discoveringProgramRulesFromServer(process: string) {
    this.subscriptions.add(
      this.programRuleEngineService
        .discoveringProgramRulesFromServer(this.currentUser)
        .subscribe(
          (response: any[]) => {
            this.removeFromQueue(process, 'dowmloading', false, response);
          },
          error => {
            this.onFailToLogin(error);
          }
        )
    );
  }

  discoveringProgramRuleActionsFromServer(process: string) {
    this.subscriptions.add(
      this.programRuleEngineService
        .discoveringProgramRuleActionsFromServer(this.currentUser)
        .subscribe(
          (response: any[]) => {
            this.removeFromQueue(process, 'dowmloading', false, response);
          },
          error => {
            this.onFailToLogin(error);
          }
        )
    );
  }

  discoveringProgramRuleVariablesFromServer(process: string) {
    this.subscriptions.add(
      this.programRuleEngineService
        .discoveringProgramRuleVariablesFromServer(this.currentUser)
        .subscribe(
          (response: any[]) => {
            this.removeFromQueue(process, 'dowmloading', false, response);
          },
          error => {
            this.onFailToLogin(error);
          }
        )
    );
  }

  discoveringIndicatorsFromServer(process: string) {
    this.subscriptions.add(
      this.indicatorService
        .discoveringIndicatorsFromServer(this.currentUser)
        .subscribe(
          (response: any[]) => {
            this.removeFromQueue(process, 'dowmloading', false, response);
          },
          error => {
            this.onFailToLogin(error);
          }
        )
    );
  }

  discoveringReportsFromServer(process: string) {
    this.subscriptions.add(
      this.standardResportService
        .discoveringReportsFromServer(this.currentUser)
        .subscribe(
          (response: any[]) => {
            this.removeFromQueue(process, 'dowmloading', false, response);
          },
          error => {
            this.onFailToLogin(error);
          }
        )
    );
  }

  discoveringConstantsFromServer(process: string) {
    this.subscriptions.add(
      this.standardResportService
        .discoveringConstantsFromServer(this.currentUser)
        .subscribe(
          (response: any[]) => {
            this.removeFromQueue(process, 'dowmloading', false, response);
          },
          error => {
            this.onFailToLogin(error);
          }
        )
    );
  }

  discoveringValidationRulesFromServer(process: string) {
    this.subscriptions.add(
      this.validationRuleService
        .discoveringValidationRulesFromServer(this.currentUser)
        .subscribe(
          (response: any[]) => {
            this.removeFromQueue(process, 'dowmloading', false, response);
          },
          error => {
            this.onFailToLogin(error);
          }
        )
    );
  }

  discoveringDataStoreFromServer(process: string) {
    this.subscriptions.add(
      this.dataStoreManagerService
        .discoveringDataStoreFromServer(this.currentUser)
        .subscribe(
          (response: any[]) => {
            this.removeFromQueue(process, 'dowmloading', false, response);
          },
          error => {
            this.onFailToLogin(error);
          }
        )
    );
  }

  startSavingProcess(process: string, data: any[]) {
    const type = 'start-saving';
    const progressMessage = getProgressMessage(process, type);
    this.updateProgressTrackerObject(process + '-' + type, progressMessage);
    if (process === 'organisationUnits') {
      this.savingOrgnisationUnitsToLocalStorage(process, data);
    } else if (process === 'dataSets') {
      this.savingDataSetsToLocalStorage(process, data);
    } else if (process === 'sections') {
      this.savingSectionsToLocalStorage(process, data);
    } else if (process === 'dataElements') {
      this.savingDataElementsToLocalStorage(process, data);
    } else if (process === 'categoryCombos') {
      this.savingCategoryCombosToLocalStorage(process, data);
    } else if (process === 'smsCommand') {
      this.savingSmsCommandsToLocalStorage(process, data);
    } else if (process === 'programs') {
      this.savingProgramsToLocalStorage(process, data);
    } else if (process === 'programStageSections') {
      this.savingProgramStageSectionsToLocalStorage(process, data);
    } else if (process === 'programRules') {
      this.savingProgramRulesToLocalStorage(process, data);
    } else if (process === 'programRuleVariables') {
      this.savingProgramRuleVariablesToLocalStorage(process, data);
    } else if (process === 'programRuleActions') {
      this.savingProgramRuleActionsToLocalStorage(process, data);
    } else if (process === 'indicators') {
      this.savingIndicatorsToLocalStorage(process, data);
    } else if (process === 'reports') {
      this.savingReportsToLocalStorage(process, data);
    } else if (process === 'constants') {
      this.savingConstantsToLocalStorage(process, data);
    } else if (process === 'validationRules') {
      this.savingValidationRulesToLocalStorage(process, data);
    } else if (process === 'dataStore') {
      this.savingDataStoreDataToLocalStorage(process, data);
    } else {
      setTimeout(() => {
        this.removeFromQueue(process, 'dowmloading', false);
      }, 1000);
    }
  }

  savingOrgnisationUnitsToLocalStorage(
    process: string,
    organisationUnits: OrganisationUnit[]
  ) {
    this.subscriptions.add(
      this.organisationUnitService
        .savingOrgnisationUnitsToLocalStorage(organisationUnits)
        .subscribe(
          () => {
            this.removeFromQueue(process, 'saving', false);
          },
          error => {
            this.onFailToLogin(error);
          }
        )
    );
  }

  savingDataSetsToLocalStorage(process: string, dataSets: any[]) {
    this.subscriptions.add(
      this.dataSetService.savingDataSetsToLocalStorage(dataSets).subscribe(
        () => {
          this.removeFromQueue(process, 'saving', false);
        },
        error => {
          this.onFailToLogin(error);
        }
      )
    );
  }

  savingSectionsToLocalStorage(process: string, sections: any[]) {
    this.subscriptions.add(
      this.sectionService.savingSectionsToLocalStorage(sections).subscribe(
        () => {
          this.removeFromQueue(process, 'saving', false);
        },
        error => {
          this.onFailToLogin(error);
        }
      )
    );
  }

  savingDataElementsToLocalStorage(process: string, dataElements: any[]) {
    this.subscriptions.add(
      this.dataElementService
        .savingdataElementsToLocalStorage(dataElements)
        .subscribe(
          () => {
            this.removeFromQueue(process, 'saving', false);
          },
          error => {
            this.onFailToLogin(error);
          }
        )
    );
  }

  savingCategoryCombosToLocalStorage(process: string, categoryCombos: any[]) {
    this.subscriptions.add(
      this.categoryComboService
        .savingCategoryCombosToLocalStorage(categoryCombos)
        .subscribe(
          () => {
            this.removeFromQueue(process, 'saving', false);
          },
          error => {
            this.onFailToLogin(error);
          }
        )
    );
  }

  savingSmsCommandsToLocalStorage(process: string, smsCommands: any[]) {
    this.subscriptions.add(
      this.smsCommandService
        .savingSmsCommandsToLocalStorage(smsCommands)
        .subscribe(
          () => {
            this.removeFromQueue(process, 'saving', false);
          },
          error => {
            this.onFailToLogin(error);
          }
        )
    );
  }

  savingProgramsToLocalStorage(process: string, programs: any[]) {
    this.subscriptions.add(
      this.programService.savingProgramsToLocalStorage(programs).subscribe(
        () => {
          this.removeFromQueue(process, 'saving', false);
        },
        error => {
          this.onFailToLogin(error);
        }
      )
    );
  }

  savingProgramStageSectionsToLocalStorage(
    process: string,
    programStageSections: any[]
  ) {
    this.subscriptions.add(
      this.programStageSectionService
        .savingProgramStageSectionsToLocalStorage(programStageSections)
        .subscribe(
          () => {
            this.removeFromQueue(process, 'saving', false);
          },
          error => {
            this.onFailToLogin(error);
          }
        )
    );
  }

  savingProgramRuleActionsToLocalStorage(
    process: string,
    programRuleActions: any[]
  ) {
    this.subscriptions.add(
      this.programRuleEngineService
        .savingProgramRuleActionsToLocalStorage(programRuleActions)
        .subscribe(
          () => {
            this.removeFromQueue(process, 'saving', false);
          },
          error => {
            this.onFailToLogin(error);
          }
        )
    );
  }

  savingProgramRulesToLocalStorage(process: string, programRules: any[]) {
    this.subscriptions.add(
      this.programRuleEngineService
        .savingProgramRulesToLocalStorage(programRules)
        .subscribe(
          () => {
            this.removeFromQueue(process, 'saving', false);
          },
          error => {
            this.onFailToLogin(error);
          }
        )
    );
  }

  savingProgramRuleVariablesToLocalStorage(
    process: string,
    programRuleVariables: any[]
  ) {
    this.subscriptions.add(
      this.programRuleEngineService
        .savingProgramRuleVariablesToLocalStorage(programRuleVariables)
        .subscribe(
          () => {
            this.removeFromQueue(process, 'saving', false);
          },
          error => {
            this.onFailToLogin(error);
          }
        )
    );
  }

  savingIndicatorsToLocalStorage(process: string, indicators: any[]) {
    this.subscriptions.add(
      this.indicatorService
        .savingIndicatorsToLocalStorage(indicators)
        .subscribe(
          () => {
            this.removeFromQueue(process, 'saving', false);
          },
          error => {
            this.onFailToLogin(error);
          }
        )
    );
  }

  savingReportsToLocalStorage(process: string, reports: any[]) {
    this.subscriptions.add(
      this.standardResportService
        .savingReportsToLocalStorage(reports)
        .subscribe(
          () => {
            this.removeFromQueue(process, 'saving', false);
          },
          error => {
            this.onFailToLogin(error);
          }
        )
    );
  }

  savingConstantsToLocalStorage(process: string, constants: any[]) {
    this.subscriptions.add(
      this.standardResportService
        .savingConstantsToLocalStorage(constants)
        .subscribe(
          () => {
            this.removeFromQueue(process, 'saving', false);
          },
          error => {
            this.onFailToLogin(error);
          }
        )
    );
  }

  savingValidationRulesToLocalStorage(process: string, validationRules: any[]) {
    this.subscriptions.add(
      this.validationRuleService
        .savingValidationRulesToLocalStorage(validationRules)
        .subscribe(
          () => {
            this.removeFromQueue(process, 'saving', false);
          },
          error => {
            this.onFailToLogin(error);
          }
        )
    );
  }

  savingDataStoreDataToLocalStorage(process: string, dataStoreData: any[]) {
    this.subscriptions.add(
      this.dataStoreManagerService
        .savingDataStoreDataToLocalStorage(dataStoreData)
        .subscribe(
          () => {
            this.removeFromQueue(process, 'saving', false);
          },
          error => {
            this.onFailToLogin(error);
          }
        )
    );
  }

  clearAllSubscriptions() {
    this.subscriptions.unsubscribe();
    this.subscriptions = new Subscription();
  }

  trackByFn(index: string, item: { id: string }) {
    return item && item.id ? item.id : index;
  }

  ngOnDestroy() {
    this.clearAllSubscriptions();
    this.processes = null;
    this.progressTrackerBackup = null;
    this.isOnLogin = null;
    this.failedProcesses = null;
    this.failedProcessesErrors = null;
    this.overAllMessage = null;
    this.savingingQueueManager = null;
    this.showOverallProgressBar = null;
    this.downloadingQueueManager = null;
    this.showCancelButton = null;
    this.progressTrackerPacentage = null;
    this.progressTrackerMessage = null;
    this.trackedProcessWithLoader = null;
    this.completedTrackedProcess = null;
  }
}
