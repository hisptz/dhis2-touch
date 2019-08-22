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
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { State, getCurrentUserColorSettings } from '../../store';
import { Observable } from 'rxjs';

import { CoordinateSelectionPage } from 'src/app/modals/coordinate-selection/coordinate-selection.page';

@Component({
  selector: 'app-coordinate-input',
  templateUrl: './coordinate-input.component.html',
  styleUrls: ['./coordinate-input.component.scss']
})
export class CoordinateInputComponent implements OnInit {
  @Input() dataElementId: string;
  @Input() categoryOptionComboId: string;
  @Input() data: any;
  @Input() lockingFieldStatus: boolean;

  @Output() coordinateChange = new EventEmitter();

  position: { lat: string | number; lng: string | number };
  colorSettings$: Observable<any>;

  constructor(
    private store: Store<State>,
    private modalController: ModalController
  ) {
    this.colorSettings$ = this.store.select(getCurrentUserColorSettings);
  }

  ngOnInit() {
    this.data = this.data || { 'de-co': { value: `[-7.013668,38.34447]` } };
    const id = `${this.dataElementId}-${this.categoryOptionComboId}`;
    if (this.data && this.data[id]) {
      try {
        const value = this.data[id].value;
        const dataValue = new Function(`return ${value}`)();
        if (dataValue && dataValue.length === 2) {
          this.position = { lat: dataValue[0], lng: dataValue[1] };
        }
      } catch (error) {}
    }
  }

  async openCoordinateSelctionModal() {
    const modal = await this.modalController.create({
      component: CoordinateSelectionPage,
      componentProps: { position: this.position },
      cssClass: 'inset-modal'
    });
    modal.present();
    const response = await modal.onDidDismiss();
    if (response && response.data) {
      const { data } = response;
      if (data && data.lat && data.lng) {
        this.position = data;
        const id = `${this.dataElementId}-${this.categoryOptionComboId}`;
        const status = 'not-sync';
        const value = `[${data.lat},${data.lng}]`;
        this.coordinateChange.emit({ id, status, value });
      }
    }
  }
}
