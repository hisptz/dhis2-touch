import {Component, OnInit} from '@angular/core';
import {UserProvider} from "../../providers/user/user";
import {AppProvider} from "../../providers/app/app";
import {SyncProvider} from "../../providers/sync/sync";
import {ModalController} from "ionic-angular";
import {DataValuesProvider} from "../../providers/data-values/data-values";
import {TrackerCaptureProvider} from "../../providers/tracker-capture/tracker-capture";
import {EnrollmentsProvider} from "../../providers/enrollments/enrollments";
import {EventCaptureFormProvider} from "../../providers/event-capture-form/event-capture-form";
import {Observable} from "rxjs/Observable";

/**
 * Generated class for the UploadViaInternetComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'upload-data-via-internet',
  templateUrl: 'upload-via-internet.html'
})
export class UploadViaInternetComponent implements OnInit{


  currentUser: any;
  selectedItems : any = {};
  isLoading : boolean;
  loadingMessage: string;
  itemsToUpload : Array<string>;
  importSummaries : any;
  dataObject : any;

  //private dataValuesProvider : DataValuesProvider,private trackerCaptureProvider : TrackerCaptureProvider,
  //private enrollmentsProvider : EnrollmentsProvider, eventCaptureFormProvider : EventCaptureFormProvider,

  constructor(private syncProvider : SyncProvider,private modalCtrl : ModalController,
              private dataValuesProvider : DataValuesProvider,private trackerCaptureProvider : TrackerCaptureProvider,
              private enrollmentsProvider : EnrollmentsProvider, private eventCaptureFormProvider : EventCaptureFormProvider,
              private appProvider: AppProvider, public user: UserProvider) {
  }

  ngOnInit(){
    this.isLoading = true;
    this.itemsToUpload = [];
    this.dataObject = {};
    this.loadingMessage = "Loading user information";
    this.importSummaries = null;
    this.user.getCurrentUser().then((user:any)=>{
      this.currentUser = user;
      this.loadingDataToUpload();
    },error=>{
    });
  }

  loadingDataToUpload(){
    let status = "not-synced";
    let promises = [];
    promises.push(
      this.dataValuesProvider.getDataValuesByStatus(status,this.currentUser).then((dataValues: any)=>{
        this.dataObject['dataValues'] = dataValues;
      })
    );
    promises.push(
      this.trackerCaptureProvider.getTrackedEntityInstanceByStatus(status,this.currentUser).then((trackedEntityInstances : any)=>{
        this.dataObject["Enrollments"] = trackedEntityInstances;
      })
    );
    promises.push(
      this.eventCaptureFormProvider.getEventsByAttribute('syncStatus',[status],this.currentUser).then((events : any)=>{
        this.dataObject['events'] = [];
        this.dataObject['eventsForTracker'] = [];
        events.forEach((event : any)=>{
          if(event.eventType == 'event-capture'){
            this.dataObject.events.push(event);
          }else{
            this.dataObject.eventsForTracker.push(event);
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

  updateItemsToUpload(){
    this.itemsToUpload = [];
    Object.keys(this.selectedItems).forEach((key: string)=>{
      if(this.selectedItems[key]){
        this.itemsToUpload.push(key);
      }
    });
  }

  uploadData(){
    this.loadingMessage = "Loading data to be uploaded";
    this.isLoading = true;
    let promises = [];
    this.importSummaries = {};
    let keys = [];
    //aggregate data values
    if(this.itemsToUpload.indexOf('dataValues') > -1){
      let formattedDataValues = this.dataValuesProvider.getFormattedDataValueForUpload(this.dataObject['dataValues']);
      promises.push(
        this.dataValuesProvider.uploadDataValues(formattedDataValues,this.dataObject['dataValues'],this.currentUser).then(importSummaries=>{
          keys.push("dataValues");
          this.importSummaries['dataValues'] = importSummaries
        }).catch(error=>{
          console.log("Error " + JSON.stringify(error));
        })
      );
    }
    //tracked entity instances and enrollments
    if(this.itemsToUpload.indexOf('Enrollments') > -1){
      promises.push(
        this.trackerCaptureProvider.uploadTrackedEntityInstancesToServer(this.dataObject['Enrollments'],this.dataObject['Enrollments'],this.currentUser).then((response : any)=>{
          this.importSummaries["trackedEntityInstances"] = response.importSummaries;
          keys.push("trackedEntityInstances");
          this.enrollmentsProvider.getSavedEnrollmentsByAttribute('trackedEntityInstance',response.trackedEntityInstanceIds,this.currentUser).then((enrollments: any)=>{
            if(enrollments.length > 0){
              this.trackerCaptureProvider.uploadEnrollments(enrollments,this.currentUser).then((importSummaries)=>{
                this.importSummaries["Enrollments"] = importSummaries;
                keys.push("Enrollments");
                this.eventCaptureFormProvider.uploadEventsToSever(this.dataObject['eventsForTracker'],this.currentUser).then((importSummaries)=>{
                  this.importSummaries["eventsForTracker"] = importSummaries;
                  keys.push("eventsForTracker");
                }).catch(()=>{});
              }).catch(error=>{});
            }
          }).catch(()=>{})
        }).catch(error=>{})
      );
    }
    //events for tracker
    if(this.itemsToUpload.indexOf('eventsForTracker') > -1 && this.itemsToUpload.indexOf('Enrollments') == -1){
      promises.push(
        this.eventCaptureFormProvider.uploadEventsToSever(this.dataObject['eventsForTracker'],this.currentUser).then((importSummaries)=>{
          this.importSummaries['eventsForTracker'] = importSummaries;
          keys.push("eventsForTracker");
        }).catch(()=>{})
      );
    }
    //events for event capture
    if(this.itemsToUpload.indexOf('events') > -1){
      promises.push(
        this.eventCaptureFormProvider.uploadEventsToSever(this.dataObject['events'],this.currentUser).then((importSummaries)=>{
          this.importSummaries['events'] = importSummaries;
          keys.push("events");
        }).catch(()=>{})
      );
    }

    Observable.forkJoin(promises).subscribe(() => {
      this.isLoading = false;
      this.viewUploadImportSummaries(keys);
    },(error) => {
      this.isLoading = false;
      this.appProvider.setNormalNotification("Fail to upload data");
    });
  }

  viewUploadImportSummaries(keys){
    if(this.importSummaries){
      let modal = this.modalCtrl.create('ImportSummariesPage',{importSummaries : this.importSummaries,keys : keys});
      modal.onDidDismiss(()=>{

      });
      modal.present();
    }
  }


}
