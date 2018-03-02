import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InterpretationService } from '../../services/interpretation.service';
import * as _ from 'lodash';
import { AppTranslationProvider } from '../../../../providers/app-translation/app-translation';

@Component({
  selector: 'app-interpretation-like',
  templateUrl: './interpretation-like.component.html'
})
export class InterpretationLikeComponent implements OnInit {
  @Input() interpretation: any;
  @Input() rootUrl: string;
  @Input() currentUser: any;
  updatingLikeStatus: boolean;
  translationMapper: any;
  @Output() onInterpretationUpdate: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private interpretationService: InterpretationService,
    private appTranslation: AppTranslationProvider
  ) {
    this.updatingLikeStatus = false;
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
    return ['Updating likes status', 'Unlike', 'Like'];
  }

  get likeText() {
    let likeText = '';

    if (this.interpretation.likedBy.length > 0) {
      const hasCurrentUserLiked = _.some(
        this.interpretation.likedBy,
        likeByObject => likeByObject.id === this.currentUser.id
      );
      if (hasCurrentUserLiked) {
        likeText += 'You';
      }

      if (hasCurrentUserLiked && this.interpretation.likedBy.length > 1) {
        likeText += ' and ';

        if (this.interpretation.likedBy.length > 2) {
          likeText += this.interpretation.likedBy.length - 1 + ' other';
        } else {
          const otherPerson = this.interpretation.likedBy.filter(
            likeObject => likeObject.id !== this.currentUser.id
          )[0];
          likeText += otherPerson.displayName;
        }
      } else if (!hasCurrentUserLiked) {
        if (this.interpretation.likedBy.length === 1) {
          likeText += this.interpretation.likedBy[0].displayName;
        } else {
          likeText += this.interpretation.likedBy.length + ' people';
        }
      }
    }

    likeText += ' liked this';
    return likeText;
  }

  get currentUserLiked() {
    return _.some(
      this.interpretation.likedBy,
      likeByObject => likeByObject.id === this.currentUser.id
    );
  }

  toggleLikeStatus(e) {
    e.stopPropagation();
    this.updatingLikeStatus = true;
    const userDidLike = _.some(
      this.interpretation.likedBy,
      likeByObject => likeByObject.id === this.currentUser.id
    );
    this.interpretationService
      .updateLikeStatus(this.interpretation, this.rootUrl, !userDidLike)
      .subscribe(
        (newInterpretation: any) => {
          this.updatingLikeStatus = false;
          this.onInterpretationUpdate.emit(newInterpretation);
        },
        error => {
          console.log(error);
        }
      );
  }
}
