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
import { UserProvider } from '../../providers/user/user';
import { AppProvider } from '../../providers/app/app';
import { TrackerCaptureProvider } from '../../providers/tracker-capture/tracker-capture';
import * as _ from 'lodash';
import { SettingsProvider } from '../../providers/settings/settings';
import { Store } from '@ngrx/store';
import { State, getCurrentUserColorSettings } from '../../store';
import { Observable } from 'rxjs';
declare var dhis2;

@IonicPage()
@Component({
  selector: 'page-tracker-capture',
  templateUrl: 'tracker-capture.html'
})
export class TrackerCapturePage implements OnInit {
  selectedOrgUnit: any;
  selectedProgram: any;
  programType: string;
  currentUser: any;
  programIdsByUserRoles: Array<string>;
  isLoading: boolean;
  loadingMessage: string;
  isFormReady: boolean;
  isMetadataLoaded: boolean;
  selectedDataDimension: Array<any>;
  dataDimension: any;
  trackedEntityInstances: Array<any>;
  programTrackedEntityAttributes: Array<any>;
  trackedEntityInstancesIds: Array<string>;
  columnsToDisplay: any;
  icons: any = {};
  tableLayout: any;
  dataEntrySettings: any;
  storageStatus: any;
  showTrackerConflictHandler: boolean;
  trackerConflictHandler: any;
  hasOnlineTrackerLoaded: boolean;
  colorSettings$: Observable<any>;

  constructor(
    private store: Store<State>,
    public navCtrl: NavController,
    private modalCtrl: ModalController,
    private userProvider: UserProvider,
    private appProvider: AppProvider,
    private trackerCaptureProvider: TrackerCaptureProvider,
    private settingsProvider: SettingsProvider
  ) {
    this.programType = 'WITH_REGISTRATION';
    this.selectedDataDimension = [];
    this.colorSettings$ = this.store.select(getCurrentUserColorSettings);
    this.storageStatus = {
      online: 0,
      offline: 0
    };
    this.trackedEntityInstances = [];
    this.columnsToDisplay = {};
    this.isLoading = true;
    this.isMetadataLoaded = false;
    this.isFormReady = false;
    this.showTrackerConflictHandler = true;
    this.trackerConflictHandler = {};
    this.hasOnlineTrackerLoaded = false;
  }

  ionViewDidEnter() {
    if (this.isFormReady) {
      this.loadingSavedTrackedEntityInstances(
        this.selectedProgram.id,
        this.selectedOrgUnit.id
      );
    }
  }

  ngOnInit() {
    this.loadingMessage = 'Discovering current user information';
    this.userProvider.getCurrentUser().subscribe(
      (currentUser: any) => {
        this.currentUser = currentUser;
        this.userProvider.getUserData().subscribe((userData: any) => {
          this.programIdsByUserRoles = userData.programs;
          this.isLoading = false;
          this.isMetadataLoaded = true;
          this.loadingAppSetting();
        });
      },
      () => {
        this.isLoading = false;
        this.loadingMessage = '';
        this.appProvider.setNormalNotification(
          'Failed to discover current user information'
        );
      }
    );
  }

  onProgramParameterSelection(data) {
    const {
      selectedOrgUnit,
      selectedProgram,
      dataDimension,
      selectedDataDimension,
      isFormReady
    } = data;
    this.isFormReady = isFormReady;
    if (isFormReady) {
      if (
        this.selectedProgram &&
        this.selectedProgram.id &&
        this.selectedProgram.id !== selectedProgram.id
      ) {
        this.hasOnlineTrackerLoaded = false;
      }
      dhis2['tackerCaptureSelection'] = {
        selectedOrgUnit: { id: selectedOrgUnit.id, name: selectedOrgUnit.name },
        selectedProgram: { id: selectedProgram.id, name: selectedProgram.name },
        dataDimension
      };
      this.selectedDataDimension = selectedDataDimension;
      this.selectedOrgUnit = selectedOrgUnit;
      this.dataDimension = dataDimension;
      this.selectedProgram = selectedProgram;
      this.trackerCaptureProvider
        .getTrackedEntityRegistration(this.selectedProgram.id, this.currentUser)
        .subscribe(
          (programTrackedEntityAttributes: any) => {
            this.programTrackedEntityAttributes = programTrackedEntityAttributes;
            this.columnsToDisplay = {};
            const { label } = this.dataEntrySettings;
            if (
              this.programTrackedEntityAttributes &&
              this.programTrackedEntityAttributes.length > 0
            ) {
              this.programTrackedEntityAttributes.map(
                (programTrackedEntityAttribute: any) => {
                  if (programTrackedEntityAttribute.displayInList) {
                    const attribute =
                      programTrackedEntityAttribute.trackedEntityAttribute;
                    let fieldLabel = attribute.name;
                    if (attribute[label] && label && isNaN(attribute[label])) {
                      fieldLabel = attribute[label];
                    }
                    this.columnsToDisplay[attribute.id] = fieldLabel;
                  }
                }
              );
              if (_.keys(this.columnsToDisplay).length == 0) {
                const attribute = this.programTrackedEntityAttributes[0]
                  .trackedEntityAttribute;
                let fieldLabel = attribute.name;
                if (attribute[label] && label && isNaN(attribute[label])) {
                  fieldLabel = attribute[label];
                }
                this.columnsToDisplay[attribute.id] = fieldLabel;
              }
              this.loadingSavedTrackedEntityInstances(
                selectedProgram.id,
                selectedOrgUnit.id
              );
            }
          },
          error => {
            this.isLoading = false;
            console.log(JSON.stringify(error));
            this.appProvider.setNormalNotification(
              'Failed to discover registration form'
            );
          }
        );
    }
  }

