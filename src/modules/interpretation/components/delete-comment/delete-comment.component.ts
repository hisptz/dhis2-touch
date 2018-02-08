import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InterpretationService } from '../../services/interpretation.service';

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
  constructor(private interpretationService: InterpretationService) { }

  ngOnInit() {
  }

  deleteComment(e) {
    e.stopPropagation();
    this.deleting = true;
    this.interpretationService.deleteComment(this.rootUrl, this.interpretationId, this.comment.id)
      .subscribe(() => this.onCommentDelete.emit(this.comment), () => {
        this.deleting = false;
        this.onCommentDeleteFail.emit(true);
      })
  }

  cancel(e) {
    e.stopPropagation();
    this.onCommentDeleteCancel.emit(true);
  }
}
