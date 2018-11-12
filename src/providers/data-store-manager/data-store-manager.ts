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
import { Injectable } from '@angular/core';
import { HttpClientProvider } from '../http-client/http-client';
import { SqlLiteProvider } from '../sql-lite/sql-lite';
import { Observable } from 'rxjs';

/*
  Generated class for the DataStoreManagerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataStoreManagerProvider {
  resource: string;
  constructor(
    private httpCLientProvider: HttpClientProvider,
    private sqlLiteProvider: SqlLiteProvider
  ) {
    this.resource = 'dataStore';
  }

  getDataStoreFromServer(): Observable<any> {
    return new Observable(observer => {});
  }

  getDataStoreNameSpacesFromServer(): Observable<any> {
    const url = `/api/${this.resource}`;
    return new Observable(observer => {});
  }

  getDataStoreNameSpaceKeysFromServer(nameSpace: string): Observable<any> {
    const url = `/api/${this.resource}/${nameSpace}`;
    return new Observable(observer => {});
  }

  getDataStoreByNameSpaceAndKeyFromServer(
    nameSpace: string,
    key: string
  ): Observable<any> {
    const url = `/api/${this.resource}/${nameSpace}/${key}`;
    return new Observable(observer => {});
  }

  saveDataStoreData(): Observable<any> {
    return new Observable(observer => {});
  }

  getSavedDataStoreData(): Observable<any> {
    return new Observable(observer => {});
  }
}
