import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InterpretationService } from '../../services/interpretation.service';
import { AppTranslationProvider } from '../../../../providers/app-translation/app-translation';

@Component({
  selector: 'app-edit-comment',
  templateUrl: './edit-comment.component.html'
})
export class EditCommentComponent implements OnInit {
  @Input() rootUrl: string;
  @Input() comment: any;
  @Input() interpretation: any;
  @Output() onCommentEdit: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCommentEditCancel: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCommentEditFail: EventEmitter<any> = new EventEmitter<any>();
  translationMapper: any;
  creating: boolean;
  constructor(
    private interpretationService: InterpretationService,
    private appTranslation: AppTranslationProvider
  ) {}

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
    return ['Cancel', 'Posting', 'Post'];
  }

  cancel(e) {
    e.stopPropagation();
    this.onCommentEditCancel.emit(true);
  }

  editComment(e) {
    e.stopPropagation();
    this.creating = true;
    this.interpretationService
      .editComment(this.rootUrl, this.interpretation, this.comment)
      .subscribe(
        interpretation => this.onCommentEdit.emit(interpretation),
        () => this.onCommentEditFail.emit(true)
      );
  }
}
