import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SettingsProvider} from "../../providers/settings/settings";
import {ActionSheetController} from "ionic-angular";

/**
 * Generated class for the TrackedEntityInputsComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'tracked-entity-inputs',
  templateUrl: 'tracked-entity-inputs.html'
})
export class TrackedEntityInputsComponent implements OnInit{

  @Input() trackedEntityAttribute;
  @Input() currentUser;
  @Input() mandatory;
  @Input() data ;
  @Input() trackedEntityAttributesSavingStatusClass;
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

    if(this.trackedEntityAttribute && this.trackedEntityAttribute.id){
      this.fieldLabelKey = this.trackedEntityAttribute.name;
      this.formLayout = "listLayout";
      this.settingProvider.getSettingsForTheApp(this.currentUser).then((appSettings : any)=>{
        let dataEntrySettings = appSettings.entryForm;
        if(dataEntrySettings.formLayout){
          this.formLayout = dataEntrySettings.formLayout;
        }
        if(dataEntrySettings.label){
          if(this.trackedEntityAttribute[dataEntrySettings.label]){
            this.fieldLabelKey = this.trackedEntityAttribute[dataEntrySettings.label];
          }
        }
      });
    }
  }

  showTooltips(){
    let title = this.fieldLabelKey;
    let subTitle = "";
    if(this.trackedEntityAttribute.description){
      title += ". Description : " + this.trackedEntityAttribute.description ;
    }
    subTitle += "Value Type : " +this.trackedEntityAttribute.valueType.toLocaleLowerCase().replace(/_/g," ");
    if(this.trackedEntityAttribute.optionSet){
      title += ". It has " +this.trackedEntityAttribute.optionSet.options.length + " options to select.";
    }
    let actionSheet = this.actionSheetCtrl.create({
      title: title,subTitle:subTitle
    });
    actionSheet.present();
  }

  updateValue(updatedValue){
    this.trackedEntityAttributesSavingStatusClass[updatedValue.id] = "input-field-container-saving";
    this.onChange.emit(updatedValue);
  };

}
