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
import { TrackerCaptureSyncProvider } from '../../../../providers/tracker-capture-sync/tracker-capture-sync';
@Component({
  selector: 'tracker-data-downloader',
  templateUrl: 'tracker-data-downloader.html'
})
export class TrackerDataDownloaderComponent implements OnInit {
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

  showLoader: boolean;
  progressTrackerPacentage: number;
  progressTrackerMessage: string;
  downloadStatus: string;

  constructor(
    private appProvider: AppProvider,
    private userProvider: UserProvider,
    private trackerCaptureSyncProvider: TrackerCaptureSyncProvider
  ) {
    this.programType = 'WITH_REGISTRATION';
    this.selectedDataDimension = [];
    this.programIdsByUserRoles = [];
    this.isMetadataLoaded = false;
    this.isLoading = true;
    this.isFormReady = false;
    this.showLoader = false;
    this.progressTrackerPacentage = 0;
    this.progressTrackerMessage = '';
    this.downloadStatus = '';
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

  downloadingTrackerData() {
    this.progressTrackerPacentage = 0;
    this.showLoader = true;
    this.downloadStatus = '';
    const eventType = 'tracker-capture';
    const orgUnitName = this.selectedOrgUnit.name;
    const programId = this.selectedProgram.id;
    const programName = this.selectedProgram.name;
    const organisationUnitId = this.selectedOrgUnit.id;
    this.progressTrackerMessage = 'Discovering data';
    this.appProvider.setTopNotification(`Discovering tracker data`);
    this.trackerCaptureSyncProvider
      .discoveringTrackerDataFromServer(
        eventType,
        organisationUnitId,
        orgUnitName,
        programId,
        programName,
        this.currentUser
      )
      .subscribe(
        discoveredTrackerData => {
          const {
            trackedEntityInstances,
            enrollments,
            events
          } = discoveredTrackerData;
          this.downloadStatus = `${events.length} events, ${
            enrollments.length
          } enrollments and ${
            trackedEntityInstances.length
          } tracked entity instances has been discovered`;
          this.appProvider.setTopNotification(this.downloadStatus);
          if (trackedEntityInstances.length > 0) {
            this.progressTrackerPacentage = 50;
            this.progressTrackerMessage = 'Saving data';
            this.trackerCaptureSyncProvider
              .savingTrackedEntityInstances(
                trackedEntityInstances,
                enrollments,
                events,
                this.currentUser
              )
              .subscribe(
                () => {
                  this.progressTrackerPacentage = 100;
                  setTimeout(() => {
                    this.showLoader = false;
                  }, 100);
                  this.appProvider.setTopNotification(
                    `Discovered tracker data has been saved successfully`
                  );
                },
                error => {
                  this.showLoader = false;
                  console.log(JSON.stringify(error));
                  this.appProvider.setNormalNotification(
                    `Failed to save tracker data`
                  );
                }
              );
          } else {
            this.showLoader = false;
          }
        },
        error => {
          this.showLoader = false;
          console.log(JSON.stringify(error));
          this.appProvider.setNormalNotification(
            `Fail to discover tracker data`
          );
        }
      );
  }
}
