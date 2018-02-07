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
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [CommonModule, HttpClientModule, StoreModule.forFeature('map', reducers), EffectsModule.forFeature(effects)],
  providers: [...fromServices.services],
  declarations: [...fromContainers.containers, ...fromComponents.components],
  exports: [...fromContainers.containers, ...fromComponents.components]
})
export class MapModule { }
