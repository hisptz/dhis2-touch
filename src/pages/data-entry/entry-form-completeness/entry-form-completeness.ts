import { Component, OnInit } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';
import { DataSetCompletenessProvider } from '../../../providers/data-set-completeness/data-set-completeness';
import { AppProvider } from '../../../providers/app/app';
import { AppTranslationProvider } from '../../../providers/app-translation/app-translation';

/**
 * Generated class for the EntryFormCompletenessPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-entry-form-completeness',
  templateUrl: 'entry-form-completeness.html'
})
export class EntryFormCompletenessPage implements OnInit {
  isLoading: boolean;
  loadingMessage: string;
  userInformation: Array<any>;
  translationMapper: any;

  constructor(
    public viewCtrl: ViewController,
    public navParams: NavParams,
    private appProvider: AppProvider,
    private dataSetCompletenessProvider: DataSetCompletenessProvider,
    private appTranslation: AppTranslationProvider
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.userInformation = [];
    this.appTranslation.getTransalations(this.getValuesToTranslate()).subscribe(
      (data: any) => {
        this.translationMapper = data;
        this.loadingCompletenessInformation();
      },
      error => {
        this.loadingCompletenessInformation();
      }
    );
  }

  loadingCompletenessInformation() {
    let key = 'Discovering completeness information';
    this.loadingMessage = this.translationMapper[key]
      ? this.translationMapper[key]
      : key;
    let currentUser = this.navParams.get('currentUser');
    let username = this.navParams.get('username');
    this.dataSetCompletenessProvider
      .getUserCompletenessInformation(username, currentUser)
      .subscribe(
        (userResponse: any) => {
          this.prepareUserInformation(userResponse.user, username);
        },
        error => {
          console.log(JSON.stringify(error));
          this.userInformation.push({
            key: this.translationMapper['Username'],
            value: username
          });
          this.isLoading = false;
          this.appProvider.setNormalNotification(
            'Fail to discover completeness information'
          );
        }
      );
  }

  dismiss() {
    this.viewCtrl.dismiss({});
  }

  prepareUserInformation(user, username) {
    //@todo checking keys on future
    this.userInformation.push({
      key: this.translationMapper['Full name'],
      value: user.firstName + ' ' + user.surname
    });
    this.userInformation.push({
      key: this.translationMapper['Username'],
      value: username
    });
    if (user && user.email) {
      this.userInformation.push({
        key: this.translationMapper['E-mail'],
        value: user.email
      });
    }
    if (user && user.phoneNumber) {
      this.userInformation.push({
        key: this.translationMapper['Phone number'],
        value: user.phoneNumber
      });
    }
    if (user && user.organisationUnits) {
      let organisationUnits = [];
      user.organisationUnits.forEach((organisationUnit: any) => {
        organisationUnits.push(organisationUnit.name);
      });
      this.userInformation.push({
        key: this.translationMapper['Assigned organisation units'],
        value: organisationUnits.join(', ')
      });
    }
    if (user && user.roles) {
      let roles = [];
      user.roles.forEach((role: any) => {
        roles.push(role.name);
      });
      this.userInformation.push({
        key: this.translationMapper['Assigned roles'],
        value: roles.join(', ')
      });
    }
    this.isLoading = false;
  }

  getValuesToTranslate() {
    return [
      'Discovering completeness information',
      'Username',
      'E-mail',
      'Phone number',
      'Assigned organisation units',
      'Assigned roles'
    ];
  }
}
