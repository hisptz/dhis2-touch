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

import { AggregatedStatusComponent } from "./aggregated-status/aggregated-status.component";
import { EventStatusComponent } from "./event-status/event-status.component";
import { EventTrackerStatusComponent } from "./event-tracker-status/event-tracker-status.component";
import { EnrollmentsComponent } from "./enrollments/enrollments.component";
import { AppSystemInfoComponent } from "./app-system-info/app-system-info.component";
import { AboutContainerComponent } from "./about-container/about-container.component";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";
import { SharedComponentsModule } from "src/app/components/sharedComponents.module";

@NgModule({
  declarations: [
    AboutContainerComponent,
    AggregatedStatusComponent,
    EventStatusComponent,
    EventTrackerStatusComponent,
    EnrollmentsComponent,
    AppSystemInfoComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    // SharedComponentsModule,
    TranslateModule.forRoot()
  ],
  exports: [
    AboutContainerComponent,
    AggregatedStatusComponent,
    EventStatusComponent,
    EventTrackerStatusComponent,
    EnrollmentsComponent,
    AppSystemInfoComponent
  ]
})
export class AboutContainerModule {}
