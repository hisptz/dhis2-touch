import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePage } from './profile';
import { providers } from './providers';
import { SharedModule } from '../../components/shared.module';
import { ProfileComponentsModule } from './components/profileComponents.module';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ProfilePage],
  imports: [
    IonicPageModule.forChild(ProfilePage),
    SharedModule,
    ProfileComponentsModule,
    TranslateModule.forChild({})
  ],
  providers: [...providers]
})
export class ProfilePageModule {}