  loadingAppSetting() {
    this.settingsProvider
      .getSettingsForTheApp(this.currentUser)
      .subscribe((appSettings: any) => {
        this.dataEntrySettings = appSettings.entryForm;
      });
  }

  loadingSavedTrackedEntityInstances(programId, organisationUnitId) {
    this.isLoading = true;
    this.showTrackerConflictHandler = false;
    this.loadingMessage = 'Discovering tracked entity list';
    const programName = this.selectedProgram.name;
    const eventType = 'tracker-capture';
    const orgUnitName = this.selectedOrgUnit.name;
    setTimeout(() => {
      this.trackerConflictHandler = {
        ...{},
        organisationUnitId,
        orgUnitName,
        eventType,
        programId,
        programName,
        currentUser: this.currentUser
      };
      this.showTrackerConflictHandler = !this.hasOnlineTrackerLoaded;
    }, 10);
    this.trackerCaptureProvider
      .loadTrackedEntityInstancesList(
        programId,
        organisationUnitId,
        this.currentUser
      )
      .subscribe(
        (trackedEntityInstances: any) => {
          this.trackerConflictHandler = {
            ...this.trackerConflictHandler,
            trackedEntityInstances
          };
          this.trackedEntityInstances = trackedEntityInstances;
          this.storageStatus.online = _.filter(
            trackedEntityInstances,
            trackedEntityInstance =>
              trackedEntityInstance.syncStatus === 'synced'
          ).length;
          this.storageStatus.offline = _.filter(
            trackedEntityInstances,
            trackedEntityInstance =>
              trackedEntityInstance.syncStatus === 'not-synced'
          ).length;
          this.renderDataAsTable();
        },
        error => {
          console.log(JSON.stringify(error));
          this.isLoading = false;
          this.appProvider.setNormalNotification(
            'Failed to discover tracked entity list'
          );
        }
      );
  }

  onSuccessDiscoveringTrackerData() {
    this.hasOnlineTrackerLoaded = true;
  }

  onSuccessTrackerConflictHandling() {
    const programId = this.selectedProgram.id;
    const organisationUnitId = this.selectedOrgUnit.id;
    this.loadingSavedTrackedEntityInstances(programId, organisationUnitId);
  }

  isAllParameterSelected() {
    let result = false;
    if (this.selectedProgram && this.selectedProgram.name) {
      result = true;
    }
    return result;
  }

  renderDataAsTable() {
    this.loadingMessage = 'Preparing table for display';
    this.trackerCaptureProvider
      .getTableFormatResult(this.columnsToDisplay, this.trackedEntityInstances)
      .subscribe(
        (response: any) => {
          this.tableLayout = response.table;
          this.trackedEntityInstancesIds = response.trackedEntityInstancesIds;
          this.isLoading = false;
        },
        error => {
          this.isLoading = false;
          this.appProvider.setNormalNotification(
            'Failed to prepare table for display'
          );
        }
      );
  }

  hideAndShowColumns() {
    const data = {
      columnsToDisplay: this.columnsToDisplay,
      programTrackedEntityAttributes: this.programTrackedEntityAttributes,
      dataEntrySettings: this.dataEntrySettings
    };
    const modal = this.modalCtrl.create('HideAndShowColumnsPage', {
      data: data
    });
    modal.onDidDismiss((columnsToDisplay: any) => {
      if (columnsToDisplay) {
        this.columnsToDisplay = columnsToDisplay;
        this.renderDataAsTable();
      }
    });
    modal.present();
  }

  registerNewTrackedEntity() {
    // this.navCtrl.push('TrackerEntityRegisterPage', {});
  }

  openTrackedEntityDashboard(currentIndex) {
    // let trackedEntityInstancesId = this.trackedEntityInstancesIds[currentIndex];
    // this.navCtrl.push('TrackedEntityDashboardPage', {
    //   trackedEntityInstancesId: trackedEntityInstancesId
    // });
  }
}
