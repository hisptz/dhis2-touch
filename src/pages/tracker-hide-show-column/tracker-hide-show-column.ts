import { Component,OnInit } from '@angular/core';
import {ViewController, NavParams, IonicPage} from 'ionic-angular';

/**
 * Generated class for the TrackerHideShowColumnPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tracker-hide-show-column',
  templateUrl: 'tracker-hide-show-column.html',
})
export class TrackerHideShowColumnPage implements OnInit{

  selectedItemsModel : any;
  trackedEntityAttributes : Array<any>;

  constructor(public viewCtrl: ViewController,public params : NavParams) {
  }

  ngOnInit(){
    this.selectedItemsModel = {};
    let attributeToDisplay = this.params.get('attributeToDisplay');
    this.trackedEntityAttributes = [];
    let programTrackedEntityAttributes = this.params.get('programTrackedEntityAttributes');
    Object.keys(attributeToDisplay).forEach(key=>{
      this.selectedItemsModel[key] = true;
    });
    programTrackedEntityAttributes.forEach((programTrackedEntityAttribute : any)=>{
      if(programTrackedEntityAttribute.trackedEntityAttribute){
        let attribute = programTrackedEntityAttribute.trackedEntityAttribute;
        this.trackedEntityAttributes.push({
          id : attribute.id,name : attribute.name
        })
      }
    });
  }

  autoSelectFields(status){
    this.trackedEntityAttributes.forEach((trackedEntityAttribute : any)=>{
      this.selectedItemsModel[trackedEntityAttribute.id] = status;
    });
  }

  saveChanges(){
    let attributeToDisplay = {};
    this.trackedEntityAttributes.forEach((trackedEntityAttribute : any)=>{
      if(this.selectedItemsModel[trackedEntityAttribute.id]){
        attributeToDisplay[trackedEntityAttribute.id] = trackedEntityAttribute.name;
      }
    });
    this.viewCtrl.dismiss(attributeToDisplay);
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

}
