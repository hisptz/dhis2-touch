import { Component, OnInit } from '@angular/core';
import { AppProvider } from '../../../../providers/app/app';
import { AlertController } from 'ionic-angular';
import { UserProvider } from '../../../../providers/user/user';
import { DataValuesProvider } from '../../../../providers/data-values/data-values';
import { TrackerCaptureProvider } from '../../../../providers/tracker-capture/tracker-capture';
import { EventCaptureFormProvider } from '../../../../providers/event-capture-form/event-capture-form';
import { TrackedEntityInstancesProvider } from '../../../../providers/tracked-entity-instances/tracked-entity-instances';
import { SqlLiteProvider } from '../../../../providers/sql-lite/sql-lite';
import { AppTranslationProvider } from '../../../../providers/app-translation/app-translation';

/**
 * Generated class for the ClearLocalDataComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'clear-local-data',
  templateUrl: 'clear-local-data.html'
})
export class ClearLocalDataComponent implements OnInit {
  currentUser: any;
  selectedItems: any = {};
  isLoading: boolean;
  loadingMessage: string;
  itemsToBeDeleted: Array<string> = [];
  dataObject: any;
  translationMapper: any;

  constructor(
    public alertCtrl: AlertController,
    private sqlliteProvider: SqlLiteProvider,
    private dataValuesProvider: DataValuesProvider,
    private trackerCaptureProvider: TrackerCaptureProvider,
    private trackedEntityInstancesProvider: TrackedEntityInstancesProvider,
    private eventCaptureFormProvider: EventCaptureFormProvider,
    private appProvider: AppProvider,
    public user: UserProvider,
    private appTranslation: AppTranslationProvider
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.dataObject = {};
    this.itemsToBeDeleted = [];
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
    this.user.getCurrentUser().subscribe((user: any) => {
      this.currentUser = user;
      this.loadingDataToDeleted();
    });
  }

  loadingDataToDeleted() {
    this.dataValuesProvider.getAllDataValues(this.currentUser).subscribe(
      (dataValues: any) => {
        this.dataObject['dataValues'] = dataValues.length;
        this.eventCaptureFormProvider.getAllEvents(this.currentUser).subscribe(
          (events: any) => {
            this.dataObject['events'] = 0;
            this.dataObject['eventsForTracker'] = 0;
            events.forEach((event: any) => {
              if (event.eventType == 'event-capture') {
                this.dataObject.events++;
              } else {
                this.dataObject.eventsForTracker++;
              }
            });
            this.trackedEntityInstancesProvider
              .getAllTrackedEntityInstances(this.currentUser)
              .subscribe((trackedEntityInstances: any) => {
                this.dataObject['enrollments'] = trackedEntityInstances.length;
                this.isLoading = false;
              });
          },
          error => {
            this.isLoading = false;
            console.log('Failed to discover events');
          }
        );
      },
      error => {
        this.isLoading = false;
        console.log('Failed to discover data values');
      }
    );
  }

  updateItemsToBeDeleted() {
    this.itemsToBeDeleted = [];
    Object.keys(this.selectedItems).forEach((key: string) => {
      if (this.selectedItems[key]) {
        this.itemsToBeDeleted.push(key);
      }
    });
  }

  deleteSelectedItems() {
    let message = this.translationMapper[
      'You are about to clear all selected items, are you sure?'
    ];
    let title = this.translationMapper['Clear offline data confirmation'];
    let alert = this.alertCtrl.create();
    alert.setTitle(title);
    alert.setMessage(message);
    alert.addButton({
      text: 'No',
      role: 'cancel',
      handler: () => {}
    });
    alert.addButton({
      text: 'Yes',
      handler: () => {
        this.isLoading = true;
        let key = 'Clearing selected items';
        this.loadingMessage = this.translationMapper[key]
          ? this.translationMapper[key]
          : key;
        this.clearingLocalData(this.itemsToBeDeleted);
      }
    });
    alert.present();
  }

  clearingLocalData(itemsToBeDeleted) {
    console.log('itemsToBeDeleted');
    let completedProcess = 0;
    const shouldClearEventsTable =
      itemsToBeDeleted.indexOf('eventsForTracker') > -1 &&
      itemsToBeDeleted.indexOf('events') > -1;
    if (shouldClearEventsTable) {
      this.eventCaptureFormProvider.deleteALLEvents(this.currentUser).subscribe(
        () => {
          completedProcess += 2;
          if (completedProcess == itemsToBeDeleted.length) {
            this.updateStorageAfterClearing();
          }
        },
        error => {
          completedProcess += 2;
          if (completedProcess == itemsToBeDeleted.length) {
            this.updateStorageAfterClearing();
          }
        }
      );
    }
    for (let item of itemsToBeDeleted) {
      if (item == 'eventsForTracker' && !shouldClearEventsTable) {
        this.eventCaptureFormProvider
          .deleteEventByAttribute(
            'eventType',
            ['tracker-capture'],
            this.currentUser
          )
          .subscribe(
            () => {
              completedProcess += 1;
              if (completedProcess == itemsToBeDeleted.length) {
                this.updateStorageAfterClearing();
              }
            },
            error => {
              completedProcess += 1;
              if (completedProcess == itemsToBeDeleted.length) {
                this.updateStorageAfterClearing();
              }
            }
          );
      } else if (item == 'events' && !shouldClearEventsTable) {
        this.eventCaptureFormProvider
          .deleteEventByAttribute(
            'eventType',
            ['event-capture'],
            this.currentUser
          )
          .subscribe(
            () => {
              completedProcess += 1;
              if (completedProcess == itemsToBeDeleted.length) {
                this.updateStorageAfterClearing();
              }
            },
            error => {
              completedProcess += 1;
              if (completedProcess == itemsToBeDeleted.length) {
                this.updateStorageAfterClearing();
              }
            }
          );
      } else if (item == 'enrollments') {
        this.trackerCaptureProvider
          .deleteAllTrackedEntityInstances(this.currentUser)
          .subscribe(
            () => {
              completedProcess += 1;
              if (completedProcess == itemsToBeDeleted.length) {
                this.updateStorageAfterClearing();
              }
            },
            error => {
              completedProcess += 1;
              if (completedProcess == itemsToBeDeleted.length) {
                this.updateStorageAfterClearing();
              }
            }
          );
      } else if (item == 'dataValues') {
        this.dataValuesProvider.deleteAllDataValues(this.currentUser).subscribe(
          () => {
            completedProcess += 1;
            if (completedProcess == itemsToBeDeleted.length) {
              this.updateStorageAfterClearing();
            }
          },
          error => {
            completedProcess += 1;
            if (completedProcess == itemsToBeDeleted.length) {
              this.updateStorageAfterClearing();
            }
          }
        );
      }
    }
  }

  updateStorageAfterClearing() {
    setTimeout(() => {
      this.sqlliteProvider
        .generateTables(this.currentUser.currentDatabase)
        .subscribe(
          () => {
            Object.keys(this.selectedItems).forEach((key: string) => {
              this.selectedItems[key] = false;
            });
            this.loadingDataToDeleted();
            this.appProvider.setNormalNotification(
              'All selected items has been cleared successfully'
            );
          },
          error => {
            this.isLoading = false;
            this.appProvider.setNormalNotification(
              'Failed to clear selected items'
            );
          }
        );
    }, 500);
  }

  getValuesToTranslate() {
    return [
      'Aggregate data',
      'Events',
      'Events for tracker',
      'Enrollments',
      'Clear local data',
      'Discovering current user information',
      'Clear offline data confirmation',
      'You are about to clear all selected items, are you sure?',
      'Yes',
      'No',
      'Clearing selected items'
    ];
  }
}
