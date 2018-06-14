import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClientProvider } from '../http-client/http-client';
import {SqlLiteProvider} from "../sql-lite/sql-lite";
import {Observable} from "rxjs/Observable";
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { AppProvider } from '../../providers/app/app' ;
import { Headers} from '@angular/http';

/*
  Generated class for the ResourcesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ResourcesProvider {

  public resource: any ;
  public documentsList :any;
  public appProvider: AppProvider;
  
    constructor( private transfer: FileTransfer, private file: File, private HttpClient: HttpClientProvider, private SqlLite: SqlLiteProvider) {
      this.resource = "documents";
    }

    /**
   *
   * @param currentUser
   * @returns {Observable<any>}
   */
  downloadResourcesFromServer(currentUser): Observable<any> {
    //get resources list from the server
    let  fields = 'id,name,displayName,contentType',
    url = '/api/' + this.resource + '.json?fields=' + fields;
    return new Observable(observer => {
      this.HttpClient.get(url, true, currentUser).subscribe((response: any) => {
       this.documentsList = response.documents ;
        //check if resource if a link or file
  for(var i=0; i < this.documentsList.length; i++){
    if(this.documentsList[i].contentType == undefined){
   console.log(this.documentsList[i].name); 
    }
    else {
      //download resources
this.downloadResources(this.documentsList[i],currentUser);    
     }
  }
       observer.next(response);
    observer.complete();   
          
      }, error => {
        console.log(error);
      });
    }); 
  }
  downloadResources(document,currentUser){
    let headers = new Headers();
          headers.append(
            'Authorization',
            'Basic ' + currentUser.authorizationKey
          );
      let url = currentUser.serverUrl + '/api/documents/' +  document.id + '/data' ;
      const fileTransfer: FileTransferObject = this.transfer.create();
     let contentType = document.contentType.substr(12);
     console.log(contentType);
     
     fileTransfer.download(url, this.file.externalDataDirectory + document.name + '.' + contentType,true,{ headers: headers }).then((entry) => {
           console.log('download complete: ' + entry.toURL());
     }, (error) => {
       console.log(error);   
     });  
 }
 
  }
