import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import {SharedModule} from "./shared.module";
import {OrganisationUnitTreeComponent} from "./organisation-unit-tree/organisation-unit-tree";
import {InputFieldComponent} from "./input-field/input-field";
import {InputContainerComponent} from "./input-container/input-container";

@NgModule({
  declarations: [
    OrganisationUnitTreeComponent,InputFieldComponent,InputContainerComponent
  ],
  imports: [
    IonicModule,SharedModule
  ],
  exports: [
    OrganisationUnitTreeComponent,InputFieldComponent,InputContainerComponent
  ]
})

export class DataEntryModule { }
