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
  selector: 'enrollment-form',
  templateUrl: 'enrollment-form.html'
})
export class EnrollmentFormComponent implements OnInit {
  @Input() currentProgram;
  @Input() enrollmentDate;
  @Input() incidentDate;
  @Input() coordinate;
  @Input() isTrackedEntityRegistered: boolean;

  @Output() deleteTrackedEntityInstance = new EventEmitter();
  @Output() updateEnrollment = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  updateDateSelection(date, dateType) {
    if (date && date !== '') {
      dateType === 'enrollmentDate'
        ? (this.enrollmentDate = date)
        : (this.incidentDate = date);
      this.updateEnrollmentDeatils();
    } else {
      if (this.isTrackedEntityRegistered) {
        const title =
          'Clearing this value results to deletion of all information related to this instance, are you sure?';
        this.deleteTrackedEntityInstance.emit({ status: true });
      } else {
        dateType === 'enrollmentDate'
          ? (this.enrollmentDate = date)
          : (this.incidentDate = date);
        this.updateEnrollmentDeatils();
      }
    }
  }

  updateEventCoordonate(coordinate) {
    this.coordinate = coordinate;
    this.updateEnrollmentDeatils();
  }

  updateEnrollmentDeatils() {
    let isFormReady = true;
    if (
      this.currentProgram &&
      this.currentProgram.displayIncidentDate &&
      (!this.incidentDate || this.incidentDate.trim() === '')
    ) {
      isFormReady = false;
    }
    if (
      this.currentProgram &&
      this.currentProgram.captureCoordinates &&
      !this.coordinate
    ) {
      isFormReady = false;
    }
    this.updateEnrollment.emit({
      isFormReady,
      enrollmentDate: this.enrollmentDate,
      incidentDate: this.enrollmentDate,
      coordinate: this.coordinate
    });
  }
}
