import { Component, OnInit } from '@angular/core';
import { App, NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { UserProvider } from '../../providers/user/user';
import { OrganisationUnitsProvider } from '../../providers/organisation-units/organisation-units';
import { SynchronizationProvider } from '../../providers/synchronization/synchronization';
import { AppProvider } from '../../providers/app/app';

/**
 * Generated class for the AccountPage page.
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
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage implements OnInit {
  animationEffect: any;
  authorizedApps: Array<AppItem>;

  constructor(
    private navCtrl: NavController,
    private app: App,
    private organisationUnitProvider: OrganisationUnitsProvider,
    private userProvider: UserProvider,
    private synchronizationProvider: SynchronizationProvider,
    private appProvider: AppProvider
  ) {
    this.authorizedApps = [];
    this.animationEffect = {
      profile: '',
      about: '',
      help: '',
      logout: ''
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
    }, 100);
  }

  trackByFn(index, item) {
    return item.id;
  }

  getAppItems(): Array<AppItem> {
    return [
      {
        id: 'profile',
        name: 'Profile',
        authorites: [],
        pageName: 'ProfilePage',
        src: 'assets/icon/profile.png'
      },
      {
        id: 'about',
        name: 'About',
        authorites: [],
        pageName: 'AboutPage',
        src: 'assets/icon/about.png'
      },
      {
        id: 'help',
        name: 'Help',
        authorites: [],
        pageName: 'HelpPage',
        src: 'assets/icon/help.png'
      }
    ];
  }

  async logOut() {
    try {
      this.applyAnimation('logout');
      this.userProvider.getCurrentUser().subscribe(user => {
        user.isLogin = false;
        this.userProvider.setCurrentUser(user).subscribe(() => {
          this.organisationUnitProvider.resetOrganisationUnit();
        });
        this.app.getRootNav().setRoot(LoginPage);
        this.synchronizationProvider.stopSynchronization();
      });
    } catch (e) {
      console.log(JSON.stringify(e));
    }
  }
}
