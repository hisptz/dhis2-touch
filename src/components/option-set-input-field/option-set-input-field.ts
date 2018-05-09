import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController, ModalOptions } from 'ionic-angular';

/**
 * Generated class for the OptionSetInputFieldComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'option-set-input-field',
  templateUrl: 'option-set-input-field.html'
})
export class OptionSetInputFieldComponent implements OnInit {
  @Input() dataElementId: string;
  @Input() categoryOptionComboId: string;
  @Input() optionListTitle: string;
  @Input() dataEntrySettings;
  @Input() data;
  @Input() options;
  @Output() onChange = new EventEmitter();
  inputFieldValue: string;
  labelMapper: any;
  shouldDisplayAsRadio: boolean;
  //{"id":"s46m5MS0hxu-Prlt0C1RF0s","value":"1","status":"synced"}
  //id = dataElementId + "-" + categoryOptionComboId
  constructor(private modalCtrl: ModalController) {
    this.labelMapper = {};
    this.shouldDisplayAsRadio = false;
  }

  ngOnInit() {
    let fieldId = this.dataElementId + '-' + this.categoryOptionComboId;
    if (this.data && this.data[fieldId]) {
      this.inputFieldValue = this.data[fieldId].value;
    }
    if (this.options) {
      this.options.map((option: any) => {
        this.labelMapper[option.code] = option.name;
      });
    }
    if (this.dataEntrySettings && this.dataEntrySettings.shouldDisplayAsRadio) {
      this.shouldDisplayAsRadio = this.dataEntrySettings.shouldDisplayAsRadio;
    }
  }

  openOptionListModal() {
    let options: ModalOptions = {
      cssClass: 'inset-modal',
      enableBackdropDismiss: true
    };
    let data = {
      options: this.options,
      currentValue: this.inputFieldValue,
      title: this.optionListTitle ? this.optionListTitle : 'Options selections'
    };
    const modal = this.modalCtrl.create(
      'OptionListModalPage',
      { data: data },
      options
    );
    modal.onDidDismiss((selectedOption: any) => {
      if (selectedOption && selectedOption.id) {
        this.inputFieldValue = selectedOption.code;
        this.updateValues();
      }
    });
    modal.present();
  }

  updateValues() {
    const fieldId = this.dataElementId + '-' + this.categoryOptionComboId;
    this.onChange.emit({
      id: fieldId,
      value: this.inputFieldValue,
      status: 'not-synced'
    });
  }
}
