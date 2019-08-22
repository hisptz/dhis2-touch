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
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';

// store
import { reducers, metaReducers, effects } from './store';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { nativePlugins, appProviders } from './services';
import { SharedComponentsModule } from './components/sharedComponents.module';
import { TranslationSelectionPageModule } from './modals/translation-selection/translation-selection.module';
import { LocalInstanceSelectionPageModule } from './modals/local-instance-selection/local-instance-selection.module';
import { CoordinateSelectionPageModule } from './modals/coordinate-selection/coordinate-selection.module';
import { OptionSetSelectionPageModule } from './modals/option-set-selection/option-set-selection.module';
import { OrganisationUnitSearchPageModule } from './modals/organisation-unit-search/organisation-unit-search.module';
import { OrganisationUnitSelectionPageModule } from './modals/organisation-unit-selection/organisation-unit-selection.module';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot(effects),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    AppRoutingModule,
    TranslationSelectionPageModule,
    LocalInstanceSelectionPageModule,
    CoordinateSelectionPageModule,
    OptionSetSelectionPageModule,
    OrganisationUnitSearchPageModule,
    OrganisationUnitSelectionPageModule,
    SharedComponentsModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ...nativePlugins,
    ...appProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
