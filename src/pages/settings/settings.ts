import { Component,OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SettingsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage implements OnInit{

  isSettingContentOpen : any;
  settingContents : Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ngOnInit(){
    this.isSettingContentOpen = {};
    this.settingContents = this.getSyncContentDetails();
    if(this.settingContents.length > 0){
      this.toggleSettingContents(this.settingContents[0]);
    }
  }


  toggleSettingContents(content){
    if(content && content.id){
      if(this.isSettingContentOpen[content.id]){
        this.isSettingContentOpen[content.id] = false;
      }else{
        this.isSettingContentOpen[content.id] = true;
      }
    }

  }

  getSyncContentDetails(){
    let syncContents = [
      {id : 'synchronization',name : 'Synchronization',icon: 'assets/settings-icons/synchronization.png'},
      {id : 'entryForm',name : 'Entry form',icon: 'assets/settings-icons/entry-form.png'}
    ];
    return syncContents;
  }

}
