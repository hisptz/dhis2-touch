import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrganisationUnitSearchPage } from './organisation-unit-search';
import { sharedComponentsModule } from '../../components/sharedComponents.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [OrganisationUnitSearchPage],
  imports: [
    IonicPageModule.forChild(OrganisationUnitSearchPage),
    sharedComponentsModule,
    TranslateModule.forChild({})
  ]
})
export class OrganisationUnitSearchPageModule {}
