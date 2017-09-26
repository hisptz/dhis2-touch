import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {SharedModule} from "../../components/shared.module";
import {DataElementSyncPage} from "./data-element-sync";
import {AboutModule} from "../../components/about.module";

@NgModule({
  declarations: [
    DataElementSyncPage,
  ],
  imports: [
    IonicPageModule.forChild(DataElementSyncPage),SharedModule, AboutModule
  ],
})
export class DataElementSnycPageModule {}
