import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { reducers, effects } from './store';
// containers
import * as fromContainers from './containers';
// components
import * as fromComponents from './components';

import * as fromServices from './services';

import { DragulaModule } from 'ng2-dragula';

import { NgxPaginationModule } from 'ngx-pagination';

import { VirtualScrollModule } from 'angular2-virtual-scroll';
import { OrgUnitFilterModule } from '../../../selection-filters/modules/org-unit-filter/org-unit-filter.module';
import { PeriodFilterModule } from '../../../selection-filters/modules/period-filter/period-filter.module';
import { DataFilterModule } from '../../../selection-filters/modules/data-filter/data-filter.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    DragulaModule,
    NgxPaginationModule,
    OrgUnitFilterModule,
    PeriodFilterModule,
    DataFilterModule,
    VirtualScrollModule,
    StoreModule.forFeature('map', reducers),
    EffectsModule.forFeature(effects)
  ],
  providers: [...fromServices.services],
  declarations: [...fromContainers.containers, ...fromComponents.components],
  exports: [...fromContainers.containers, ...fromComponents.components]
})
export class MapModule {}
