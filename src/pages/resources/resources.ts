 import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { AppProvider } from '../../providers/app/app';
import { ResourcesProvider } from '../../providers/resources/resources';
import { SqlLiteProvider } from '../../providers/sql-lite/sql-lite';
import { AppTranslationProvider } from '../../providers/app-translation/app-translation';
import * as _ from 'lodash';



@IonicPage()
@Component({
  selector: 'page-resources',
  templateUrl: 'resources.html',
})
export class ResourcesPage  implements OnInit {
  public loadingMessages: any = [];
  public currentUser: any;
  documents: Array<any>;
  documentsCopy: Array<any>;
  currentPage: number;
  currentValue: string;
  isLoading: boolean = true;

  public numberItems : number = 10 ;
  public p: number = 1;
  icons: any = {};
  loadingMessage: string;
  translationMapper: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public user: UserProvider,
    public appProvider: AppProvider,
    public resourceProvider: ResourcesProvider,
    private sqLite: SqlLiteProvider,
    private appTranslation: AppTranslationProvider

  ) {
    this.documents = [];
    this.documentsCopy = [];
    this.isLoading = false;
    this.currentPage = 1;
    this.currentValue = '';
  }

  ngOnInit() {
    this.loadingMessages = [];
    this.isLoading = true;
    this.documents = [];
    this.translationMapper = {};
    this.user.getCurrentUser().subscribe((user: any) => {
      this.currentUser = user;
      this.appTranslation
        .getTransalations(this.getValuesToTranslate())
        .subscribe(
          (data: any) => {
            this.translationMapper = data;
            this.loadDocumentsList(user);
          },
          error => {
            this.loadDocumentsList(user);
          }
        );
    });
  }
  
  doRefresh(refresher) {
    refresher.complete();
    let key = 'Downloading documents from server';
    this.loadingMessage = this.translationMapper[key]
      ? this.translationMapper[key]
      : key;
    this.isLoading = true;
    let resource = "documents";
    this.resourceProvider.downloadResourcesFromServer(this.currentUser).subscribe(response => {
      key = 'Preparing local storage for updates';
      this.loadingMessage = this.translationMapper[key]
        ? this.translationMapper[key]
        : key;
      this.sqLite
        .createTable(resource, this.currentUser.currentDatabase)
        .subscribe(
          () => {
            key = 'Saving documents from server';
            this.loadingMessage = this.translationMapper[key]
              ? this.translationMapper[key]
              : key;
           this.resourceProvider
           .saveDocumentsFromServer(response,this.currentUser)
           .subscribe(
             () => {
               this.loadDocumentsList(this.currentUser);
             },
             error => {
                     this.isLoading = true;
                     this.appProvider.setNormalNotification(
                 'Failed to save documents'
               );
             }
           );
       },
       error => {
        this.isLoading = true;
         this.appProvider.setNormalNotification(
           'Failed to prepare local storage for updates'
         );
       }
     );
 
    },error =>{
      this.isLoading = true;
 this.appProvider.setNormalNotification('Failed to download files');
  });
  }

  trackByFn(index, item) {
    return item.id;
  }

  getValuesToTranslate() {
    return [
      'Discovering documents',
      'Downloading documents from server',
      'Preparing local storage for updates',
      'Saving documents from server',
      'there is no report to select'
    ];
  }
  loadDocumentsList(user){
    let key = 'Discovering documents';
    this.loadingMessage = this.translationMapper[key]
      ? this.translationMapper[key]
      : key;
    this.resourceProvider.getdocumentList(user)
    .subscribe( documentList => {
      this.documents = _.orderBy(documentList,['displayNane'],['asc']) ;
      this.isLoading = false;
    },
    error => {
      this.isLoading = false;
 this.appProvider.setNormalNotification(
   'Failed load documents'
 );
    });
   }
   
  previousPage() {
    this.currentPage--;
  }

  nextPage() {
    if (this.currentPage < this.documents.length) {
      this.currentPage++;
    }
  }
  changenumberItems(Items:any){
    this.numberItems = Items;
  this.documents = this.getdocumentsPaginations(this.documentsCopy,this.numberItems);
  this.currentPage = 1;  
  }
  getdocumentsWithPaginations(documents) {
    const pageSize = 10;
    return _.chunk(documents, pageSize);
  }
  getdocumentsPaginations(documentsCopy,numberItems){
    return _.chunk(documentsCopy, numberItems);
  }
  getSubArryByPagination(array, pageSize, pageNumber) {
    return array.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize);
  }
}
