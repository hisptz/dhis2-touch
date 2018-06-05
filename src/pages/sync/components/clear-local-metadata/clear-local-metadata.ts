import { Component, OnInit } from '@angular/core';
import { SyncProvider } from '../../../../providers/sync/sync';
import { AppProvider } from '../../../../providers/app/app';
import { SqlLiteProvider } from '../../../../providers/sql-lite/sql-lite';
import { UserProvider } from '../../../../providers/user/user';
import { AlertController } from 'ionic-angular';
import { SyncPage } from '../../../../pages/sync/sync';
import { AppTranslationProvider } from '../../../../providers/app-translation/app-translation';

/**
 * Generated class for the ClearLocalMetadataComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'clear-local-metadata',
  templateUrl: 'clear-local-metadata.html'
})
export class ClearLocalMetadataComponent implements OnInit {
  resources: any;
  dataBaseStructure: any;
  currentUser: any;
  hasAllSelected: boolean;
  isLoading: boolean = false;
  loadingMessage: string = '';
  translationMapper: any;

  constructor(
    private syncProvider: SyncProvider,
    private appProvider: AppProvider,
    private sqLite: SqlLiteProvider,
    private user: UserProvider,
    private alertCtrl: AlertController,
    private syncPage: SyncPage,
    private appTranslation: AppTranslationProvider
  ) {}

  ngOnInit() {
    this.hasAllSelected = false;
    this.translationMapper = {};
    this.user.getCurrentUser().subscribe((user: any) => {
      this.currentUser = user;
    });
    this.resources = this.syncPage.resources;
    this.autoSelect('');
    this.appTranslation.getTransalations(this.getValuesToTranslate()).subscribe(
      (data: any) => {
        this.translationMapper = data;
      },
      error => {}
    );
  }

  autoSelect(selectType) {
    if (selectType == 'selectAll') {
      this.resources.forEach((resource: any) => {
        resource.status = true;
      });
      this.hasAllSelected = true;
    } else {
      this.resources.forEach((resource: any) => {
        resource.status = false;
      });
      this.hasAllSelected = false;
    }
  }

  verifyingDeleteOfResources() {
    let confirmAlert = this.alertCtrl.create({
      title: this.translationMapper['Clear local metadata confirmation'],
      message: this.translationMapper[
        'You are about to clear all selected items, Are you sure?'
      ],
      buttons: [
        {
          text: this.translationMapper['No'],
          role: 'cancel'
        },
        {
          text: this.translationMapper['Yes'],
          handler: () => {
            this.checkingForResourceToDelete();
          }
        }
      ]
    });
    confirmAlert.present();
  }

  checkingForResourceToDelete() {
    let resourcesToDelete = [];
    this.resources.forEach((resource: any) => {
      if (resource.status) {
        resourcesToDelete.push(resource.name);
        if (resource.dependentTable.length > 0) {
          resource.dependentTable.forEach((tableNames: any) => {
            resourcesToDelete.push(tableNames);
          });
        }
      }
    });
    if (resourcesToDelete.length == 0) {
      this.appProvider.setNormalNotification(
        'Please select at least one item to clear'
      );
    } else {
      this.deleteResources(resourcesToDelete);
      this.isLoading = true;
    }
  }

  deleteResources(resources) {
    this.loadingMessage = 'Clearing selected items';
    this.syncProvider
      .prepareTablesToApplyChanges(resources, this.currentUser)
      .subscribe(
        () => {
          this.loadingMessage = 'Applying updates to local storage';
          this.sqLite
            .generateTables(this.currentUser.currentDatabase)
            .subscribe(
              () => {
                this.autoSelect('un-selectAll');
                this.appProvider.setNormalNotification(
                  'All selected metadata has been cleared successfully'
                );
                this.isLoading = false;
              },
              error => {
                this.appProvider.setTopNotification(
                  'Failed to apply updates to local storage'
                );
              }
            );
        },
        error => {
          this.appProvider.setNormalNotification(
            'Failed to apply updates to local storage'
          );
          console.log(JSON.stringify(error));
        }
      );
  }

  trackByFn(index, item) {
    return item.id;
  }

  getValuesToTranslate() {
    return [
      'Select all',
      'Deselect all',
      'Clear metaData',
      'Clear local metadata confirmation',
      'You are about to clear all selected items, Are you sure?',
      'Yes',
      'No',
      'Clearing selected items',
      'Applying updates to local storage'
    ];
  }
}
