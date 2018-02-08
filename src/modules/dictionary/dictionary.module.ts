import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DictionaryListComponent } from './components/dictionary-list/dictionary-list.component';
import { DictionaryStoreService } from './services/dictionary-store.service';
import { DictionaryProgressComponent } from './components/dictionary-progress/dictionary-progress.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers, effects } from './store';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('dictionary', reducers),
    EffectsModule.forFeature(effects)
  ],
  declarations: [DictionaryListComponent, DictionaryProgressComponent],
  exports: [DictionaryListComponent],
  providers: [DictionaryStoreService, DatePipe]
})
export class DictionaryModule {}
