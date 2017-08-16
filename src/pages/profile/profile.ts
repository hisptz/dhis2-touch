import { Component,OnInit } from '@angular/core';
import {AppProvider} from "../../providers/app-provider";
import {ProfileProvider} from "../../providers/profile";

/*
  Generated class for the Profile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage implements OnInit{

  isProfileContentOpen : any;
  profileContents : Array<any>;

  userData : any;

  loadingMessage : string;
  isLoading : boolean = true;

  constructor(
              private appProvider : AppProvider,
              private profileProvider : ProfileProvider) {
  }

  ngOnInit(){
    this.loadingMessage = 'Loading profile information';
    this.isLoading = true;
    this.isProfileContentOpen = {};
    this.profileContents = this.profileProvider.getProfileContentDetails();
    if(this.profileContents.length > 0){
      this.toggleProfileContents(this.profileContents[0]);
    }
    this.profileProvider.getSavedUserData().then((userData)=>{
      this.userData = userData;
      this.isLoading = false;
      this.loadingMessage = '';
    }).catch(error=>{
      this.isLoading = false;
      this.loadingMessage = '';
      console.log(JSON.stringify(error));
      this.appProvider.setNormalNotification('Fail to load profile information');
    });
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
