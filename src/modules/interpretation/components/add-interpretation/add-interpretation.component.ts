import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { InterpretationService } from '../../services/interpretation.service';
import { Subscription } from 'rxjs/Subscription';
import { AppTranslationProvider } from '../../../../providers/app-translation/app-translation';

@Component({
  selector: 'app-add-interpretation',
  templateUrl: './add-interpretation.component.html'
})
export class AddInterpretationComponent implements OnInit {
  @Input() visualizationTypeObject: any;
  @Input() rootUrl: string;
  @Output() onInterpretationCreate: EventEmitter<any> = new EventEmitter<any>();
  interpretation: any;
  creating: boolean;
  subscription: Subscription;
  translationMapper: any;

  constructor(
    private interpretationService: InterpretationService,
    private appTranslation: AppTranslationProvider
  ) {
    this.creating = false;
  }

  ngOnInit() {
    if (this.visualizationTypeObject) {
      this.interpretation = {
        id: this.visualizationTypeObject.id,
        type: this.visualizationTypeObject.type,
        message: ''
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
    return ['Write new interpretation', 'Cancel', 'Posting', 'Post'];
  }

  postInterpretation(e) {
    e.stopPropagation();
    this.creating = true;
    this.subscription = this.interpretationService
      .create(this.interpretation, this.rootUrl)
      .subscribe(
        (interpretations: any[]) => {
          this.creating = false;
          this.interpretation.message = '';
          this.onInterpretationCreate.emit(interpretations);
        },
        error => console.log(error)
      );
  }

  cancel(e) {
    e.stopPropagation();
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.creating = false;
    }
    this.interpretation.message = '';
  }
}
