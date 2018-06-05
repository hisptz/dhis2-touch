import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HideAndShowColumnsPage } from './hide-and-show-columns';
import { SharedModule } from '../../components/shared.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [HideAndShowColumnsPage],
  imports: [
    IonicPageModule.forChild(HideAndShowColumnsPage),
    SharedModule,
    TranslateModule.forChild()
  ]
})
export class HideAndShowColumnsPageModule {}
