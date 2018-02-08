import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InterpretationService } from '../../services/interpretation.service';

@Component({
  selector: 'app-edit-interpretation',
  templateUrl: './edit-interpretation.component.html'
})
export class EditInterpretationComponent implements OnInit {

  @Input() rootUrl: string;
  @Output() onInterpretationEdit: EventEmitter<any> = new EventEmitter<any>();
  @Input() interpretation: any;
  creating: boolean;
  constructor(private interpretationService: InterpretationService) {
    this.creating = false;
  }

  ngOnInit() {
  }

  editInterpretation(e) {
    e.stopPropagation();
    this.creating = true;
    this.interpretationService.edit(this.interpretation, this.rootUrl)
      .subscribe((interpretation: any) => {
        this.creating = false;
        this.onInterpretationEdit.emit(interpretation);
      }, error => console.log(error))
  }

  cancel(e) {
    e.stopPropagation();
  }

}
