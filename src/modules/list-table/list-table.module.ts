import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as fromContainers from './containers';
import * as fromComponents from './components';

@NgModule({
  imports: [CommonModule],
  declarations: [...fromContainers.containers],
  exports: [...fromContainers.containers]
})
export class ListTableModule {}
