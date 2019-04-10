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
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'profile-enrollment-form',
  templateUrl: 'profile-enrollment-form.html'
})
export class ProfileEnrollmentFormComponent implements OnInit {
  @Input() currentProgram;
  @Input() enrollmentDate;
  @Input() incidentDate;
  @Input() coordinate;

  @Input() formLayout: string;
  @Input() dataObject;
  @Input() currentUser;
  @Input() trackedEntityAttributesSavingStatusClass;
  @Input() trackerRegistrationForm: string;
  @Input() programTrackedEntityAttributes;
  @Input() hiddenFields;
  @Input() hiddenSections;
  @Input() errorOrWarningMessage;
  @Input() dataUpdateStatus: { [elementId: string]: string };

  @Input() isTrackedEntityRegistered: boolean;

  @Output() deleteTrackedEntityInstance = new EventEmitter();
  @Output() updateEnrollment = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  onUpdateEnrollmentDeatils(data) {
    const { enrollmentDate, incidentDate, coordinate } = data;
    console.log({ enrollmentDate, incidentDate, coordinate });
  }

  onDeleteTrackedEntityInstance() {
    console.log('On delete');
  }
}
