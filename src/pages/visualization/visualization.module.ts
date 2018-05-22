import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { reducers, effects } from './store';
import { EffectsModule } from '@ngrx/effects';
import { containers } from './containers';
import { CommonModule } from '@angular/common';
import { services } from './services';
import { components } from './components';
import { modules } from './modules';
import { pipes } from './pipes';
import { SelectionFiltersModule } from '../selection-filters/selection-filters.module';

@NgModule({
  declarations: [
    ...containers,
    ...components,
    ...pipes
  ],
  imports: [
    CommonModule,
    ...modules,
    SelectionFiltersModule,
    StoreModule.forFeature('visualization', reducers),
    EffectsModule.forFeature(effects)
  ],
  exports: [
    ...containers
  ],
  providers: [...services]
})
export class VisualizationPageModule {
}
