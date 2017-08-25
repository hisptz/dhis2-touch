import { Component,OnInit,Input } from '@angular/core';

/**
 * Generated class for the HelpContentsComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'help-contents',
  templateUrl: 'help-contents.html'
})
export class HelpContentsComponent implements OnInit{

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
