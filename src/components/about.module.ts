import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import {SharedModule} from "./shared.module";
import {DataSetSyncComponent} from "./data-set-sync/data-set-sync";

@NgModule({
  declarations: [DataSetSyncComponent],
  imports: [
    IonicModule,SharedModule
  ],
  exports: [DataSetSyncComponent]
})

export class AboutModule { }
