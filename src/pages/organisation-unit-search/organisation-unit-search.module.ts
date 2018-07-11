import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrganisationUnitSearchPage } from './organisation-unit-search';
import { SharedModule } from '../../components/shared.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [OrganisationUnitSearchPage],
  imports: [
    IonicPageModule.forChild(OrganisationUnitSearchPage),
    SharedModule,
    TranslateModule.forChild({})
  ]
})
export class OrganisationUnitSearchPageModule {}
