import { Injectable } from '@angular/core';
import { Http ,Headers,RequestOptions,Response} from '@angular/http';
import { Storage, LocalStorage } from 'ionic-angular';
import   'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
//import {Observable} from "../../../../sample/node_modules/rxjs/Observable";

/*
 Generated class for the HttpClient provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class HttpClient {

  private localStorage:any;

  constructor(private http:Http) {
    this.localStorage = new Storage(LocalStorage);
  }

  get(url,user):Observable<Response>{
    let headers = new Headers();
    headers.append('Authorization', 'Basic ' +
      btoa(user.username + ':' + user.password));
    return this.http.get(user.serverUrl + url, {headers: headers});
  }

  post(url, data, user):Observable<Response> {
    let headers = new Headers();
    headers.append('Authorization', 'Basic ' +
      btoa(user.username + ':' + user.password));
    return this.http.post(user.serverUrl + url, data, {headers: headers});
  }

}

