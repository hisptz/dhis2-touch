import { Injectable, Pipe } from '@angular/core';

/*
  Generated class for the ObjectToArray pipe.

  See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
  Angular 2 Pipes.
*/
@Pipe({
  name: 'objectToArray'
})
@Injectable()
export class ObjectToArray {

  transform(value: any, args: any[]) {
    console.log(value);
    let keys = [];
    if(value){
      for (let key in value) {
        let newValue = value[key];
        if(newValue instanceof Object) {
          newValue = JSON.stringify(newValue)
        }
        let newKey = (key.charAt(0).toUpperCase() + key.slice(1)).replace(/([A-Z])/g, ' $1').trim();
        keys.push({key: newKey, value: newValue});
      }
    }
    return keys;
  }
}
