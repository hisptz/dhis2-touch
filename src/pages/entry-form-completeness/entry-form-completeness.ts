import {Component, OnInit} from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';
import {DataSetCompletenessProvider} from "../../providers/data-set-completeness/data-set-completeness";
import {AppProvider} from "../../providers/app/app";

/**
 * Generated class for the EntryFormCompletenessPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-entry-form-completeness',
  templateUrl: 'entry-form-completeness.html',
})
export class EntryFormCompletenessPage implements OnInit{

  isLoading : boolean;
  loadingMessage : string;
  userInformation : Array<any>;

  constructor(public viewCtrl: ViewController, public navParams: NavParams,
              private appProvider : AppProvider,
              private dataSetCompletenessProvider : DataSetCompletenessProvider) {
  }

  ngOnInit(){
    let currentUser = this.navParams.get('currentUser');
    let username = this.navParams.get('username');
    this.loadingMessage = "Loading information for " + username;
    this.isLoading = true;
    this.userInformation = [];
    this.dataSetCompletenessProvider.getUserCompletenessInformation(username,currentUser).then((userResponse : any )=>{
      this.prepareUserInformation(userResponse.user,username);
    },error=>{
      console.log(JSON.stringify(error));
      this.userInformation.push({key : "Username",value : username});
      this.isLoading = false;
      this.appProvider.setNormalNotification("Fail to load user information");
    });
  }

  dismiss(){
    this.viewCtrl.dismiss({});
  }

  prepareUserInformation(user,username){
    //@todo checking keys on future
    this.userInformation.push({key : "Full name",value : user.firstName + " " + user.surname});
    this.userInformation.push({key : "Username",value : username});
    if(user && user.email){
      this.userInformation.push({key : "E-mail",value : user.email});
    }
    if(user && user.phoneNumber){
      this.userInformation.push({key : "Phone number",value : user.phoneNumber});
    }
    if(user && user.organisationUnits){
      let organisationUnits = [];
      user.organisationUnits.forEach((organisationUnit : any)=>{
        organisationUnits.push(organisationUnit.name);
      });
      this.userInformation.push({key : "Assigned Roles",value : organisationUnits.join(', ')});
    }
    if(user && user.roles){
      let roles = [];
      user.roles.forEach((role : any)=>{
        roles.push(role.name);
      });
      this.userInformation.push({key : "Assigned Roles",value : roles.join(', ')});
    }
    this.isLoading = false;
  }

}
