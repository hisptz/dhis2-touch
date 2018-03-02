import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InterpretationService } from '../../services/interpretation.service';
import { AppTranslationProvider } from '../../../../providers/app-translation/app-translation';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html'
})
export class AddCommentComponent implements OnInit {
  @Input() interpretation: any;
  @Input() rootUrl: string;
  commentFormData: any;
  @Output() onCommentCreate: EventEmitter<any> = new EventEmitter<any>();
  creating: boolean;
  translationMapper: any;

  constructor(
    private interpretationService: InterpretationService,
    private appTranslation: AppTranslationProvider
  ) {
    this.creating = false;
  }

  ngOnInit() {
    if (this.interpretation) {
      this.commentFormData = {
        id: this.interpretation.id,
        type: this.interpretation.type,
        comment: ''
      };
    }
    this.translationMapper = {};
    this.appTranslation.getTransalations(this.getValuesToTranslate()).subscribe(
      (data: any) => {
        this.translationMapper = data;
      },
      error => {}
    );
  }

  getValuesToTranslate() {
    return ['Write your comment', 'Cancel', 'Posting', 'Post'];
  }

  postComment(e) {
    e.stopPropagation();
    this.creating = true;
    this.interpretationService
      .postComment(this.commentFormData, this.rootUrl)
      .subscribe(
        (interpretation: any[]) => {
          this.creating = false;
          this.commentFormData.comment = '';
          this.onCommentCreate.emit(interpretation);
        },
        error => {
          this.creating = false;
          console.log(error);
        }
      );
  }

  cancel(e) {
    e.stopPropagation();
    this.commentFormData.comment = '';
  }
}
