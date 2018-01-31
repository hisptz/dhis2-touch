import {Component, OnInit} from '@angular/core';
import {AppProvider} from "../../providers/app/app";
import {AlertController} from "ionic-angular";
import {UserProvider} from "../../providers/user/user";
import {DataValuesProvider} from "../../providers/data-values/data-values";
import {TrackerCaptureProvider} from "../../providers/tracker-capture/tracker-capture";
import {EventCaptureFormProvider} from "../../providers/event-capture-form/event-capture-form";
import {Observable} from "rxjs/Observable";
import {TrackedEntityInstancesProvider} from "../../providers/tracked-entity-instances/tracked-entity-instances";
import {SqlLiteProvider} from "../../providers/sql-lite/sql-lite";

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
export class ClearLocalDataComponent implements OnInit{

  currentUser: any;
  selectedItems : any = {};
  isLoading : boolean;
  loadingMessage: string;
  itemsToBeDeleted : Array<string>;
  dataObject : any;

  constructor(public alertCtrl: AlertController,private sqlliteProvider : SqlLiteProvider,
              private dataValuesProvider : DataValuesProvider,private trackerCaptureProvider : TrackerCaptureProvider,
              private trackedEntityInstancesProvider : TrackedEntityInstancesProvider,
              private eventCaptureFormProvider : EventCaptureFormProvider,
              private appProvider: AppProvider, public user: UserProvider) {
  }

  ngOnInit(){
    this.isLoading = true;
    this.dataObject = {};
    this.itemsToBeDeleted = [];
    this.loadingMessage = "Loading user information";
    this.user.getCurrentUser().subscribe((user:any)=>{
      this.currentUser = user;
      this.loadingDataToDeleted();
    });
  }

  loadingDataToDeleted(){
    let promises = [];
    promises.push(
      this.dataValuesProvider.getAllDataValues(this.currentUser).subscribe((dataValues: any)=>{
        this.dataObject['dataValues'] = dataValues.length;
      })
    );
    promises.push(
      this.trackedEntityInstancesProvider.getAllTrackedEntityInstances(this.currentUser).subscribe((trackedEntityInstances : any)=>{
        this.dataObject["enrollments"] = trackedEntityInstances.length;
      })
    );
    promises.push(
      this.eventCaptureFormProvider.getAllEvents(this.currentUser).subscribe((events : any)=>{
        this.dataObject['events'] = 0;
        this.dataObject['eventsForTracker'] = 0;
        events.forEach((event : any)=>{
          if(event.eventType == 'event-capture'){
            this.dataObject.events ++;
          }else{
            this.dataObject.eventsForTracker ++;
          }
        });
      })
    );
    Observable.forkJoin(promises).subscribe(() => {
      this.isLoading = false;
    },(error) => {
      this.isLoading = false;
      this.appProvider.setNormalNotification("Fail to load data");
    });
  }

  updateItemsToBeDeleted(){
    this.itemsToBeDeleted = [];
    Object.keys(this.selectedItems).forEach((key: string)=>{
      if(this.selectedItems[key]){
        this.itemsToBeDeleted.push(key);
      }
    });
  }

  deleteSelectedItems(){
    let mapper = {
      eventsForTracker : "events for tracker",
      enrollments : "enrollments",
      dataValues : "aggregate data",
      events : "events",
    };
    let message = "You are about to clear ";
    let readableItems = [];
    this.itemsToBeDeleted.forEach((key)=>{
      readableItems.push(mapper[key]);
    });
    message += readableItems.join(', ') + ". Are you sure ?";
    let alert = this.alertCtrl.create();
    alert.setTitle('Clear offline data confirmation');
    alert.setMessage(message);
    alert.addButton({
        text: 'No',
        role: 'cancel',
        handler: ()=>{}
      });
    alert.addButton({
        text: 'Yes',
        handler:() =>{
          this.isLoading = true;
          this.loadingMessage = "Clearing local data, please wait...";
          this.clearingLocalData(this.itemsToBeDeleted);
        }
      }
    );
    alert.present();
  }

  clearingLocalData(itemsToBeDeleted){
    let promises = [];
    let shouldClearEventsTable = (itemsToBeDeleted.indexOf('eventsForTracker') > -1 && itemsToBeDeleted.indexOf('events'));
    itemsToBeDeleted.forEach((item : any)=>{
      if(item == "eventsForTracker" && !shouldClearEventsTable){
        promises.push(
          this.eventCaptureFormProvider.deleteEventByAttribute('eventType',['tracker-capture'],this.currentUser).subscribe(()=>{},error=>{})
        );
      }else if(item == "events" && !shouldClearEventsTable){
        promises.push(
          this.eventCaptureFormProvider.deleteEventByAttribute('eventType',['event-capture'],this.currentUser).subscribe(()=>{},error=>{})
        );
      }else if(item == "enrollments"){
        promises.push(
          this.trackerCaptureProvider.deleteAllTrackedEntityInstances(this.currentUser).subscribe(()=>{},error=>{})
        );
      }else if(item == "dataValues"){
        promises.push(
          this.dataValuesProvider.deleteAllDataValues(this.currentUser).subscribe(()=>{},error=>{})
        );
      }
    });
    if(shouldClearEventsTable){
      promises.push(
        this.eventCaptureFormProvider.deleteALLEvents(this.currentUser).subscribe(()=>{},error=>{})
      );
    }
    Observable.forkJoin(promises).subscribe(() => {
      setTimeout(()=>{
        this.sqlliteProvider.generateTables(this.currentUser.currentDatabase).subscribe(()=>{
          Object.keys(this.selectedItems).forEach((key: string)=>{
            this.selectedItems[key] = false;
          });
          this.loadingDataToDeleted();
          this.appProvider.setNormalNotification('All selected local data has been cleared successfully');
        },error=>{
          this.isLoading = false;
          this.appProvider.setNormalNotification("Fail to clear local data");
        });
      },500);
    },(error) => {
      this.isLoading = false;
      this.appProvider.setNormalNotification("Fail to clear local data");
    });
  }


}
