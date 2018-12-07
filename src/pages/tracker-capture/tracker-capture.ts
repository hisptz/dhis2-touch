import { Component, OnInit } from '@angular/core';
import { IonicPage, ModalController, NavController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { AppProvider } from '../../providers/app/app';
import { OrganisationUnitsProvider } from '../../providers/organisation-units/organisation-units';
import { ProgramsProvider } from '../../providers/programs/programs';
import { TrackerCaptureProvider } from '../../providers/tracker-capture/tracker-capture';
import { AppTranslationProvider } from '../../providers/app-translation/app-translation';
import * as _ from 'lodash';
import { SettingsProvider } from '../../providers/settings/settings';

/**
 * Generated class for the TrackerCapturePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tracker-capture',
  templateUrl: 'tracker-capture.html'
})
export class TrackerCapturePage implements OnInit {
  selectedOrgUnit: any;
  selectedProgram: any;
  currentUser: any;
  programIdsByUserRoles: Array<string>;
  isLoading: boolean;
  loadingMessage: string;
  organisationUnitLabel: string;
  programLabel: string;
  isFormReady: boolean;
  selectedDataDimension: Array<any>;
  programs: Array<any>;
  trackedEntityInstances: Array<any>;
  programTrackedEntityAttributes: Array<any>;
  trackedEntityInstancesIds: Array<string>;
  columnsToDisplay: any;
  icons: any = {};
  tableLayout: any;
  translationMapper: any;
  dataEntrySettings: any;

  constructor(
    public navCtrl: NavController,
    private modalCtrl: ModalController,
    private userProvider: UserProvider,
    private appProvider: AppProvider,
    private programsProvider: ProgramsProvider,
    private trackerCaptureProvider: TrackerCaptureProvider,
    private organisationUnitsProvider: OrganisationUnitsProvider,
    private appTranslation: AppTranslationProvider,
    private settingsProvider: SettingsProvider
  ) {}

  ionViewDidEnter() {
    if (this.isFormReady) {
      this.loadingSavedTrackedEntityInstances(
        this.selectedProgram.id,
        this.selectedOrgUnit.id
      );
    }
  }

  ngOnInit() {
    this.icons.orgUnit = 'assets/icon/orgUnit.png';
    this.icons.program = 'assets/icon/program.png';
    this.trackedEntityInstances = [];
    this.columnsToDisplay = {};
    this.isLoading = true;
    this.isFormReady = false;
    this.translationMapper = {};
    this.appTranslation.getTransalations(this.getValuesToTranslate()).subscribe(
      (data: any) => {
        this.translationMapper = data;
        this.loadingCurrentUserInformation();
      },
      error => {
        this.loadingCurrentUserInformation();
      }
    );
  }

  loadingCurrentUserInformation() {
    let key = 'Discovering current user information';
    this.loadingMessage = this.translationMapper[key]
      ? this.translationMapper[key]
      : key;
    this.userProvider.getCurrentUser().subscribe(
      (currentUser: any) => {
        this.currentUser = currentUser;
        this.userProvider.getUserData().subscribe((userData: any) => {
          this.programIdsByUserRoles = userData.programs;
          this.organisationUnitsProvider
            .getLastSelectedOrganisationUnitUnit(currentUser)
            .subscribe((lastSelectedOrgUnit: any) => {
              if (lastSelectedOrgUnit && lastSelectedOrgUnit.id) {
                this.selectedOrgUnit = lastSelectedOrgUnit;
                this.loadingPrograms();
                this.loadingAppSetting();
              }
              this.updateTrackerCaptureSelections();
            });
        });
      },
      error => {
        this.isLoading = false;
        this.loadingMessage = '';
        this.appProvider.setNormalNotification(
          'Failed to discover current user information'
        );
      }
    );
  }

  loadingAppSetting() {
    this.settingsProvider
      .getSettingsForTheApp(this.currentUser)
      .subscribe((appSettings: any) => {
        this.dataEntrySettings = appSettings.entryForm;
      });
  }

  loadingPrograms() {
    this.isLoading = true;
    let key = 'Discovering assigned programs';
    this.loadingMessage = this.translationMapper[key]
      ? this.translationMapper[key]
      : key;
    let programType = 'WITH_REGISTRATION';
    this.programsProvider
      .getProgramsAssignedOnOrgUnitAndUserRoles(
        this.selectedOrgUnit.id,
        programType,
        this.programIdsByUserRoles,
        this.currentUser
      )
      .subscribe(
        (programs: any) => {
          this.programs = programs;
          this.selectedProgram = this.programsProvider.lastSelectedProgram;
          if (this.selectedProgram && this.selectedProgram.id) {
            this.trackerCaptureProvider
              .getTrackedEntityRegistration(
                this.selectedProgram.id,
                this.currentUser
              )
              .subscribe(
                (programTrackedEntityAttributes: any) => {
                  this.programTrackedEntityAttributes = programTrackedEntityAttributes;
                  this.updateTrackerCaptureSelections();
                  this.isLoading = false;
                  this.loadingMessage = '';
                },
                error => {
                  this.isLoading = false;
                  console.log(JSON.stringify(error));
                  this.appProvider.setNormalNotification(
                    'Failed to discover registration form'
                  );
                }
              );
          } else {
            this.updateTrackerCaptureSelections();
          }
        },
        error => {
          this.isLoading = false;
          this.loadingMessage = '';
          console.log(JSON.stringify(error));
          this.appProvider.setNormalNotification(
            'Failed to discover assigned programs'
          );
        }
      );
  }

  updateTrackerCaptureSelections() {
    if (this.organisationUnitsProvider.lastSelectedOrgUnit) {
      this.selectedOrgUnit = this.organisationUnitsProvider.lastSelectedOrgUnit;
      this.organisationUnitLabel = this.selectedOrgUnit.name;
    } else {
      this.organisationUnitLabel = 'Touch to select organisation unit';
    }
    if (this.selectedProgram && this.selectedProgram.name) {
      this.programLabel = this.selectedProgram.name;
    } else {
      this.programLabel = 'Touch to select program';
    }
    this.isFormReady = this.isAllParameterSelected();
    this.isLoading = false;
    this.loadingMessage = '';
    if (this.isFormReady) {
      this.columnsToDisplay = {};
      const { label } = this.dataEntrySettings;
      if (
        this.programTrackedEntityAttributes &&
        this.programTrackedEntityAttributes.length > 0
      ) {
        this.programTrackedEntityAttributes.map(
          (programTrackedEntityAttribute: any) => {
            if (programTrackedEntityAttribute.displayInList) {
              const attribute =
                programTrackedEntityAttribute.trackedEntityAttribute;
              let fieldLabel = attribute.name;
              if (attribute[label] && label && isNaN(attribute[label])) {
                fieldLabel = attribute[label];
              }
              this.columnsToDisplay[attribute.id] = fieldLabel;
            }
          }
        );
        if (_.keys(this.columnsToDisplay).length == 0) {
          const attribute = this.programTrackedEntityAttributes[0]
            .trackedEntityAttribute;
          let fieldLabel = attribute.name;
          if (attribute[label] && label && isNaN(attribute[label])) {
            fieldLabel = attribute[label];
          }
          this.columnsToDisplay[attribute.id] = fieldLabel;
        }
      }
      this.loadingSavedTrackedEntityInstances(
        this.selectedProgram.id,
        this.selectedOrgUnit.id
      );
    } else {
      this.trackedEntityInstances = [];
    }
  }

  openOrganisationUnitTree() {
    let modal = this.modalCtrl.create('OrganisationUnitSelectionPage', {
      filterType: 'WITH_REGISTRATION'
    });
    modal.onDidDismiss((selectedOrgUnit: any) => {
      if (selectedOrgUnit && selectedOrgUnit.id) {
        this.selectedOrgUnit = selectedOrgUnit;
        this.updateTrackerCaptureSelections();
        this.loadingPrograms();
      }
    });
    modal.present();
  }

  openProgramList() {
    if (this.programs && this.programs.length > 0) {
      let modal = this.modalCtrl.create('ProgramSelection', {
        currentProgram: this.selectedProgram,
        programsList: this.programs
      });
      modal.onDidDismiss((selectedProgram: any) => {
        if (selectedProgram && selectedProgram.id) {
          this.selectedProgram = selectedProgram;
          this.programsProvider.setLastSelectedProgram(selectedProgram);
          this.trackerCaptureProvider
            .getTrackedEntityRegistration(selectedProgram.id, this.currentUser)
            .subscribe(
              (programTrackedEntityAttributes: any) => {
                this.programTrackedEntityAttributes = programTrackedEntityAttributes;
                this.updateTrackerCaptureSelections();
              },
              error => {
                this.isLoading = false;
                console.log(JSON.stringify(error));
                this.appProvider.setNormalNotification(
                  'Failed to discover registration form'
                );
              }
            );
        }
      });
      modal.present();
    } else {
      this.appProvider.setNormalNotification(
        'There are no program to select, please select another organisation unit'
      );
    }
  }

  loadingSavedTrackedEntityInstances(programId, orgUnitId) {
    this.isLoading = true;
    let key = 'Discovering tracked entity list';
    this.loadingMessage = this.translationMapper[key]
      ? this.translationMapper[key]
      : key;
    this.trackerCaptureProvider
      .loadTrackedEntityInstancesList(programId, orgUnitId, this.currentUser)
      .subscribe(
        (trackedEntityInstances: any) => {
          console.log(JSON.stringify(trackedEntityInstances));
          this.trackedEntityInstances = trackedEntityInstances;
          this.renderDataAsTable();
        },
        error => {
          console.log(JSON.stringify(error));
          this.isLoading = false;
          this.appProvider.setNormalNotification(
            'Failed to discover tracked entity list'
          );
        }
      );
  }

  isAllParameterSelected() {
    let result = false;
    if (this.selectedProgram && this.selectedProgram.name) {
      result = true;
    }
    return result;
  }

  renderDataAsTable() {
    let key = 'Preparing table for display';
    this.loadingMessage = this.translationMapper[key]
      ? this.translationMapper[key]
      : key;
    this.trackerCaptureProvider
      .getTableFormatResult(this.columnsToDisplay, this.trackedEntityInstances)
      .subscribe(
        (response: any) => {
          this.tableLayout = response.table;
          this.trackedEntityInstancesIds = response.trackedEntityInstancesIds;
          this.isLoading = false;
        },
        error => {
          this.isLoading = false;
          this.appProvider.setNormalNotification(
            'Failed to prepare table for display'
          );
        }
      );
  }

  hideAndShowColumns() {
    const data = {
      columnsToDisplay: this.columnsToDisplay,
      programTrackedEntityAttributes: this.programTrackedEntityAttributes,
      dataEntrySettings: this.dataEntrySettings
    };
    const modal = this.modalCtrl.create('HideAndShowColumnsPage', {
      data: data
    });
    modal.onDidDismiss((columnsToDisplay: any) => {
      if (columnsToDisplay) {
        this.columnsToDisplay = columnsToDisplay;
        this.renderDataAsTable();
      }
    });
    modal.present();
  }

  registerNewTrackedEntity() {
    this.navCtrl.push('TrackerEntityRegisterPage', {});
  }

  openTrackedEntityDashboard(currentIndex) {
    let trackedEntityInstancesId = this.trackedEntityInstancesIds[currentIndex];
    this.navCtrl.push('TrackedEntityDashboardPage', {
      trackedEntityInstancesId: trackedEntityInstancesId
    });
  }

  getValuesToTranslate() {
    return [
      'Discovering current user information',
      'Discovering assigned programs',
      'Discovering tracked entity list',
      'Preparing table for display'
    ];
  }
}
