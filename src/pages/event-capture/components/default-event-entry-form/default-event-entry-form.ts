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

  @Output() onChange = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  updateData(data) {
    this.onChange.emit(data);
  }

  trackByFn(index, item) {
    return item.id;
  }
}
