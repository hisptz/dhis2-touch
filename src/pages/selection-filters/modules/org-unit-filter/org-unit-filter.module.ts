import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { containers } from './containers';
import { components } from './components';
import { TranslateModule } from '@ngx-translate/core';
import { directives } from './directives';
import { pipes } from './pipes';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild()
  ],
  declarations: [
    ...containers,
    ...components,
    ...directives,
    ...pipes
  ],
  exports: [...containers],
  providers: []
})
export class OrgUnitFilterModule { }
