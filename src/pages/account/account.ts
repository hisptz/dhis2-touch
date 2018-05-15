import { Component, OnInit } from '@angular/core';
import { App, NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { UserProvider } from '../../providers/user/user';
import { OrganisationUnitsProvider } from '../../providers/organisation-units/organisation-units';
import { SynchronizationProvider } from '../../providers/synchronization/synchronization';

/**
 * Generated class for the AccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage implements OnInit {
  animationEffect: any;

  constructor(
    private navCtrl: NavController,
    private app: App,
    private organisationUnitProvider: OrganisationUnitsProvider,
    private userProvider: UserProvider,
    private synchronizationProvider: SynchronizationProvider
  ) {}

  ngOnInit() {
    this.animationEffect = {
      profile: '',
      about: '',
      help: '',
      logout: ''
    };
  }

  goToView(key) {
    this.applyAnimation(key);
    setTimeout(() => {
      if (key == 'profile') {
        this.setView('ProfilePage');
      } else if (key == 'about') {
        this.setView('AboutPage');
      } else if (key == 'help') {
        this.setView('HelpPage');
      }
    }, 60);
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
