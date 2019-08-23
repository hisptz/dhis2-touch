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
import { Injectable } from '@angular/core';
import * as _ from 'lodash';

import { LocalInstance, CurrentUser } from 'src/models';
import { DEFAULT_LOCAL_INSTANCES } from 'src/constants';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class LocalInstanceService {
  constructor(private localStorageService: LocalStorageService) {}

  async getLocalInstances() {
    const defaultLocalInstances: LocalInstance[] = DEFAULT_LOCAL_INSTANCES;
    const key = 'LOCAL_INSTANCE_KEY';
    let localInstances = await this.localStorageService.getDataFromLocalStorage(
      key
    );
    localInstances = localInstances ? localInstances : [];
    const sanitizedLocalInstances = this.getSanitizedLocalInstances(
      localInstances,
      defaultLocalInstances
    );
    return _.sortBy(sanitizedLocalInstances, 'name');
  }

  async setLocalInstanceInstances(
    localInstances: LocalInstance[],
    loggedInInInstance: string,
    currentUser: CurrentUser
  ) {
    const key = 'LOCAL_INSTANCE_KEY';
    const sanitizedLocalInstances = this.getSanitizedLocalInstancesForSaving(
      localInstances,
      loggedInInInstance,
      currentUser
    );
    return this.localStorageService.setDataOnLocalStorage(
      sanitizedLocalInstances,
      key
    );
  }

  getSanitizedLocalInstancesForSaving(
    localInstances: LocalInstance[],
    loggedInInInstance: string,
    currentUser: CurrentUser
  ): LocalInstance[] {
    localInstances = _.filter(localInstances, (localInstance: any) => {
      return _.indexOf(localInstance.id, 'default') > -1;
    });
    const { serverUrl, currentDatabase, currentLanguage } = currentUser;
    let newInstances: LocalInstance[] = [];
    if (!loggedInInInstance && serverUrl) {
      loggedInInInstance = serverUrl;
      if (serverUrl.split('://').length > 1) {
        loggedInInInstance = serverUrl.split('://')[1];
      }
    }
    newInstances = [
      ...newInstances,
      {
        id: currentDatabase,
        name: loggedInInInstance,
        currentUser: currentUser,
        currentLanguage
      }
    ];
    if (localInstances && localInstances.length > 0) {
      localInstances.map((localInstance: any) => {
        if (localInstance.id !== currentDatabase) {
          if (!localInstance.currentUser.currentLanguage) {
            localInstance.currentLanguage = 'en';
            localInstance.currentUser.currentLanguage = 'en';
          }
          newInstances = [...newInstances, localInstance];
        }
      });
    }
    return _.flattenDeep(newInstances);
  }

  getSanitizedLocalInstances(
    localInstances: LocalInstance[],
    defaultInstances: LocalInstance[]
  ): LocalInstance[] {
    let sanitizedLocalInstances: LocalInstance[] = [];
    const omittedDefaultInstances = _.map(
      localInstances,
      (localInstance: LocalInstance) => localInstance.name
    );
    if (localInstances.length === 0) {
      sanitizedLocalInstances = _.flattenDepth([
        ...sanitizedLocalInstances,
        _.map(defaultInstances, (defaultInstance: LocalInstance) => {
          return {
            ...defaultInstance,
            name: defaultInstance.currentUser.serverUrl
          };
        })
      ]);
    } else {
      sanitizedLocalInstances = _.uniqBy(
        _.flattenDeep(
          _.map(
            [
              ...localInstances,
              ..._.filter(
                _.map(defaultInstances, (defaultInstance: LocalInstance) => {
                  return {
                    ...defaultInstance,
                    name: defaultInstance.currentUser.serverUrl
                  };
                }),
                (defaultInstance: LocalInstance) => {
                  return (
                    _.indexOf(omittedDefaultInstances, defaultInstance.name) ===
                    -1
                  );
                }
              )
            ],
            (localInstance: LocalInstance) => {
              const { name, currentUser } = localInstance;
              const { serverUrl } = currentUser;
              return { ...localInstance, name: name ? name : serverUrl };
            }
          )
        ),
        'id'
      );
    }
    return sanitizedLocalInstances;
  }
}
