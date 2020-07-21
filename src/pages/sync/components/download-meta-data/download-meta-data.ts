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
import { DATABASE_STRUCTURE } from '../../../../models';
import * as _ from 'lodash';
import { EncryptionProvider } from '../../../../providers/encryption/encryption';
/**
 * Generated class for the DownloadMetaDataComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'download-meta-data',
  templateUrl: 'download-meta-data.html'
})
export class DownloadMetaDataComponent implements OnInit {
  @Input() colorSettings: any;

  resources: any;
  dataBaseStructure: any;
  currentUser: any;
  hasAllSelected: boolean;
  isLoading: boolean = true;
  isUpdateProcessOnProgress: boolean;
  isOnLogin: boolean = false;
  processes: string[];
  icons: any;

  constructor(
    private appProvider: AppProvider,
    private user: UserProvider,
    private encryptionProvider: EncryptionProvider
  ) {
    this.icons = {
      all: 'assets/icon/check-all.png',
      none: 'assets/icon/uncheck-all.png',
      reset: 'assets/icon/not-allowed.png',
      done: 'assets/icon/circle-tick.png'
    };
  }

  ngOnInit() {
    this.hasAllSelected = false;
    this.user.getCurrentUser().subscribe((user: any) => {
      const { password } = user;
      const { isPasswordEncode } = user;
      const newPassord = isPasswordEncode
        ? this.encryptionProvider.decode(password)
        : password;
      this.currentUser = {
        ...user,
        password: newPassord,
        isPasswordEncode: false
      };
      this.resources = this.getListOfResources();
      this.autoSelect('');
      this.isLoading = false;
    });
  }

  getListOfResources() {
    const resources = [];
    const dataBaseStructure = DATABASE_STRUCTURE;
    Object.keys(dataBaseStructure).forEach((resource: any) => {
      if (dataBaseStructure[resource].isMetadata) {
        resources.push({
          name: resource,
          displayName: dataBaseStructure[resource].displayName
            ? dataBaseStructure[resource].displayName
            : resource,
          status: false,
          dependentTable: dataBaseStructure[resource].dependentTable
        });
      }
    });
    return _.orderBy(resources, 'name', 'asc');
  }

  autoSelect(selectType) {
    if (selectType == 'selectAll') {
      this.resources.map((resource: any) => {
        resource.status = true;
      });
      this.hasAllSelected = true;
    } else {
      this.resources.map((resource: any) => {
        resource.status = false;
      });
      this.hasAllSelected = false;
    }
  }

  checkingForResourceUpdate() {
    const resources = _.flattenDeep([...[], this.resources]);
    const resourceUpdated = resources
      .filter((resource: any) => resource.status)
      .map(resource => resource.name);
    if (resourceUpdated.length == 0) {
      this.appProvider.setNormalNotification('Please select at least one item');
    } else {
      this.updateResources(resourceUpdated);
    }
  }

  updateResources(resources) {
    this.user.getCurrentUser().subscribe((user: any) => {
      const { password } = user;
      const { isPasswordEncode } = user;
      const newPassord = isPasswordEncode
        ? this.encryptionProvider.decode(password)
        : password;
      this.currentUser = {
        ...user,
        password: newPassord,
        isPasswordEncode: false
      };
      this.processes = resources;
      this.isLoading = true;
      this.isUpdateProcessOnProgress = true;
    });
  }

  onCancelLoginProcess() {
    this.isLoading = false;
    this.isUpdateProcessOnProgress = false;
  }

  onFailLogin(errorReponse) {
    const { failedProcesses, error, failedProcessesErrors } = errorReponse;
    if (error) {
      this.appProvider.setNormalNotification(error, 10000);
    } else if (failedProcesses && failedProcesses.length > 0) {
      let errorMessage = '';
      failedProcesses.map(process => {
        const error = failedProcessesErrors[failedProcesses.indexOf(process)];
        errorMessage +=
          (process.charAt(0).toUpperCase() + process.slice(1))
            .replace(/([A-Z])/g, ' $1')
            .trim() +
          ' : ' +
          this.appProvider.getSanitizedMessage(error) +
          '; ';
      });
      this.appProvider.setNormalNotification(errorMessage, 10000);
    }
    this.onCancelLoginProcess();
  }

  onSuccessLogin() {
    this.isLoading = false;
    this.isUpdateProcessOnProgress = false;
    const resources = _.flattenDeep([...[], this.resources]);
    const updatedResources = resources
      .filter((resource: any) => resource.status)
      .map(resource => resource.displayName)
      .join(', ');
    this.autoSelect('');
    const message =
      updatedResources.split(', ').length > 1
        ? `${updatedResources} have been updated successfully`
        : `${updatedResources} has been updated successfully`;
    this.appProvider.setNormalNotification(message);
  }

  trackByFn(index, item) {
    return item && item.id ? item.id : index;
  }
}
