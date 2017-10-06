import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import {SharedModule} from "./shared.module";
import {OrganisationUnitTreeComponent} from "./organisation-unit-tree/organisation-unit-tree";
import {InputContainerComponent} from "./input-container/input-container";
import {BooleanInputFieldComponent} from "./boolean-input-field/boolean-input-field";
import {DateInputFieldComponent} from "./date-input-field/date-input-field";
import {NumericalInputFieldComponent} from "./numerical-input-field/numerical-input-field";
import {OptionSetInputFieldComponent} from "./option-set-input-field/option-set-input-field";
import {TextInputFieldComponent} from "./text-input-field/text-input-field";
import {TrueOnlyInputFieldComponent} from "./true-only-input-field/true-only-input-field";
import {TrackedEntityInputsComponent} from "./tracked-entity-inputs/tracked-entity-inputs";
import {EventCaptureFormInputComponent} from "./event-capture-form-inputs/event-capture-form-inputs";

@NgModule({
  declarations: [
    OrganisationUnitTreeComponent,InputContainerComponent,TrackedEntityInputsComponent,
    BooleanInputFieldComponent,DateInputFieldComponent,NumericalInputFieldComponent,
    OptionSetInputFieldComponent,TextInputFieldComponent,TrueOnlyInputFieldComponent,EventCaptureFormInputComponent
  ],
  imports: [
    IonicModule,SharedModule
  ],
  exports: [
    OrganisationUnitTreeComponent,InputContainerComponent,TrackedEntityInputsComponent,
    BooleanInputFieldComponent,DateInputFieldComponent,NumericalInputFieldComponent,
    OptionSetInputFieldComponent,TextInputFieldComponent,TrueOnlyInputFieldComponent,EventCaptureFormInputComponent
  ]
})

export class DataEntryModule { }
