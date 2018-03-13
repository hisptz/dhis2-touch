import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InterpretationService } from '../../services/interpretation.service';
import { AppTranslationProvider } from '../../../../providers/app-translation/app-translation';

@Component({
  selector: 'app-delete-comment',
  templateUrl: './delete-comment.component.html'
})
export class DeleteCommentComponent implements OnInit {
  deleting: boolean;
  @Input() rootUrl: string;
  @Input() interpretationId: string;
  @Input() comment: any;
  @Output() onCommentDelete: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCommentDeleteFail: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCommentDeleteCancel: EventEmitter<any> = new EventEmitter<any>();
  translationMapper: any;
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
    return ['This comment will be deleted, are you sure?', 'Deleting comment'];
  }

  deleteComment(e) {
    e.stopPropagation();
    this.deleting = true;
    this.interpretationService
      .deleteComment(this.rootUrl, this.interpretationId, this.comment.id)
      .subscribe(
        () => this.onCommentDelete.emit(this.comment),
        () => {
          this.deleting = false;
          this.onCommentDeleteFail.emit(true);
        }
      );
  }

  cancel(e) {
    e.stopPropagation();
    this.onCommentDeleteCancel.emit(true);
  }
}
