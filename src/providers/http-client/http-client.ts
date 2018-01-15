import { Injectable } from '@angular/core';
import {HTTP} from "@ionic-native/http";
import {Http,Headers } from '@angular/http';
import   'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import {Observable} from "rxjs/Observable";

/*
  Generated class for the HttpClientProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HttpClientProvider {

  public timeOutTime : number;
  constructor(private http: HTTP, public defaultHttp : Http) {
    this.timeOutTime = 2*60*1000;
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
  get(url,user,resourceName?,pageSize?) {
    this.http.setRequestTimeout(this.timeOutTime);
    this.http.useBasicAuth(user.username,user.password);
    url = user.serverUrl + this.getUrlBasedOnDhisVersion(url,user);
    if(resourceName && pageSize){
      return new Promise((resolve, reject)=> {
        let promises = [];
        let testUrl = user.serverUrl +"/api/25/"+resourceName+".json?fields=none&pageSize="+pageSize;
        this.http.get(testUrl, {}, {})
          .then((initialResponse:any)  => {
            initialResponse = JSON.parse(initialResponse.data);
            if(initialResponse.pager.pageCount){
              initialResponse[resourceName] = [];
              for(let i = 1;i <= initialResponse.pager.pageCount; i++){
                let paginatedUrl = url + "&pageSize="+pageSize+"&page=" + i;
                promises.push(
                  this.http.get(paginatedUrl,{}, {}).then((response : any)=>{
                    response = JSON.parse(response.data);
                    initialResponse[resourceName] = initialResponse[resourceName].concat(response[resourceName]);
                  }).catch((error=>{}))
                )
              }
              Observable.forkJoin(promises).subscribe(() => {
                  resolve(initialResponse);
                },
                (error) => {
                  reject(error);
                })
            }else{
              this.http.get(url, {}, {})
                .then((response:any)  => {
                  resolve(response);
                },error=>{
                  reject(error);
                })
                .catch(error => {
                  reject(error);
                });
            }
          },error=>{
            reject(error);
          })
          .catch(error => {
            reject(error);
          });
      });
    }else{
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
    url = user.serverUrl + this.getUrlBasedOnDhisVersion(url,user);
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
      this.defaultHttp.post(user.serverUrl + url, data, { headers: headers }).timeout(this.timeOutTime).subscribe((response : any)=>{
        resolve();
      },error=>{
        console.error(JSON.stringify(error));
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
