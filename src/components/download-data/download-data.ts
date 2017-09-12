import {Component, OnInit} from '@angular/core';
import {UserProvider} from "../../providers/user/user";
import {AppProvider} from "../../providers/app/app";
import {SqlLiteProvider} from "../../providers/sql-lite/sql-lite";
import {AlertController, NavController, NavParams} from "ionic-angular";
import {SyncProvider} from "../../providers/sync/sync";

/**
 * Generated class for the DownloadDataComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'download-data',
  templateUrl: 'download-data.html'
})
export class DownloadDataComponent implements OnInit{

  text: string;
  currentUser: any;

  isDownloadContentOpen : any;
  downloadContents : Array<any>;


  downloadManagerObject : any = {
    dataDownload : {isExpanded : false,isProcessRunning : false,isDataDownloaded : true,selectedItems :{}, itemsToBeDownloaded : []}

  };


  constructor(public alertCtrl: AlertController, private sqLite: SqlLiteProvider,
              private appProvider: AppProvider, public user: UserProvider,
              public navCtrl: NavController, public navParams: NavParams,private syncProvider : SyncProvider) {

  }



  ngOnInit(){
    this.isDownloadContentOpen = {};
    this.downloadContents = this.syncProvider.getDownloadDataDetails();
    if(this.downloadContents.length > 0){
      this.toggleDownloadContents(this.downloadContents[0]);
    }
  }

  toggleDownloadContents(content){
    if(content && content.id){
      if(this.isDownloadContentOpen[content.id]){
        this.isDownloadContentOpen[content.id] = false;
      }else{
        Object.keys(this.isDownloadContentOpen).forEach(id=>{
          this.isDownloadContentOpen[id] = false;
        });
        this.isDownloadContentOpen[content.id] = true;
      }
    }

  }



}
