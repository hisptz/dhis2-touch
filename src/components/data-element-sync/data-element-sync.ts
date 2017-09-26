import {Component, Input, OnInit} from '@angular/core';
import {NavController, NavParams} from "ionic-angular";

/**
 * Generated class for the DataElementSyncComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'data-element-sync-component',
  templateUrl: 'data-element-sync.html'
})
export class DataElementSyncComponent implements OnInit{

  @Input() dataElements;
  public loadingMessage : string = "Preparing data";
  public isLoading : boolean = true;


  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  ngOnInit() {
    if(this.dataElements){
      this.isLoading = false;
    }
  }


}
