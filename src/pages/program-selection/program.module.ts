import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {SharedModule} from "../../components/shared.module";
import {ProgramSelectionPage} from "./program-selection";

@NgModule({
  declarations: [
    ProgramSelectionPage,
  ],
  imports: [
    IonicPageModule.forChild(ProgramSelectionPage),SharedModule
  ],
})
export class ProgramPageModule {}
