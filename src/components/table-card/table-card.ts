import { Component,Input,OnInit } from '@angular/core';

/**
 * Generated class for the TableCardComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'table-card',
  templateUrl: 'table-card.html'
})
export class TableCardComponent implements OnInit{

  @Input() tableObject;

  constructor() {
  }

  ngOnInit(){

  }

}
