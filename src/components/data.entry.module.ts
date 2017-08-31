import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import {SharedModule} from "./shared.module";
import {OrganisationUnitTreeComponent} from "./organisation-unit-tree/organisation-unit-tree";
import {InputFieldComponent} from "./input-field/input-field";

@NgModule({
  declarations: [
    OrganisationUnitTreeComponent,InputFieldComponent
  ],
  imports: [
    IonicModule,SharedModule
  ],
  exports: [
    OrganisationUnitTreeComponent,InputFieldComponent
  ]
})

export class DataEntryModule { }
