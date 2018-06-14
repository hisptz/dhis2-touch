import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { AppProvider } from '../../providers/app/app';
import { SqlLiteProvider } from '../../providers/sql-lite/sql-lite';
import { AppTranslationProvider } from '../../providers/app-translation/app-translation';
import { HttpClientProvider } from '../../providers/http-client/http-client';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Http,Headers, RequestOptions } from '@angular/http';
import { ResourcesProvider } from '../../providers/resources/resources' ;

/**
 * Generated class for the DocumentsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-documents',
  templateUrl: 'documents.html',
})
export class DocumentsPage {
  public documents :any ;
  public currentUser: any;


  constructor(public navCtrl: NavController, 
   public user:UserProvider,
   private transfer: FileTransfer, private file: File, 
    private sqLite: SqlLiteProvider,
    public HttpClient: HttpClientProvider,
    private appTranslation: AppTranslationProvider,
    public resourceProvider:ResourcesProvider,
    public appProvider: AppProvider) {
    }

  ngOnInit(){
    this.user.getCurrentUser().subscribe((user: any) => {
      this.currentUser = user ;

    this.resourceProvider.downloadResourcesFromServer(user).subscribe(data => {
       this.documents = data.documents;
         },error =>{
      this.appProvider.setNormalNotification('Failed to download files');
    });
    });
  }

downloaddoc(document){
   let headers = new Headers();
         headers.append(
           'Authorization',
           'Basic ' + this.currentUser.authorizationKey
         );
     let url = this.currentUser.serverUrl + '/api/documents/' +  document.id + '/data' ;
     const fileTransfer: FileTransferObject = this.transfer.create();
     console.log(fileTransfer);
    let contentType = document.contentType.substr(12);
    console.log(contentType);
    
    fileTransfer.download(url, this.file.externalDataDirectory + document.name + '.' + contentType,true,{ headers: headers }).then((entry) => {
      this.appProvider.setNormalNotification('files downloaded');
          console.log('download complete: ' + entry.toURL());
    }, (error) => {
      this.appProvider.setNormalNotification('Failed to download files');
      console.log(error);
      
    });  
}
}
