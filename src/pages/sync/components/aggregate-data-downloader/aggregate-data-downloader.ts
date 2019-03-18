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
import { Component, OnInit, Input } from '@angular/core';
import { AppProvider } from '../../../../providers/app/app';
import { UserProvider } from '../../../../providers/user/user';
import { CurrentUser } from '../../../../models';

@Component({
  selector: 'aggregate-data-downloader',
  templateUrl: 'aggregate-data-downloader.html'
})
export class AggregateDataDownloaderComponent implements OnInit {
  @Input() colorSettings;

  isFormReady: boolean;
  isLoading: boolean;
  dataSetIdsByUserRoles: Array<any>;
  currentUser: CurrentUser;

  selectedOrgUnit: any;
  selectedDataSet: any;
  selectedPeriod: any;
  dataDimension: any;
  constructor(
    private userProvider: UserProvider,
    private appProvider: AppProvider
  ) {
    this.isLoading = true;
  }

  ngOnInit() {
    this.userProvider.getCurrentUser().subscribe(
      (currentUser: any) => {
        this.currentUser = currentUser;
        this.userProvider.getUserData().subscribe((userData: any) => {
          this.dataSetIdsByUserRoles = userData.dataSets;
          this.isLoading = false;
        });
      },
      () => {
        this.isLoading = false;
        this.appProvider.setNormalNotification(
          'Failed to discover current user information'
        );
      }
    );
  }
  onAggregateParameterSelection(data) {
    const {
      selectedOrgUnit,
      selectedDataSet,
      selectedPeriod,
      dataDimension,
      isFormReady
    } = data;
    this.isFormReady = isFormReady;
    this.selectedDataSet = selectedDataSet;
    this.selectedOrgUnit = selectedOrgUnit;
    this.selectedPeriod = selectedPeriod;
    this.dataDimension = dataDimension;
  }

  downloadingAggegateData() {
    alert('here');
  }
}
