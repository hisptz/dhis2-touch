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
import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State, getAccountTitle } from '../../store';
import { Observable } from 'rxjs';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root = 'AppsPage';
  tab2Root = 'AccountPage';

  accountTitle$: Observable<string>;

  constructor(private store: Store<State>) {
    this.accountTitle$ = this.store.pipe(select(getAccountTitle));
  }
}
