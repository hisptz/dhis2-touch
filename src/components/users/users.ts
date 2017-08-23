import { Component,OnInit,Input } from '@angular/core';
import {Visualization} from "../../model/visualization";

/**
 * Generated class for the UsersComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'users',
  templateUrl: 'users.html'
})
export class UsersComponent implements OnInit {

  @Input() visualizationObject: Visualization;
  private _users: any[];
  constructor() {

  }

  ngOnInit() {
    this._users = this.visualizationObject.layers[0].settings.users;
  }


  get users(): any[] {
    return this._users;
  }

  set users(value: any[]) {
    this._users = value;
  }
}
