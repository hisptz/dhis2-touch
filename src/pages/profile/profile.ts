import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { ProfileProvider } from './providers/profile/profile';
import { AppProvider } from '../../providers/app/app';
import { AppTranslationProvider } from '../../providers/app-translation/app-translation';
import { UserProvider } from '../../providers/user/user';
import { CurrentUser } from '../../models/currentUser';

/**
 * Generated class for the ProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage implements OnInit {
  isProfileContentOpen: any;
  profileContents: Array<any>;
  userData: any;
  currentUser: CurrentUser;
  translationMapper: any;
  loadingMessage: string;
  isLoading: boolean = true;

  constructor(
    public navCtrl: NavController,
    private appProvider: AppProvider,
    private profileProvider: ProfileProvider,
    private appTranslation: AppTranslationProvider,
    private userProvider: UserProvider
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.translationMapper = {};
    this.appTranslation.getTransalations(this.getValuesToTranslate()).subscribe(
      (data: any) => {
        this.translationMapper = data;
        this.loadingProfileInformation();
      },
      error => {
        this.loadingProfileInformation();
      }
    );
  }

  loadingProfileInformation() {
    let key = 'Discovering profile information';
    this.loadingMessage = this.translationMapper[key]
      ? this.translationMapper[key]
      : key;
    this.isProfileContentOpen = {};
    this.profileContents = this.profileProvider.getProfileContentDetails();
    if (this.profileContents.length > 0) {
      this.toggleProfileContents(this.profileContents[0]);
    }
    this.userProvider.getCurrentUser().subscribe(
      currentUser => {
        this.profileProvider.getSavedUserData(currentUser).subscribe(
          userData => {
            this.userData = userData;
            this.isLoading = false;
            this.loadingMessage = '';
          },
          error => {
            this.isLoading = false;
            this.loadingMessage = '';
            console.log(JSON.stringify(error));
            this.appProvider.setNormalNotification(
              'Failed to discover profile information'
            );
          }
        );
      },
      error => {
        this.isLoading = false;
        this.loadingMessage = '';
        console.log(JSON.stringify(error));
        this.appProvider.setNormalNotification(
          'Failed to discover profile information'
        );
      }
    );
  }

  toggleProfileContents(content) {
    if (content && content.id) {
      if (this.isProfileContentOpen[content.id]) {
        this.isProfileContentOpen[content.id] = false;
      } else {
        Object.keys(this.isProfileContentOpen).forEach(id => {
          this.isProfileContentOpen[id] = false;
        });
        this.isProfileContentOpen[content.id] = true;
      }
    }
  }

  getValuesToTranslate() {
    return ['Discovering profile information'];
  }
}
