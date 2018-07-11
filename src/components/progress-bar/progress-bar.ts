import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

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
export class ProgressBarComponent implements OnInit{

  @Input() progressBar;
  @Input() progressBarTitle;
  @Output() isProcessActive = new EventEmitter();

  cancelIcon : string;

  constructor() {
  }


  getPercentage(progressBar){
    return parseInt(progressBar);
  }

  ngOnInit(){
    this.cancelIcon = "assets/icon/cancel.png";
  }

  cancelRunningProcess(){
    this.isProcessActive.emit({isProcessActive : false});
  }



}
