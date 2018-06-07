import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ActionSheetController,
  Content,
  IonicPage,
  ModalController,
  NavController,
  NavParams
} from 'ionic-angular';
import { TrackedEntityAttributeValuesProvider } from '../../../providers/tracked-entity-attribute-values/tracked-entity-attribute-values';
import { EventCaptureFormProvider } from '../../../providers/event-capture-form/event-capture-form';
import { AppProvider } from '../../../providers/app/app';
import { ProgramsProvider } from '../../../providers/programs/programs';
import { UserProvider } from '../../../providers/user/user';
import { OrganisationUnitsProvider } from '../../../providers/organisation-units/organisation-units';
import { TrackerCaptureProvider } from '../../../providers/tracker-capture/tracker-capture';
import { TrackedEntityInstancesProvider } from '../../../providers/tracked-entity-instances/tracked-entity-instances';
import { AppTranslationProvider } from '../../../providers/app-translation/app-translation';
import { SettingsProvider } from '../../../providers/settings/settings';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

/**
 * Generated class for the TrackedEntityDashboardPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tracked-entity-dashboard',
  templateUrl: 'tracked-entity-dashboard.html'
})
export class TrackedEntityDashboardPage implements OnInit {
  currentOrgUnit: any;
  currentProgram: any;
  currentUser: any;
  trackedEntityInstance: any;
  enrollment: any;
  programStages: Array<any>;
  programTrackedEntityAttributes: Array<any>;
  dataObject: any = {};
  trackedEntityAttributesSavingStatusClass: any;
  trackedEntityAttributeValuesObject: any = {};
  isLoading: boolean;
  loadingMessage: string;
  dashboardWidgets: Array<any>;
  isDashboardWidgetOpen: any;
  currentWidget: any;
  currentWidgetIndex: any;
  icons: any = {};
  translationMapper: any;
  trackerRegistrationForm: string;
  formLayout: string;
  private _dataUpdateStatus$: BehaviorSubject<{
    [elementId: string]: string;
  }> = new BehaviorSubject<{ [elementId: string]: string }>({});
  dataUpdateStatus$: Observable<{ [elementId: string]: string }>;
  @ViewChild(Content) content: Content;

  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private eventCaptureFormProvider: EventCaptureFormProvider,
    private userProvider: UserProvider,
    private appProvider: AppProvider,
    private programsProvider: ProgramsProvider,
    private trackerCaptureProvider: TrackerCaptureProvider,
    private organisationUnitsProvider: OrganisationUnitsProvider,
    private trackedEntityAttributeValuesProvider: TrackedEntityAttributeValuesProvider,
    private trackedEntityInstancesProvider: TrackedEntityInstancesProvider,
    private navParams: NavParams,
    private appTranslation: AppTranslationProvider,
    private settingProvider: SettingsProvider
  ) {
    this.dataUpdateStatus$ = this._dataUpdateStatus$.asObservable();
  }

  ngOnInit() {
    this.isDashboardWidgetOpen = {};
    this.trackedEntityAttributesSavingStatusClass = {};
    this.icons['menu'] = 'assets/icon/menu.png';
    this.isLoading = true;
    this.currentProgram = this.programsProvider.lastSelectedProgram;
    this.currentOrgUnit = this.organisationUnitsProvider.lastSelectedOrgUnit;
    this.dashboardWidgets = this.getDashboardWidgets();
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
    let trackedEntityInstancesId = this.navParams.get(
      'trackedEntityInstancesId'
    );
    let key = 'Discovering current user information';
    this.loadingMessage = this.translationMapper[key]
      ? this.translationMapper[key]
      : key;
    this.userProvider.getCurrentUser().subscribe(
      user => {
        this.currentUser = user;
        this.settingProvider.getSettingsForTheApp(user).subscribe(settings => {
          if (settings && settings.entryForm && settings.entryForm.formLayout) {
            this.formLayout = settings.entryForm.formLayout;
          }
        });
        this.loadTrackedEntityInstanceData(trackedEntityInstancesId);
      },
      error => {
        console.log(JSON.stringify(error));
        this.isLoading = false;
        this.appProvider.setNormalNotification(
          'Failed to discover current user information'
        );
      }
    );
  }

  loadTrackedEntityInstanceData(trackedEntityInstanceId) {
    let key = 'Discovering tracked entity';
    this.loadingMessage = this.translationMapper[key]
      ? this.translationMapper[key]
      : key;
    this.trackerCaptureProvider
      .getTrackedEntityInstance(trackedEntityInstanceId, this.currentUser)
      .subscribe(
        (response: any) => {
          this.trackedEntityInstance = response;
          if (response && response.attributes) {
            response.attributes.forEach((attributeObject: any) => {
              this.trackedEntityAttributeValuesObject[
                attributeObject.attribute
              ] =
                attributeObject.value;
              let id = attributeObject.attribute + '-trackedEntityAttribute';
              this.dataObject[id] = { id: id, value: attributeObject.value };
            });
          }
          this.loadingProgramStages(this.currentProgram.id, this.currentUser);
        },
        error => {
          console.log(JSON.stringify(error));
          this.isLoading = false;
          this.appProvider.setNormalNotification(
            'Failed to discover tracked entity'
          );
        }
      );
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
          if (this.dashboardWidgets.length > 0) {
            this.changeDashboardWidget(this.dashboardWidgets[0]);
          }
          this.loadTrackedEntityRegistration(programId, currentUser);
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
    let key = 'Discovering registration fields';
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
              },
              error => {
                this.isLoading = false;
                console.log(JSON.stringify(error));
                this.appProvider.setNormalNotification(
                  'Failed to discover registration entry form'
                );
              }
            );
          this.isLoading = false;
        },
        error => {
          this.isLoading = false;
          console.log(JSON.stringify(error));
          this.appProvider.setNormalNotification(
            'Failed to discover registration fields'
          );
        }
      );
  }

  deleteTrackedEntity(trackedEntityInstanceId) {
    const actionSheet = this.actionSheetCtrl.create({
      title: this.translationMapper[
        'You are about to delete all information related to this tracked entity instance, are you sure?'
      ],
      buttons: [
        {
          text: this.translationMapper['Yes'],
          handler: () => {
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
                    'Tracked entity instance has been delete successfully'
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
  }

  updateData(updateDataValue) {
    let id = updateDataValue.id.split('-')[0];
    this.trackedEntityAttributeValuesObject[id] = updateDataValue.value;
    let trackedEntityAttributeValues = [];
    Object.keys(this.trackedEntityAttributeValuesObject).forEach(key => {
      trackedEntityAttributeValues.push({
        value: this.trackedEntityAttributeValuesObject[key],
        attribute: key
      });
    });
    this.trackedEntityAttributeValuesProvider
      .savingTrackedEntityAttributeValues(
        this.trackedEntityInstance.id,
        trackedEntityAttributeValues,
        this.currentUser
      )
      .subscribe(
        () => {
          this.trackedEntityInstancesProvider
            .updateSavedTrackedEntityInstancesByStatus(
              [this.trackedEntityInstance],
              this.currentUser,
              'not-synced'
            )
            .subscribe(
              () => {
                this.dataObject[updateDataValue.id] = updateDataValue;
                this.trackedEntityAttributesSavingStatusClass[
                  updateDataValue.id
                ] =
                  'input-field-container-success';

                // Update status for custom form
                this._dataUpdateStatus$.next({
                  [updateDataValue.id + '-val']: 'OK'
                });
              },
              error => {
                this.trackedEntityAttributesSavingStatusClass[
                  updateDataValue.id
                ] =
                  'input-field-container-failed';
                console.log(JSON.stringify(error));

                // Update status for custom form
                this._dataUpdateStatus$.next({
                  [updateDataValue.id + '-val']: 'ERROR'
                });
              }
            );
        },
        error => {
          this.trackedEntityAttributesSavingStatusClass[updateDataValue.id] =
            'input-field-container-failed';
          console.log(JSON.stringify(error));

          // Update status for custom form
          this._dataUpdateStatus$.next({
            [updateDataValue.id + '-val']: 'ERROR'
          });
        }
      );
  }

  updateWidgetPagination(widgetIndex) {
    let widget = this.dashboardWidgets[widgetIndex];
    if (widget && widget.id) {
      this.changeDashboardWidget(widget);
    }
  }

  changeDashboardWidget(widget) {
    if (widget && widget.id) {
      this.currentWidgetIndex = this.dashboardWidgets.indexOf(widget);
      this.currentWidget = widget;
      if (!this.isDashboardWidgetOpen[widget.id]) {
        Object.keys(this.isDashboardWidgetOpen).forEach(id => {
          this.isDashboardWidgetOpen[id] = false;
        });
      }
      this.isDashboardWidgetOpen[widget.id] = true;
    }
  }

  openWidgetList() {
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

  trackByFn(index, item) {
    return item && item.id ? item.id : index;
  }

  getValuesToTranslate() {
    return [
      'Discovering current user information',
      'Discovering tracked entity',
      'Discovering program stages',
      'Discovering registration fields',
      'You are about to delete all information related to this tracked entity instance, are you sure?',
      'Yes',
      'No',
      'Deleting all information related to this tracked entity instance'
    ];
  }
}
