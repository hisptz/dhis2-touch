import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HelpPage } from './help';
import {SharedModule} from "../../components/shared.module";
import { TranslateModule} from "@ngx-translate/core";
@NgModule({
  declarations: [
    HelpPage,
  ],
  imports: [
    IonicPageModule.forChild(HelpPage),SharedModule,
    TranslateModule.forChild({})
  ],
})
export class HelpPageModule {}
