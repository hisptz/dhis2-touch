import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, ModalOptions } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { AppProvider } from '../../providers/app/app';

/**
 * Generated class for the AppsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

interface AppItem {
  id: string;
  name: string;
  src: string;
  pageName: string;
  authorites: Array<string>;
}

@Component({
  selector: 'page-apps',
  templateUrl: 'apps.html'
})
export class AppsPage implements OnInit {
  animationEffect: any;
  authorizedApps: Array<AppItem>;

  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private userProvider: UserProvider,
    private appProvider: AppProvider
  ) {
    this.authorizedApps = [];
    this.animationEffect = {
      data_entry: '',
      event_capture: '',
      reports: '',
      dashboard: '',
      tracker_capture: '',
      sync: '',
      settings: ''
    };
  }

  ngOnInit() {
    this.userProvider.getCurrentUser().subscribe(
      currentUser => {
        const appItems = this.getAppItems();
        this.setAuthorizedApps(appItems, currentUser);
      },
      error => {
        this.appProvider.setNormalNotification('Fail to discover current user');
      }
    );
  }

  setAuthorizedApps(appItems, currentUser) {
    // @todo filter apps based on app authorites
    this.authorizedApps = appItems;
  }

  goToView(appItem: AppItem) {
    this.applyAnimation(appItem.id);
    setTimeout(() => {
      this.setView(appItem.pageName);
    }, 50);
  }

  setView(viewName) {
    this.navCtrl.push(viewName).then(() => {});
  }

  applyAnimation(key: any) {
    this.animationEffect[key] = 'animated bounceIn';
    setTimeout(() => {
      this.animationEffect[key] = '';
    }, 50);
  }

  trackByFn(index, item) {
    return item.id;
  }

  getAppItems(): Array<AppItem> {
    return [
      {
        id: 'data_entry',
        name: 'Data entry',
        authorites: [],
        pageName: 'DataEntryPage',
        src: 'assets/icon/data-entry.png'
      },
      {
        id: 'event_capture',
        name: 'Event capture',
        authorites: [],
        pageName: 'EventCapturePage',
        src: 'assets/icon/event-capture.png'
      },
      {
        id: 'tracker_capture',
        name: 'Tracker capture',
        authorites: [],
        pageName: 'TrackerCapturePage',
        src: 'assets/icon/tracker-capture.png'
      },
      {
        id: 'dashboard',
        name: 'Dashboard',
        authorites: [],
        pageName: 'DashboardPage',
        src: 'assets/icon/dashboard.png'
      },
      {
        id: 'reports',
        name: 'Reports',
        authorites: [],
        pageName: 'ReportsPage',
        src: 'assets/icon/reports.png'
      },
      {
        id: 'sync',
        name: 'Sync',
        authorites: [],
        pageName: 'SyncPage',
        src: 'assets/icon/sync.png'
      },
      {
        id: 'settings',
        name: 'Settings',
        authorites: [],
        pageName: 'SettingsPage',
        src: 'assets/icon/settings.png'
      }
    ];
  }
}
