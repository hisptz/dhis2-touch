import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { LoadingController } from 'ionic-angular';

import {HttpClient} from '../../providers/http-client/http-client';
import {Observable} from 'rxjs/Rx';
import {SqlLite} from "../../providers/sql-lite/sql-lite";

/*
 Generated class for the App provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */

@Injectable()
export class App {

  private formattedBaseUrl :string;
  private loading : any;

  constructor(private http: Http,private loadingController : LoadingController,private sqlLite:SqlLite) {
  }

  showProgressMessage(message){
    this.loading = this.loadingController.create({
      content: message
    });
    this.loading.present();
  }

  hideProgressMessage(){
    this.loading.dismiss();
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



}

