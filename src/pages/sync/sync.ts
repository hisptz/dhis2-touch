import { Component,OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SyncPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sync',
  templateUrl: 'sync.html',
})
export class SyncPage implements OnInit{

  isSyncContentOpen : any;
  syncContents : Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ngOnInit(){
    this.isSyncContentOpen = {};
    this.syncContents = this.getSyncContentDetails();
    if(this.syncContents.length > 0){
      this.toggleSyncContents(this.syncContents[0]);
    }
  }


  toggleSyncContents(content){
    if(content && content.id){
      Object.keys(this.isSyncContentOpen).forEach(id=>{
        this.isSyncContentOpen[id] = false;
      });
      this.isSyncContentOpen[content.id] = true;
      // if(this.isSyncContentOpen[content.id]){
      //   this.isSyncContentOpen[content.id] = false;
      // }else{
      //   this.isSyncContentOpen[content.id] = true;
      // }
    }

  }

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
