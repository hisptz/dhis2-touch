import {Component, EventEmitter, Input, Output} from '@angular/core';

/**
 * Generated class for the ProgressBarComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'progress-bar',
  templateUrl: 'progress-bar.html'
})
export class ProgressBarComponent {

  @Input() progressBar;
  @Input() progressBarTitle;
  @Output() isProcessActive = new EventEmitter();

  constructor() {
  }

  cancelRunningProcess(){
    this.isProcessActive.emit({isProcessActive : false});
  }



}
