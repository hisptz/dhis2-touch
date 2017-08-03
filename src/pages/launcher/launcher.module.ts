import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LauncherPage } from './launcher';
import {SharedModule} from "../../components/shared.module";

@NgModule({
  declarations: [
    LauncherPage,
  ],
  imports: [
    IonicPageModule.forChild(LauncherPage),
    SharedModule
  ],
})
export class LauncherPageModule {}
