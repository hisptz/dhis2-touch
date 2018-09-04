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
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { CurrentUser } from '../../models/currentUser';
import { CurrentUserActions, CurrentUserActionTypes } from '../actions';
export interface currentUserState extends EntityState<CurrentUser> {
  currentUserId: string;
}

export const currentUserAdapter: EntityAdapter<
  CurrentUser
> = createEntityAdapter<CurrentUser>();

const initialState: currentUserState = currentUserAdapter.getInitialState({
  currentUserId: null
});

export function currentUserReducer(
  state = initialState,
  action: CurrentUserActions
): currentUserState {
  switch (action.type) {
    case CurrentUserActionTypes.AddCurrentUser: {
      return currentUserAdapter.addOne(action.payload.currentUser, state);
    }
    case CurrentUserActionTypes.UpdateCurrentUser: {
      return currentUserAdapter.updateOne(
        { id: action.payload.id, changes: action.payload.currentUser },
        state
      );
    }
    case CurrentUserActionTypes.SetCurrentUser: {
      return { ...state, currentUserId: action.payload.id };
    }
    case CurrentUserActionTypes.ClearCurrentUser: {
      return { ...state, currentUserId: null };
    }
    default: {
      return state;
    }
  }
}
