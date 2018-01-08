import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {SharedModule} from "../../components/shared.module";
import {ProgramSelection} from "./program-selection";
import { TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    ProgramSelection,
  ],
  imports: [
    IonicPageModule.forChild(ProgramSelection),SharedModule,
    TranslateModule.forChild({})
  ],
})
export class ProgramPageModule {}
