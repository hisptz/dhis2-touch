/*
 *
 * Copyright 2019 HISP Tanzania
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
 * @since 2019
 * @author Joseph Chingalo <profschingalo@gmail.com>
 *
 */
import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State, getCurrentUserColorSettings } from '../../store';
import { AppColorObject, AgggregatePeriod } from 'src/models';
import { PeriodSelectionService } from 'src/app/services/period-selection.service';

@Component({
  selector: 'app-period-selection',
  templateUrl: './period-selection.page.html',
  styleUrls: ['./period-selection.page.scss']
})
export class PeriodSelectionPage implements OnInit {
  colorSettings$: Observable<AppColorObject>;
  selectedValue: string;
  currentPeriodOffset: number;
  openFuturePeriods: number;
  periodType: string;
  cancelIcon: string;
  periods: AgggregatePeriod[];

  constructor(
    private modalController: ModalController,
    private navParms: NavParams,
    private store: Store<State>,
    private periodSelectionService: PeriodSelectionService
  ) {
    this.colorSettings$ = this.store.select(getCurrentUserColorSettings);
    this.cancelIcon = 'assets/icon/cancel.png';
  }

  ngOnInit() {
    const selectedValue = this.navParms.get('selectedValue');
    const calendarId = this.navParms.get('calendarId');
    const currentPeriodOffset = this.navParms.get('currentPeriodOffset');
    const periodType = this.navParms.get('periodType');
    const openFuturePeriods = this.navParms.get('openFuturePeriods');
    this.setInitalValue(
      selectedValue,
      calendarId,
      currentPeriodOffset,
      periodType,
      openFuturePeriods
    );
  }

  async setInitalValue(
    selectedValue: string,
    calendarId: string,
    currentPeriodOffset: number,
    periodType: string,
    openFuturePeriods: number
  ) {
    this.selectedValue = selectedValue;
    this.currentPeriodOffset = currentPeriodOffset;
    this.periodType = periodType;
    this.openFuturePeriods = openFuturePeriods;
    await this.periodSelectionService.intiateCalendarInstance(calendarId);
    await this.discoveringPeriodList();
  }

  async changePeriodSelection(currentPeriodOffset: number) {
    this.currentPeriodOffset = currentPeriodOffset;
    await this.discoveringPeriodList();
  }

  async discoveringPeriodList() {
    this.periods = await this.periodSelectionService.getPeriodsList(
      this.periodType,
      this.openFuturePeriods,
      this.currentPeriodOffset
    );
  }

  setSelectedPeriod(selectedPeriod: AgggregatePeriod) {
    this.closeModal(selectedPeriod);
  }

  async closeModal(selectedPeriod?: AgggregatePeriod) {
    await this.modalController.dismiss({
      currentPeriodOffset: this.currentPeriodOffset,
      selectedPeriod
    });
  }

  trackByFn(index: any, option: any) {
    return option && option.id ? option.id : index;
  }
}
