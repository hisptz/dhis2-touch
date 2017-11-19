import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SettingsProvider} from "../../providers/settings/settings";
import {ActionSheetController} from "ionic-angular";

/**
 * Generated class for the InputContainerComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'input-container',
  templateUrl: 'input-container.html'
})
export class InputContainerComponent implements OnInit{

  @Input() dataElement;
  @Input() currentUser;
  @Input() data ;
  @Input() dataValuesSavingStatusClass;
  @Output() onChange = new EventEmitter();

  fieldLabelKey : any;
  textInputField : Array<string>;
  numericalInputField : Array<string>;
  supportValueTypes : Array<string>;
  formLayout : string;

  constructor(private settingProvider : SettingsProvider,private actionSheetCtrl : ActionSheetController) {}

  ngOnInit(){
    this.numericalInputField = ['INTEGER_NEGATIVE','INTEGER_POSITIVE','INTEGER','NUMBER','INTEGER_ZERO_OR_POSITIVE'];
    this.textInputField = ['TEXT','LONG_TEXT'];
    this.supportValueTypes = ['BOOLEAN','TRUE_ONLY','DATE','TEXT','LONG_TEXT','INTEGER_NEGATIVE','INTEGER_POSITIVE','INTEGER','NUMBER','INTEGER_ZERO_OR_POSITIVE'];

    this.formLayout = "listLayout";
    this.settingProvider.getSettingsForTheApp(this.currentUser).then((appSettings : any)=>{
      let dataEntrySettings = appSettings.entryForm;
      this.fieldLabelKey = this.dataElement.displayName;
      if(dataEntrySettings.formLayout){
        this.formLayout = dataEntrySettings.formLayout;
      }
      if(dataEntrySettings.label){
        if(this.dataElement[dataEntrySettings.label] && this.dataElement[dataEntrySettings.label] != '0'){
          this.fieldLabelKey = this.dataElement[dataEntrySettings.label];
        }
      }
    });
  }

  getListLayoutLabel(categoryComboName,categoryOptionComboName){
    let label = this.fieldLabelKey;
    if(categoryComboName != 'default'){
      label += " " + categoryOptionComboName;
    }
    return label;
  }

  showTooltips(dataElement,categoryComboName){
    let title = this.fieldLabelKey + (categoryComboName != 'default' ? " " +categoryComboName:"");
    let subTitle = "";
    if(dataElement.description){
      title += ". Description : " + dataElement.description ;
    }
    subTitle += "Value Type : " +dataElement.valueType.toLocaleLowerCase().replace(/_/g," ");
    if(dataElement.optionSet){
      title += ". It has " +dataElement.optionSet.options.length + " options to select.";
    }
    let actionSheet = this.actionSheetCtrl.create({
      title: title,subTitle:subTitle
    });
    actionSheet.present();
  }

  updateValue(updatedValue){
    this.dataValuesSavingStatusClass[updatedValue.id] = "input-field-container-saving";
    this.onChange.emit(updatedValue);
  };

}
