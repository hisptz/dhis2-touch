import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisualizationPageModule } from '../visualization/visualization.module';
import { VisualizationItemPage } from './visualization-item';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    VisualizationItemPage
  ],
  imports: [
    CommonModule,
    VisualizationPageModule,
    IonicPageModule.forChild(VisualizationItemPage),
  ],
  exports: [

  ],
  providers: []
})
export class VisualizationItemPageModule {
}
