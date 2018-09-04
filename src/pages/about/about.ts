import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { AboutProvider } from '../../providers/about/about';
import { AppProvider } from '../../providers/app/app';
import { DataValuesProvider } from '../../providers/data-values/data-values';
import { UserProvider } from '../../providers/user/user';
import { TrackerCaptureProvider } from '../../providers/tracker-capture/tracker-capture';
import { EventCaptureFormProvider } from '../../providers/event-capture-form/event-capture-form';
import { AppTranslationProvider } from '../../providers/app-translation/app-translation';

/**
 * Generated class for the AboutPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage implements OnInit {
  logoUrl: string;
  currentUser: any;
  appInformation: any;
  systemInfo: any;
  loadingMessage: string;
  isLoading: boolean = true;
  hasAllDataBeenLoaded: boolean = false;
  aboutContents: Array<any>;
  isAboutContentOpen: any = {};
  dataValuesStorage: any = { online: 0, offline: 0 };
  eventsStorage: any = { online: 0, offline: 0 };
  eventsForTrackerStorage: any = { online: 0, offline: 0 };
  enrollmentStorage: any = { online: 0, offline: 0 };
  translationMapper: any;

  constructor(
    public navCtrl: NavController,
    private appProvider: AppProvider,
    private trackerCaptureProvider: TrackerCaptureProvider,
    private eventCaptureFormProvider: EventCaptureFormProvider,
    private aboutProvider: AboutProvider,
    private dataValuesProvider: DataValuesProvider,
    private userProvider: UserProvider,
    private appTranslation: AppTranslationProvider
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.logoUrl = 'assets/img/logo.png';
    this.translationMapper = {};
    this.aboutContents = this.aboutProvider.getAboutContentDetails();
    this.appTranslation.getTransalations(this.getValuesToTranslate()).subscribe(
      (data: any) => {
        this.translationMapper = data;
        this.loadingUserInformation();
      },
      error => {
        this.loadingUserInformation();
      }
    );
  }

  loadingUserInformation() {
    let key = 'Discovering app information';
    this.loadingMessage = this.translationMapper[key]
      ? this.translationMapper[key]
      : key;
    this.userProvider.getCurrentUser().subscribe(
      (currentUser: any) => {
        this.currentUser = currentUser;
        this.loadAllData();
      },
      error => {
        this.isLoading = false;
        this.appProvider.setNormalNotification(
          'Failed to discover user information'
        );
      }
    );
  }

  loadAllData() {
    this.hasAllDataBeenLoaded = false;
    this.aboutProvider.getAppInformation().subscribe(
      appInformation => {
        this.appInformation = appInformation;
        let key = 'Discovering system information';
        this.loadingMessage = this.translationMapper[key]
          ? this.translationMapper[key]
          : key;
        this.aboutProvider.getSystemInformation().subscribe(
          systemInfo => {
            this.systemInfo = systemInfo;
            if (this.aboutContents.length > 0) {
              if (
                this.isAboutContentOpen &&
                !this.isAboutContentOpen[this.aboutContents[0].id]
              ) {
                this.toggleAboutContents(this.aboutContents[0]);
              }
            }
            this.loadingDataValueStatus();
          },
          error => {
            this.isLoading = false;
            console.log(JSON.stringify(error));
            this.appProvider.setNormalNotification(
              'Failed to discover system information'
            );
          }
        );
      },
      error => {
        this.isLoading = false;
        console.log(JSON.stringify(error));
        this.appProvider.setNormalNotification(
          'Failed to discover app information'
        );
      }
    );
  }

  ionViewDidEnter() {
    if (this.hasAllDataBeenLoaded) {
      this.loadAllData();
    }
  }

  toggleAboutContents(content) {
    if (content && content.id) {
      if (this.isAboutContentOpen[content.id]) {
        this.isAboutContentOpen[content.id] = false;
      } else {
        Object.keys(this.isAboutContentOpen).forEach(id => {
          this.isAboutContentOpen[id] = false;
        });
        this.isAboutContentOpen[content.id] = true;
      }
    }
  }

  loadingDataValueStatus() {
    let key = 'Discovering data values storage status';
    this.loadingMessage = this.translationMapper[key]
      ? this.translationMapper[key]
      : key;
    this.isLoading = true;
    this.dataValuesProvider
      .getDataValuesByStatus('synced', this.currentUser)
      .subscribe(
        (syncedDataValues: any) => {
          this.dataValuesProvider
            .getDataValuesByStatus('not-synced', this.currentUser)
            .subscribe(
              (unSyncedDataValues: any) => {
                this.dataValuesStorage.offline = unSyncedDataValues.length;
                this.dataValuesStorage.online = syncedDataValues.length;
                this.loadingEventStatus();
              },
              error => {
                console.log(JSON.stringify(error));
                this.appProvider.setNormalNotification(
                  'Failed to discover data values storage status'
                );
                this.isLoading = false;
              }
            );
        },
        error => {
          console.log(JSON.stringify(error));
          this.appProvider.setNormalNotification(
            'Failed to discover data values storage status'
          );
          this.isLoading = false;
        }
      );
  }

  loadingEventStatus() {
    let key = 'Discovering events storage status';
    this.loadingMessage = this.translationMapper[key]
      ? this.translationMapper[key]
      : key;
    this.eventCaptureFormProvider
      .getEventsByStatusAndType('synced', 'event-capture', this.currentUser)
      .subscribe(
        (events: any) => {
          this.eventsStorage.online = events.length;
          this.eventCaptureFormProvider
            .getEventsByStatusAndType(
              'not-synced',
              'event-capture',
              this.currentUser
            )
            .subscribe(
              (events: any) => {
                this.eventsStorage.offline = events.length;
                this.eventCaptureFormProvider
                  .getEventsByStatusAndType(
                    'synced',
                    'tracker-capture',
                    this.currentUser
                  )
                  .subscribe(
                    (events: any) => {
                      this.eventsForTrackerStorage.online = events.length;
                      this.eventCaptureFormProvider
                        .getEventsByStatusAndType(
                          'not-synced',
                          'tracker-capture',
                          this.currentUser
                        )
                        .subscribe(
                          (events: any) => {
                            this.eventsForTrackerStorage.offline =
                              events.length;
                            this.loadingEnrollmentStatus();
                          },
                          error => {
                            console.log(JSON.stringify(error));
                            this.appProvider.setNormalNotification(
                              'Failed to discover enrollments storage status'
                            );
                            this.isLoading = false;
                          }
                        );
                    },
                    error => {
                      console.log(JSON.stringify(error));
                      this.appProvider.setNormalNotification(
                        'Failed to discover enrollments storage status'
                      );
                      this.isLoading = false;
                    }
                  );
              },
              error => {
                console.log(JSON.stringify(error));
                this.appProvider.setNormalNotification(
                  'Failed to discover enrollments storage status'
                );
                this.isLoading = false;
              }
            );
        },
        error => {
          console.log(JSON.stringify(error));
          this.appProvider.setNormalNotification(
            'Failed to discover enrollments storage status'
          );
          this.isLoading = false;
        }
      );
  }

  loadingEnrollmentStatus() {
    let key = 'Discovering enrollments storage status';
    this.loadingMessage = this.translationMapper[key]
      ? this.translationMapper[key]
      : key;
    this.trackerCaptureProvider
      .getTrackedEntityInstanceByStatus('synced', this.currentUser)
      .subscribe((trackedEntityInstances: any) => {
        this.enrollmentStorage.online = trackedEntityInstances.length;
        this.trackerCaptureProvider
          .getTrackedEntityInstanceByStatus('not-synced', this.currentUser)
          .subscribe(
            (trackedEntityInstances: any) => {
              this.enrollmentStorage.offline = trackedEntityInstances.length;
              this.isLoading = false;
              this.hasAllDataBeenLoaded = true;
            },
            error => {
              console.log(JSON.stringify(error));
              this.appProvider.setNormalNotification(
                'Failed to discover enrollments storage status'
              );
            }
          );
      });
  }

  getValuesToTranslate() {
    return [
      'Discovering app information',
      'Discovering system information',
      'Discovering data values storage status',
      'Discovering events storage status',
      'Discovering enrollments storage status'
    ];
  }
}
