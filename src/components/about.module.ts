import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import {SharedModule} from "./shared.module";
import {DataSetSyncComponent} from "./data-set-sync/data-set-sync";
import {DataElementSyncComponent} from "./data-element-sync/data-element-sync";

@NgModule({
  declarations: [DataSetSyncComponent, DataElementSyncComponent],
  imports: [
    IonicModule,SharedModule
  ],
  exports: [DataSetSyncComponent, DataElementSyncComponent]
})

export class AboutModule { }


//DataSetReportComponent
