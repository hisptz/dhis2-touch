import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {ProgramsProvider} from "../programs/programs";
import {DataElementsProvider} from "../data-elements/data-elements";

/*
  Generated class for the EventCaptureFormProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class EventCaptureFormProvider {


  constructor(public http: Http, public programsProvider:ProgramsProvider, public dataElementProvider:DataElementsProvider){
    
  }



}
