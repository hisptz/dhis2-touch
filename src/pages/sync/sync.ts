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
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SyncProvider } from '../../providers/sync/sync';
import { SqlLiteProvider } from '../../providers/sql-lite/sql-lite';
import { Store } from '@ngrx/store';
import { State, getCurrentUserColorSettings } from '../../store';
import { Observable } from 'rxjs';

/**
 * Generated class for the SyncPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sync',
  templateUrl: 'sync.html'
})
export class SyncPage implements OnInit {
  isSyncContentOpen: any;
  syncContents: Array<any>;
  resources: any;
  colorSettings$: Observable<any>;

  constructor(
    private store: Store<State>,
    public navCtrl: NavController,
    public navParams: NavParams,
    private syncProvider: SyncProvider,
    private sqLiteProvider: SqlLiteProvider
  ) {
    this.colorSettings$ = this.store.select(getCurrentUserColorSettings);
    this.isSyncContentOpen = {};
    this.syncContents = this.syncProvider.getSyncContentDetails();
    this.resources = [];
  }

  ngOnInit() {
    if (this.syncContents.length > 0) {
      this.toggleSyncContents(this.syncContents[0]);
    }
    const dataBaseStructure = this.sqLiteProvider.getDataBaseStructure();
    Object.keys(dataBaseStructure).map((resource: any) => {
      if (dataBaseStructure[resource].isMetadata) {
        this.resources.push({
          name: resource,
          displayName: dataBaseStructure[resource].displayName
            ? dataBaseStructure[resource].displayName
            : resource,
          status: false,
          dependentTable: dataBaseStructure[resource].dependentTable
        });
      }
    });
  }

  toggleSyncContents(content) {
    if (content && content.id) {
      if (this.isSyncContentOpen[content.id]) {
        this.isSyncContentOpen[content.id] = false;
      } else {
        Object.keys(this.isSyncContentOpen).map(id => {
          this.isSyncContentOpen[id] = false;
        });
        this.isSyncContentOpen[content.id] = true;
      }
    }
  }

  trackByFn(index, item) {
    return item && item.id ? item.id : index;
  }
}
