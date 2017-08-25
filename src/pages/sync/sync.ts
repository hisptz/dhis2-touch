import { Component,OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {SyncProvider} from "../../providers/sync/sync";

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

  constructor(public navCtrl: NavController, public navParams: NavParams,private syncProvider : SyncProvider) {
  }

  ngOnInit(){
    this.isSyncContentOpen = {};
    this.syncContents = this.syncProvider.getSyncContentDetails();
    if(this.syncContents.length > 0){
      this.toggleSyncContents(this.syncContents[0]);
    }
  }


  toggleSyncContents(content){
    if(content && content.id){
      if(this.isSyncContentOpen[content.id]){
        this.isSyncContentOpen[content.id] = false;
      }else{
        Object.keys(this.isSyncContentOpen).forEach(id=>{
          this.isSyncContentOpen[id] = false;
        });
        this.isSyncContentOpen[content.id] = true;
      }
    }

  }



}
