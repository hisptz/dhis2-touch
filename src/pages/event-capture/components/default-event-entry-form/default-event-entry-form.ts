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
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

/**
 * Generated class for the DefaultEventEntryFormComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'default-event-entry-form',
  templateUrl: 'default-event-entry-form.html'
})
export class DefaultEventEntryFormComponent implements OnInit {
  @Input() programStage;
  @Input() currentUser;
  @Input() dataObject;
  @Input() dataValuesSavingStatusClass;
  @Input() hiddenFields;
  @Input() hiddenSections;
  @Input() errorOrWarningMessage;

  @Output() onChange = new EventEmitter();

  isSectionOpen: any;
  isEventCompleted: boolean;

  constructor() {
    this.isSectionOpen = {};
    this.isEventCompleted = false;
  }

  ngOnInit() {
    if (this.programStage) {
      const { programStageSections } = this.programStage;
      if (programStageSections && programStageSections.length > 0) {
        const { id } = programStageSections[0];
        this.toggleSection(id);
      }
    }
  }

  toggleSection(sectionId) {
    if (sectionId) {
      if (this.isSectionOpen[sectionId]) {
        this.isSectionOpen[sectionId] = false;
      } else {
        Object.keys(this.isSectionOpen).map(key => {
          this.isSectionOpen[key] = false;
        });
        this.isSectionOpen[sectionId] = true;
      }
    }
  }

  updateData(data) {
    this.onChange.emit(data);
  }

  trackByFn(index, item) {
    return item.id;
  }
}
