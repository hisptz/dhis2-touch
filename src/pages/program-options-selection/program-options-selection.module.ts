import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {SharedModule} from "../../components/shared.module";
import {ProgramOptionsSelectionPage} from "./program-options-selection";

@NgModule({
  declarations: [
    ProgramOptionsSelectionPage,
  ],
  imports: [
    IonicPageModule.forChild(ProgramOptionsSelectionPage),SharedModule
  ],
})
export class ProgramOptionsSelectionPageModule {}
