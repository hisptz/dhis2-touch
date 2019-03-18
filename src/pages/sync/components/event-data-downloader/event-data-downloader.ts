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
import { CurrentUser } from '../../../../models';
import { UserProvider } from '../../../../providers/user/user';
import { EventCaptureFormProvider } from '../../../../providers/event-capture-form/event-capture-form';
@Component({
  selector: 'event-data-downloader',
  templateUrl: 'event-data-downloader.html'
})
export class EventDataDownloaderComponent implements OnInit {
  @Input() colorSettings;

  selectedOrgUnit: any;
  selectedProgram: any;
  currentUser: CurrentUser;
  programType: string;
  dataDimension: any;
  selectedDataDimension: any;
  programIdsByUserRoles: Array<string>;
  isLoading: boolean;
  isMetadataLoaded: boolean;
  isFormReady: boolean = false;

  constructor(
    private appProvider: AppProvider,
    private userProvider: UserProvider,
    private eventCaptureFormProvider: EventCaptureFormProvider
  ) {
    this.programType = 'WITHOUT_REGISTRATION';
    this.selectedDataDimension = [];
    this.programIdsByUserRoles = [];
    this.isMetadataLoaded = false;
    this.isLoading = true;
    this.isFormReady = false;
  }
  ngOnInit() {
    this.userProvider.getCurrentUser().subscribe(
      (currentUser: any) => {
        this.currentUser = currentUser;
        this.userProvider.getUserData().subscribe((userData: any) => {
          this.programIdsByUserRoles = userData.programs;
          this.isLoading = false;
          this.isMetadataLoaded = true;
        });
      },
      () => {
        this.isLoading = false;
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
    this.selectedDataDimension = selectedDataDimension;
    this.selectedOrgUnit = selectedOrgUnit;
    this.dataDimension = dataDimension;
    this.selectedProgram = selectedProgram;
  }

  downloadingEventData() {
    const dataDimension = this.dataDimension;
    const programId = this.selectedProgram.id;
    const programName = this.selectedProgram.name;
    const organisationUnitId = this.selectedOrgUnit.id;
    const eventType = 'event-capture';
    this.appProvider.setTopNotification(`Discovering online events`);
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
        discoveredEvents => {
          this.appProvider.setTopNotification(
            `${discoveredEvents.length} events has been discovered`
          );
          this.eventCaptureFormProvider
            .saveEvents(discoveredEvents, this.currentUser)
            .subscribe(
              () => {
                this.appProvider.setTopNotification(
                  `Discovered events data has been saved successfully`
                );
              },
              error => {
                console.log(JSON.stringify(error));
                this.appProvider.setNormalNotification(
                  `Failed to discover events data`
                );
              }
            );
        },
        error => {
          console.log(JSON.stringify(error));
          this.appProvider.setNormalNotification(
            `Failed to discover events data`
          );
        }
      );
  }
}
