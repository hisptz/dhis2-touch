import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

/**
 * Generated class for the TrackerRegistrationFormComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'tracker-registration-form',
  templateUrl: 'tracker-registration-form.html'
})
export class TrackerRegistrationFormComponent implements OnInit {
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

  @Output() onChange = new EventEmitter();

  entryFormType: string;
  
  constructor() {}

  ngOnInit() {
    this.entryFormType = 'tracker';
    console.log("errorOrWarningMessage : " + JSON.stringify(this.errorOrWarningMessage))
  }

  trackByFn(index, item) {
    return item && item.id ? item.id : index;
  }

  updateData(event) {
    this.onChange.emit(event);
  }
}
