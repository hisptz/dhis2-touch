import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import {SharedModule} from "./shared.module";
import {ClearLocalDataComponent} from "./clear-local-data/clear-local-data";

@NgModule({
  declarations: [
    ClearLocalDataComponent
  ],
  imports: [
    IonicModule,SharedModule
  ],
  exports: [
    ClearLocalDataComponent
  ]
})

export class SyncModule { }
