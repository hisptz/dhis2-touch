import { Component ,OnInit} from '@angular/core';
import { ViewController,NavParams } from 'ionic-angular';
import {HelpProvider} from "../../providers/help";

/*
 Generated class for the DashboardSearch page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-help-search',
  templateUrl: 'help-search.html'
})
export class HelpSearchPage implements OnInit{

  currentHelpContentId : string;
  helpContents : any = [];
  helpContentsObject : any;

  constructor(private navParams: NavParams,
              private HelpProvider : HelpProvider,
              private viewCtrl: ViewController) {}
  ngOnInit() {
    this.currentHelpContentId = this.navParams.get("currentHelpContentId");
    this.helpContentsObject = this.HelpProvider.getHelpContents();
    this.helpContents = this.getHelpContents(this.helpContentsObject);
  }

  getFilteredList(event: any) {
    let searchValue = event.target.value;
    this.helpContents = this.getHelpContents(this.helpContentsObject);
    if(searchValue && searchValue.trim() != ''){
      this.helpContents = this.helpContents.filter((currentHelpContent:any) => {
        return (this.isSearchedValueExist(currentHelpContent.name,searchValue) || this.isSearchedValueExist(currentHelpContent.id,searchValue)); //|| this.isSearchedValueExist(JSON.stringify(currentHelpContent.subMenu),searchValue));
      })
    }
  }

  isSearchedValueExist(contents,searchValue){

    if(contents){
      return (contents.toLowerCase().indexOf(searchValue.toLowerCase()) > -1)
    }else{
      return false;
    }

  }

  getHelpContents(helpContentsObject){
    let helpContents = [];
    Object.keys(helpContentsObject).forEach(key=>{
      helpContents.push(helpContentsObject[key]);
    });
    return helpContents;
  }



  setCurrentDashboard(selectedCurrentHelpContent){
    this.viewCtrl.dismiss(selectedCurrentHelpContent);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
