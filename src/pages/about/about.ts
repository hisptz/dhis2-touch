import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import {AboutProvider} from "../../providers/about/about";
import {AppProvider} from "../../providers/app/app";
import {DataValuesProvider} from "../../providers/data-values/data-values";
import {UserProvider} from "../../providers/user/user";
import {TrackerCaptureProvider} from "../../providers/tracker-capture/tracker-capture";
import {EventCaptureFormProvider} from "../../providers/event-capture-form/event-capture-form";

/**
 * Generated class for the AboutPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage implements OnInit{

  logoUrl : string;
  currentUser: any;
  appInformation : any;
  systemInfo : any;
  loadingMessage : string;
  isLoading : boolean = true;
  hasAllDataBeenLoaded :boolean = false;
  aboutContents : Array<any>;
  isAboutContentOpen : any = {};
  dataValuesStorage : any = { online : 0,offline : 0};
  eventsStorage : any = { online : 0,offline : 0};
  eventsForTrackerStorage : any = { online : 0,offline : 0};
  enrollmentStorage : any = { online : 0,offline : 0};


  constructor(public navCtrl: NavController,
              private appProvider : AppProvider,private trackerCaptureProvider : TrackerCaptureProvider,
              private eventCaptureFormProvider : EventCaptureFormProvider,
              private aboutProvider : AboutProvider, private dataValuesProvider: DataValuesProvider, private userProvider: UserProvider) {
  }

  ngOnInit() {
    this.loadingMessage = 'Loading app information';
    this.isLoading = true;
    this.logoUrl = 'assets/img/logo.png';
    this.aboutContents = this.aboutProvider.getAboutContentDetails();
    this.userProvider.getCurrentUser().then((currentUser: any) => {
      this.currentUser = currentUser;
      this.loadAllData();
    }, error => {
      this.isLoading = false;
      this.appProvider.setNormalNotification("Fail to load user information");
    })
  }

  loadAllData(){
    this.hasAllDataBeenLoaded = false;
    this.aboutProvider.getAppInformation().then(appInformation => {
      this.appInformation = appInformation;
      this.loadingMessage = 'Loading system information';
      this.aboutProvider.getSystemInformation().then(systemInfo => {
        this.systemInfo = systemInfo;
        if (this.aboutContents.length > 0) {
          if(this.isAboutContentOpen && !this.isAboutContentOpen[this.aboutContents[0].id]){
            this.toggleAboutContents(this.aboutContents[0]);
          }
        }
        this.loadingDataValueStatus();
      }).catch(error => {
        this.isLoading = false;
        console.log(JSON.stringify(error));
        this.appProvider.setNormalNotification('Fail to load system information');
      });
    }).catch(error => {
      this.isLoading = false;
      console.log(JSON.stringify(error));
      this.appProvider.setNormalNotification('Fail to load app information');
    });
  }

  ionViewDidEnter(){
    if(this.hasAllDataBeenLoaded){
      this.loadAllData();
    }
  }

  toggleAboutContents(content){
    if(content && content.id){
      if(this.isAboutContentOpen[content.id]){
        this.isAboutContentOpen[content.id] = false;
      }else{
        Object.keys(this.isAboutContentOpen).forEach(id=>{
          this.isAboutContentOpen[id] = false;
        });
        this.isAboutContentOpen[content.id] = true;
      }
    }
  }

  loadingDataValueStatus(){
    this.loadingMessage = 'Loading data values storage status';
    this.isLoading = true;
    this.dataValuesProvider.getDataValuesByStatus("synced",this.currentUser).then((syncedDataValues : any)=>{
      this.dataValuesProvider.getDataValuesByStatus("not-synced",this.currentUser).then((unSyncedDataValues : any)=>{
        this.dataValuesStorage.offline = unSyncedDataValues.length;
        this.dataValuesStorage.online = syncedDataValues.length;
        this.loadingEventStatus();
      },error=>{
        console.log(JSON.stringify(error));
        this.appProvider.setNormalNotification('Fail to load data values storage status');
        this.isLoading = false;
      });
    },error=>{
      console.log(JSON.stringify(error));
      this.appProvider.setNormalNotification('Fail to load data values storage status');
      this.isLoading = false;
    });
  }

  loadingEventStatus(){
    this.loadingMessage = "Loading events storage status";
    this.eventCaptureFormProvider.getEventsByStatusAndType('synced','event-capture',this.currentUser).then((events : any)=>{
      this.eventsStorage.online = events.length;
      this.eventCaptureFormProvider.getEventsByStatusAndType('not-synced','event-capture',this.currentUser).then((events : any)=>{
        this.eventsStorage.offline = events.length;
        this.eventCaptureFormProvider.getEventsByStatusAndType('synced','tracker-capture',this.currentUser).then((events : any)=>{
          this.eventsForTrackerStorage.online = events.length;
          this.eventCaptureFormProvider.getEventsByStatusAndType('not-synced','tracker-capture',this.currentUser).then((events : any)=>{
            this.eventsForTrackerStorage.offline = events.length;
            this.loadingEnrollmentStatus();
          }).catch(error=>{
            console.log(JSON.stringify(error));
            this.appProvider.setNormalNotification('Fail to load enrollments storage status');
            this.isLoading = false;
          });
        }).catch(error=>{
          console.log(JSON.stringify(error));
          this.appProvider.setNormalNotification('Fail to load enrollments storage status');
          this.isLoading = false;
        });
      }).catch(error=>{
        console.log(JSON.stringify(error));
        this.appProvider.setNormalNotification('Fail to load enrollments storage status');
        this.isLoading = false;
      });
    }).catch(error=>{
      console.log(JSON.stringify(error));
      this.appProvider.setNormalNotification('Fail to load enrollments storage status');
      this.isLoading = false;
    });
  }

  loadingEnrollmentStatus(){
    this.loadingMessage = "Loading enrollments storage status";
    this.trackerCaptureProvider.getTrackedEntityInstanceByStatus('synced',this.currentUser).then((trackedEntityInstances : any)=>{
      this.enrollmentStorage.online = trackedEntityInstances.length;
      this.trackerCaptureProvider.getTrackedEntityInstanceByStatus('not-synced',this.currentUser).then((trackedEntityInstances : any)=>{
        this.enrollmentStorage.offline = trackedEntityInstances.length;
        this.isLoading = false;
        this.hasAllDataBeenLoaded = true;
      }).catch(error=>{
        console.log(JSON.stringify(error));
        this.appProvider.setNormalNotification('Fail to load enrollments storage status');
      }).catch(error=>{
        console.log(JSON.stringify(error));
        this.appProvider.setNormalNotification('Fail to load enrollments storage status');
        this.isLoading = false;
      });
    });
  }

}
