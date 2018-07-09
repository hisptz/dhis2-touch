import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { SharedModule } from '../../../components/shared.module';
import { DataEntryModule } from '../../../components/data.entry.module';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileInfoComponent } from './profile-info/profile-info';
import { ProfilePasswordComponent } from './profile-password/profile-password';

@NgModule({
  declarations: [ProfileInfoComponent, ProfilePasswordComponent],
  imports: [
    IonicModule,
    SharedModule,
    DataEntryModule,
    TranslateModule.forChild({})
  ],
  exports: [ProfileInfoComponent, ProfilePasswordComponent]
})
export class ProfileComponentsModule {}
