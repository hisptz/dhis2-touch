import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http';
import { Http ,Headers, RequestOptions } from '@angular/http';
import   'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';

/*
  Generated class for the HttpClientProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class HttpClientProvider {

  public timeOutTime : number;
  constructor(private http: HTTP, public defaultHttp : Http) {
    this.timeOutTime = 4*60*1000;
  }

  getUrlBasedOnDhisVersion(url,user){
    if(user.dhisVersion &&(parseInt(user.dhisVersion) < 25)){
      url = url.replace("/api/25/","/api/");
    }
    return url;
  }

  /**
   *
   * @param url
   * @param user
   * @returns {Promise<T>}
     */
  get(url,user) {
    this.http.setRequestTimeout(this.timeOutTime);
    this.http.useBasicAuth(user.username,user.password);
    url = user.serverUrl + this.getUrlBasedOnDhisVersion(url,user);
    return new Promise((resolve, reject)=> {
      this.http.get(url, {}, {})
        .then((response:any)  => {
          resolve(response);
        },error=>{
          reject(error);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  /**
   *
   * @param url
   * @param data
   * @param user
   * @returns {Promise<T>}
     */
  post(url,data,user) {
    this.http.useBasicAuth(user.username,user.password);
    this.http.setRequestTimeout(this.timeOutTime);
    return new Promise((resolve, reject)=> {
      this.http.post(url,data,{})
        .then((response:any)  => {
          resolve(response);
        },error=>{
          reject(error);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  defaultPost(url, data, user){
    url = this.getUrlBasedOnDhisVersion(url,user);
    let headers = new Headers();
    headers.append('Authorization', 'Basic ' +user.authorizationKey);
    return new Promise((resolve, reject)=> {
      this.defaultHttp.post(user.serverUrl + url, data, { headers: headers }).timeout(this.timeOutTime).subscribe((response)=>{
        resolve(response);
      },error=>{
        reject(error.json());
      });
    });
  }

  /**
   *
   * @param url
   * @param data
   * @param user
   * @returns {Promise<T>}
     */
  put(url, data, user){
    url = this.getUrlBasedOnDhisVersion(url,user);
    let headers = new Headers();
    headers.append('Authorization', 'Basic ' +user.authorizationKey);
    return new Promise((resolve, reject)=> {
      this.defaultHttp.put(user.serverUrl + url, data, { headers: headers })
        .timeout(this.timeOutTime).map(res=>res.json())
        .subscribe((response)=>{
        resolve(response);
      },error=>{
        reject(error);
      });
    });
  }

  /**
   *
   * @param url
   * @param user
   * @returns {Promise<T>}
     */
  delete(url,user){
    url = this.getUrlBasedOnDhisVersion(url,user);
    let headers = new Headers();
    headers.append('Authorization', 'Basic ' +user.authorizationKey);
    return new Promise((resolve, reject)=> {
      this.defaultHttp.delete(user.serverUrl + url,{headers: headers})
        .timeout(this.timeOutTime).map(res=>res.json()).subscribe((response)=>{
        resolve(response);
      },error=>{
        reject(error);
      });
    });
  }

}
