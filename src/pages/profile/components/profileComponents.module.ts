import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { SharedModule } from '../../../components/shared.module';
import { DataEntryModule } from '../../../components/data.entry.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [],
  imports: [
    IonicModule,
    SharedModule,
    DataEntryModule,
    TranslateModule.forChild({})
  ],
  exports: []
})
export class ProfileComponentsModule {}
