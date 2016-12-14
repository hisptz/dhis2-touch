import { Injectable } from '@angular/core';
import {SqlLite} from "./sql-lite/sql-lite";

/*
  Generated class for the Program provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Program {

  constructor(private sqlLite : SqlLite) {
  }

}
