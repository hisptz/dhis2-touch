import { Injectable } from '@angular/core';
import { Http ,Headers,RequestOptions,Response} from '@angular/http';
import   'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import { Observable } from 'rxjs/Rx';

/*
 Generated class for the HttpClient provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class HttpClient {

  public timeOutTime : number;
  constructor(private http:Http) {
    this.timeOutTime = 2*60*1000;
  }

  get(url,user):Observable<Response>{
    let headers = new Headers();
    headers.append('Authorization', 'Basic ' +user.authorizationKey);
    return this.http.get(user.serverUrl + url, {headers: headers}).timeout(this.timeOutTime);
  }

  post(url, data, user):Observable<Response> {
    let headers = new Headers();
    headers.append('Authorization', 'Basic ' +user.authorizationKey);
    return this.http.post(user.serverUrl + url, data, { headers: headers }).timeout(this.timeOutTime);
  }

  put(url, data, user):Observable<Response> {
    let headers = new Headers();
    headers.append('Authorization', 'Basic ' +user.authorizationKey);
    return this.http.put(user.serverUrl + url, data, { headers: headers }).timeout(this.timeOutTime);
  }

  delete(url,user):Observable<Response> {
    let headers = new Headers();
    headers.append('Authorization', 'Basic ' +user.authorizationKey);
    return this.http.delete(user.serverUrl + url,{headers: headers}).timeout(this.timeOutTime);
  }

}

