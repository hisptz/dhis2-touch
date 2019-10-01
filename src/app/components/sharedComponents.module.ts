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
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

import { ProgressBarComponent } from "./progress-bar/progress-bar.component";
import { BarcodeInputComponent } from "./barcode-input/barcode-input.component";
import { PasswordInputComponent } from "./password-input/password-input.component";
import { TextInputComponent } from "./text-input/text-input.component";
import { DateTimeComponent } from "./date-time/date-time.component";
import { DateInputComponent } from "./date-input/date-input.component";
import { AgeInputComponent } from "./age-input/age-input.component";
import { EmailInputComponent } from "./email-input/email-input.component";
import { PhoneNumberInputComponent } from "./phone-number-input/phone-number-input.component";
import { NumericalInputComponent } from "./numerical-input/numerical-input.component";
import { UnitIntervalInputComponent } from "./unit-interval-input/unit-interval-input.component";
import { PercentageInputComponent } from "./percentage-input/percentage-input.component";
import { RadioButtonComponent } from "./radio-button/radio-button.component";
import { TrueOnlyInputComponent } from "./true-only-input/true-only-input.component";
import { BooleanInputComponent } from "./boolean-input/boolean-input.component";
import { CoordinateInputComponent } from "./coordinate-input/coordinate-input.component";
import { OptionSetInputComponent } from "./option-set-input/option-set-input.component";
import { OrganisationUnitInputComponent } from "./organisation-unit-input/organisation-unit-input.component";
import { OrganisationUnitTreeComponent } from "./organisation-unit-tree/organisation-unit-tree.component";
import { SynchronizationStatusComponent } from "./synchronization-status/synchronization-status.component";

@NgModule({
  declarations: [
    BarcodeInputComponent,
    PasswordInputComponent,
    ProgressBarComponent,
    TextInputComponent,
    DateTimeComponent,
    DateInputComponent,
    AgeInputComponent,
    EmailInputComponent,
    PhoneNumberInputComponent,
    NumericalInputComponent,
    UnitIntervalInputComponent,
    PercentageInputComponent,
    SynchronizationStatusComponent,
    RadioButtonComponent,
    TrueOnlyInputComponent,
    BooleanInputComponent,
    CoordinateInputComponent,
    OptionSetInputComponent,
    OrganisationUnitInputComponent,
    OrganisationUnitTreeComponent
  ],
  imports: [IonicModule, CommonModule, FormsModule, TranslateModule.forChild()],
  exports: [
    BarcodeInputComponent,
    PasswordInputComponent,
    ProgressBarComponent,
    TextInputComponent,
    DateTimeComponent,
    DateInputComponent,
    AgeInputComponent,
    EmailInputComponent,
    PhoneNumberInputComponent,
    SynchronizationStatusComponent,
    NumericalInputComponent,
    UnitIntervalInputComponent,
    PercentageInputComponent,
    RadioButtonComponent,
    TrueOnlyInputComponent,
    BooleanInputComponent,
    CoordinateInputComponent,
    OptionSetInputComponent,
    OrganisationUnitInputComponent,
    OrganisationUnitTreeComponent
  ]
})
export class SharedComponentsModule {}
