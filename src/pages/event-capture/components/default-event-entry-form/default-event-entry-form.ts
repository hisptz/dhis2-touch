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

  constructor() {
    this.isSectionOpen = {};
  }

  ngOnInit() {
    if (this.programStage) {
      const { programStageSections } = this.programStage;
      if (programStageSections && programStageSections.length > 0) {
        const { id } = programStageSections[0];
        this.toggleSection(id);
      }
    }
    console.log(
      'errorOrWarningMessage : ' + JSON.stringify(this.errorOrWarningMessage)
    );
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
