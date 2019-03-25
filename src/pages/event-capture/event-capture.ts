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
import { EventCaptureFormProvider } from '../../providers/event-capture-form/event-capture-form';
import { SettingsProvider } from '../../providers/settings/settings';
import * as _ from 'lodash';
import { Store } from '@ngrx/store';
import { State, getCurrentUserColorSettings } from '../../store';
import { Observable } from 'rxjs';
import { SynchronizationProvider } from '../../providers/synchronization/synchronization';

@IonicPage()
@Component({
  selector: 'page-event-capture',
  templateUrl: 'event-capture.html'
})
export class EventCapturePage implements OnInit {
  selectedOrgUnit: any;
  selectedProgram: any;
  currentUser: any;
  programType: string;
  dataDimension: any;
  selectedDataDimension: any;
  programIdsByUserRoles: Array<string>;
  isLoading: boolean;
  isMetadataLoaded: boolean;
  loadingMessage: string;
  isFormReady: boolean = false;
  programStage: any;
  columnsToDisplay: any = {};
  icons: any = {};
  tableLayout: any;
  eventIds: Array<string>;
  currentEvents: Array<any>;
  dataEntrySettings: any;
  storageStatus: any;
  showEventConflictHandler: boolean;
  eventConflictHandler: any;
  hasOnlineEventLoaded: boolean;
  colorSettings$: Observable<any>;

  constructor(
    private store: Store<State>,
    private navCtrl: NavController,
    private userProvider: UserProvider,
    private modalCtrl: ModalController,
    private settingsProvider: SettingsProvider,
    private appProvider: AppProvider,
    private eventCaptureFormProvider: EventCaptureFormProvider,
    private synchronizationProvider: SynchronizationProvider
  ) {
    this.programType = 'WITHOUT_REGISTRATION';
    this.selectedDataDimension = [];
    this.colorSettings$ = this.store.select(getCurrentUserColorSettings);
    this.storageStatus = { online: 0, offline: 0 };
    this.icons = {
      accept: 'assets/icon/tick.png',
      decline: 'assets/icon/cancel.png'
    };

    this.programIdsByUserRoles = [];
    this.isMetadataLoaded = false;
    this.isLoading = true;
    this.isFormReady = false;
    this.showEventConflictHandler = false;
    this.eventConflictHandler = {};
    this.hasOnlineEventLoaded = false;
  }

