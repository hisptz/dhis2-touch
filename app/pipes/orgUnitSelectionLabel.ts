import { Injectable, Pipe } from '@angular/core';

/*
  Generated class for the OrgUnitSelectionLabel pipe.

  See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
  Angular 2 Pipes.
*/
@Pipe({
  name: 'orgUnitSelectionLabel'
})
@Injectable()
export class OrgUnitSelectionLabel {
  /*
    Takes a value and makes it lowercase.
   */
  transform(value: any, args: any[]) {
    let label = "Touch to select organisation Unit";
    if(value.name){
      label = value.name;
    }
    return label;
  }
}
