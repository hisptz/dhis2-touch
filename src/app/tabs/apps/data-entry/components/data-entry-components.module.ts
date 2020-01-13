/*
 *
 * Copyright 2019 HISP Tanzania
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301, USA.
 *
 * @since 2019
 * @author Joseph Chingalo <profschingalo@gmail.com>
 *
 */
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { DataEntryFormSummaryComponent } from './data-entry-form-summary/data-entry-form-summary.component';
import { AggregateParameterSelectionComponent } from './aggregate-parameter-selection/aggregate-parameter-selection.component';
import { AggregateFormContainerComponent } from './aggregate-form-container/aggregate-form-container.component';
import { CompletenessContainerComponent } from './completeness-container/completeness-container.component';
import { CustomEntryFormComponent } from './custom-entry-form/custom-entry-form.component';
import { DefaultEntryFormComponent } from './default-entry-form/default-entry-form.component';
import { AggregateCompletenessPaginatorComponent } from './aggregate-completeness-paginator/aggregate-completeness-paginator.component';

@NgModule({
  declarations: [
    AggregateParameterSelectionComponent,
    DataEntryFormSummaryComponent,
    AggregateFormContainerComponent,
    CompletenessContainerComponent,
    CustomEntryFormComponent,
    DefaultEntryFormComponent,
    AggregateCompletenessPaginatorComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    TranslateModule.forChild(),
    SharedComponentsModule
  ],
  exports: [
    AggregateParameterSelectionComponent,
    DataEntryFormSummaryComponent,
    AggregateFormContainerComponent,
    CompletenessContainerComponent,
    CustomEntryFormComponent,
    DefaultEntryFormComponent,
    AggregateCompletenessPaginatorComponent
  ]
})
export class DataEntryComponentsModule {}
