import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ActionSheetController,
  Content,
  IonicPage,
  ModalController,
  NavController
} from 'ionic-angular';
import { TrackerCaptureProvider } from '../../../providers/tracker-capture/tracker-capture';
import { UserProvider } from '../../../providers/user/user';
import { AppProvider } from '../../../providers/app/app';
import { ProgramsProvider } from '../../../providers/programs/programs';
import { OrganisationUnitsProvider } from '../../../providers/organisation-units/organisation-units';
import { TrackedEntityAttributeValuesProvider } from '../../../providers/tracked-entity-attribute-values/tracked-entity-attribute-values';
import { EventCaptureFormProvider } from '../../../providers/event-capture-form/event-capture-form';
import { AppTranslationProvider } from '../../../providers/app-translation/app-translation';
import { SettingsProvider } from '../../../providers/settings/settings';

declare var dhis2: any;
/**
 * Generated class for the TrackerEntityRegisterPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tracker-entity-register',
  templateUrl: 'tracker-entity-register.html'
})
export class TrackerEntityRegisterPage implements OnInit {
  currentProgram: any;
  currentOrganisationUnit: any;
  currentUser: any;
  programTrackedEntityAttributes: Array<any>;
  dashboardWidgets: Array<any>;
  programStages: Array<any>;
  isDashboardWidgetOpen: any = {};
  isLoading: boolean;
  isRegistrationProcessingRunning: boolean;
  loadingMessage: string;
  date: any;
  currentProgramName: string;
  currentOrganisationUnitName: string;
  dataObject: any;
  trackedEntityAttributesSavingStatusClass: any;
  trackedEntityAttributeValuesObject: any;
  isTrackedEntityRegistered: boolean = false;
  trackedEntityInstance: string;
  icons: any = {};
  currentWidget: any;
  currentWidgetIndex: any;
  currentTrackedEntityId: string;
  translationMapper: any;
  isFormReady: boolean;
  trackerRegistrationForm: string;
  formLayout: string;
  data;
  @ViewChild(Content) content: Content;

  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private eventCaptureFormProvider: EventCaptureFormProvider,
    private userProvider: UserProvider,
    private appProvider: AppProvider,
    private programsProvider: ProgramsProvider,
    private trackedEntityAttributeValuesProvider: TrackedEntityAttributeValuesProvider,
    private organisationUnitsProvider: OrganisationUnitsProvider,
    private trackerCaptureProvider: TrackerCaptureProvider,
    private appTranslation: AppTranslationProvider,
    private settingProvider: SettingsProvider
  ) {
    this.isFormReady = false;
    this.currentProgramName = '';
    this.currentOrganisationUnitName = '';
    const today = new Date().toISOString().split('T')[0];
    this.date = {
      incidentDate: today,
      enrollmentDate: today
    };
  }

  ngOnInit() {
    this.icons['addNewCase'] = 'assets/icon/add-new-case.png';
    this.icons['menu'] = 'assets/icon/menu.png';
    this.isLoading = true;
    this.isRegistrationProcessingRunning = false;
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

  goBack() {
    this.navCtrl.pop();
  }

  loadingCurrentUserInformation() {
    let key = 'Discovering current user information';
    this.loadingMessage = this.translationMapper[key]
      ? this.translationMapper[key]
      : key;
    this.dataObject = {};
    this.trackedEntityAttributesSavingStatusClass = {};
    this.trackedEntityAttributeValuesObject = {};
    this.dashboardWidgets = this.getDashboardWidgets();
    this.currentOrganisationUnit = this.organisationUnitsProvider.lastSelectedOrgUnit;
    this.currentProgram = this.programsProvider.getLastSelectedProgram();
    this.userProvider.getCurrentUser().subscribe(
      user => {
        this.currentUser = user;
        this.settingProvider.getSettingsForTheApp(user).subscribe(settings => {
          if (settings && settings.entryForm && settings.entryForm.formLayout) {
            this.formLayout = settings.entryForm.formLayout;
          }
        });
        this.loadTrackedEntityRegistration(
          this.currentProgram.id,
          this.currentUser
        );
      },
      error => {
        console.log(error);
        this.isLoading = false;
        this.appProvider.setNormalNotification(
          'Failed to discover current user information'
        );
      }
    );
  }

  resetRegistration() {
    this.dataObject = {};
    this.trackedEntityAttributeValuesObject = {};
    this.trackedEntityAttributesSavingStatusClass = {};
    this.date = {
      incidentDate: '',
      enrollmentDate: ''
    };
    this.dashboardWidgets = this.getDashboardWidgets();
    this.isTrackedEntityRegistered = false;
    if (this.dashboardWidgets.length > 0) {
      this.changeDashboardWidget(this.dashboardWidgets[0]);
    }
    this.trackedEntityInstance = dhis2.util.uid();
    this.isFormReady = true;
    this.loadingProgramStages(this.currentProgram.id, this.currentUser);
  }

  loadingProgramStages(programId, currentUser) {
    let key = 'Discovering program stages';
    this.loadingMessage = this.translationMapper[key]
      ? this.translationMapper[key]
      : key;
    this.eventCaptureFormProvider
      .getProgramStages(programId, currentUser)
      .subscribe(
        (programStages: any) => {
          this.programStages = programStages;
          if (programStages && programStages.length > 0) {
            let counter = 1;
            programStages.forEach((programStage: any) => {
              this.dashboardWidgets.push({
                id: programStage.id,
                name: programStage.name,
                iconName: counter
              });
              counter++;
            });
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

  loadTrackedEntityRegistration(programId, currentUser) {
    let key = 'Discovering registration form';
    this.loadingMessage = this.translationMapper[key]
      ? this.translationMapper[key]
      : key;
    this.isLoading = true;
    this.trackerCaptureProvider
      .getTrackedEntityRegistration(programId, currentUser)
      .subscribe(
        (programTrackedEntityAttributes: any) => {
          this.programTrackedEntityAttributes = programTrackedEntityAttributes;
          this.trackerCaptureProvider
            .getTrackedEntityRegistrationDesignForm(programId, currentUser)
            .subscribe(
              form => {
                this.trackerRegistrationForm = form;
                this.isLoading = false;
                this.resetRegistration();
              },
              error => {
                this.isLoading = false;
                console.log(JSON.stringify(error));
                this.appProvider.setNormalNotification(
                  'Failed to discover registration entry form'
                );
              }
            );
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

  getDashboardWidgets() {
    return [
      {
        id: 'enrollment',
        name: 'Enrollment & Profile',
        icon: 'assets/icon/profile.png'
      }
    ];
  }

  openWidgetList() {
    if (this.isTrackedEntityRegistered) {
      let modal = this.modalCtrl.create('TrackedEntityWidgetSelectionPage', {
        dashboardWidgets: this.dashboardWidgets,
        currentWidget: this.currentWidget
      });
      modal.onDidDismiss((currentWidget: any) => {
        this.changeDashboardWidget(currentWidget);
        setTimeout(() => {
          this.content.scrollToTop(1300);
        }, 200);
      });
      modal.present();
    } else {
      this.appProvider.setNormalNotification(
        'A tracked entity instance has not yet registered'
      );
    }
  }

  updateWidgetPagination(widgetIndex) {
    let widget = this.dashboardWidgets[widgetIndex];
    if (widget && widget.id) {
      this.changeDashboardWidget(widget);
    }
  }

  changeDashboardWidget(content) {
    if (content && content.id) {
      this.currentWidgetIndex = this.dashboardWidgets.indexOf(content);
      this.currentWidget = content;
      if (!this.isDashboardWidgetOpen[content.id]) {
        Object.keys(this.isDashboardWidgetOpen).forEach(id => {
          this.isDashboardWidgetOpen[id] = false;
        });
      }
      this.isDashboardWidgetOpen[content.id] = true;
    }
  }

  //@todo changes of enrollments as well
  updateData(updateDataValue, shoulOnlyCheckDates?) {
    if (!shoulOnlyCheckDates) {
      const id = updateDataValue.id.split('-')[0];
      this.currentTrackedEntityId = updateDataValue.id;
      this.trackedEntityAttributeValuesObject[id] = updateDataValue.value;
      this.dataObject[updateDataValue.id] = updateDataValue;
    }
    const isFormReady = this.isALlRequiredFieldHasValue(
      this.programTrackedEntityAttributes,
      this.trackedEntityAttributeValuesObject,
      shoulOnlyCheckDates
    );
    if (isFormReady) {
      this.registerEntity();
    }
  }

  addNewTrackedEntity() {
    if (this.isTrackedEntityRegistered) {
      this.isFormReady = false;
      setTimeout(() => {
        this.resetRegistration();
      });
    } else {
      this.appProvider.setNormalNotification(
        'A tracked entity instance has not yet registered'
      );
    }
  }

  deleteTrackedEntity(trackedEntityInstanceId) {
    if (this.isTrackedEntityRegistered) {
      const actionSheet = this.actionSheetCtrl.create({
        title: this.translationMapper[
          'You are about to delete all information related to this tracked entity instance, are you sure?'
        ],
        buttons: [
          {
            text: this.translationMapper['Yes'],
            handler: () => {
              this.isLoading = true;
              let key =
                'Deleting all information related to this tracked entity instance';
              this.loadingMessage = this.translationMapper[key]
                ? this.translationMapper[key]
                : key;
              this.trackerCaptureProvider
                .deleteTrackedEntityInstance(
                  trackedEntityInstanceId,
                  this.currentUser
                )
                .subscribe(
                  () => {
                    this.goBack();
                    this.appProvider.setNormalNotification(
                      'A tracked entity instance has been deleted successfully'
                    );
                  },
                  error => {
                    this.isLoading = false;
                    console.log(JSON.stringify(error));
                    this.appProvider.setNormalNotification(
                      'Failed to delete all information related to this tracked entity instance'
                    );
                  }
                );
            }
          },
          {
            text: this.translationMapper['No'],
            handler: () => {}
          }
        ]
      });
      actionSheet.present();
    } else {
      this.appProvider.setNormalNotification(
        'A tracked entity instance has not yet registered'
      );
    }
  }

  registerEntity() {
    let trackedEntityAttributeValues = [];
    Object.keys(this.trackedEntityAttributeValuesObject).forEach(key => {
      trackedEntityAttributeValues.push({
        value: this.trackedEntityAttributeValuesObject[key],
        attribute: key
      });
    });
    if (this.isTrackedEntityRegistered) {
      this.trackedEntityAttributeValuesProvider
        .savingTrackedEntityAttributeValues(
          this.trackedEntityInstance,
          trackedEntityAttributeValues,
          this.currentUser
        )
        .subscribe(
          () => {
            this.trackedEntityAttributesSavingStatusClass[
              this.currentTrackedEntityId
            ] =
              'input-field-container-success';
          },
          error => {
            this.trackedEntityAttributesSavingStatusClass[
              this.currentTrackedEntityId
            ] =
              'input-field-container-failed';
            console.log(JSON.stringify(error));
          }
        );
    } else {
      this.trackerCaptureProvider
        .saveTrackedEntityRegistration(
          this.date.incidentDate,
          this.date.enrollmentDate,
          this.currentUser,
          this.trackedEntityInstance
        )
        .subscribe(
          (reseponse: any) => {
            this.appProvider.setNormalNotification(
              'A tracked entity instance has been saved successfully'
            );
            this.isTrackedEntityRegistered = true;
            Object.keys(this.trackedEntityAttributeValuesObject).forEach(
              key => {
                this.trackedEntityAttributesSavingStatusClass[
                  key + '-trackedEntityAttribute'
                ] =
                  'input-field-container-success';
              }
            );
            this.registerEntity();
          },
          error => {
            Object.keys(this.trackedEntityAttributeValuesObject).forEach(
              key => {
                this.trackedEntityAttributesSavingStatusClass[
                  key + '-trackedEntityAttribute'
                ] =
                  'input-field-container-failed';
              }
            );
            this.appProvider.setNormalNotification(
              'Failed to save a tracked entity instance'
            );
            console.log(JSON.stringify(error));
          }
        );
    }
  }

  isALlRequiredFieldHasValue(
    programTrackedEntityAttributes,
    trackedEntityAttributeValuesObject,
    shoulOnlyCheckDates
  ) {
    let result = Object.keys(trackedEntityAttributeValuesObject).length > 0;
    programTrackedEntityAttributes.forEach(
      (programTrackedEntityAttribute: any) => {
        if (
          programTrackedEntityAttribute &&
          programTrackedEntityAttribute.mandatory &&
          programTrackedEntityAttribute.trackedEntityAttribute &&
          programTrackedEntityAttribute.trackedEntityAttribute.id
        ) {
          if (
            !trackedEntityAttributeValuesObject[
              programTrackedEntityAttribute.trackedEntityAttribute.id
            ]
          ) {
            result = false;
          }
        }
      }
    );
    if (result) {
      if (this.date.enrollmentDate === '') {
        this.appProvider.setNormalNotification(
          this.currentProgram.enrollmentDateLabel + ' is mandatory field'
        );
        result = false;
      }
      if (
        result &&
        this.currentProgram &&
        this.currentProgram.displayIncidentDate &&
        this.date.enrollmentDate !== ''
      ) {
        if (this.date.incidentDate === '') {
          this.appProvider.setNormalNotification(
            this.currentProgram.incidentDateLabel + ' is mandatory field'
          );
          result = false;
        }
      }
    }
    return result;
  }

  trackByFn(index, item) {
    return item.id;
  }

  getValuesToTranslate() {
    return [
      'Discovering current user information',
      'Discovering program stages',
      'Discovering registration form',
      'You are about to delete all information related to this tracked entity instance, are you sure?',
      'Yes',
      'No',
      'Deleting all information related to this tracked entity instance'
    ];
  }
}
