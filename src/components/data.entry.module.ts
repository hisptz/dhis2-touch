import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { SharedModule } from './shared.module';
import { OrganisationUnitTreeComponent } from './organisation-unit-tree/organisation-unit-tree';
import { InputContainerComponent } from './input-container/input-container';
import { BooleanInputFieldComponent } from './boolean-input-field/boolean-input-field';
import { DateInputFieldComponent } from './date-input-field/date-input-field';
import { NumericalInputFieldComponent } from './numerical-input-field/numerical-input-field';
import { OptionSetInputFieldComponent } from './option-set-input-field/option-set-input-field';
import { TextInputFieldComponent } from './text-input-field/text-input-field';
import { TrueOnlyInputFieldComponent } from './true-only-input-field/true-only-input-field';
import { CoordinateInputComponent } from './coordinate-input/coordinate-input';
import { OrganisationUnitInputComponent } from './organisation-unit-input/organisation-unit-input';
import { PercentageInputComponent } from './percentage-input/percentage-input';
import { UnitIntervalInputComponent } from './unit-interval-input/unit-interval-input';
import { EmailInputComponent } from './email-input/email-input';
import { PhoneNumberInputComponent } from './phone-number-input/phone-number-input';
import { RadioButtonInputComponent } from './radio-button-input/radio-button-input';
import { DataTimeInputComponent } from './data-time-input/data-time-input';
import { BarcodeInputComponent } from './barcode-input/barcode-input';
import { AgeInputComponent } from './age-input/age-input';

@NgModule({
  declarations: [
    OrganisationUnitTreeComponent,
    InputContainerComponent,
    BooleanInputFieldComponent,
    DateInputFieldComponent,
    NumericalInputFieldComponent,
    OptionSetInputFieldComponent,
    TextInputFieldComponent,
    TrueOnlyInputFieldComponent,
    CoordinateInputComponent,
    OrganisationUnitInputComponent,
    PercentageInputComponent,
    UnitIntervalInputComponent,
    EmailInputComponent,
    PhoneNumberInputComponent,
    RadioButtonInputComponent,
    DataTimeInputComponent,
    BarcodeInputComponent,
    AgeInputComponent
  ],
  imports: [IonicModule, SharedModule],
  exports: [
    OrganisationUnitTreeComponent,
    InputContainerComponent,
    BooleanInputFieldComponent,
    DateInputFieldComponent,
    NumericalInputFieldComponent,
    OptionSetInputFieldComponent,
    TextInputFieldComponent,
    TrueOnlyInputFieldComponent,
    CoordinateInputComponent,
    OrganisationUnitInputComponent,
    PercentageInputComponent,
    UnitIntervalInputComponent,
    EmailInputComponent,
    PhoneNumberInputComponent,
    RadioButtonInputComponent,
    DataTimeInputComponent,
    BarcodeInputComponent,
    AgeInputComponent
  ]
})
export class DataEntryModule {}
