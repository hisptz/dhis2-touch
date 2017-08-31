import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SettingsProvider} from "../../providers/settings/settings";

/**
 * Generated class for the InputFieldComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'input-field',
  templateUrl: 'input-field.html'
})
export class InputFieldComponent implements OnInit{

  @Input() dataElement;
  @Input() currentUser;
  //@Input() data ;
  @Output() onChange = new EventEmitter();

  fieldLabelKey : any;

  constructor(private settingProvider : SettingsProvider) {}

  ngOnInit(){
    this.settingProvider.getSettingsForTheApp(this.currentUser).then((appSettings : any)=>{
      let dataEntrySettings = appSettings.entryForm;
      this.fieldLabelKey = this.dataElement.displayName;
      if(dataEntrySettings.label){
        if(this.dataElement[dataEntrySettings.label]){
          this.fieldLabelKey = this.dataElement[dataEntrySettings.label];
        }
      }
    })

  }



}
