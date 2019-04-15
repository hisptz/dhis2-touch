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
import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  Output,
  EventEmitter
} from '@angular/core';
import { ActionSheetController } from 'ionic-angular';

import { Subscription } from 'rxjs/Subscription';
import * as _ from 'lodash';
import { AppProvider } from '../../../../providers/app/app';
import { TrackerCaptureSyncProvider } from '../../../../providers/tracker-capture-sync/tracker-capture-sync';
import { CurrentUser } from '../../../../models';

@Component({
  selector: 'tracker-conflict-handler',
  templateUrl: 'tracker-conflict-handler.html'
})
export class TrackerConflictHandlerComponent implements OnInit, OnDestroy {
  @Input() trackerConflictHandler;
  @Output() successDiscovering = new EventEmitter();
  @Output() successTrackerConflictHandler = new EventEmitter();

  isLoading: boolean;
  icons: any = {
    accept: 'assets/icon/tick.png',
    decline: 'assets/icon/cancel.png'
  };
  TrackerDataWithConflicts: any;
  subscriptions: Subscription;
  discoveredTrackerData: any;

  trackedEntityInstanceWithConflicts: any;

  constructor(
    private trackerCaptureSyncProvider: TrackerCaptureSyncProvider,
    private appProvider: AppProvider,
    private actionSheetCtrl: ActionSheetController
  ) {
    this.trackedEntityInstanceWithConflicts = [];
    this.isLoading = true;
    this.subscriptions = new Subscription();
  }
  ngOnInit() {
    const {
      eventType,
      organisationUnitId,
      orgUnitName,
      programId,
      programName,
      currentUser
    } = this.trackerConflictHandler;
    this.discoveringTrackerData(
      eventType,
      organisationUnitId,
      orgUnitName,
      programId,
      programName,
      currentUser
    );
  }

  discoveringTrackerData(
    eventType: string,
    organisationUnitId: string,
    orgUnitName: string,
    programId: string,
    programName: string,
    currentUser: CurrentUser
  ) {
    this.subscriptions.add(
      this.trackerCaptureSyncProvider
        .discoveringTrackerDataFromServer(
          eventType,
          organisationUnitId,
          orgUnitName,
          programId,
          programName,
          currentUser
        )
        .subscribe(
          discoveredTrackerData => {
            const {
              trackedEntityInstances,
              enrollments,
              events
            } = discoveredTrackerData;
            const offlineTrackedEntityInstanceIds = _.map(
              this.trackerConflictHandler.trackedEntityInstances,
              trackedEntityInstance => trackedEntityInstance.id
            );
            const {
              trackedEntityInstanceWithConflicts,
              trackedEntityInstanceWithoutConflicts
            } = this.trackerCaptureSyncProvider.getTrackedEntityInstancesByStatus(
              discoveredTrackerData,
              offlineTrackedEntityInstanceIds
            );
            //this.trackedEntityInstanceWithConflicts = trackedEntityInstanceWithConflicts;
            if (
              trackedEntityInstanceWithoutConflicts &&
              trackedEntityInstanceWithoutConflicts.length > 0
            ) {
              const {
                events,
                enrollments
              } = this.trackerCaptureSyncProvider.getSelectedEnrollementEventsByTrackedEntityInstances(
                trackedEntityInstanceWithoutConflicts,
                discoveredTrackerData
              );
              this.applyingChangesToEvents(
                trackedEntityInstanceWithoutConflicts,
                enrollments,
                events
              );
            }
            this.isLoading = false;
          },
          error => {
            this.isLoading = false;
            console.log(JSON.stringify({ error }));
          }
        )
    );
  }

  conflictHandlingAction(action) {
    if (action === 'accept') {
      const actionSheet = this.actionSheetCtrl.create({
        title:
          'You are about to replace offline data with data from the server, are you sure?',
        buttons: [
          {
            text: 'Yes',
            handler: () => {
              console.log('Apply new updates ');
            }
          },
          {
            text: 'No',
            handler: () => {}
          }
        ]
      });
      actionSheet.present();
    }
    if (action === 'decline') {
      const actionSheet = this.actionSheetCtrl.create({
        title: 'You are about to discard data from server, are you sure?',
        buttons: [
          {
            text: 'Yes',
            handler: () => {
              console.log('Discard changes or updates');
            }
          },
          {
            text: 'No',
            handler: () => {}
          }
        ]
      });
      actionSheet.present();
    }
  }

  applyingChangesToEvents(trackedEntityInstances, enrollments, events) {
    const { currentUser } = this.trackerConflictHandler;
    this.subscriptions.add(
      this.trackerCaptureSyncProvider
        .savingTrackedEntityInstances(
          trackedEntityInstances,
          enrollments,
          events,
          currentUser
        )
        .subscribe(
          () => {
            const trackedEntityInstancesCount = trackedEntityInstances.length;
            const enrollmentsCount = enrollments.length;
            const eventsCount = events.length;
            const message = `${trackedEntityInstancesCount} tracked Entity Instances,${enrollmentsCount} enrollments and ${eventsCount} events have been dicovered and applied into local storage`;
            this.appProvider.setTopNotification(message);
            this.successTrackerConflictHandler.emit();
          },
          error => {
            console.log(JSON.stringify({ error }));
          }
        )
    );
    console.log(JSON.stringify({}));
  }

  clearAllSubscriptions() {
    this.subscriptions.unsubscribe();
    this.subscriptions = new Subscription();
  }

  ngOnDestroy() {
    this.clearAllSubscriptions();
    this.isLoading = null;
    this.icons = null;
  }
}
