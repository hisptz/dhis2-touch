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
import { State, getCurrentUserColorSettings } from '../../../store';
import { AppColorObject, CurrentEntrySelection, CurrentUser } from 'src/models';
import { DEFAULT_CURRENT_ENTRY_SELECTION } from 'src/constants';
import { UserService } from 'src/app/services/user.service';
import { CurrentEntrySelectionStorageService } from 'src/app/services/current-entry-selection-storage.service';
import { ToasterMessagesService } from 'src/app/services/toaster-messages.service';

@Component({
  selector: 'app-event-capture',
  templateUrl: './event-capture.page.html',
  styleUrls: ['./event-capture.page.scss']
})
export class EventCapturePage implements OnInit {
  colorSettings$: Observable<AppColorObject>;
  currentEntrySelection: CurrentEntrySelection;
  allowMultipleOuSelection: boolean;
  authorities: string[];
  programIdsByUserRoles: string[];
  programType: string;
  currentUser: CurrentUser;
  isLoading: boolean;

  constructor(
    private store: Store<State>,
    private userService: UserService,
    private toasterMessagesService: ToasterMessagesService,
    private currentEntrySelectionStorageService: CurrentEntrySelectionStorageService
  ) {
    this.colorSettings$ = this.store.select(getCurrentUserColorSettings);
    this.authorities = [];
    this.programIdsByUserRoles = [];
    this.allowMultipleOuSelection = false;
    this.isLoading = true;
    this.programType = 'WITHOUT_REGISTRATION';
  }

  ngOnInit() {
    this.discoveringCurrentUser();
  }

  async discoveringCurrentUser() {
    try {
      this.currentUser = await this.userService.getCurrentUser();
      const { authorities, programs } = this.currentUser;
      this.authorities = authorities;
      this.programIdsByUserRoles = programs;
      await this.getCurrentEntrySelection(this.currentUser);
    } catch (error) {
      const message = `Error : ${JSON.stringify(error)}`;
      this.toasterMessagesService.showToasterMessage(message);
    } finally {
      setTimeout(() => {
        this.isLoading = false;
      }, 100);
    }
  }

  async getCurrentEntrySelection(currentUser: CurrentUser) {
    const selections = await this.currentEntrySelectionStorageService.getCurrentEntrySelection(
      currentUser
    );
    this.currentEntrySelection = selections
      ? selections
      : DEFAULT_CURRENT_ENTRY_SELECTION;
  }

  async onCurrentSelectionChange(response: any) {
    const { isFormReady, currentEntrySelection } = response;
    if (currentEntrySelection) {
      this.currentEntrySelection = currentEntrySelection;
      this.currentEntrySelectionStorageService.setCurrentEntrySelection(
        currentEntrySelection,
        this.currentUser
      );
    }
    console.log({ isFormReady });
  }
}
