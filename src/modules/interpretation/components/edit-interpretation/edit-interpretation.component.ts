import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InterpretationService } from '../../services/interpretation.service';
import { AppTranslationProvider } from '../../../../providers/app-translation/app-translation';

@Component({
  selector: 'app-edit-interpretation',
  templateUrl: './edit-interpretation.component.html'
})
export class EditInterpretationComponent implements OnInit {
  @Input() rootUrl: string;
  @Output() onInterpretationEdit: EventEmitter<any> = new EventEmitter<any>();
  @Input() interpretation: any;
  creating: boolean;
  translationMapper: any;
  constructor(
    private interpretationService: InterpretationService,
    private appTranslation: AppTranslationProvider
  ) {
    this.creating = false;
  }

  ngOnInit() {
    this.translationMapper = {};
    this.appTranslation.getTransalations(this.getValuesToTranslate()).subscribe(
      (data: any) => {
        this.translationMapper = data;
      },
      error => {}
    );
  }

  getValuesToTranslate() {
    return ['Write new interpretation', 'Cancel', 'Posting', 'Post'];
  }

  editInterpretation(e) {
    e.stopPropagation();
    this.creating = true;
    this.interpretationService
      .edit(this.interpretation, this.rootUrl)
      .subscribe(
        (interpretation: any) => {
          this.creating = false;
          this.onInterpretationEdit.emit(interpretation);
        },
        error => console.log(error)
      );
  }

  cancel(e) {
    e.stopPropagation();
  }
}
