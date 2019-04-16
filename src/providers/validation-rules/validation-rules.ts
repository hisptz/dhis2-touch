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
 */
import { Injectable } from '@angular/core';
import { SqlLiteProvider } from '../sql-lite/sql-lite';
import { HttpClientProvider } from '../http-client/http-client';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import { CurrentUser, ValidationRule } from '../../models';

@Injectable()
export class ValidationRulesProvider {
  constructor(
    private sqlLite: SqlLiteProvider,
    private HttpClient: HttpClientProvider
  ) {}

  discoveringValidationRules(
    currentUser: CurrentUser
  ): Observable<ValidationRule[]> {
    return new Observable(observer => {
      observer.next([]);
      observer.complete();
    });
  }

  savingValidationRules(
    validationRules: ValidationRule[],
    currentUser: CurrentUser
  ): Observable<any> {
    const resource = 'validationRules';
    return new Observable(observer => {
      console.log(`validation rules ${validationRules.length}`);
      if (validationRules.length === 0) {
        observer.next();
        observer.complete();
      } else {
        observer.next();
        observer.complete();
      }
    });
  }
}
