/*
 *
 * Copyright 2015 HISP Tanzania
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
 * @since 2015
 * @author Joseph Chingalo <profschingalo@gmail.com>
 *
 */

import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { AgeInputComponent } from './age-input/age-input';
import { BarcodeInputComponent } from './barcode-input/barcode-input';
import { BooleanInputFieldComponent } from './boolean-input-field/boolean-input-field';
import { CoordinateInputComponent } from './coordinate-input/coordinate-input';
import { DataTimeInputComponent } from './data-time-input/data-time-input';
import { DateInputFieldComponent } from './date-input-field/date-input-field';
import { EmailInputComponent } from './email-input/email-input';
import { LoadingComponent } from './loading/loading';
import { MultiOrganisationUnitComponent } from './multi-organisation-unit/multi-organisation-unit';
import { MultiOrganisationUnitTreeComponent } from './multi-organisation-unit-tree/multi-organisation-unit-tree';
import { NumericalInputFieldComponent } from './numerical-input-field/numerical-input-field';
import { OptionSetInputFieldComponent } from './option-set-input-field/option-set-input-field';
import { OrganisationUnitInputComponent } from './organisation-unit-input/organisation-unit-input';
import { OrganisationUnitTreeComponent } from './organisation-unit-tree/organisation-unit-tree';
import { PasswordInputComponent } from './password-input/password-input';
import { PercentageInputComponent } from './percentage-input/percentage-input';
import { PhoneNumberInputComponent } from './phone-number-input/phone-number-input';
import { RadioButtonInputComponent } from './radio-button-input/radio-button-input';
import { TextInputFieldComponent } from './text-input-field/text-input-field';
import { TrueOnlyInputFieldComponent } from './true-only-input-field/true-only-input-field';
import { UnitIntervalInputComponent } from './unit-interval-input/unit-interval-input';
import { ProgressBarComponent } from './progress-bar/progress-bar';

@NgModule({
  declarations: [
    AgeInputComponent,
    BarcodeInputComponent,
    BooleanInputFieldComponent,
    CoordinateInputComponent,
    DataTimeInputComponent,
    DateInputFieldComponent,
    EmailInputComponent,
    LoadingComponent,
    MultiOrganisationUnitComponent,
    MultiOrganisationUnitTreeComponent,
    NumericalInputFieldComponent,
    OptionSetInputFieldComponent,
    OrganisationUnitInputComponent,
    OrganisationUnitTreeComponent,
    PasswordInputComponent,
    PercentageInputComponent,
    PhoneNumberInputComponent,
    RadioButtonInputComponent,
    TextInputFieldComponent,
    TrueOnlyInputFieldComponent,
    UnitIntervalInputComponent,
    ProgressBarComponent
  ],
  imports: [IonicModule, TranslateModule.forChild({})],
  exports: [
    AgeInputComponent,
    BarcodeInputComponent,
    BooleanInputFieldComponent,
    CoordinateInputComponent,
    DataTimeInputComponent,
    DateInputFieldComponent,
    EmailInputComponent,
    LoadingComponent,
    MultiOrganisationUnitComponent,
    MultiOrganisationUnitTreeComponent,
    NumericalInputFieldComponent,
    OptionSetInputFieldComponent,
    OrganisationUnitInputComponent,
    OrganisationUnitTreeComponent,
    PasswordInputComponent,
    PercentageInputComponent,
    PhoneNumberInputComponent,
    RadioButtonInputComponent,
    TextInputFieldComponent,
    TrueOnlyInputFieldComponent,
    UnitIntervalInputComponent,
    ProgressBarComponent
  ]
})
export class sharedComponentsModule {}
