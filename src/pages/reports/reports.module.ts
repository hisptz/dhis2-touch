import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReportsPage } from './reports';
import { sharedComponentsModule } from '../../components/sharedComponents.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [ReportsPage],
  imports: [
    IonicPageModule.forChild(ReportsPage),
    sharedComponentsModule,
    NgxPaginationModule,
    PipesModule,
    TranslateModule.forChild({})
  ]
})
export class ReportsPageModule {}
