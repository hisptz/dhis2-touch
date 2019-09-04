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
import { Store } from '@ngrx/store';
import { State, getCurrentUserColorSettings } from '../../../store';
import { Observable } from 'rxjs';

@IonicPage()
@Component({
  selector: 'page-entry-form-completeness',
  templateUrl: 'entry-form-completeness.html'
})
export class EntryFormCompletenessPage implements OnInit {
  isLoading: boolean;
  loadingMessage: string;
  userInformation: Array<any>;
  colorSettings$: Observable<any>;

  constructor(
    private store: Store<State>,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    private appProvider: AppProvider,
    private dataSetCompletenessProvider: DataSetCompletenessProvider
  ) {
    this.isLoading = true;
    this.userInformation = [];
    this.colorSettings$ = this.store.select(getCurrentUserColorSettings);
  }

  ngOnInit() {
    this.loadingCompletenessInformation();
  }

  loadingCompletenessInformation() {
    this.loadingMessage = 'Discovering completeness information';
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
            key: 'Username',
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

  prepareUserInformation(user: any, username: string) {
    //@todo checking keys on future
    this.userInformation.push({
      key: 'Full name',
      value: user.firstName + ' ' + user.surname
    });
    this.userInformation.push({
      key: 'Username',
      value: username
    });
    if (user && user.email) {
      this.userInformation.push({
        key: 'E-mail',
        value: user.email
      });
    }
    if (user && user.phoneNumber) {
      this.userInformation.push({
        key: 'Phone number',
        value: user.phoneNumber
      });
    }
    if (user && user.organisationUnits) {
      let organisationUnits = [];
      user.organisationUnits.forEach((organisationUnit: any) => {
        organisationUnits.push(organisationUnit.name);
      });
      this.userInformation.push({
        key: 'Assigned organisation units',
        value: organisationUnits.join(', ')
      });
    }
    if (user && user.roles) {
      let roles = [];
      user.roles.forEach((role: any) => {
        roles.push(role.name);
      });
      this.userInformation.push({
        key: 'Assigned roles',
        value: roles.join(', ')
      });
    }
    this.isLoading = false;
  }

  trackByFn(index: any, item: any) {
    return item && item.id ? item.id : index;
  }
}
