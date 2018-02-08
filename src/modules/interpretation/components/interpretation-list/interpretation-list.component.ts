import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output
} from "@angular/core";
import * as _ from "lodash";
import * as moment from "moment";
import { InterpretationService } from "../../services/interpretation.service";

@Component({
  selector: "app-interpretation-list",
  templateUrl: "./interpretation-list.component.html"
})
export class InterpretationListComponent implements OnInit {
  @Input() interpretations: any[];
  @Input() rootUrl: string;
  @Input() itemHeight: string;
  @Input() currentUser: any;
  @Output() onInterpretationUpdate: EventEmitter<any> = new EventEmitter<any>();
  @Input() visualizationTypeObject: any;
  interpretationTerm: string;
  constructor(private interpretationService: InterpretationService) {}

  ngOnInit() {
    if (this.interpretations) {
      this.interpretations = this.interpretations.map(
        (interpretation: any, index: number) =>
          this._sanitizeInterpretation(interpretation, index)
      );
    }
  }

  private _sanitizeInterpretation(interpretation: any, index) {
    const newInterpretation: any = { ...interpretation };
    if (!newInterpretation.showDate) {
      newInterpretation.showDate = true;
    }

    if (!newInterpretation.showMoreButton) {
      newInterpretation.showMoreButton = false;
    }

    if (!newInterpretation.showDropdownOptions) {
      newInterpretation.showDropdownOptions = false;
    }

    if (!newInterpretation.showCommentBlock) {
      newInterpretation.showCommentBlock = index === 0 ? true : false;
    }

    if (!newInterpretation.showDeleteButton) {
      newInterpretation.showDeleteButton =
        newInterpretation.user.id === this.currentUser.id;
    }

    newInterpretation.lastUpdated = moment(
      newInterpretation.lastUpdated
    ).fromNow();

    return newInterpretation;
  }

  toggleInterpretationOptions(
    interpretation: any,
    e,
    mouseEnter: boolean = false
  ) {
    e.stopPropagation();
    const interpretationIndex = _.findIndex(
      this.interpretations,
      _.find(this.interpretations, ["id", interpretation.id])
    );

    if (interpretationIndex !== -1) {
      if (mouseEnter) {
        interpretation.showDate = false;
        interpretation.showMoreButton = true;
      } else {
        interpretation.showDate = true;
        interpretation.showMoreButton = false;
        interpretation.showDropdownOptions = false;
      }

      this.interpretations = [
        ...this.interpretations.slice(0, interpretationIndex),
        interpretation,
        ...this.interpretations.slice(interpretationIndex + 1)
      ];
    }
  }

  toggleInterpretationDropdownOptions(interpretationIndex, e?) {
    e.stopPropagation();
    const interpretation: any = this.interpretations[interpretationIndex];

    if (interpretation) {
      interpretation.showDropdownOptions = !interpretation.showDropdownOptions;
      this.interpretations = [
        ...this.interpretations.slice(0, interpretationIndex),
        interpretation,
        ...this.interpretations.slice(interpretationIndex + 1)
      ];
    }
    this.emitInterpretationUpdates();
  }

  updateInterpretationList(interpretationList) {
    if (interpretationList) {
      const newInterpretationList = interpretationList.filter(
        interpretation =>
          !_.find(this.interpretations, ["id", interpretation.id])
      );

      this.interpretations = [
        ...newInterpretationList,
        ...this.interpretations
      ].map((interpretation: any, index: number) =>
        this._sanitizeInterpretation(interpretation, index)
      );

      this.interpretations = this.interpretations.map(interpretation => {
        if (newInterpretationList[0].id !== interpretation.id) {
          interpretation.showCommentBlock = false;
        }
        return interpretation;
      });
    }

    this.emitInterpretationUpdates();
  }

  toggleCommentBlock(interpretationIndex, e) {
    e.stopPropagation();
    const toggleInterpretation: any = this.interpretations[interpretationIndex];

    if (toggleInterpretation) {
      toggleInterpretation.showCommentBlock = !toggleInterpretation.showCommentBlock;

      this.interpretations = this.interpretations.map(interpretation => {
        if (toggleInterpretation.id !== interpretation.id) {
          interpretation.showCommentBlock = false;
        }
        return interpretation;
      });
    }

    this.emitInterpretationUpdates();
  }

