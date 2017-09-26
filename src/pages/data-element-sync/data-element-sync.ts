import {Component, OnInit} from '@angular/core';
import {IonicPage, NavParams} from "ionic-angular";
import {UserProvider} from "../../providers/user/user";
import {DataSetsProvider} from "../../providers/data-sets/data-sets";
import {DataEntryFormProvider} from "../../providers/data-entry-form/data-entry-form";
import {SqlLiteProvider} from "../../providers/sql-lite/sql-lite";

/**
 * Generated class for the DataElementSyncPage component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@IonicPage()
@Component({
  selector: 'data-element-sync',
  templateUrl: 'data-element-sync.html'
})
export class DataElementSyncPage implements OnInit{

  public isLoading :boolean = true;
  public loadingMessage : string;
  public syncStatus : string;
  public entryFormName : string =  "Entry Form Sync Summary";
  public dataValues : any;
  public dataElementObject : any;
  public dataElements : any = [];
  currentUser: any;

  constructor(private navParams: NavParams, private userProvider: UserProvider, private dataSetProvider: DataSetsProvider,
              private dataEntryFormProvider: DataEntryFormProvider, private sqliteProvider: SqlLiteProvider ) {
  }


  ngOnInit(){
    this.loadingMessage ="Loading forms information";
    this.syncStatus = this.navParams.get("syncStatus");
    this.entryFormName = this.navParams.get("entryFormName");
    let dataSetId = this.navParams.get("dataSetId");
    this.dataValues = this.navParams.get("dataValues");
    this.userProvider.getCurrentUser().then((user)=>{
      this.currentUser = user;

      this.displayElementInfo();

       this.dataSetProvider.getDataSetById(dataSetId,user).then((dataSet : any)=>{
        this.dataElementObject = {};
        this.dataEntryFormProvider.getDataElements(dataSet).forEach((dataElement:any)=>{
          this.dataElementObject[dataElement.id]=dataElement;
        });
        //this.prepareDataElementForDisplay(this.dataValues,this.dataElementObject);
      },error=>{
        this.isLoading = false;
      });
    });
  }



  displayElementInfo(){

      this.dataValues.forEach((dataValue : any)=>{

        let attributeArray = [];
        let dataElementName;
        attributeArray.push(dataValue.de);
        this.sqliteProvider.getDataFromTableByAttributes("dataElements", "id",attributeArray, this.currentUser.currentDatabase).then((resultData:any)=>{
          dataElementName = resultData[0].displayName;

          this.dataElements.push({
            name : dataElementName,
            id : dataValue.de,
            value : dataValue.value,
            period : dataValue.period,
            iso : dataValue.pe,
            orgUnit : dataValue.orgUnit
          });

        })
      });
    this.isLoading = false;
    }

}
