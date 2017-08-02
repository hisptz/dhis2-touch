import { Component,OnInit,Input } from '@angular/core';

/*
 Generated class for the Help page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-help-contents',
  templateUrl: 'help-contents.html'
})
export class HelpContentsPage implements OnInit{

  loadingMessage : string;
  isLoading : boolean  = false;
  isHelpContentOpened : any = {};

  @Input() helpContents ;

  constructor() {}

  ngOnInit() {
    this.isLoading = true;
    this.isLoading = false;
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



}
