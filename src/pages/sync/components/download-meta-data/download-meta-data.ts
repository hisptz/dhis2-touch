import { Component, OnInit } from '@angular/core';
import { SyncProvider } from '../../../../providers/sync/sync';
import { AppProvider } from '../../../../providers/app/app';
import { SqlLiteProvider } from '../../../../providers/sql-lite/sql-lite';
import { UserProvider } from '../../../../providers/user/user';
import { SyncPage } from '../../../../pages/sync/sync';
import { AppTranslationProvider } from '../../../../providers/app-translation/app-translation';
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
  resources: any;
  dataBaseStructure: any;
  currentUser: any;
  hasAllSelected: boolean;
  isLoading: boolean = true;
  isUpdateProcessOnProgress: boolean;
  isOnLogin: boolean = false;
  processes: string[];

  constructor(
    private appProvider: AppProvider,
    private user: UserProvider,
    private encryptionProvider: EncryptionProvider
  ) {}

  ngOnInit() {
    this.hasAllSelected = false;
    this.user.getCurrentUser().subscribe((user: any) => {
      const { password } = user;
      const { isPasswordEncode } = user;
      const newPassord = isPasswordEncode
        ? this.encryptionProvider.decode(password)
        : password;
      this.currentUser = { ...user, password: newPassord };
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
    return resources;
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
    let resourceUpdated = [];
    this.resources.map((resource: any) => {
      if (resource.status) {
        resourceUpdated.push(resource.name);
      }
    });
    if (resourceUpdated.length == 0) {
      this.appProvider.setNormalNotification('Please select at least one item');
    } else {
      this.updateResources(resourceUpdated);
    }
  }

  updateResources(resources) {
    this.processes = resources;
    this.isLoading = true;
    this.isUpdateProcessOnProgress = true;
    console.log(resources);
  }

  onUpdateCurrentUser(currentUser) {
    this.currentUser = _.assign({}, this.currentUser, currentUser);
  }

  onCancelLoginProcess() {
    this.isLoading = false;
    this.isUpdateProcessOnProgress = false;
  }

  onFailLogin(errorReponse) {
    this.appProvider.setNormalNotification(errorReponse);
    this.onCancelLoginProcess();
  }

  onSuccessLogin(data) {
    const { currentUser } = data;
    this.isLoading = false;
    this.isUpdateProcessOnProgress = false;
    console.log(JSON.stringify(currentUser));
  }

  // updateResourcesOlds(resources) {
  //   let key = 'Downloading updates';
  //   this.loadingMessage = this.translationMapper[key]
  //     ? this.translationMapper[key]
  //     : key;
  //   this.syncProvider.downloadResources(resources, this.currentUser).subscribe(
  //     resourcesData => {
  //       this.syncProvider
  //         .prepareTablesToApplyChanges(resources, this.currentUser)
  //         .subscribe(
  //           () => {
  //             key = 'Preparing local storage for updates';
  //             this.loadingMessage = this.translationMapper[key]
  //               ? this.translationMapper[key]
  //               : key;
  //             this.sqLite
  //               .generateTables(this.currentUser.currentDatabase)
  //               .subscribe(
  //                 () => {
  //                   key = 'Applying updates';
  //                   this.loadingMessage = this.translationMapper[key]
  //                     ? this.translationMapper[key]
  //                     : key;
  //                   this.syncProvider
  //                     .savingResources(
  //                       resources,
  //                       resourcesData,
  //                       this.currentUser
  //                     )
  //                     .subscribe(
  //                       () => {
  //                         this.autoSelect('un-selectAll');
  //                         this.appProvider.setNormalNotification(
  //                           'All updates has been applied successfully'
  //                         );
  //                         this.showLoadingMessage = false;
  //                       },
  //                       error => {
  //                         this.appProvider.setNormalNotification(
  //                           'Failed to apply updates'
  //                         );
  //                         this.showLoadingMessage = false;
  //                       }
  //                     );
  //                 },
  //                 error => {
  //                   this.showLoadingMessage = false;
  //                   this.appProvider.setNormalNotification(
  //                     'Failed to prepare local storage for update'
  //                   );
  //                 }
  //               );
  //           },
  //           error => {
  //             this.showLoadingMessage = false;
  //             this.appProvider.setNormalNotification(
  //               'Failed to prepare local storage for update'
  //             );
  //             console.log(JSON.stringify(error));
  //           }
  //         );
  //     },
  //     error => {
  //       this.showLoadingMessage = false;
  //       this.appProvider.setNormalNotification('Failed to download updates');
  //       console.log(JSON.stringify(error));
  //     }
  //   );
  // }

  trackByFn(index, item) {
    return item && item.id ? item.id : index;
  }
}
