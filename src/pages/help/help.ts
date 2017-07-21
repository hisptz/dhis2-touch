import { Component,OnInit } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import {HelpProvider} from "../../providers/help";
import {HelpSearchPage} from "../help-search/help-search";


/*
  Generated class for the Help page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-help',
  templateUrl: 'help.html'
})
export class HelpPage implements OnInit{

  helpContentsObject : any;
  currentHelpContent : any;
  loadingMessage : string;
  isLoading : boolean  = false;

  constructor(private navCtrl: NavController, private modalCtrl: ModalController,private HelpProvider : HelpProvider) {}

  ngOnInit() {
    this.isLoading = true;
    this.loadingMessage = "Loading help contents";
    this.helpContentsObject = this.HelpProvider.getHelpContents();
    let keys = Object.keys(this.helpContentsObject);
    if(keys.length > 0){
      this.currentHelpContent = this.helpContentsObject[keys[0]]
    }
    this.isLoading = false;
  }

  openHelpContentsFilter(){
    if(this.currentHelpContent && this.currentHelpContent.id){
      this.loadingMessage = "Please wait ...";
      this.isLoading = true;
      let modal = this.modalCtrl.create(HelpSearchPage, {
        currentHelpContentId: this.currentHelpContent.id
      });
      modal.onDidDismiss((currentHelpContent:any)=> {
        this.isLoading = false;
        this.loadingMessage = "";
        if(currentHelpContent && currentHelpContent.id){
          this.currentHelpContent = currentHelpContent;
        }
      });
      modal.present();
    }
  }



}
