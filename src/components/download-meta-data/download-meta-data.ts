import { Component, OnInit } from '@angular/core';
import { SyncProvider } from '../../providers/sync/sync';
import { AppProvider } from '../../providers/app/app';
import { SqlLiteProvider } from '../../providers/sql-lite/sql-lite';
import { UserProvider } from '../../providers/user/user';
import { SyncPage } from '../../pages/sync/sync';
import { AppTranslationProvider } from '../../providers/app-translation/app-translation';

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
  loadingData: boolean = false;
  showLoadingMessage: boolean = false;
  translationMapper: any;
  loadingMessage: string = '';

  constructor(
    private syncProvider: SyncProvider,
    private appProvider: AppProvider,
    private sqLite: SqlLiteProvider,
    private user: UserProvider,
    private syncPage: SyncPage,
    private appTranslation: AppTranslationProvider
  ) {}

  ngOnInit() {
    this.hasAllSelected = false;
    this.translationMapper = {};
    this.loadingData = true;
    this.user.getCurrentUser().subscribe((user: any) => {
      this.currentUser = user;
      this.loadingData = false;
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
        this.showLoadingMessage = true;
      }
    });
    if (resourceUpdated.length == 0) {
      this.appProvider.setNormalNotification('Please select at least one item');
    } else {
      this.updateResources(resourceUpdated);
    }
  }

  updateResources(resources) {
    let key = 'Downloading updates';
    this.loadingMessage = this.translationMapper[key]
      ? this.translationMapper[key]
      : key;
    this.syncProvider.downloadResources(resources, this.currentUser).subscribe(
      resourcesData => {
        this.syncProvider
          .prepareTablesToApplyChanges(resources, this.currentUser)
          .subscribe(
            () => {
              key = 'Preparing local storage for updates';
              this.loadingMessage = this.translationMapper[key]
                ? this.translationMapper[key]
                : key;
              this.sqLite
                .generateTables(this.currentUser.currentDatabase)
                .subscribe(
                  () => {
                    key = 'Applying updates';
                    this.loadingMessage = this.translationMapper[key]
                      ? this.translationMapper[key]
                      : key;
                    this.syncProvider
                      .savingResources(
                        resources,
                        resourcesData,
                        this.currentUser
                      )
                      .subscribe(
                        () => {
                          this.autoSelect('un-selectAll');
                          this.appProvider.setNormalNotification(
                            'All updates has been applied successfully'
                          );
                          this.showLoadingMessage = false;
                        },
                        error => {
                          this.appProvider.setNormalNotification(
                            'Failed to apply updates'
                          );
                          this.showLoadingMessage = false;
                        }
                      );
                  },
                  error => {
                    this.showLoadingMessage = false;
                    this.appProvider.setNormalNotification(
                      'Failed to prepare local storage for update'
                    );
                  }
                );
            },
            error => {
              this.showLoadingMessage = false;
              this.appProvider.setNormalNotification(
                'Failed to prepare local storage for update'
              );
              console.log(JSON.stringify(error));
            }
          );
      },
      error => {
        this.showLoadingMessage = false;
        this.appProvider.setNormalNotification('Failed to download updates');
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
      'Download metadata',
      'Downloading updates',
      'Preparing local storage for updates',
      'Applying updates'
    ];
  }
}
