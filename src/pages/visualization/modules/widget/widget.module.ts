import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { containers } from './containers';

@NgModule({
  imports: [CommonModule],
  declarations: [...containers],
  exports: [...containers]
})
export class WidgetModule {}
