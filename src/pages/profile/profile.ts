import { Component,OnInit } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import {ProfileProvider} from "../../providers/profile/profile";

/**
 * Generated class for the ProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage implements OnInit{

  isProfileContentOpen : any;
  profileContents : Array<any>;

  loadingMessage : string;
  isLoading : boolean = true;

  constructor(public navCtrl: NavController, private profileProvider : ProfileProvider) {
  }

  ngOnInit(){
    this.loadingMessage = 'Loading app information';
    this.isLoading = true;
    this.isProfileContentOpen = {};
    this.profileContents = this.profileProvider.getProfileContentDetails();
    //@todo implement loading information
    setTimeout(()=>{
      this.isLoading = false;
    },500)
  }

  toggleProfileContents(content){
    if(content && content.id){
      if(this.isProfileContentOpen[content.id]){
        this.isProfileContentOpen[content.id] = false;
      }else{
        Object.keys(this.isProfileContentOpen).forEach(id=>{
          this.isProfileContentOpen[id] = false;
        });
        this.isProfileContentOpen[content.id] = true;
      }
    }
  }


}
