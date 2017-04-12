import { Component,OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {User} from "../../providers/user";
import {DataSets} from "../../providers/data-sets";
import {EntryForm} from "../../providers/entry-form";
import {Setting} from "../../providers/setting";

/*
  Generated class for the DataElementSyncContainer page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-data-element-sync-container',
  templateUrl: 'data-element-sync-container.html'
})
export class DataElementSyncContainerPage  implements OnInit{

  public isLoading :boolean = true;
  public loadingMessage : string = "Loading entry form information";
  public syncStatus : string;
  public entryFormName : string =  "Entry Form Sync Summary";
  public dataValues : any;
  public dataElementObject : any;
  public dataElements : any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public DataSets : DataSets,
              public EntryForm : EntryForm,
              public Setting : Setting,
              public user : User) {}

  ngOnInit() {
    this.syncStatus = this.navParams.get("syncStatus");
    this.entryFormName = this.navParams.get("entryFormName");
    let dataSetId = this.navParams.get("dataSetId");
    this.dataValues = this.navParams.get("dataValues");
    this.user.getCurrentUser().then((user)=>{
      this.DataSets.getDataSetById(dataSetId,user).then((dataSet : any)=>{
        this.dataElementObject = {};
        this.EntryForm.getDataElements(dataSet).forEach((dataElement:any)=>{
          this.dataElementObject[dataElement.id]=dataElement;
        });
        this.prepareDataElementForDisplay(this.dataValues,this.dataElementObject);
      },error=>{
        this.isLoading = false;
      });
    });
  }

  prepareDataElementForDisplay(dataValues,dataElementObject){
    let label = "displayName";
    this.Setting.getDataEntrySetting().then((dataEntrySetting: any)=>{
      if(dataEntrySetting && dataEntrySetting.label){
        label = dataEntrySetting.label;
      }
      let count = 0;
      dataValues.forEach((dataValue : any)=>{
        count ++;
        this.dataElements.push({
          name : this.getDataElementName(dataValue,dataElementObject[dataValue.de],label),
          id : dataValue.de,
          value : dataValue.value,
          period : dataValue.pe
        });
        if(count == dataValues.length){
          this.dataElements.sort((a, b) => {
            if (a.period > b.period) {
              return -1;
            }
            if (a.period < b.period) {
              return 1;
            }
            return 0;
          });
          this.isLoading = false;
        }
      });

    })
  }

  getDataElementName(dataValue,dataElement,label){
    let dataElementName = (dataElement[label]) ? dataElement[label] : dataElement["displayName"];
    if(dataElement.categoryCombo.name != 'default'){
      for(let categoryOptionCombos of dataElement.categoryCombo.categoryOptionCombos){
        if(categoryOptionCombos.id == dataValue.co){
          dataElementName = dataElementName + " " + categoryOptionCombos.name;
        }
      }
    }
    return dataElementName
  }

}
