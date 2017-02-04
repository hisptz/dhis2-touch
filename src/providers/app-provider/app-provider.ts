import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import {HttpClient} from '../../providers/http-client/http-client';
import {Observable} from 'rxjs/Rx';
import {SqlLite} from "../../providers/sql-lite/sql-lite";
import { AppVersion } from 'ionic-native';

/*
 Generated class for the App provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */

@Injectable()
export class AppProvider {

  private formattedBaseUrl :string;
  private multipleIdsData : any = [];

  constructor(private http: HttpClient,private sqlLite:SqlLite) {
  }

  getAppInformation(){
    let appInformation = {};
    let promises = [];

    return new Promise(function(resolve, reject) {
      promises.push(
        AppVersion.getAppName().then(appName=>{
          appInformation['appName'] = appName;
        })
      );
      promises.push(
        AppVersion.getPackageName().then(packageName=>{
          appInformation['packageName'] = packageName;
        })
      );
      promises.push(
        AppVersion.getVersionCode().then(versionCode=>{
          appInformation['versionCode'] = versionCode;
        })
      );
      promises.push(
        AppVersion.getVersionNumber().then(versionNumber=>{
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

  getDataBaseName(url){
    let databaseName = url.replace('://', '_').replace('/', '_').replace('.', '_').replace(':', '_');
    return Promise.resolve(databaseName);
  }

  saveMetadata(resource,resourceValues,databaseName){
    let promises = [];
    let self = this;

    return new Promise(function(resolve, reject) {
      if(resourceValues.length == 0){
        resolve();
      }
      resourceValues.forEach(resourceValue=>{
        promises.push(
          self.sqlLite.insertDataOnTable(resource,resourceValue,databaseName).then(()=>{
            //saving success
          },(error) => {
          })
        );
      });

      Observable.forkJoin(promises).subscribe(() => {
          resolve();
        },
        (error) => {
          reject(error.failure);
        })
    });
  }

  getMetaDataCountFromServer(user,resource, resourceId, fields, filter){
    let self = this;
    let resourceUrl = self.getResourceUrl(resource, resourceId, fields, filter);
    return new Promise(function(resolve, reject) {
      self.http.get(resourceUrl,user).subscribe(response=>{
        response = response.json();
        resolve(self.getResourceCounter(response,resource));
      },error=>{
        reject(error);
      });
    });
  }

  getResourceCounter(response,resource){
    return response[resource]? response[resource].length : 0;
  }

  downloadMetadata(user,resource, resourceId, fields, filter){
    let self = this;
    let resourceUrl = self.getResourceUrl(resource, resourceId, fields, filter);
    return new Promise(function(resolve, reject) {
      self.http.get(resourceUrl,user).subscribe(response=>{
        response = response.json();
        resolve(response);
      },error=>{
        reject(error);
      });
    });
  }
  downloadMetadataByResourceIds(user,resource, resourceIds, fields, filter){
    let self = this;
    let data = [];
    let promises = [];

    return new Promise(function(resolve, reject) {
      self.multipleIdsData = [];
      resourceIds.forEach(resourceId=>{
        promises.push(
          self.downloadMetadata(user,resource, resourceId, fields, filter).then(response=>{
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

  getResourceUrl(resource, resourceId, fields, filter){
    let url = '/api/' + resource;
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

