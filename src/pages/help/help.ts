import { Component,OnInit } from '@angular/core';
import {HelpProvider} from "../../providers/help";


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
  loadingMessage : string;
  isLoading : boolean  = false;
  isHelpContentOpened : any = {};
  helpContents : any;

  constructor(private HelpProvider : HelpProvider) {}

  ngOnInit() {
    this.isLoading = true;
    this.loadingMessage = "Loading help contents";
    this.helpContentsObject = this.HelpProvider.getHelpContents();
    this.helpContents = this.getHelpContents(this.helpContentsObject);
    if(this.helpContents.length > 0){
      if(this.helpContents[0].id){
        this.isHelpContentOpened[this.helpContents[0].id] = true;
      }
    }
    this.isLoading = false;
  }

  getHelpContents(helpContentsObject){
    let helpContents = [];
    Object.keys(helpContentsObject).forEach(key=>{
      helpContents.push(helpContentsObject[key]);
    });
    return helpContents;
  }

  getFilteredList(event: any) {
    let searchValue = event.target.value;
    this.helpContents = this.getHelpContents(this.helpContentsObject);
    if(searchValue && searchValue.trim() != ''){
      this.helpContents = this.helpContents.filter((currentHelpContent:any) => {
        return (this.isSearchedValueExist(currentHelpContent.name,searchValue) || this.isSearchedValueExist(currentHelpContent.id,searchValue)|| this.isSearchedValueExist(currentHelpContent.tags,searchValue));
      })
    }
  }

  toggleHelpContent(helpContent){
    if(helpContent && helpContent.id){
      if(this.isHelpContentOpened[helpContent.id]){
        this.isHelpContentOpened[helpContent.id] = !this.isHelpContentOpened[helpContent.id];
      }else{
        this.isHelpContentOpened[helpContent.id] = true;
      }
    }
  }

  isSearchedValueExist(contents,searchValue){
    if(contents){
      return (contents.toLowerCase().indexOf(searchValue.toLowerCase()) > -1)
    }else{
      return false;
    }
  }

}
