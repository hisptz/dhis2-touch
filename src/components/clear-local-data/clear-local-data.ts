import {Component, OnInit} from '@angular/core';
import {AppProvider} from "../../providers/app/app";
import {AlertController, ModalController} from "ionic-angular";
import {UserProvider} from "../../providers/user/user";
import {DataValuesProvider} from "../../providers/data-values/data-values";
import {TrackerCaptureProvider} from "../../providers/tracker-capture/tracker-capture";
import {EnrollmentsProvider} from "../../providers/enrollments/enrollments";
import {EventCaptureFormProvider} from "../../providers/event-capture-form/event-capture-form";
import {Observable} from "rxjs/Observable";

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

  constructor(public alertCtrl: AlertController,private modalCtrl : ModalController,
              private dataValuesProvider : DataValuesProvider,private trackerCaptureProvider : TrackerCaptureProvider,
              private enrollmentsProvider : EnrollmentsProvider, private eventCaptureFormProvider : EventCaptureFormProvider,
              private appProvider: AppProvider, public user: UserProvider) {
  }

  ngOnInit(){
    this.isLoading = true;
    this.dataObject = {};
    this.loadingMessage = "Loading user information";
    this.user.getCurrentUser().then((user:any)=>{
      this.currentUser = user;
      this.loadingDataToDeleted();
    });
  }

  loadingDataToDeleted(){
    let status = "not-synced";
    let promises = [];
    promises.push(
      this.dataValuesProvider.getDataValuesByStatus(status,this.currentUser).then((dataValues: any)=>{
        this.dataObject['dataValues'] = dataValues.length;
      })
    );
    promises.push(
      this.trackerCaptureProvider.getTrackedEntityInstanceByStatus(status,this.currentUser).then((trackedEntityInstances : any)=>{
        this.dataObject["Enrollments"] = trackedEntityInstances.length;
      })
    );
    promises.push(
      this.eventCaptureFormProvider.getEventsByAttribute('syncStatus',[status],this.currentUser).then((events : any)=>{
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
      this.appProvider.setNormalNotification("Fail to load data for uploading");
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
    console.log(this.itemsToBeDeleted)
  }


}
