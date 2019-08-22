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

import { createSelector } from '@ngrx/store';
import * as _ from 'lodash';
import { AppItem, CurrentUser } from 'src/models';
import { getRootState, State } from '../reducers';
import { currentUserAdapter } from '../reducers/current-user.reducer';
import { DEFAULT_COLOR_SETTING } from 'src/constants';

export const getUsersEntityState = createSelector(
  getRootState,
  (state: State) => state.currentUser
);

const getCurrentUserId = createSelector(
  getUsersEntityState,
  state => state.currentUserId
);

export const {
  selectIds: getCurrentUserIds,
  selectEntities: getCurrentUserEntities,
  selectAll: getAllCurrentUsers
} = currentUserAdapter.getSelectors(getUsersEntityState);

export const getCurrentUser = createSelector(
  getCurrentUserId,
  getCurrentUserEntities,
  (currentUserId, entities) => {
    return currentUserId && entities && entities[currentUserId]
      ? entities[currentUserId]
      : null;
  }
);

export const getAccountTitle = createSelector(
  getCurrentUser,
  (currentUser: CurrentUser) => {
    return currentUser && currentUser.name
      ? currentUser.name
          .split(' ')
          .map(name => name.charAt(0).toUpperCase())
          .join('')
      : 'Account';
  }
);

export const getCurrentUserColorSettings = createSelector(
  getUsersEntityState,
  state => {
    let { colorSettings } = state;
    colorSettings = colorSettings ? colorSettings : DEFAULT_COLOR_SETTING;
    return colorSettings;
  }
);

export const getCurrentUserDataSets = createSelector(
  getCurrentUser,
  (currentUser: CurrentUser) => currentUser.dataSets
);

export const getCurrentUserPrograms = createSelector(
  getCurrentUser,
  (currentUser: CurrentUser) => currentUser.programs
);

export const getCurrentUserAuthorities = createSelector(
  getCurrentUser,
  (currentUser: CurrentUser) =>
    currentUser && currentUser.authorities ? currentUser.authorities : []
);

export const getAthorizedApps = (apps: AppItem[]) =>
  createSelector(
    getCurrentUserAuthorities,
    (currentUserAuthorities: string[]) => {
      let authorizedApps = [];
      if (_.indexOf(currentUserAuthorities, 'ALL') > -1) {
        authorizedApps = _.concat(authorizedApps, apps);
      } else {
        apps.map(app => {
          const { authorites } = app;
          if (authorites.length === 0) {
            authorizedApps = _.concat(authorizedApps, app);
          }
          authorites.map(authority => {
            if (_.indexOf(currentUserAuthorities, authority) > -1) {
              authorizedApps = _.concat(authorizedApps, app);
            }
          });
        });
      }
      return _.uniqBy(
        _.filter(authorizedApps, (authorizedApp: AppItem) => {
          return authorizedApp.isVisible;
        }),
        'id'
      );
    }
  );
