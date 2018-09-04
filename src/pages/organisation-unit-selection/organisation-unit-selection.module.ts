import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrganisationUnitSelectionPage } from './organisation-unit-selection';
import { sharedComponentsModule } from '../../components/sharedComponents.module';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [OrganisationUnitSelectionPage],
  imports: [
    IonicPageModule.forChild(OrganisationUnitSelectionPage),
    sharedComponentsModule,
    TranslateModule.forChild({})
  ]
})
export class OrganisationUnitSelectionPageModule {}
