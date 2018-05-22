import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartListComponent } from './components/chart-list/chart-list.component';
import { ChartItemComponent } from './components/chart-item/chart-item.component';
import {ChartConfigurationService} from './services/chart-configuration.service';
import {ChartService} from './services/chart.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ChartListComponent,
    ChartItemComponent],
  exports: [
    ChartListComponent,
    ChartItemComponent],
  providers: [
    ChartConfigurationService,
    ChartService
  ]
})
export class ChartModule { }
