import { NgModule } from '@angular/core';
import { modules } from './modules/index';
import { containers } from './containers/index';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ...containers
  ],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    ...modules
  ],
  exports: [
    ...containers
  ],
  providers: []
})
export class SelectionFiltersModule {
}
