import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  Output,
  EventEmitter
} from '@angular/core';
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
    private appProvider: AppProvider
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
            this.eventsWithConflicts = _.filter(discoveredEvents, event => {
              return _.indexOf(localEventIds, event.id) > -1;
            });
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

  applyingChnagesToEvents(events) {
    this.successEventConflictHandle.emit(events);
  }

  conflictHandlingAction(action) {
    console.log(action);
    this.successEventConflictHandle.emit([]);
  }

  clearAllSubscriptions() {
    this.subscriptions.unsubscribe();
    this.subscriptions = new Subscription();
  }

  ngOnDestroy() {
    this.clearAllSubscriptions();
  }
}
