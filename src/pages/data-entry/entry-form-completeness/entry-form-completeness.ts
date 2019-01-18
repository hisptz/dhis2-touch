/*
 *
 * Copyright 2015 HISP Tanzania
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301, USA.
 *
 * @since 2015
 * @author Joseph Chingalo <profschingalo@gmail.com>
 *
 */
import { Component, OnInit } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';
import { DataSetCompletenessProvider } from '../../../providers/data-set-completeness/data-set-completeness';
import { AppProvider } from '../../../providers/app/app';
import { AppTranslationProvider } from '../../../providers/app-translation/app-translation';
import { Store } from '@ngrx/store';
import { State, getCurrentUserColorSettings } from '../../../store';
import { Observable } from 'rxjs';

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
  colorSettings$: Observable<any>;

  constructor(
    private store: Store<State>,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    private appProvider: AppProvider,
    private dataSetCompletenessProvider: DataSetCompletenessProvider,
    private appTranslation: AppTranslationProvider
  ) {
    this.isLoading = true;
    this.userInformation = [];
    this.colorSettings$ = this.store.select(getCurrentUserColorSettings);
  }

  ngOnInit() {
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
            'Failed to discover completeness information'
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

  trackByFn(index, item) {
    return item && item.id ? item.id : index;
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
