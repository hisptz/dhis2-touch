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
import { EventCaptureFormProvider } from '../../../../providers/event-capture-form/event-capture-form';
import { AppProvider } from '../../../../providers/app/app';

/**
 * Generated class for the EventConflictHandlerComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'event-conflict-handler',
  templateUrl: 'event-conflict-handler.html'
})
export class EventConflictHandlerComponent implements OnInit, OnDestroy {
  @Input() eventConflictHandler: any;
  @Output() successDiscoveringEvents = new EventEmitter();
  @Output() successEventConflictHandle = new EventEmitter();

  eventsWithConflicts: any;
  isLoading: boolean;
  icons: any = {
    accept: 'assets/icon/tick.png',
    decline: 'assets/icon/cancel.png'
  };
  subscriptions: Subscription;
  constructor(
    private eventCaptureFormProvider: EventCaptureFormProvider,
    private appProvider: AppProvider,
    private actionSheetCtrl: ActionSheetController
  ) {
    this.isLoading = true;
    this.subscriptions = new Subscription();
    this.eventsWithConflicts = [];
  }
  ngOnInit() {
    const {
      eventType,
      dataDimension,
      organisationUnitId,
      programId,
      programName,
      currentUser
    } = this.eventConflictHandler;
    if (
      organisationUnitId &&
      eventType &&
      dataDimension &&
      programName &&
      programId &&
      currentUser
    ) {
      this.discoveringEventsFromOnlineSever(
        programId,
        programName,
        organisationUnitId,
        dataDimension,
        eventType,
        currentUser
      );
    } else {
      this.isLoading = false;
    }
  }

  discoveringEventsFromOnlineSever(
    programId,
    programName,
    organisationUnitId,
    datadimension,
    eventType,
    currentUser
  ) {
    this.subscriptions.add(
      this.eventCaptureFormProvider
        .discoveringEventsFromServer(
          programId,
          programName,
          organisationUnitId,
          datadimension,
          eventType,
          currentUser
        )
        .subscribe(
          discoveredEvents => {
            this.successDiscoveringEvents.emit({ status: true });
            const { events } = this.eventConflictHandler;
            const localEventIds = _.map(events, event => event.id);
            this.eventsWithConflicts = this.getEventsWithConflicts(
              discoveredEvents
            );
            const eventWithOutConflicts = _.filter(discoveredEvents, event => {
              return _.indexOf(localEventIds, event.id) === -1;
            });
            if (eventWithOutConflicts.length > 0) {
              const eventsToBeSaved = _.flatMapDeep([
                ...events,
                eventWithOutConflicts
              ]);
              const count = eventWithOutConflicts.length;
              this.appProvider.setTopNotification(
                `${count} events have been dicovered and applied into local storage`
              );
              this.applyingChnagesToEvents(eventsToBeSaved);
            }
            this.isLoading = false;
          },
          error => {
            console.log(JSON.stringify({ error }));
          }
        )
    );
  }

  getEventsWithConflicts(discoveredEvents) {
    const { events } = this.eventConflictHandler;
    const eventsWithConflicts = [];
    const localEventIds = _.map(events, event => event.id);
    const sconstFilteredDiscoveredEvents = _.filter(discoveredEvents, event => {
      return _.indexOf(localEventIds, event.id) > -1;
    });
    _.map(sconstFilteredDiscoveredEvents, event => {
      const offlineEvent = _.find(events, offlineEventObject => {
        return offlineEventObject.id === event.id;
      });
      if (offlineEvent && offlineEvent.id) {
        // if (offlineEvent.syncStatus !== event.syncStatus) {
        //   eventsWithConflicts.push(event);
        // } else
        if (offlineEvent.dataValues.length !== event.dataValues.length) {
          eventsWithConflicts.push(event);
        } else {
          console.log('based on consistence of data values');
          const hasSameDataValues = this.getDataValuesConsistencyStatus(
            offlineEvent.dataValues,
            event.dataValues
          );
          if (!hasSameDataValues) {
            eventsWithConflicts.push(events);
          }
        }
      }
      //console.log(JSON.stringify({ offlineEvent }));
    });
    return eventsWithConflicts;
  }

  getDataValuesConsistencyStatus(offlineDataValue, onlineDataValue) {
    console.log(JSON.stringify(offlineDataValue));
    return true;
  }

  applyingChnagesToEvents(events) {
    this.successEventConflictHandle.emit(events);
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
              const { events } = this.eventConflictHandler;
              // this.eventsWithConflicts
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
              this.eventsWithConflicts = [];
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

  clearAllSubscriptions() {
    this.subscriptions.unsubscribe();
    this.subscriptions = new Subscription();
  }

  ngOnDestroy() {
    this.clearAllSubscriptions();
    this.eventConflictHandler = null;
    this.isLoading = null;
    this.icons = null;
  }
}
