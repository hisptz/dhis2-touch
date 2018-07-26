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
       this.documents = data;
         },error =>{
      this.appProvider.setNormalNotification('Failed to download files');
    });
    });
  }
}
