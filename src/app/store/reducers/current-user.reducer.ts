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
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import * as curentUserAction from '../actions/current-user.actions';
import { CurrentUser, AppColorObject } from 'src/models';
import { DEFAULT_COLOR_SETTING } from 'src/constants';

export interface CurrentUserState extends EntityState<CurrentUser> {
  currentUserId: string;
  colorSettings: AppColorObject;
}

export const currentUserAdapter: EntityAdapter<CurrentUser> = createEntityAdapter<
  CurrentUser
>();

const initialUserState: CurrentUserState = currentUserAdapter.getInitialState({
  currentUserId: null,
  colorSettings: DEFAULT_COLOR_SETTING
});

export const reducer = createReducer(
  initialUserState,
  on(curentUserAction.AddCurrentUser, (state, { currentUser }) => {
    return currentUserAdapter.addOne(currentUser, state);
  }),
  on(curentUserAction.UpdateCurrentUser, (state, { currentUser, id }) => {
    return currentUserAdapter.updateOne({ id, changes: currentUser }, state);
  }),
  on(curentUserAction.SetCurrentUser, (state, { id }) => {
    return { ...state, currentUserId: id };
  }),
  on(
    curentUserAction.SetCurrentUserColorSettings,
    (state, { colorSettings }) => {
      return { ...state, colorSettings };
    }
  ),
  on(curentUserAction.ClearCurrentUser, state => {
    return { ...state, currentUserId: null };
  })
);

export function currentUserReducer(
  state: CurrentUserState | undefined,
  action: Action
): CurrentUserState {
  return reducer(state, action);
}
