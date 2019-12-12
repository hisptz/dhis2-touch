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
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { getRepository } from 'typeorm';
import { HttpClientService } from './http-client.service';
import { CurrentUser } from 'src/models';
import { IndicatorEntity } from 'src/entites';

@Injectable({
  providedIn: 'root'
})
export class IndicatorService {
  constructor(private httpCLientService: HttpClientService) {}

  discoveringIndicatorsFromServer(currentUser: CurrentUser): Observable<any> {
    const resource = 'indicators';
    const fields =
      'fields=id,name,denominatorDescription,numeratorDescription,numerator,denominator,indicatorType[:all]';
    const url = `/api/${resource}.json?paging=false&${fields}`;
    return new Observable(observer => {
      this.httpCLientService
        .get(url, true, currentUser)
        .then((response: any) => {
          const { indicators } = response;
          observer.next(indicators);
          observer.complete();
        })
        .catch((error: any) => {
          observer.error(error);
        });
    });
  }

  async getAggregateIndicators(indicatorIds: string[]) {
    const repository = getRepository(IndicatorEntity);
    return await repository.findByIds(indicatorIds);
  }

  savingIndicatorsToLocalStorage(indicators: any[]): Observable<any> {
    return new Observable(observer => {
      const repository = getRepository(IndicatorEntity);
      const chunk = 100;
      repository
        .save(indicators, { chunk })
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch((error: any) => {
          observer.error(error);
        });
    });
  }
}
