import {Component, Input, OnInit} from '@angular/core';

/**
 * Generated class for the DataSetReportRowComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'data-set-report-row',
  templateUrl: 'data-set-report-row.html'
})
export class DataSetReportRowComponent implements OnInit{

  @Input() dataElement;
  @Input() appSettings;
  @Input() dataValues;


  fieldLabelKey : string;
  dataObject : any;

  constructor() { }

  ngOnInit(){
    this.dataObject = {};
    if(this.dataElement && this.dataElement.displayName){
      this.fieldLabelKey = this.dataElement.displayName;
      let dataEntrySettings = this.appSettings.entryForm;
      if(dataEntrySettings.label){
        if(this.dataElement[dataEntrySettings.label] && this.dataElement[dataEntrySettings.label] != '0'){
          this.fieldLabelKey = this.dataElement[dataEntrySettings.label];
        }
      }
      this.setReportValues(this.dataValues,this.dataElement);
    }
  }

  getListLayoutLabel(categoryComboName,categoryOptionComboName){
    let label = this.fieldLabelKey;
    if(categoryComboName != 'default'){
      label += " " + categoryOptionComboName;
    }
    return label;
  }

  setReportValues(dataValues,dataElement){
    let validAggregatedTypes = ['INTEGER_NEGATIVE','INTEGER_POSITIVE','INTEGER','NUMBER','INTEGER_ZERO_OR_POSITIVE'];
    let categoryComboValues = {};
    dataValues.forEach((dataValue : any)=>{
      if(!categoryComboValues[dataValue.co]){
        categoryComboValues[dataValue.co] = [];
      }
      categoryComboValues[dataValue.co].push(dataValue.value);
    });

    if(dataElement.categoryCombo.categoryOptionCombos && dataElement.categoryCombo.categoryOptionCombos && dataElement.categoryCombo.categoryOptionCombos){
      dataElement.categoryCombo.categoryOptionCombos.forEach((categoryOptionCombo : any)=>{
        let id = dataElement.id + "-" +categoryOptionCombo.id;
        let values = categoryComboValues[categoryOptionCombo.id];
        if(validAggregatedTypes.indexOf(dataElement.valueType) > -1){
          this.dataObject[id] = this.getAggregatedValue(values,dataElement.aggregationType);
        }else{
          this.dataObject[id] = "";
        }
      });
    }
  }

  getAggregatedValue(values,aggregationType){
    let aggregatedValue = 0;
    if(values && values.length > 0){
      if(aggregationType == "SUM"){
        values.forEach((value )=>{
          aggregatedValue += parseFloat(value);
        });
      }else if(aggregationType == "AVERAGE"){
        let sum = 0;
        values.forEach((value )=>{
          sum += parseFloat(value);
        });
        aggregatedValue = sum/values.length;
      }else{
        console.log("aggregationType : " +aggregationType);
        //@todo calculate based on aggregation types for other apart of SUM, AVERAGE,
        //assume using operations
        values.forEach((value )=>{
          aggregatedValue += parseFloat(value);
        });
      }

    }
    return aggregatedValue;
  }

}
