import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { ProfileProvider } from './providers/profile/profile';
import { AppProvider } from '../../providers/app/app';
import { AppTranslationProvider } from '../../providers/app-translation/app-translation';
import { UserProvider } from '../../providers/user/user';
import { CurrentUser } from '../../models/current-user';
import { SettingsProvider } from '../../providers/settings/settings';
import { EncryptionProvider } from '../../providers/encryption/encryption';
import * as _ from 'lodash';

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
  isPasswordFormValid: boolean;
  isUserPasswordUpdateProcessActive: boolean;
  passwordDataObject;

  constructor(
    public navCtrl: NavController,
    private appProvider: AppProvider,
    private profileProvider: ProfileProvider,
    private appTranslation: AppTranslationProvider,
    private userProvider: UserProvider,
    private settingProvider: SettingsProvider,
    private encryptionProvider: EncryptionProvider
  ) {
    this.dataValuesSavingStatusClass = {};
    this.passwordDataObject = {};
    this.isLoading = true;
    this.translationMapper = {};
    this.isPasswordFormValid = false;
    this.isUserPasswordUpdateProcessActive = false;
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

  updateUserPassword(newPassword) {
    this.isUserPasswordUpdateProcessActive = true;
    const payLoad = { userCredentials: { password: newPassword } };
    this.profileProvider.updateUserPassword(payLoad).subscribe(
      () => {
        this.currentUser.hashedKeyForOfflineAuthentication = this.encryptionProvider.getHashedKeyForOfflineAuthentication(
          this.currentUser
        );
        this.currentUser.authorizationKey = btoa(
          this.currentUser.username + ':' + this.currentUser.password
        );
        this.appProvider.setNormalNotification(
          'New password has been updated successfully'
        );
        const id: any = 'accountSetting';
        const matchContent: any = _.find(this.profileContents, { id: id });
        if (matchContent) {
          this.toggleProfileContents(matchContent);
        }
        setTimeout(() => {
          this.currentUser.password = this.encryptionProvider.encode(
            newPassword
          );
          this.userProvider
            .setCurrentUser(this.currentUser)
            .subscribe(() => {}, () => {});
        }, 100);
      },
      error => {
        this.appProvider.setNormalNotification(error);
        this.isUserPasswordUpdateProcessActive = false;
      }
    );
  }

  passwordFormFieldUpdate(data) {
    const { id } = data;
    const { value } = data;
    this.passwordDataObject[id] = value;
    const oldPassword = this.passwordDataObject['oldPassword'];
    const newPassword = this.passwordDataObject['newPassword'];
    const newPasswordConfirmation = this.passwordDataObject[
      'newPasswordConfirmation'
    ];
    const regexCapital = /^(?=.*[A-Z]).+$/;
    const regexSpecial = /^(?=.*[0-9_\W]).+$/;
    const regexNumberical = /^(?=.*[0-9]).+$/;
    let hasViolation = false;
    Object.keys(this.passwordDataObject).map(key => {
      if (!hasViolation) {
        if (key == 'oldPassword') {
          const encoddePassword = this.encryptionProvider.encode(oldPassword);
          const { password } = this.currentUser;
          if (encoddePassword !== password) {
            hasViolation = true;
            this.appProvider.setNormalNotification(
              'Old password is not correct'
            );
          }
        } else if (key == 'newPassword') {
          if (oldPassword) {
            if (newPassword && newPassword === oldPassword) {
              hasViolation = true;
              this.appProvider.setNormalNotification(
                'New password and old password should not be equal'
              );
            } else if (newPassword && newPassword !== oldPassword) {
              if (newPassword.length < 8) {
                hasViolation = true;
                this.appProvider.setNormalNotification(
                  'New password should be at least 8 characters'
                );
              } else if (!regexNumberical.test(newPassword)) {
                hasViolation = true;
                this.appProvider.setNormalNotification(
                  'New password should be at least with at least 1 digit '
                );
              } else if (!regexSpecial.test(newPassword)) {
                hasViolation = true;
                this.appProvider.setNormalNotification(
                  'New password should be at  least 1 special character'
                );
              } else if (!regexCapital.test(newPassword)) {
                hasViolation = true;
                this.appProvider.setNormalNotification(
                  'New password should be at least 1 uppercase letter'
                );
              }
            }
          }
        } else if (key == 'newPasswordConfirmation') {
          if (
            newPassword &&
            newPasswordConfirmation &&
            newPassword !== newPasswordConfirmation
          ) {
            this.appProvider.setNormalNotification(
              'New password and New password confirmation should match'
            );
          }
        }
      }
    });
    this.isPasswordFormValid =
      Object.keys(this.passwordDataObject).length === 3 && !hasViolation;
  }

  trackByFn(index, item) {
    return item && item.id ? item.id : index;
  }

  getValuesToTranslate() {
    return ['Discovering profile information'];
  }
}
