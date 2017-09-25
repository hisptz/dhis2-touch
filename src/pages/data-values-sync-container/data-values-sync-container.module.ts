import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {SharedModule} from "../../components/shared.module";
import {DataValuesSyncContainerPage} from "./data-values-sync-container";
import {AboutModule} from "../../components/about.module";

@NgModule({
  declarations: [
    DataValuesSyncContainerPage,
  ],
  imports: [
    IonicPageModule.forChild(DataValuesSyncContainerPage),SharedModule, AboutModule
  ],
})
export class DataValuesSyncPageModule {}
