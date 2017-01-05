import { Component } from '@angular/core';
import { ViewController,NavParams } from 'ionic-angular';

/*
  Generated class for the EventFieldSelectionMenu page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-event-field-selection-menu',
  templateUrl: 'event-field-selection-menu.html'
})
export class EventFieldSelectionMenu {

  public dataElementToDisplay : any;
  public dataElementMapper : any;
  public selectedDataElementIds : any;

  constructor(public viewCtrl: ViewController,public params : NavParams) {
    this.getAndSetParameter();
  }

  getAndSetParameter(){
    this.selectedDataElementIds = {
      pepperoni1 : false,
      pepperoni2 : true,
      pepperoni3 : false,
    };
    this.dataElementMapper = this.params.get("dataElementMapper");
    this.dataElementToDisplay = this.params.get("dataElementToDisplay");
  }

  ionViewDidLoad() {}

  onSavingChanges(){
    this.dismiss();
  }

  dismiss(response?) {
    let parameter = {};
    if(response){
      parameter = response;
    }
    this.viewCtrl.dismiss(parameter);
  }

}
