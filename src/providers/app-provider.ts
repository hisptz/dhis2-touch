import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {HttpClient} from "./http-client";
import {SqlLite} from "./sql-lite";
import { AppVersion } from '@ionic-native/app-version';
import {Observable} from 'rxjs/Rx';

/*
  Generated class for the AppProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AppProvider {

  private formattedBaseUrl :string;
  private multipleIdsData : any = [];

  constructor(private http: HttpClient,private sqlLite:SqlLite,public appVersion: AppVersion) {
  }

  /**
   * get app infromations
   * @returns {Promise<T>}
     */
  getAppInformation(){
    let appInformation = {};
    let promises = [];

    return new Promise((resolve, reject)=> {
      promises.push(
        this.appVersion.getAppName().then(appName=>{
          appInformation['appName'] = appName;
        })
      );
      promises.push(
        this.appVersion.getPackageName().then(packageName=>{
          appInformation['packageName'] = packageName;
        })
      );
      promises.push(
        this.appVersion.getVersionCode().then(versionCode=>{
          appInformation['versionCode'] = versionCode;
        })
      );
      promises.push(
        this.appVersion.getVersionNumber().then(versionNumber=>{
          appInformation['versionNumber'] = versionNumber;
        })
      );

      Observable.forkJoin(promises).subscribe(() => {
          resolve(appInformation);
        },
        (error) => {
          reject();
        })
    });
  }

  /**
   * get formatted base url for the instance
   * @param url
   * @returns {Promise<string>}
     */
  getFormattedBaseUrl(url){
    this.formattedBaseUrl = "";
    let urlToBeFormatted : string ="",urlArray : any =[],baseUrlString : any;
    if (!(url.split('/')[0] == "https:" || url.split('/')[0] == "http:")) {
      urlToBeFormatted = "http://" + url;
    } else {
      urlToBeFormatted = url;
    }
    baseUrlString = urlToBeFormatted.split('/');
    for(let index in baseUrlString){
      if (baseUrlString[index]) {
        urlArray.push(baseUrlString[index]);
      }
    }
    this.formattedBaseUrl = urlArray[0] + '/';
    for (let i =0; i < urlArray.length; i ++){
      if(i != 0){
        this.formattedBaseUrl = this.formattedBaseUrl + '/' + urlArray[i];
      }
    }
    return Promise.resolve(this.formattedBaseUrl);
  }

  /**
   *get database name based in
   * @param url
   * @returns {Promise<T>}
     */
  getDataBaseName(url){
    let databaseName = url.replace('://', '_').replace(/[/\s]/g, '_').replace(/[.\s]/g, '_').replace(/[:\s]/g, '_');
    return Promise.resolve(databaseName);
  }

  /**
   *
   * @param resource
   * @param resourceValues
   * @param databaseName
   * @returns {Promise<T>}
     */
  saveMetadata(resource,resourceValues,databaseName){

    return new Promise((resolve, reject)=> {
      if(resourceValues.length == 0){
        resolve();
      }else{
        this.sqlLite.insertBulkDataOnTable(resource,resourceValues,databaseName).then(()=>{
          resolve();
        },error=>{
          console.log(JSON.stringify(error));
          reject(error);
        });
      }
    });
  }

  /**
   *
   * @param user
   * @param resource
   * @param resourceId
   * @param fields
   * @param filter
     * @returns {Promise<T>}
     */
  getMetaDataCountFromServer(user,resource, resourceId, fields, filter){

    let resourceUrl = this.getResourceUrl(resource, resourceId, fields, filter);
    return new Promise((resolve, reject)=> {
      this.http.get(resourceUrl,user).subscribe(response=>{
        response = response.json();
        resolve(this.getResourceCounter(response,resource));
      },error=>{
        reject(error);
      });
    });
  }

  /**
   *
   * @param response
   * @param resource
   * @returns {number}
     */
  getResourceCounter(response,resource){
    return response[resource]? response[resource].length : 0;
  }

  /**
   *
   * @param user
   * @param resource
   * @param resourceId
   * @param fields
   * @param filter
     * @returns {Promise<T>}
     */
  downloadMetadata(user,resource, resourceId, fields, filter){

    let resourceUrl = this.getResourceUrl(resource, resourceId, fields, filter);
    return new Promise((resolve, reject)=> {
      this.http.get(resourceUrl,user).subscribe(response=>{
        response = response.json();
        resolve(response);
      },error=>{
        reject(error);
      });
    });
  }

  /**
   *
   * @param user
   * @param resource
   * @param resourceIds
   * @param fields
   * @param filter
   * @returns {Promise<T>}
     */
  downloadMetadataByResourceIds(user,resource, resourceIds, fields, filter){

    let data = [];
    let promises = [];

    return new Promise((resolve, reject)=> {
      this.multipleIdsData = [];
      resourceIds.forEach(resourceId=>{
        promises.push(
          this.downloadMetadata(user,resource, resourceId, fields, filter).then(response=>{
            data.push(response);
          },error=>{})
        );
      });
      Observable.forkJoin(promises).subscribe(() => {
          resolve(data);
        },
        (error) => {
          reject(error);
        })
    });
  }

  /**
   *
   * @param resource
   * @param resourceId
   * @param fields
   * @param filter
   * @returns {string}
     */
  getResourceUrl(resource, resourceId, fields, filter){
    let url = '/api/25/' + resource;
    if (resourceId || resourceId != null) {
      url += "/" + resourceId + ".json?paging=false";
    } else {
      url += ".json?paging=false";
    }
    if (fields || fields != null) {
      url += '&fields=' + fields;
    }
    if (filter || filter != null) {
      url += '&filter=' + filter;
    }
    return url;
  }

}
