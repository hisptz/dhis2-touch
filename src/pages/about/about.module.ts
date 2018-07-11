import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {AboutPage} from './about';
import {SharedModule} from "../../components/shared.module";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    AboutPage,
  ],
  imports: [
    IonicPageModule.forChild(AboutPage), SharedModule,
    TranslateModule.forChild({})
  ],
})
export class AboutPageModule {
}
