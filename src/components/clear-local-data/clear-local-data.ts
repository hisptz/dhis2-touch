import { Component, OnInit } from "@angular/core";
import { AppProvider } from "../../providers/app/app";
import { AlertController } from "ionic-angular";
import { UserProvider } from "../../providers/user/user";
import { DataValuesProvider } from "../../providers/data-values/data-values";
import { TrackerCaptureProvider } from "../../providers/tracker-capture/tracker-capture";
import { EventCaptureFormProvider } from "../../providers/event-capture-form/event-capture-form";
import { TrackedEntityInstancesProvider } from "../../providers/tracked-entity-instances/tracked-entity-instances";
import { SqlLiteProvider } from "../../providers/sql-lite/sql-lite";

/**
 * Generated class for the ClearLocalDataComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: "clear-local-data",
  templateUrl: "clear-local-data.html"
})
export class ClearLocalDataComponent implements OnInit {
  currentUser: any;
  selectedItems: any = {};
  isLoading: boolean;
  loadingMessage: string;
  itemsToBeDeleted: Array<string> = [];
  dataObject: any;

  constructor(
    public alertCtrl: AlertController,
    private sqlliteProvider: SqlLiteProvider,
    private dataValuesProvider: DataValuesProvider,
    private trackerCaptureProvider: TrackerCaptureProvider,
    private trackedEntityInstancesProvider: TrackedEntityInstancesProvider,
    private eventCaptureFormProvider: EventCaptureFormProvider,
    private appProvider: AppProvider,
    public user: UserProvider
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.dataObject = {};
    this.itemsToBeDeleted = [];
    this.loadingMessage = "Loading user information";
    this.user.getCurrentUser().subscribe((user: any) => {
      this.currentUser = user;
      this.loadingDataToDeleted();
    });
  }

  loadingDataToDeleted() {
    this.dataValuesProvider.getAllDataValues(this.currentUser).subscribe(
      (dataValues: any) => {
        this.dataObject["dataValues"] = dataValues.length;
        this.eventCaptureFormProvider.getAllEvents(this.currentUser).subscribe(
          (events: any) => {
            this.dataObject["events"] = 0;
            this.dataObject["eventsForTracker"] = 0;
            events.forEach((event: any) => {
              if (event.eventType == "event-capture") {
                this.dataObject.events++;
              } else {
                this.dataObject.eventsForTracker++;
              }
            });
            this.trackedEntityInstancesProvider
              .getAllTrackedEntityInstances(this.currentUser)
              .subscribe((trackedEntityInstances: any) => {
                this.dataObject["enrollments"] = trackedEntityInstances.length;
                this.isLoading = false;
              });
          },
          error => {
            this.isLoading = false;
            console.log("Fail to loading events");
          }
        );
      },
      error => {
        this.isLoading = false;
        console.log("Fail to load data values");
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
    let mapper = {
      eventsForTracker: "events for tracker",
      enrollments: "enrollments",
      dataValues: "aggregate data",
      events: "events"
    };
    let message = "You are about to clear ";
    let readableItems = [];
    this.itemsToBeDeleted.forEach(key => {
      readableItems.push(mapper[key]);
    });
    message += readableItems.join(", ") + ". Are you sure ?";
    let alert = this.alertCtrl.create();
    alert.setTitle("Clear offline data confirmation");
    alert.setMessage(message);
    alert.addButton({
      text: "No",
      role: "cancel",
      handler: () => {}
    });
    alert.addButton({
      text: "Yes",
      handler: () => {
        this.isLoading = true;
        this.loadingMessage = "Clearing local data, please wait...";
        this.clearingLocalData(this.itemsToBeDeleted);
      }
    });
    alert.present();
  }

  clearingLocalData(itemsToBeDeleted) {
    let completedProcess = 0;
    let shouldClearEventsTable =
      itemsToBeDeleted.indexOf("eventsForTracker") > -1 &&
      itemsToBeDeleted.indexOf("events") > -1;
    if (shouldClearEventsTable) {
      this.eventCaptureFormProvider.deleteALLEvents(this.currentUser).subscribe(
        () => {
          completedProcess += 2;
          if (completedProcess == itemsToBeDeleted.length) {
            this.updateStorageAfterClearing();
          }
        },
        error => {}
      );
    }
    for (let item of itemsToBeDeleted) {
      if (item == "eventsForTracker" && !shouldClearEventsTable) {
        this.eventCaptureFormProvider
          .deleteEventByAttribute(
            "eventType",
            ["tracker-capture"],
            this.currentUser
          )
          .subscribe(
            () => {
              completedProcess += 1;
              if (completedProcess == itemsToBeDeleted.length) {
                this.updateStorageAfterClearing();
              }
            },
            error => {}
          );
      } else if (item == "events" && !shouldClearEventsTable) {
        this.eventCaptureFormProvider
          .deleteEventByAttribute(
            "eventType",
            ["event-capture"],
            this.currentUser
          )
          .subscribe(
            () => {
              completedProcess += 1;
              if (completedProcess == itemsToBeDeleted.length) {
                this.updateStorageAfterClearing();
              }
            },
            error => {}
          );
      } else if (item == "enrollments") {
        this.trackerCaptureProvider
          .deleteAllTrackedEntityInstances(this.currentUser)
          .subscribe(
            () => {
              completedProcess += 1;
              if (completedProcess == itemsToBeDeleted.length) {
                this.updateStorageAfterClearing();
              }
            },
            error => {}
          );
      } else if (item == "dataValues") {
        this.dataValuesProvider.deleteAllDataValues(this.currentUser).subscribe(
          () => {
            completedProcess += 1;
            if (completedProcess == itemsToBeDeleted.length) {
              this.updateStorageAfterClearing();
            }
          },
          error => {}
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
              "All selected local data has been cleared successfully"
            );
          },
          error => {
            this.isLoading = false;
            this.appProvider.setNormalNotification("Fail to clear local data");
          }
        );
    }, 500);
  }
}
