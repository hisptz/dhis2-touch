import { Component, OnInit } from '@angular/core';
import { IonicPage, ModalController, NavController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { OrganisationUnitsProvider } from '../../providers/organisation-units/organisation-units';
import { ProgramsProvider } from '../../providers/programs/programs';
import { AppProvider } from '../../providers/app/app';
import { EventCaptureFormProvider } from '../../providers/event-capture-form/event-capture-form';
import { SettingsProvider } from '../../providers/settings/settings';
import { AppTranslationProvider } from '../../providers/app-translation/app-translation';

/**
 * Generated class for the EventCapturePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-event-capture',
  templateUrl: 'event-capture.html'
})
export class EventCapturePage implements OnInit {
  selectedOrgUnit: any;
  selectedProgram: any;
  currentUser: any;
  programIdsByUserRoles: Array<string>;
  isLoading: boolean;
  loadingMessage: string;
  organisationUnitLabel: string;
  programLabel: string;
  isFormReady: boolean = false;
  isProgramDimensionApplicable: boolean;
  programDimensionNotApplicableMessage: string;
  programCategoryCombo: any;
  selectedDataDimension: Array<any>;
  programs: Array<any>;
  programStage: any;
  columnsToDisplay: any = {};
  icons: any = {};
  tableLayout: any;
  eventIds: Array<string>;
  currentEvents: Array<any>;
  translationMapper: any;
  dataEntrySettings: any;

  constructor(
    private navCtrl: NavController,
    private userProvider: UserProvider,
    private modalCtrl: ModalController,
    private settingsProvider: SettingsProvider,
    private organisationUnitsProvider: OrganisationUnitsProvider,
    private programsProvider: ProgramsProvider,
    private appProvider: AppProvider,
    private eventCaptureFormProvider: EventCaptureFormProvider,
    private appTranslation: AppTranslationProvider
  ) {}

  ngOnInit() {
    this.icons.orgUnit = 'assets/icon/orgUnit.png';
    this.icons.program = 'assets/icon/program.png';
    this.selectedDataDimension = [];
    this.programIdsByUserRoles = [];
    this.programs = [];
    this.isLoading = true;
    this.isFormReady = false;
    this.isProgramDimensionApplicable = false;

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
              }
              this.updateEventCaptureSelections();
              this.loadingAppSetting();
            });
        });
      },
      error => {
        this.isLoading = false;
        this.loadingMessage = '';
        this.appProvider.setNormalNotification(
          'Failed to discover user information'
        );
      }
    );
  }

  ionViewDidEnter() {
    if (this.isFormReady) {
      this.loadingEvents();
    }
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
    let programType = 'WITHOUT_REGISTRATION';
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
          this.updateEventCaptureSelections();
          if (this.selectedProgram && this.selectedProgram.categoryCombo) {
            this.updateDataSetCategoryCombo(this.selectedProgram.categoryCombo);
            this.loadProgramStages(this.selectedProgram.id);
          }
          this.isLoading = false;
          this.loadingMessage = '';
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

  updateEventCaptureSelections() {
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
      this.loadingEvents();
    }
  }

  openOrganisationUnitTree() {
    let modal = this.modalCtrl.create('OrganisationUnitSelectionPage', {
      filterType: 'WITHOUT_REGISTRATION'
    });
    modal.onDidDismiss((selectedOrgUnit: any) => {
      if (selectedOrgUnit && selectedOrgUnit.id) {
        this.selectedOrgUnit = selectedOrgUnit;
        this.updateEventCaptureSelections();
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
          this.updateEventCaptureSelections();
          this.updateDataSetCategoryCombo(this.selectedProgram.categoryCombo);
          this.loadProgramStages(selectedProgram.id);
        }
      });
      modal.present();
    } else {
      this.appProvider.setNormalNotification('There are no program to select');
    }
  }

  openDataDimensionSelection(category) {
    if (
      category.categoryOptions &&
      category.categoryOptions &&
      category.categoryOptions.length > 0
    ) {
      let currentIndex = this.programCategoryCombo.categories.indexOf(category);
      let modal = this.modalCtrl.create('DataDimensionSelectionPage', {
        categoryOptions: category.categoryOptions,
        title: category.name,
        currentSelection: this.selectedDataDimension[currentIndex]
          ? this.selectedDataDimension[currentIndex]
          : {}
      });
      modal.onDidDismiss((selectedDataDimension: any) => {
        if (selectedDataDimension && selectedDataDimension.id) {
          this.selectedDataDimension[currentIndex] = selectedDataDimension;
          this.updateEventCaptureSelections();
        }
      });
      modal.present();
    } else {
      let message =
        'There is no option for selected category that associated with selected organisation unit';
      this.appProvider.setNormalNotification(message);
    }
  }

  getDataDimensions() {
    if (this.selectedProgram && this.selectedProgram.categoryCombo) {
      let attributeCc = this.selectedProgram.categoryCombo.id;
      let attributeCos = '';
      this.selectedDataDimension.forEach((dimension: any, index: any) => {
        if (index == 0) {
          attributeCos += dimension.id;
        } else {
          attributeCos += ';' + dimension.id;
        }
      });
      return { attributeCc: attributeCc, attributeCos: attributeCos };
    } else {
      return {};
    }
  }

  isAllParameterSelected() {
    let isFormReady = true;
    if (
      this.selectedProgram &&
      this.selectedProgram.name &&
      this.selectedProgram.categoryCombo.name &&
      this.selectedProgram.categoryCombo.name != 'default'
    ) {
      if (
        this.selectedDataDimension &&
        this.selectedDataDimension.length > 0 &&
        this.programCategoryCombo &&
        this.programCategoryCombo.categories &&
        this.selectedDataDimension.length ==
          this.programCategoryCombo.categories.length
      ) {
        let count = 0;
        this.selectedDataDimension.forEach(() => {
          count++;
        });
        if (count != this.selectedDataDimension.length) {
          isFormReady = false;
        }
      } else {
        isFormReady = false;
      }
    } else if (!this.selectedProgram) {
      isFormReady = false;
    }
    return isFormReady;
  }

  updateDataSetCategoryCombo(categoryCombo) {
    if (categoryCombo) {
      let programCategoryCombo = {};
      this.isProgramDimensionApplicable = false;
      if (categoryCombo.name != 'default') {
        programCategoryCombo['id'] = categoryCombo.id;
        programCategoryCombo['name'] = categoryCombo.name;
        let categories = this.programsProvider.getProgramCategoryComboCategories(
          this.selectedOrgUnit.id,
          categoryCombo.categories
        );
        programCategoryCombo['categories'] = categories;
        this.isProgramDimensionApplicable = true;
        categories.forEach((category: any) => {
          if (
            category.categoryOptions &&
            category.categoryOptions.length == 0
          ) {
            this.isProgramDimensionApplicable = false;
          }
        });
        this.programDimensionNotApplicableMessage =
          'All of selected category disaggregation are restricted from entry in selcted organisation unit, choose a different form or contact your support desk';
      }
      this.selectedDataDimension = [];
      this.programCategoryCombo = programCategoryCombo;
      this.updateEventCaptureSelections();
    }
  }

  loadProgramStages(programId) {
    let key = 'Discovering program stages';
    this.loadingMessage = this.translationMapper[key]
      ? this.translationMapper[key]
      : key;
    this.columnsToDisplay = {};
    this.eventCaptureFormProvider
      .getProgramStages(programId, this.currentUser)
      .subscribe(
        (programStages: any) => {
          if (programStages && programStages.length > 0) {
            this.programStage = programStages[0];
            const { executionDateLabel } = this.programStage;
            this.columnsToDisplay['eventDate'] =
              executionDateLabel != 0 || executionDateLabel != 0.0
                ? executionDateLabel
                : 'Report date';
            if (this.programStage.programStageDataElements) {
              this.programStage.programStageDataElements.forEach(
                (programStageDataElement: any) => {
                  if (
                    programStageDataElement.dataElement &&
                    programStageDataElement.dataElement.id
                  ) {
                    let fieldLabelKey =
                      programStageDataElement.dataElement.displayName;
                    if (
                      this.dataEntrySettings &&
                      this.dataEntrySettings.label &&
                      programStageDataElement.dataElement[
                        this.dataEntrySettings.label
                      ]
                    ) {
                      if (
                        isNaN(
                          programStageDataElement.dataElement[
                            this.dataEntrySettings.label
                          ]
                        )
                      ) {
                        fieldLabelKey =
                          programStageDataElement.dataElement[
                            this.dataEntrySettings.label
                          ];
                      }
                    }
                    if (programStageDataElement.displayInReports) {
                      this.columnsToDisplay[
                        programStageDataElement.dataElement.id
                      ] = fieldLabelKey;
                    }
                  }
                }
              );
            }
            this.updateEventCaptureSelections();
          }
        },
        error => {
          console.log(JSON.stringify(error));
          this.isLoading = false;
          this.appProvider.setNormalNotification(
            'Failed to discover program stages'
          );
        }
      );
  }

  hideAndShowColumns() {
    const data = {
      columnsToDisplay: this.columnsToDisplay,
      programStage: this.programStage,
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

  loadingEvents() {
    if (
      this.selectedOrgUnit &&
      this.selectedOrgUnit.id &&
      this.selectedProgram &&
      this.selectedProgram.id
    ) {
      this.isLoading = true;
      let key = 'Discovering data';
      this.loadingMessage = this.translationMapper[key]
        ? this.translationMapper[key]
        : key;
      let dataDimension = this.getDataDimensions();
      this.eventCaptureFormProvider
        .getEventsBasedOnEventsSelection(
          this.currentUser,
          dataDimension,
          this.selectedProgram.id,
          this.selectedOrgUnit.id
        )
        .subscribe((events: any) => {
          this.currentEvents = events;
          this.renderDataAsTable();
        });
    }
  }

  renderDataAsTable() {
    this.isLoading = true;
    let key = 'Preparing table';
    this.loadingMessage = this.translationMapper[key]
      ? this.translationMapper[key]
      : key;
    this.eventCaptureFormProvider
      .getTableFormatResult(this.columnsToDisplay, this.currentEvents)
      .subscribe(
        (response: any) => {
          this.tableLayout = response.table;
          this.eventIds = response.eventIds;
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

  goToEventView(currentIndex) {
    let params = {
      dataDimension: this.getDataDimensions(),
      eventId: this.eventIds[currentIndex]
    };
    this.navCtrl.push('EventCaptureRegisterPage', params);
  }

  goToEventRegister() {
    let params = { dataDimension: this.getDataDimensions() };
    this.navCtrl.push('EventCaptureRegisterPage', params);
  }

  getValuesToTranslate() {
    return [
      'Discovering current user information',
      'Discovering assigned programs',
      'Discovering program stages',
      'Discovering data',
      'Preparing table for display',
      'All of selected category disaggregation are restricted from entry in selcted organisation unit, choose a different form or contact your support desk'
    ];
  }
}
