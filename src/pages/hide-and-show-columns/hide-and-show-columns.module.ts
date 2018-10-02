import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HideAndShowColumnsPage } from './hide-and-show-columns';
import { TranslateModule } from '@ngx-translate/core';
import { sharedComponentsModule } from '../../components/sharedComponents.module';

@NgModule({
  declarations: [HideAndShowColumnsPage],
  imports: [
    IonicPageModule.forChild(HideAndShowColumnsPage),
    sharedComponentsModule,
    TranslateModule.forChild()
  ]
})
export class HideAndShowColumnsPageModule {}
