import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LayoutComponent} from './layout.component';
import {DragulaModule} from 'ng2-dragula';
import {DndModule} from 'ng2-dnd';

@NgModule({
  imports: [
    CommonModule,
    DragulaModule,
    DndModule.forRoot()
  ],
  declarations: [LayoutComponent],
  exports: [LayoutComponent]
})
export class LayoutModule { }
