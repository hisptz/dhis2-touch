import {Component, OnInit} from '@angular/core';
import {ModalController} from "ionic-angular";
import {OrganisationUnitsProvider} from "../../providers/organisation-units/organisation-units";
import {DataSetsProvider} from "../../providers/data-sets/data-sets";
import {AppProvider} from "../../providers/app/app";
import {PeriodSelectionProvider} from "../../providers/period-selection/period-selection";
import {SmsCommandProvider} from "../../providers/sms-command/sms-command";
import {AppPermissionProvider} from "../../providers/app-permission/app-permission";
import {UserProvider} from "../../providers/user/user";


declare var cordova;

/**
 * Generated class for the UploadDataViaSmsComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'upload-data-via-sms',
  templateUrl: 'upload-data-via-sms.html'
})
export class UploadDataViaSmsComponent implements OnInit{

  text: string;

  public loadingData : boolean = false;
  public loadingMessages : any = [];
  public currentUser : any;
  public organisationUnits : any;
  public selectedOrganisationUnit :any = {};
  public selectedOrganisationUnitLabel :string;
  public assignedDataSets : any;
  public selectedDataSet : any = {};
  public selectedDataSetLabel : string;
  public dataSetIdsByUserRoles : any;
  public selectedPeriod : any = {};
  public selectedPeriodLabel : string;
  public selectedDataDimension : any ;
  public currentPeriodOffset : number;
  public currentSelectionStatus :any = {};

  organisationUnitLabel : string;
  dataSetLabel : string;
  periodLabel : string;
  isFormReady : boolean;
  dataSetCategoryCombo : any;
  isLoading : boolean;
  loadingMessage : string;
  dataSets : Array<any>;



  selectedOrgUnit : any;

  public sendDataViaSmsObject : any = {
    orgUnit : {},dataSet : {},period : {},dataDimension : {},mobileNumber : "",isLoading : false,loadingMessage : ""
  };

  constructor(public modalCtrl: ModalController, public orgUnitProvider: OrganisationUnitsProvider,
              public dataSetProvider: DataSetsProvider, public appProvider: AppProvider,
              public periodService: PeriodSelectionProvider, public smsCommandProvider: SmsCommandProvider,
              public appPermission: AppPermissionProvider, public userProvider: UserProvider, private periodSelection : PeriodSelectionProvider) {
    console.log('Hello UploadDataViaSmsComponent Component');
    this.text = 'Hello World ts Greaeet learning Ionic';
  }

  ngOnInit() {
    //checking and request for sms permissions
    let permissions = cordova.plugins.permissions;
    let smsPermission = [permissions.SEND_SMS];
    this.appPermission.checkAndRequestAppPermission(smsPermission);

    this.selectedDataDimension = [];

    // from dataEntry Samples
    this.isLoading = true;
    this.currentPeriodOffset = 0;

    this.userProvider.getCurrentUser().then((currentUser: any)=>{
      this.currentUser = currentUser;
      this.initiateDefaultValues();
      this.userProvider.getUserData().then((userData : any)=>{
        this.dataSetIdsByUserRoles = [];
        userData.userRoles.forEach((userRole:any)=>{
          if (userRole.dataSets) {
            userRole.dataSets.forEach((dataSet:any)=>{
              this.dataSetIdsByUserRoles.push(dataSet.id);
            });
          }
        });

        this.orgUnitProvider.getLastSelectedOrganisationUnitUnit(currentUser).then((lastSelectedOrgunit)=>{
          this.selectedOrgUnit = lastSelectedOrgunit;
          this.updateDataEntryFormSelections();
          //this.loadingEntryForm();
        });
        this.updateDataEntryFormSelections();
      });
    },error=>{
      this.isLoading = false;
      this.loadingMessage = "";
      this.appProvider.setNormalNotification("Fail to load user information");
    })

  }

  //----------------------------------------------------------------------------------------------------------------------------------------------------

  updateDataEntryFormSelections(){
    if(this.orgUnitProvider.lastSelectedOrgUnit){
      this.selectedOrgUnit = this.orgUnitProvider.lastSelectedOrgUnit;
      this.organisationUnitLabel = this.selectedOrgUnit.name;
    }else{
      this.organisationUnitLabel = "Touch to select organisation Unit";
    }
    if(this.selectedDataSet && this.selectedDataSet.name){
      this.dataSetLabel = this.selectedDataSet.name;
    }else {
      this.dataSetLabel = "Touch to select entry form";
    }

    if(this.selectedPeriod && this.selectedPeriod.name){
      this.periodLabel = this.selectedPeriod.name;
    }else{
      this.periodLabel = "Touch to select period"
    }
    this.isFormReady = this.isAllFormParameterSelected();
    this.isLoading = false;
    this.loadingMessage = "";
  }



  // updateSmsFormSelections(){
  //   if(this.orgUnitProvider.lastSelectedOrgUnit){
  //     this.selectedOrgUnit = this.orgUnitProvider.lastSelectedOrgUnit;
  //     this.organisationUnitLabel = this.selectedOrgUnit.name;
  //   }else{
  //     this.organisationUnitLabel = "Touch to select organisation Unit";
  //   }
  //   if(this.selectedDataSet && this.selectedDataSet.name){
  //     this.dataSetLabel = this.selectedDataSet.name;
  //   }else {
  //     this.dataSetLabel = "Touch to select entry form";
  //   }
  //
  //   if(this.selectedPeriod && this.selectedPeriod.name){
  //     this.periodLabel = this.selectedPeriod.name;
  //   }else{
  //     this.periodLabel = "Touch to select period"
  //   }
  //   this.isFormReady = this.isAllFormParameterSelected();
  //   this.isLoading = false;
  //   this.loadingMessage = "";
  // }



  isAllFormParameterSelected(){
    let isFormReady = true;
    if(this.selectedPeriod && this.selectedPeriod.name && this.selectedDataSet && this.selectedDataSet.categoryCombo.name != 'default'){
      if(this.selectedDataDimension && this.selectedDataDimension.length > 0 && this.selectedDataDimension.length == this.dataSetCategoryCombo.categories.length){
        let count = 0;
        this.selectedDataDimension.forEach((dimension : any)=>{
          count ++;
        });
        if(count != this.selectedDataDimension.length){
          isFormReady = false;
        }
      }else{
        isFormReady = false;
      }
    }
    return isFormReady;
  }

  // setDataSetIdsByUserRoles(){
  //   this.dataSetIdsByUserRoles = [];
  //   this.currentPeriodOffset = 0;
  //   this.userProvider.getUserData().then((userData : any)=>{
  //     userData.userRoles.forEach((userRole:any)=>{
  //       if (userRole.dataSets) {
  //         userRole.dataSets.forEach((dataSet:any)=>{
  //           this.dataSetIdsByUserRoles.push(dataSet.id);
  //         });
  //       }
  //     });
  //     this.loadOrganisationUnits();
  //   });
  // }

  // loadOrganisationUnits(){
  //   this.currentSelectionStatus.isDataSetLoaded = true;
  //   this.currentSelectionStatus.isOrgUnitLoaded = false;
  //   this.orgUnitProvider.getOrganisationUnits(this.currentUser).then((organisationUnitsResponse : any)=>{
  //     this.organisationUnits = organisationUnitsResponse.organisationUnits;
  //     this.currentSelectionStatus.isOrgUnitLoaded = true;
  //     this.selectedOrganisationUnit = organisationUnitsResponse.lastSelectedOrgUnit;
  //     this.setDataEntrySelectionLabel();
  //     this.loadingDataSets();
  //     this.setDataEntrySelectionLabel();
  //   },error=>{
  //     this.appProvider.setNormalNotification('Fail to load organisation units : ' + JSON.stringify(error));
  //   });
  // }


  initiateDefaultValues(){
    this.currentSelectionStatus.orgUnit = false;
    this.currentSelectionStatus.isOrgUnitSelected = false;
    this.currentSelectionStatus.isOrgUnitLoaded = false;
    this.currentSelectionStatus.dataSet = false;
    this.currentSelectionStatus.isDataSetSelected = false;
    this.currentSelectionStatus.isDataSetLoaded = false;
    this.currentSelectionStatus.period = false;
    this.currentSelectionStatus.isPeriodSelected = false;
    this.currentSelectionStatus.allParameterSet = false;
    this.currentSelectionStatus.message = "";
  }





  openOrganisationUnitTree(){
    let modal = this.modalCtrl.create('OrganisationUnitSelectionPage',{});
    modal.onDidDismiss((selectedOrgUnit : any)=>{
      if(selectedOrgUnit && selectedOrgUnit.id){
        this.selectedOrgUnit = selectedOrgUnit;
         this.updateDataEntryFormSelections();
         this.loadingEntryForm();
      }
    });
    modal.present();
  }

  openEntryFormList(){
    if(this.dataSets && this.dataSets.length > 0){
      let modal = this.modalCtrl.create('DataSetSelectionPage',{dataSetsList : this.dataSets,currentDataSet :this.selectedDataSet.name  });
      modal.onDidDismiss((selectedDataSet : any)=>{
        if(selectedDataSet && selectedDataSet.id && selectedDataSet.id != this.selectedDataSet.id){
          this.selectedDataSet = selectedDataSet;
          this.currentPeriodOffset = 0;
          this.updateDataEntryFormSelections();
          this.loadPeriodSelection();
          this.updateDataSetCategoryCombo(this.selectedDataSet.categoryCombo);
        }
      });
      modal.present();
    }else{
      this.appProvider.setNormalNotification("There are no entry form to select on " + this.selectedOrgUnit.name );
    }
  }

  updateDataSetCategoryCombo(categoryCombo){
    let dataSetCategoryCombo  = {};
    if(categoryCombo.name != 'default'){
      dataSetCategoryCombo['id'] = categoryCombo.id;
      dataSetCategoryCombo['name'] = categoryCombo.name;
      dataSetCategoryCombo['categories'] = this.dataSetProvider.getDataSetCategoryComboCategories(this.selectedOrgUnit.id,this.selectedDataSet.categoryCombo.categories);
    }
    this.selectedDataDimension = [];
    this.dataSetCategoryCombo = dataSetCategoryCombo;
    this.updateDataEntryFormSelections();
  }

  loadingEntryForm(){
    this.dataSetProvider.getAssignedDataSets(this.selectedOrgUnit.id,this.dataSetIdsByUserRoles,this.currentUser).then((dataSets: any)=>{
      this.dataSets = dataSets;
      this.selectedDataSet = this.dataSetProvider.lastSelectedDataSet;
      this.currentPeriodOffset = 0;
      this.updateDataEntryFormSelections();
      this.loadPeriodSelection();
      this.updateDataSetCategoryCombo(this.selectedDataSet.categoryCombo);
    },error=>{
      this.appProvider.setNormalNotification("Fail to reload entry form");
    });
  }

  openPeriodList(){
    if(this.selectedDataSet && this.selectedDataSet.id){
      let modal = this.modalCtrl.create('PeriodSelectionPage', {
        periodType: this.selectedDataSet.periodType,
        currentPeriodOffset : this.currentPeriodOffset,
        openFuturePeriods: this.selectedDataSet.openFuturePeriods,
        currentPeriod : this.selectedPeriod
      });
      modal.onDidDismiss((data : any)=>{
        if(data && data.selectedPeriod ){
          this.selectedPeriod = data.selectedPeriod;
          this.currentPeriodOffset = data.currentPeriodOffset;
          this.updateDataEntryFormSelections();
        }
      });
      modal.present();
    }else{
      this.appProvider.setNormalNotification("Please select entry form first");
    }
  }


  loadPeriodSelection(){
    let periodType = this.selectedDataSet.periodType;
    let openFuturePeriods = parseInt(this.selectedDataSet.openFuturePeriods);
    let periods = this.periodSelection.getPeriods(periodType,openFuturePeriods,this.currentPeriodOffset);
    if(periods && periods.length > 0){
      this.selectedPeriod = periods[0];
    }else{
      this.selectedPeriod = {};
    }
    this.updateDataEntryFormSelections();
  }


  // loadingDataSets(){
  //   this.currentSelectionStatus.isDataSetLoaded = false;
  //   this.assignedDataSets = [];
  //   this.currentPeriodOffset = 0;
  //   this.selectedPeriod = {};
  //   this.dataSetProvider.getAssignedDataSets(this.selectedOrganisationUnit,this.dataSetIdsByUserRoles,this.currentUser).then((dataSets : any)=>{
  //     this.assignedDataSets = dataSets;
  //     let lastSelectedDataSet = this.dataSetProvider.getLastSelectedDataSet();
  //     let lastselectedPeriod = this.dataSetProvider.getLastSelectedDataSetPeriod();
  //     if(lastSelectedDataSet && lastSelectedDataSet.id){
  //       for(let dataSet of dataSets){
  //         if(dataSet.id = lastSelectedDataSet.id){
  //           this.selectedDataSet = lastSelectedDataSet;
  //           if(lastselectedPeriod && lastselectedPeriod.name){
  //             this.selectedPeriod = lastselectedPeriod;
  //             this.preSelectDataSetDataDimension(lastSelectedDataSet);
  //           }else{
  //             this.preSelectPeriod(lastSelectedDataSet);
  //           }
  //         }
  //       }
  //     }else if(this.assignedDataSets.length > 0){
  //       this.selectedDataSet =this.assignedDataSets[0];
  //       this.dataSetProvider.setLastSelectedDataSet(this.assignedDataSets[0]);
  //       this.preSelectPeriod(this.assignedDataSets[0]);
  //     }
  //     this.setDataEntrySelectionLabel();
  //     this.currentSelectionStatus.isDataSetLoaded = true;
  //   },error=>{
  //     this.appProvider.setNormalNotification('Fail to load assigned forms : ' + JSON.stringify(error));
  //   });
  // }

  // preSelectPeriod(selectedDataSet){
  //   this.preSelectDataSetDataDimension(selectedDataSet);
  //   let periods = this.periodService.getPeriods(null,selectedDataSet,this.currentPeriodOffset);
  //   if(periods.length == 0){
  //     this.currentPeriodOffset = this.currentPeriodOffset + 1;
  //     periods = this.periodService.getPeriods(null,selectedDataSet,this.currentPeriodOffset);
  //   }
  //   this.selectedPeriod = periods[0];
  // }


  // preSelectDataSetDataDimension(selectedDataSet){
  //   if(selectedDataSet.categoryCombo.name != 'default'){
  //     this.selectedDataDimension = [];
  //     let categoryIndex = 0;
  //     for(let category of selectedDataSet.categoryCombo.categories){
  //       this.selectedDataDimension[categoryIndex] = category.categoryOptions[0].id;
  //       categoryIndex = categoryIndex + 1;
  //     }
  //   }
  // }


  // setDataEntrySelectionLabel(){
  //   this.setOrganisationSelectLabel();
  //   this.setSelectedDataSetLabel();
  //   this.setselectedPeriodLabel();
  // }

  // setOrganisationSelectLabel(){
  //   console.log("sms orgUnitId "+ this.selectedOrganisationUnit.id);
  //   if(this.selectedOrganisationUnit.id){
  //     this.selectedOrganisationUnitLabel = this.selectedOrganisationUnit.name;
  //     this.currentSelectionStatus.isOrgUnitSelected = true;
  //     this.currentSelectionStatus.dataSet = true;
  //   }else{
  //     this.selectedOrganisationUnitLabel = "Touch to select Organisation Unit";
  //     this.currentSelectionStatus.dataSet = false;
  //     this.currentSelectionStatus.isOrgUnitSelected = false;
  //     this.currentSelectionStatus.allParameterSet = false;
  //     if (this.currentSelectionStatus.orgUnit && !this.currentSelectionStatus.dataSet) {
  //       this.currentSelectionStatus.message = "Please select organisation unit";
  //     }
  //   }
  // }

  // setSelectedDataSetLabel(){
  //   if(this.selectedDataSet.id){
  //     this.selectedDataSetLabel = this.selectedDataSet.name;
  //     this.currentSelectionStatus.period = true;
  //     this.currentSelectionStatus.isDataSetSelected = true;
  //   }else{
  //     this.selectedDataSetLabel = "Touch to select Entry Form";
  //     this.currentSelectionStatus.period = false;
  //     this.sendDataViaSmsObject.mobileNumber = "";
  //     this.sendDataViaSmsObject.isLoading = false;
  //     this.sendDataViaSmsObject.loadingMessage = "";
  //     this.currentSelectionStatus.isDataSetSelected = false;
  //     this.currentSelectionStatus.allParameterSet = false;
  //     if (this.currentSelectionStatus.dataSet && !this.currentSelectionStatus.period) {
  //       this.currentSelectionStatus.message = "Please select entry form";
  //     }
  //   }
  // }
  //
  // setselectedPeriodLabel(){
  //   if(this.selectedPeriod.name){
  //     this.selectedPeriodLabel = this.selectedPeriod.name;
  //     this.currentSelectionStatus.isPeriodSelected = true;
  //     this.currentSelectionStatus.message = "";
  //     this.hasDataDimensionSet();
  //   }else{
  //     this.selectedPeriodLabel = "Touch to select Period";
  //     this.currentSelectionStatus.isPeriodSelected = false;
  //     if(this.currentSelectionStatus.period){
  //       this.currentSelectionStatus.message = "Please select period for entry form";
  //     }
  //     this.currentSelectionStatus.allParameterSet = false;
  //   }
  // }

  // hasDataDimensionSet(){
  //   let result = true;
  //   if(this.selectedDataSet.categoryCombo.name != 'default'){
  //     if(this.selectedDataDimension.length > 0){
  //       this.selectedDataDimension.forEach((dimension : any)=>{
  //         if(dimension == null){
  //           result = false;
  //         }
  //       });
  //     }else{
  //       result = false;
  //     }
  //   }
  //   this.currentSelectionStatus.allParameterSet = (result && (this.selectedPeriodLabel.indexOf("Touch to select Period") < 0 ))?true:false;
  //   return result;
  // }
  //
  // getDataDimension(){
  //   let cc = this.selectedDataSet.categoryCombo.id;
  //   let cp = "";
  //   this.selectedDataDimension.forEach((dimension : any,index:any)=>{
  //     if(index == 0){
  //       cp +=dimension;
  //     }else{
  //       cp += ";" + dimension;
  //     }
  //   });
  //   return {cc : cc,cp:cp};
  // }




  // sendDataViaSms(){
  //   this.sendDataViaSmsObject.orgUnit = {id :this.selectedOrganisationUnit.id,name :this.selectedOrganisationUnitLabel};
  //   this.sendDataViaSmsObject.dataSet = {id : this.selectedDataSet.id,name : this.selectedDataSet.name};
  //   this.sendDataViaSmsObject.period = {iso : this.selectedPeriod.iso,name : this.selectedPeriod.name };
  //   if(this.hasDataDimensionSet()){
  //     this.sendDataViaSmsObject.dataDimension = this.getDataDimension();
  //   }
  //   this.sendDataViaSmsObject.isLoading = true;
  //   this.sendDataViaSmsObject.loadingMessage = "Loading Sms Configuration";
  //   this.smsCommandProvider.getSmsCommandForDataSet(this.selectedDataSet.id,this.currentUser).then((smsCommand:any)=>{
  //     this.sendDataViaSmsObject.loadingMessage = "Preparing Data";
  //     let dataElements = this.smsCommandProvider.getEntryFormDataElements(this.selectedDataSet);
  //     this.smsCommandProvider.getEntryFormDataValuesObjectFromStorage(this.selectedDataSet.id,this.selectedPeriod.iso,this.selectedOrganisationUnit.id,dataElements,this.currentUser).then((entryFormDataValuesObject:any)=>{
  //       let key = Object.keys(entryFormDataValuesObject);
  //       if(key.length > 0){
  //         this.sendDataViaSmsObject.loadingMessage = "Preparing sms";
  //         this.smsCommandProvider.getSmsForReportingData(smsCommand,entryFormDataValuesObject,this.selectedPeriod).then((reportingSms:any)=>{
  //           this.sendDataViaSmsObject.loadingMessage = "Sending "+reportingSms.length+ (reportingSms.length == 1)?" SMS " : " SMSes";
  //           this.smsCommandProvider.sendSmsForReportingData(this.sendDataViaSmsObject.mobileNumber,reportingSms).then((response)=>{
  //             this.sendDataViaSmsObject.isLoading = false;
  //             this.sendDataViaSmsObject.loadingMessage = "";
  //             this.appProvider.setNormalNotification("SMS has been sent");
  //           },error=>{
  //             this.sendDataViaSmsObject.isLoading = false;
  //             this.sendDataViaSmsObject.loadingMessage = "";
  //             this.appProvider.setNormalNotification("Fail to send some of SMS, Please go into your SMS inbox and resend them manually");
  //           });
  //         });
  //       }else{
  //         this.sendDataViaSmsObject.isLoading = false;
  //         this.sendDataViaSmsObject.loadingMessage = "";
  //         this.appProvider.setNormalNotification("There is no data to be sent via SMS for " + this.selectedDataSet.name);
  //       }
  //     },error=>{
  //       this.sendDataViaSmsObject.isLoading = false;
  //       this.sendDataViaSmsObject.loadingMessage = "";
  //       this.appProvider.setNormalNotification("Fail to prepare data for " +this.selectedDataSet.name);
  //     });
  //   },error=>{
  //     this.sendDataViaSmsObject.isLoading = false;
  //     this.sendDataViaSmsObject.loadingMessage = "";
  //     this.appProvider.setNormalNotification("Fail to load sms configuration for " +this.selectedDataSet.name);
  //   });
  // }


}
