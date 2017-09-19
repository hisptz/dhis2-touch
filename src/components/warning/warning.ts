import {Component, Input, OnInit} from '@angular/core';

/**
 * Generated class for the WarningComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'warning',
  templateUrl: 'warning.html'
})
export class WarningComponent implements OnInit{

  @Input() warningMessage;
  icon : string;
  constructor() {
  }
  ngOnInit(){
    this.icon = "assets/icon/warning.png";
  }

}
