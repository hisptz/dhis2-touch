import { Component,EventEmitter, Input, OnInit, Output } from '@angular/core';

/**
 * Generated class for the ProgramStageComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'program-stage',
  templateUrl: 'program-stage.html'
})
export class ProgramStageComponent implements OnInit{

  @Input() programStage;
  
  constructor() {
  }

  ngOnInit(){

  }

}
