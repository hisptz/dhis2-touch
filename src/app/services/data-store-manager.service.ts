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
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { getRepository, Repository } from 'typeorm';
import { HttpClientService } from './http-client.service';
import { CurrentUser, DataStore } from 'src/models';
import { DataStoreEntity } from 'src/entites';
import * as async from 'async';

@Injectable({
  providedIn: 'root'
})
export class DataStoreManagerService {
  constructor(private httpCLientService: HttpClientService) {}

  discoveringDataStoreFromServer(currentUser: CurrentUser): Observable<any> {
    return new Observable(observer => {
      this.getDataStoreByNameSpaceAndKeys(currentUser)
        .then((response: any) => {
          const { dataStore, errorResponse } = response;
          if (errorResponse && dataStore.length === 0) {
            observer.error(errorResponse);
          } else {
            observer.next(dataStore);
            observer.complete();
          }
        })
        .catch((error: any) => {
          observer.error(error);
        });
    });
  }

  async getDataStoreByNameSpaceAndKeys(currentUser: CurrentUser) {
    let dataStore: any = [];
    let errorResponse = null;
    try {
      const nameSpaces = await this.getAllNameSpacesfromServer(currentUser);
      const nameSpaceKeysArray = [];
      for (const nameSpace of nameSpaces) {
        const nameSpaceKeys = await this.getNameSpaceKeysByNameSpace(
          currentUser,
          nameSpace
        );
        nameSpaceKeysArray.push({ nameSpace, nameSpaceKeys });
      }
      const dataStoreFetcherObject = _.flattenDeep(
        _.map(nameSpaceKeysArray, (nameSpaceKeysObj: any) => {
          const { nameSpace, nameSpaceKeys } = nameSpaceKeysObj;
          const resource = 'dataStore';
          return _.map(nameSpaceKeys, (key: string) => {
            const url = `/api/${resource}/${nameSpace}/${key}`;
            return { url, key, nameSpace };
          });
        })
      );
      dataStore = await this.getDataStoreByNameSpaceAndKeyFromServer(
        dataStoreFetcherObject,
        currentUser
      );
    } catch (error) {
      errorResponse = error;
    } finally {
      return { dataStore, errorResponse };
    }
  }

  async getAllNameSpacesfromServer(currentUser: CurrentUser) {
    const resource = 'dataStore';
    const url = `/api/${resource}`;
    const nameSpaces: any = await this.httpCLientService.get(
      url,
      true,
      currentUser
    );
    return nameSpaces;
  }

  async getNameSpaceKeysByNameSpace(
    currentUser: CurrentUser,
    nameSpace: string
  ) {
    const resource = 'dataStore';
    const url = `/api/${resource}/${nameSpace}`;
    const nameSpaceKeys: any = await this.httpCLientService.get(
      url,
      true,
      currentUser
    );
    return nameSpaceKeys;
  }

  async getDataStoreByNameSpaceAndKeyFromServer(
    dataStoreFetcherObject: any[],
    currentUser: CurrentUser
  ) {
    const that = this;
    return new Promise((resolve, reject) => {
      let completed = 0;
      const response = [];
      const status = 'synced';
      async.mapLimit(
        dataStoreFetcherObject,
        dataStoreFetcherObject.length,
        async function(dataStoreFetcher: any) {
          const { url, key, nameSpace } = dataStoreFetcher;
          const id = `${nameSpace}_${key}`;
          const data = await that.httpCLientService.get(url, true, currentUser);
          response.push({ data, status, nameSpace, key, id });
          completed++;
          if (completed === dataStoreFetcherObject.length) {
            resolve(response);
          }
        },
        (error: any, results: any) => {
          if (error) {
            reject(error);
          }
          console.log({ error, results });
        }
      );
    });
  }

  savingDataStoreDataToLocalStorage(dataStoreData: any[]): Observable<any> {
    return new Observable(observer => {
      const repository = getRepository('DataStoreEntity') as Repository<
        DataStoreEntity
      >;
      const chunk = 10;
      repository
        .save(dataStoreData, { chunk })
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch((error: any) => {
          observer.error(error);
        });
    });
  }
}
