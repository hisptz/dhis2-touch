import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { reducers, effects } from './store';
import * as fromContainers from './containers';
import * as fromComponents from './components';
import * as fromServices from './services';
import * as fromPipes from './pipes';
@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('feedbackMessage', reducers),
    EffectsModule.forFeature(effects)
  ],
  declarations: [...fromContainers.containers, ...fromComponents.components, ...fromPipes.pipes],
  exports: [...fromContainers.containers],
  providers: [...fromServices.services]
})
export class FeedbackMessageModule { }
