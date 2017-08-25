import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrganisationUnitSelectionPage } from './organisation-unit-selection';
import {SharedModule} from "../../components/shared.module";
import {DataEntryModule} from "../../components/data.entry.module";

@NgModule({
  declarations: [
    OrganisationUnitSelectionPage,
  ],
  imports: [
    IonicPageModule.forChild(OrganisationUnitSelectionPage),DataEntryModule,SharedModule
  ],
})
export class OrganisationUnitSelectionPageModule {}
