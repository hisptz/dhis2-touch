import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { sharedComponentsModule } from '../../../components/sharedComponents.module';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileInfoComponent } from './profile-info/profile-info';
import { ProfilePasswordComponent } from './profile-password/profile-password';

@NgModule({
  declarations: [ProfileInfoComponent, ProfilePasswordComponent],
  imports: [IonicModule, sharedComponentsModule, TranslateModule.forChild({})],
  exports: [ProfileInfoComponent, ProfilePasswordComponent]
})
export class ProfileComponentsModule {}
