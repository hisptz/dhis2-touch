import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import {SharedModule} from "./shared.module";
import {DataSetSyncComponent} from "./data-set-sync/data-set-sync";
import {DataElementSyncComponent} from "./data-element-sync/data-element-sync";
import {Http} from "@angular/http";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../app/app.module";

@NgModule({
  declarations: [DataSetSyncComponent, DataElementSyncComponent],
  imports: [
    IonicModule,SharedModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      },
      isolate: true
    }),
  ],
  exports: [DataSetSyncComponent, DataElementSyncComponent]
})

export class AboutModule { }
