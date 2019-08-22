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
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State, getCurrentUserColorSettings } from '../../store';
import * as _ from 'lodash';
import { LocalInstance, CurrentUser, AppColorObject } from 'src/models';

@Component({
  selector: 'app-local-instance-selection',
  templateUrl: './local-instance-selection.page.html',
  styleUrls: ['./local-instance-selection.page.scss']
})
export class LocalInstanceSelectionPage implements OnInit {
  cancelIcon: string;
  filterItems: LocalInstance[] = [];
  colorSettings$: Observable<AppColorObject>;

  constructor(
    private modalController: ModalController,
    private navParms: NavParams,
    private store: Store<State>
  ) {
    this.colorSettings$ = this.store.select(getCurrentUserColorSettings);
    this.cancelIcon = 'assets/icon/cancel.png';
    this.filterItems = [];
  }

  ngOnInit() {
    this.filterItems = this.navParms.get('localInstances');
  }

  async closeModal(currentUser?: CurrentUser) {
    await this.modalController.dismiss(currentUser);
  }

  async setCurrentLocalInstance(localInstance: LocalInstance) {
    const { currentLanguage, currentUser } = localInstance;
    await this.closeModal({ ...currentUser, currentLanguage });
  }

  getFilteredList(data: { target: { value: string } }) {
    const value = data.target.value || '';
    const localInstances = this.navParms.get('localInstances');
    this.filterItems = _.filter(
      localInstances,
      (localInstance: LocalInstance) => {
        const { name, currentUser } = localInstance;
        const { username } = currentUser;
        return (
          name.toLowerCase().includes(value.toLowerCase()) ||
          username.toLowerCase().includes(value.toLowerCase())
        );
      }
    );
  }

  trackByFn(index: any, item: LocalInstance) {
    return item && item.id ? item.id : index;
  }
}
