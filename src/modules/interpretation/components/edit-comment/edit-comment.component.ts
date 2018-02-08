import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {InterpretationService} from '../../services/interpretation.service';

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
  creating: boolean;
  constructor(private interpretationService: InterpretationService) { }

  ngOnInit() {
  }

  cancel(e) {
    e.stopPropagation();
    this.onCommentEditCancel.emit(true)
  }

  editComment(e) {
    e.stopPropagation();
    this.creating = true;
    this.interpretationService.editComment(
      this.rootUrl,
      this.interpretation,
      this.comment
    ).subscribe((interpretation) => this.onCommentEdit.emit(interpretation),
      () => this.onCommentEditFail.emit(true));
  }
}
