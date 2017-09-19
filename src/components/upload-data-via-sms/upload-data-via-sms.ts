import {Component, OnInit} from '@angular/core';
import {PeriodSelectionProvider} from "../../providers/period-selection/period-selection";
import {ModalController, NavController} from "ionic-angular";
import {OrganisationUnitsProvider} from "../../providers/organisation-units/organisation-units";
import {UserProvider} from "../../providers/user/user";
import {SmsCommandProvider} from "../../providers/sms-command/sms-command";
import {AppProvider} from "../../providers/app/app";
import {DataSetsProvider} from "../../providers/data-sets/data-sets";
import {NgForm} from "@angular/forms";

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
  canSend : boolean;
  loadingMessage : string;
  dataSets : Array<any>;

  icons : any = {};
  isDataSetDimensionApplicable : boolean;

  selectedOrgUnit : any;

  constructor(private navCtrl: NavController,private modalCtrl : ModalController,
              private userProvider : UserProvider,private appProvider : AppProvider,
              private dataSetProvider : DataSetsProvider,private periodSelection : PeriodSelectionProvider,
              private organisationUnitsProvider : OrganisationUnitsProvider) {  //public appPermission: AppPermissionProvider,
  }

  ngOnInit() {

    this.icons.orgUnit = "assets/upload-data-via-sms/orgUnit.png";
    this.icons.dataSet = "assets/upload-data-via-sms/form.png";
    this.icons.period = "assets/upload-data-via-sms/period.png";
    //checking and request for sms permissions

    // let permissions = cordova.plugins.permissions;
    // let smsPermission = [permissions.SEND_SMS];
    // this.appPermission.checkAndRequestAppPermission(smsPermission);

    this.loadingMessage = "Loading user information";
    this.isLoading = true;
    this.currentPeriodOffset = 0;
    this.isDataSetDimensionApplicable = false;

    this.userProvider.getCurrentUser().then((currentUser: any)=>{
      this.currentUser = currentUser;
      this.userProvider.getUserData().then((userData : any)=>{
        this.dataSetIdsByUserRoles = [];
        userData.userRoles.forEach((userRole:any)=>{
          if (userRole.dataSets) {
            userRole.dataSets.forEach((dataSet:any)=>{
              this.dataSetIdsByUserRoles.push(dataSet.id);
            });
          }
        });

        this.organisationUnitsProvider.getLastSelectedOrganisationUnitUnit(currentUser).then((lastSelectedOrgunit)=>{
          this.selectedOrgUnit = lastSelectedOrgunit;
          this.updateDataEntryFormSelections();
          this.loadingEntryForm();
        });
        this.updateDataEntryFormSelections();
      });
    },error=>{
      this.isLoading = false;
      this.loadingMessage = "";
      this.appProvider.setNormalNotification("Fail to load user information");
    })


  }



  updateDataEntryFormSelections(){
    if(this.organisationUnitsProvider.lastSelectedOrgUnit){
      this.selectedOrgUnit = this.organisationUnitsProvider.lastSelectedOrgUnit;
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

  openDataDimensionSelection(category){
    if(category.categoryOptions && category.categoryOptions && category.categoryOptions.length > 0){
      let currentIndex = this.dataSetCategoryCombo.categories.indexOf(category);
      let modal = this.modalCtrl.create('DataDimensionSelectionPage', {
        categoryOptions : category.categoryOptions,
        title : category.name + "'s selection",
        currentSelection : (this.selectedDataDimension[currentIndex]) ? this.selectedDataDimension[currentIndex]: {}
      });
      modal.onDidDismiss((selectedDataDimension : any)=>{
        if(selectedDataDimension && selectedDataDimension.id ){
          this.selectedDataDimension[currentIndex] = selectedDataDimension;
          this.updateDataEntryFormSelections();
        }
      });
      modal.present();
    }else{
      let message = "There is no option for " + category.name + " that associated with " + this.selectedOrgUnit.name;
      this.appProvider.setNormalNotification(message);
    }
  }

  updateDataSetCategoryCombo(categoryCombo){
    let dataSetCategoryCombo  = {};
    if(categoryCombo.name != 'default'){
      dataSetCategoryCombo['id'] = categoryCombo.id;
      dataSetCategoryCombo['name'] = categoryCombo.name;
      let categories = this.dataSetProvider.getDataSetCategoryComboCategories(this.selectedOrgUnit.id,this.selectedDataSet.categoryCombo.categories);
      dataSetCategoryCombo['categories'] = categories;
      this.isDataSetDimensionApplicable = true;
      categories.forEach((category: any)=>{
        if(category.categoryOptions && category.categoryOptions.length == 0){
          this.isDataSetDimensionApplicable = false;
        }
      })
    }
    this.selectedDataDimension = [];
    this.dataSetCategoryCombo = dataSetCategoryCombo;
    this.updateDataEntryFormSelections();
  }



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
    }else if(this.periodLabel == "Touch to select period"){
      isFormReady = false;
    }
    return isFormReady;
  }


  goSubmit(form: NgForm){
    let phoneNo: number;
    phoneNo = form.value.mobileNumber;

    console.log("send to: "+phoneNo+"\n" +
      "orgUnit: "+this.organisationUnitLabel+"\n" +
      "DataSet: "+this.dataSetLabel+"\n" +
      "Period: "+this.periodLabel);
  }




}
