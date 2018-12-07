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
import { EventCaptureFormProvider } from '../../../../providers/event-capture-form/event-capture-form';
import { AppProvider } from '../../../../providers/app/app';

@Component({
  selector: 'tracker-conflict-handler',
  templateUrl: 'tracker-conflict-handler.html'
})
export class TrackerConflictHandlerComponent implements OnInit, OnDestroy {
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
  }
  ngOnInit() {}

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
