import { ListTableModule } from './../list-table/list-table.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as fromContainers from './containers';

@NgModule({
  imports: [CommonModule, ListTableModule],
  declarations: [...fromContainers.containers],
  exports: [...fromContainers.containers]
})
export class ResourcesModule {}
