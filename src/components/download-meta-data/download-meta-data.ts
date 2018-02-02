import {Component, OnInit} from '@angular/core';
import {SyncProvider} from "../../providers/sync/sync";
import {AppProvider} from "../../providers/app/app";
import {SqlLiteProvider} from "../../providers/sql-lite/sql-lite";
import {UserProvider} from "../../providers/user/user";
import {SyncPage} from "../../pages/sync/sync";


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

  updateMetaDataLoadingMessages: string = "";

  constructor(private syncProvider: SyncProvider, private appProvider: AppProvider, private sqLite: SqlLiteProvider, private user: UserProvider,
              public syncPage: SyncPage) {

  }

  ngOnInit() {
    this.hasAllSelected = false;
    this.loadingData = true;
    this.user.getCurrentUser().subscribe((user: any) => {
      this.currentUser = user;
      this.loadingData = false;
    });
    this.resources = this.syncPage.resources;
    this.autoSelect("");
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

  checkingForResourceUpdate() {
    let resourceUpdated = [];
    this.resources.forEach((resource: any) => {
      if (resource.status) {
        resourceUpdated.push(resource.name);
        if(resource.dependentTable.length > 0){
          resource.dependentTable.forEach((tableName: any)=>{
            resourceUpdated.push(tableName)
          });
        }
        this.showLoadingMessage = true;
      }
    });
    if (resourceUpdated.length == 0) {
      this.appProvider.setNormalNotification("Please select at least one resources to update");
    } else {
      this.updateResources(resourceUpdated);
    }
  }

  updateResources(resources) {
    this.updateMetaDataLoadingMessages = "Downloading updates";
    this.syncProvider.downloadResources(resources, this.currentUser).subscribe((resourcesData) => {
      this.syncProvider.prepareTablesToApplyChanges(resources, this.currentUser).subscribe(() => {
        this.updateMetaDataLoadingMessages = "Deleting Selected MetaData Tables ";
        this.sqLite.generateTables(this.currentUser.currentDatabase).subscribe(() => {
            this.updateMetaDataLoadingMessages = "Applying updates ";
            this.syncProvider.savingResources(resources,resourcesData,this.currentUser).subscribe(()=>{
              this.autoSelect("un-selectAll");
              this.appProvider.setNormalNotification("All updates has been applied successfully.");
              this.showLoadingMessage = false;
            },error=>{
              this.appProvider.setNormalNotification("Fail. to apply updates");
              this.showLoadingMessage = false;
            });
          },
          error => {
            this.showLoadingMessage = false;
            this.appProvider.setNormalNotification("Fail to prepare Database tables");
          }
        );
      }, error => {
        this.showLoadingMessage = false;
        this.appProvider.setNormalNotification("Fail to prepare device to apply updates " + JSON.stringify(error));
      });
    }, error => {
      this.showLoadingMessage = false;
      this.appProvider.setNormalNotification("Fail to download updates : " + JSON.stringify(error));
    });
  }


}
