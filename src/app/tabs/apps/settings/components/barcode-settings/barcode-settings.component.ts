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
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State, getCurrentUserColorSettings } from '../../../../../store';
import { BarcodeSetting, AppColorObject } from 'src/models';
import { DEFAULT_SETTINGS } from 'src/constants';
import { getUpdatedSettingObject, getUpdatedDataObject } from '../../helpers';

@Component({
  selector: 'app-barcode-settings',
  templateUrl: './barcode-settings.component.html',
  styleUrls: ['./barcode-settings.component.scss']
})
export class BarcodeSettingsComponent implements OnInit {
  @Input() barcodeSetting: BarcodeSetting;

  @Output() barcodeSettingChange = new EventEmitter();

  colorSettings$: Observable<AppColorObject>;
  data: any;
  isLoading: boolean;

  constructor(private store: Store<State>) {
    this.isLoading = true;
    this.data = {};
    this.colorSettings$ = this.store.select(getCurrentUserColorSettings);
  }

  ngOnInit() {
    this.barcodeSetting = this.barcodeSetting || DEFAULT_SETTINGS.barcode;
    this.setUpDataModel(this.barcodeSetting);
  }

  setUpDataModel(barcodeSetting: BarcodeSetting) {
    this.data = getUpdatedDataObject(barcodeSetting);
    setTimeout(() => {
      this.isLoading = false;
    }, 200);
  }

  onBarcodeSetingChnage(data: any) {
    this.barcodeSetting = getUpdatedSettingObject(data, this.barcodeSetting);
    this.barcodeSettingChange.emit({
      id: 'barcode',
      data: this.barcodeSetting
    });
  }
}