  ngOnInit() {
    this.loadingMessage = 'Discovering current user information';
    this.userProvider.getCurrentUser().subscribe(
      (currentUser: any) => {
        this.currentUser = currentUser;
        this.userProvider.getUserData().subscribe((userData: any) => {
          this.programIdsByUserRoles = userData.programs;
          this.loadingAppSetting();
          this.isLoading = false;
          this.isMetadataLoaded = true;
        });
      },
      error => {
        this.isLoading = false;
        this.loadingMessage = '';
        this.appProvider.setNormalNotification(
          'Failed to discover user information'
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
        this.hasOnlineEventLoaded = false;
      }
      this.selectedDataDimension = selectedDataDimension;
      this.selectedOrgUnit = selectedOrgUnit;
      this.dataDimension = dataDimension;
      this.selectedProgram = selectedProgram;
      this.loadProgramStages(selectedProgram.id, true);
    }
  }

  ionViewDidEnter() {
    if (this.isFormReady) {
      this.loadingEvents();
    } else {
      this.hasOnlineEventLoaded = false;
    }
  }

  loadingAppSetting() {
    this.settingsProvider
      .getSettingsForTheApp(this.currentUser)
      .subscribe((appSettings: any) => {
        this.dataEntrySettings = appSettings.entryForm;
      });
  }

  loadProgramStages(programId, shouldLoadEvent?) {
    this.loadingMessage = 'Discovering program stages';
    this.columnsToDisplay = {};
    this.eventCaptureFormProvider
      .getProgramStages(programId, this.currentUser)
      .subscribe(
        (programStages: any) => {
          if (programStages && programStages.length > 0) {
            this.programStage = programStages[0];
            const { executionDateLabel } = this.programStage;
            this.columnsToDisplay['eventDate'] =
              executionDateLabel && isNaN(executionDateLabel)
                ? executionDateLabel
                : 'Report date';
            if (this.programStage.programStageDataElements) {
              this.programStage.programStageDataElements.map(
                (programStageDataElement: any) => {
                  if (
                    programStageDataElement.dataElement &&
                    programStageDataElement.dataElement.id
                  ) {
                    let fieldLabelKey =
                      programStageDataElement.dataElement.displayName;
                    if (
                      this.dataEntrySettings &&
                      this.dataEntrySettings.label &&
                      programStageDataElement.dataElement[
                        this.dataEntrySettings.label
                      ]
                    ) {
                      if (
                        isNaN(
                          programStageDataElement.dataElement[
                            this.dataEntrySettings.label
                          ]
                        )
                      ) {
                        fieldLabelKey =
                          programStageDataElement.dataElement[
                            this.dataEntrySettings.label
                          ];
                      }
                    }
                    if (programStageDataElement.displayInReports) {
                      this.columnsToDisplay[
                        programStageDataElement.dataElement.id
                      ] = fieldLabelKey;
                    }
                  }
                }
              );
            }
            if (shouldLoadEvent) {
              this.loadingEvents();
            }
          }
        },
        error => {
          console.log(JSON.stringify(error));
          this.isLoading = false;
          this.appProvider.setNormalNotification(
            'Failed to discover program stages'
          );
        }
      );
  }

  hideAndShowColumns() {
    const data = {
      columnsToDisplay: this.columnsToDisplay,
      programStage: this.programStage,
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

  loadingEvents() {
    if (
      this.selectedOrgUnit &&
      this.selectedOrgUnit.id &&
      this.selectedProgram &&
      this.selectedProgram.id
    ) {
      this.isLoading = true;
      this.showEventConflictHandler = false;
      this.loadingMessage = 'Discovering data';
      const dataDimension = this.dataDimension;
      const programId = this.selectedProgram.id;
      const programName = this.selectedProgram.name;
      const organisationUnitId = this.selectedOrgUnit.id;
      const eventType = 'event-capture';
      setTimeout(() => {
        this.eventConflictHandler = {
          ...{},
          organisationUnitId,
          eventType,
          dataDimension,
          programId,
          programName,
          currentUser: this.currentUser
        };
        this.showEventConflictHandler = !this.hasOnlineEventLoaded;
      }, 10);
      this.eventCaptureFormProvider
        .getEventsBasedOnEventsSelection(
          this.currentUser,
          dataDimension,
          programId,
          organisationUnitId
        )
        .subscribe((events: any) => {
          this.eventConflictHandler = { ...this.eventConflictHandler, events };
          this.currentEvents = events;
          this.renderDataAsTable();
        });
    }
  }

  onSuccessDiscoveringEvents() {
    this.hasOnlineEventLoaded = true;
  }

  onSuccessEventConflictHandle(data) {
    const { action, events } = data;
    if (action && action === 'decline') {
      this.appProvider.setTopNotification('Uploading offline data');
      this.synchronizationProvider
        .syncAllOfflineDataToServer(this.currentUser)
        .subscribe(
          response => {
            const percentage =
              response && response.percentage
                ? parseInt(response.percentage)
                : 0;
            const { importSummaries } = response;
            if (importSummaries && importSummaries.events) {
              const { fail } = importSummaries.events;
              if (fail == 0 && percentage === 100) {
                this.appProvider.setTopNotification(
                  'Offline data has been uploaded successfully'
                );
                this.currentEvents.forEach((event: any) => {
                  event.syncStatus = 'synced';
                });
                this.eventConflictHandler = {
                  ...this.eventConflictHandler,
                  events: this.currentEvents
                };
                this.renderDataAsTable();
              } else {
                this.appProvider.setTopNotification(
                  'Failed to upload offline data'
                );
              }
            }
            console.log(JSON.stringify({ importSummaries, percentage }));
          },
          error => {
            console.log(JSON.stringify({ error }));
          }
        );
    } else {
      const eventIds = _.map(events, event => event.id);
      const currentEvents = _.filter(this.currentEvents, event => {
        return _.indexOf(eventIds, event.id) === -1;
      });
      const eventsToBeApplied = _.flatMapDeep([...currentEvents, events]);
      this.eventCaptureFormProvider
        .saveEvents(eventsToBeApplied, this.currentUser)
        .subscribe(
          () => {
            this.currentEvents = eventsToBeApplied;
            this.eventConflictHandler = {
              ...this.eventConflictHandler,
              events: this.currentEvents
            };
            this.renderDataAsTable();
          },
          error => {
            console.log(JSON.stringify(error));
          }
        );
    }
  }

  loadingOnlineEvents(
    programId,
    programName,
    organisationUnitId,
    dataDimension,
    eventType
  ) {
    const eventIds = this.currentEvents.map(event => event.id);
    this.eventCaptureFormProvider
      .discoveringEventsFromServer(
        programId,
        programName,
        organisationUnitId,
        dataDimension,
        eventType,
        this.currentUser
      )
      .subscribe(
        events => {
          // @todo on adding events checking for conflicts
          for (const event of events) {
            if (eventIds.indexOf(event.id) === -1) {
              this.currentEvents.push(event);
            }
          }
          const eventsToBesaved = events.filter(
            event => eventIds.indexOf(event.id) === -1
          );
          if (eventsToBesaved.length > 0) {
            const count = eventsToBesaved.length;
            this.appProvider.setTopNotification(
              `${count} events have been discovered and saved from online servers`
            );
            this.eventCaptureFormProvider
              .saveEvents(eventsToBesaved, this.currentUser)
              .subscribe(
                () => {
                  this.renderDataAsTable();
                },
                error => {
                  console.log(JSON.stringify(error));
                }
              );
          }
        },
        error => {
          console.log(JSON.stringify({ error }));
        }
      );
  }

  renderDataAsTable() {
    this.isLoading = true;
    this.currentEvents = _.reverse(
      _.sortBy(_.uniqBy(this.currentEvents, 'id'), ['eventDate'])
    );
    this.loadingMessage = 'Preparing table';
    this.storageStatus.online = _.filter(
      this.currentEvents,
      event => event.syncStatus === 'synced'
    ).length;
    this.storageStatus.offline = _.filter(
      this.currentEvents,
      event => event.syncStatus === 'not-synced'
    ).length;
    this.eventCaptureFormProvider
      .getTableFormatResult(this.columnsToDisplay, this.currentEvents)
      .subscribe(
        (response: any) => {
          this.tableLayout = response.table;
          this.eventIds = response.eventIds;
          this.isLoading = false;
        },
        () => {
          this.isLoading = false;
          this.appProvider.setNormalNotification(
            'Failed to prepare table for display'
          );
        }
      );
  }

  goToEventView(currentIndex) {
    let params = {
      dataDimension: this.dataDimension,
      eventId: this.eventIds[currentIndex]
    };
    this.navCtrl.push('EventCaptureRegisterPage', params);
  }

  goToEventRegister() {
    let params = { dataDimension: this.dataDimension };
    this.navCtrl.push('EventCaptureRegisterPage', params);
  }
}
