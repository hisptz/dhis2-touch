import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { DashboardPage } from './dashboard';

import { containers } from './containers';
import { reducers, effects } from './store';
import { services } from './services';
import { VisualizationPageModule } from '../visualization/visualization.module';
import { TranslateModule } from '@ngx-translate/core';
import { sharedComponentsModule } from '../../components/sharedComponents.module';

@NgModule({
  declarations: [...containers, DashboardPage],
  imports: [
    IonicPageModule.forChild(DashboardPage),
    VisualizationPageModule,
    sharedComponentsModule,
    StoreModule.forFeature('dashboard', reducers),
    EffectsModule.forFeature(effects),
    TranslateModule.forChild()
  ],
  providers: [...services]
})
export class DashboardPageModule {}
