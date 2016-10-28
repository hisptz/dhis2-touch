import { Injectable, Pipe } from '@angular/core';

/*
  Generated class for the AccountName pipe.

  See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
  Angular 2 Pipes.
*/
@Pipe({
  name: 'accountName'
})
@Injectable()
export class AccountName {
  /*
    Takes a value and makes it lowercase.
   */
  transform(value: string, args: any[]) {
    let newValue = "";
    let nameList = value.split(' ');
    nameList.forEach(name=>{
      newValue += name.charAt(0).toUpperCase();
    });

    return newValue;
  }
}
