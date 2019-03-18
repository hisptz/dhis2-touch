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
import { IonicPage, ModalController, NavController } from 'ionic-angular';
import { OrganisationUnitsProvider } from '../../providers/organisation-units/organisation-units';
import { UserProvider } from '../../providers/user/user';
import { AppProvider } from '../../providers/app/app';
import { DataSetsProvider } from '../../providers/data-sets/data-sets';
import { PeriodSelectionProvider } from '../../providers/period-selection/period-selection';
import { AppTranslationProvider } from '../../providers/app-translation/app-translation';
import { Store } from '@ngrx/store';
import { State, getCurrentUserColorSettings } from '../../store';
import { Observable } from 'rxjs';

/**
 * Generated class for the DataEntryPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-data-entry',
  templateUrl: 'data-entry.html'
})
export class DataEntryPage implements OnInit {
  currentUser: any;
  isLoading: boolean;
  loadingMessage: string;
  isFormReady: boolean;
  dataSetIdsByUserRoles: Array<any>;
  colorSettings$: Observable<any>;

  constructor(
    private store: Store<State>,
    private navCtrl: NavController,
    private userProvider: UserProvider,
    private appProvider: AppProvider
  ) {
    this.isLoading = true;
    this.colorSettings$ = this.store.select(getCurrentUserColorSettings);
  }

  ngOnInit() {
    this.loadingMessage = 'Discovering current user information';
    this.userProvider.getCurrentUser().subscribe(
      (currentUser: any) => {
        this.currentUser = currentUser;
        this.userProvider.getUserData().subscribe((userData: any) => {
          this.dataSetIdsByUserRoles = userData.dataSets;
          this.isLoading = false;
        });
      },
      error => {
        this.isLoading = false;
        this.loadingMessage = '';
        this.appProvider.setNormalNotification(
          'Failed to discover current user information'
        );
      }
    );
  }

  openDataEntryForm() {
    let parameter = {
      orgUnit: { id: this.selectedOrgUnit.id, name: this.selectedOrgUnit.name },
      dataSet: { id: this.selectedDataSet.id, name: this.selectedDataSet.name },
      period: { iso: this.selectedPeriod.iso, name: this.selectedPeriod.name }
      // dataDimension: this.getDataDimensions()
    };
    this.navCtrl.push('DataEntryFormPage', { parameter: parameter });
  }
}
