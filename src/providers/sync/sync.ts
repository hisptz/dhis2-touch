import { Injectable } from '@angular/core';
import {HttpClientProvider} from "../http-client/http-client";

/*
  Generated class for the SyncProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class SyncProvider {

  constructor(private HttpClient : HttpClientProvider) {}

  getSyncContentDetails(){
    let syncContents = [
      {id : 'dataViaSms',name : 'Upload data via sms',icon: 'assets/sync-icons/sms.png'},
      {id : 'dataViaInternet',name : 'Upload data via internet',icon: 'assets/sync-icons/internet.png'},
      {id : 'downloadMetadata',name : 'Download metadata',icon: 'assets/sync-icons/download-metadata.png'},
      {id : 'downloadData',name : 'Download data',icon: 'assets/sync-icons/download-data.png'},
      {id : 'clearData',name : 'Clear local data',icon: 'assets/sync-icons/clear-data.png'},
      {id : 'clearMetadata',name : 'Clear local metadata',icon: 'assets/sync-icons/clear-metadata.png'},
    ];
    return syncContents;
  }

}
