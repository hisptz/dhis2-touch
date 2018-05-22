import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PeriodFilterComponent } from './period-filter.component';
import {FormsModule} from '@angular/forms';
import {PeriodService} from './period.service';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule.forChild()
  ],
  declarations: [PeriodFilterComponent],
  exports: [PeriodFilterComponent],
  providers: [PeriodService]
})
export class PeriodFilterModule { }
