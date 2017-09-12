import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {SharedModule} from "../../components/shared.module";
import {ProgramSelection} from "./program-selection";
import {DataEntryModule} from "../../components/data.entry.module";

@NgModule({
  declarations: [
    ProgramSelection,
  ],
  imports: [
    IonicPageModule.forChild(ProgramSelection),SharedModule
  ],
})
export class ProgramPageModule {}