  updateInterpretationLikeStatus(interpretation: any) {
    this.interpretations = this.interpretations.map(interpretationObject => {
      const newInterpretationObject: any = { ...interpretationObject };
      if (interpretationObject.id === interpretation.id) {
        newInterpretationObject.likes = interpretation.likes;
        newInterpretationObject.likedBy = [...interpretation.likedBy];
      }

      return newInterpretationObject;
    });

    this.emitInterpretationUpdates();
  }

  updateInterpretationComment(interpretation: any) {
    this.interpretations = this.interpretations.map(interpretationObject => {
      const newInterpretationObject: any = { ...interpretationObject };
      if (interpretationObject.id === interpretation.id) {
        newInterpretationObject.comments = [...interpretation.comments];
      }

      return newInterpretationObject;
    });

    this.emitInterpretationUpdates();
  }

  deleteInterpretationComment(interpretation, deletedComment) {
    const correspondinginterpretation: any = _.find(this.interpretations, [
      "id",
      interpretation.id
    ]);

    if (correspondinginterpretation) {
      const interpretationIndex = _.findIndex(
        this.interpretations,
        correspondinginterpretation
      );

      const availableComment = _.find(correspondinginterpretation.comments, [
        "id",
        deletedComment.id
      ]);

      if (availableComment) {
        const deletedCommentIndex = _.findIndex(
          correspondinginterpretation.comments,
          availableComment
        );

        const newComments = [
          ...correspondinginterpretation.comments.slice(0, deletedCommentIndex),
          ...correspondinginterpretation.comments.slice(deletedCommentIndex + 1)
        ];

        this.interpretations = [
          ...this.interpretations.slice(0, interpretationIndex),
          { ...correspondinginterpretation, comments: newComments },
          ...this.interpretations.slice(interpretationIndex + 1)
        ];
      }
    }
  }

  updateInterpretationText(interpretation: any) {
    this.interpretations = this.interpretations.map(interpretationObject => {
      const newInterpretationObject: any = { ...interpretationObject };
      if (interpretationObject.id === interpretation.id) {
        newInterpretationObject.text = interpretation.text;
        newInterpretationObject.lastUpdated = interpretation.lastUpdated;
        newInterpretationObject.showEditForm = false;
      }

      return newInterpretationObject;
    });

    this.emitInterpretationUpdates();
  }

  openInterpretationEditForm(interpretation, e) {
    e.stopPropagation();

    this.interpretations = this.interpretations.map(interpretationObject => {
      const newInterpretationObject: any = { ...interpretationObject };
      if (interpretationObject.id === interpretation.id) {
        newInterpretationObject.showEditForm = true;
        newInterpretationObject.showDropdownOptions = false;
      }

      return newInterpretationObject;
    });

    this.emitInterpretationUpdates();
  }

  toggleDeleteConfirmationDialog(interpretation, e) {
    e.stopPropagation();

    this.interpretations = this.interpretations.map(interpretationObject => {
      const newInterpretationObject: any = { ...interpretationObject };
      if (interpretationObject.id === interpretation.id) {
        newInterpretationObject.showDeleteDialog = !newInterpretationObject.showDeleteDialog;
        newInterpretationObject.showDropdownOptions = false;
      }

      return newInterpretationObject;
    });

    this.emitInterpretationUpdates();
  }

  deleteInterpretation(interpretation, e) {
    e.stopPropagation();
    this.interpretations = this.interpretations.map(interpretationObject => {
      const newInterpretationObject: any = { ...interpretationObject };
      if (interpretationObject.id === interpretation.id) {
        newInterpretationObject.showDeleteDialog = false;
        newInterpretationObject.deleting = true;
      }

      return newInterpretationObject;
    });

    this.interpretationService.delete(interpretation, this.rootUrl).subscribe(
      () => {
        const interpretationIndex = _.findIndex(
          this.interpretations,
          _.find(this.interpretations, ["id", interpretation.id])
        );

        if (interpretationIndex !== -1) {
          this.interpretations = [
            ...this.interpretations.slice(0, interpretationIndex),
            ...this.interpretations.slice(interpretationIndex + 1)
          ];
        }

        this.emitInterpretationUpdates();
      },
      deleteError => {
        this.interpretations = this.interpretations.map(
          interpretationObject => {
            const newInterpretationObject: any = { ...interpretationObject };
            if (interpretationObject.id === interpretation.id) {
              newInterpretationObject.deleting = false;
            }

            return newInterpretationObject;
          }
        );
      }
    );
  }

  emitInterpretationUpdates() {
    this.onInterpretationUpdate.emit(this.interpretations);
  }
}
