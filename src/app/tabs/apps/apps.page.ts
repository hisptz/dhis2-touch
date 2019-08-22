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
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  State,
  getCurrentUserColorSettings,
  getAthorizedApps
} from '../../store';
import { AppColorObject, AppItem } from 'src/models';
import { APPS_LIST } from 'src/constants';

@Component({
  selector: 'app-apps',
  templateUrl: './apps.page.html',
  styleUrls: ['./apps.page.scss']
})
export class AppsPage implements OnInit {
  colorSettings$: Observable<AppColorObject>;
  currentUserApps$: Observable<AppItem[]>;

  constructor(private store: Store<State>) {
    this.colorSettings$ = this.store.select(getCurrentUserColorSettings);
    this.currentUserApps$ = this.store.select(getAthorizedApps(APPS_LIST));
  }
  ngOnInit() {}

  onSelectApp(appItem: AppItem) {
    const { url } = appItem;
    console.log(url);
  }
}
