import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { ProfileProvider } from './providers/profile/profile';
import { AppProvider } from '../../providers/app/app';
import { AppTranslationProvider } from '../../providers/app-translation/app-translation';
import { UserProvider } from '../../providers/user/user';
import { CurrentUser } from '../../models/currentUser';
import { SettingsProvider } from '../../providers/settings/settings';

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
  profileInfoForm: any;
  dataEntrySettings: any;
  barcodeSettings: any;
  translationMapper: any;
  loadingMessage: string;
  isLoading: boolean = true;
  dataValuesSavingStatusClass: any;

  constructor(
    public navCtrl: NavController,
    private appProvider: AppProvider,
    private profileProvider: ProfileProvider,
    private appTranslation: AppTranslationProvider,
    private userProvider: UserProvider,
    private settingProvider: SettingsProvider
  ) {
    this.dataValuesSavingStatusClass = {};
    this.isLoading = true;
    this.translationMapper = {};
  }

  ngOnInit() {
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
        this.currentUser = currentUser;
        this.profileProvider.getSavedUserData(currentUser).subscribe(
          userData => {
            this.userData = userData;
            this.profileInfoForm = this.profileProvider.getProfileInfoForm();
            this.settingProvider.getSettingsForTheApp(currentUser).subscribe(
              appSettings => {
                this.barcodeSettings = appSettings.barcode;
                this.dataEntrySettings = appSettings.entryForm;
                this.isLoading = false;
                this.loadingMessage = '';
              },
              error => {
                this.isLoading = false;
                this.loadingMessage = '';
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

  updateProfileInformation(eventData) {
    const { data } = eventData;
    const { id } = eventData;
    this.profileProvider;
    console.log('data before : ' + JSON.stringify(data));
    this.userProvider.setProfileInformation(data).subscribe(
      () => {
        this.dataValuesSavingStatusClass[id] = 'input-field-container-success';
      },
      error => {
        console.log('On saving profile info : ' + JSON.stringify(error));
        this.dataValuesSavingStatusClass[id] = 'input-field-container-failed';
      }
    );
  }

  trackByFn(index, item) {
    return item && item.id ? item.id : index;
  }

  getValuesToTranslate() {
    return ['Discovering profile information'];
  }
}
