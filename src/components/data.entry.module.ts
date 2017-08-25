import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import {SharedModule} from "./shared.module";
import {OrganisationUnitTreeComponent} from "./organisation-unit-tree/organisation-unit-tree";
import {PeriodSelectionComponent} from "./period-selection/period-selection";

@NgModule({
  declarations: [
    OrganisationUnitTreeComponent,PeriodSelectionComponent
  ],
  imports: [
    IonicModule,SharedModule
  ],
  exports: [
    OrganisationUnitTreeComponent,PeriodSelectionComponent
  ]
})

export class DataEntryModule { }
