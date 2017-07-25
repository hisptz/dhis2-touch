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

  @Input() helpContents ;

  constructor() {}

  ngOnInit() {
    this.isLoading = true;
    this.isLoading = false;
  }



}
