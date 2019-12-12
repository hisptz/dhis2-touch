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
import { ConstantEntity, ReportEntity, ReportDesignEntity } from 'src/entites';

@Injectable({
  providedIn: 'root'
})
export class StandardResportService {
  constructor(private httpCLientService: HttpClientService) {}

  discoveringReportsFromServer(currentUser: CurrentUser): Observable<any> {
    const fields =
      'id,name,created,type,relativePeriods,reportParams,designContent';
    // const filter = 'filter=type:eq:HTML&filter=designContent:ilike:cordova';
    const filter = '';
    const resource = 'reports';
    const url = `/api/${resource}.json?paging=false&fields=${fields}&${filter}`;
    return new Observable(observer => {
      this.httpCLientService
        .get(url, true, currentUser)
        .then((response: any) => {
          const { reports } = response;
          observer.next(reports);
          observer.complete();
        })
        .catch((error: any) => {
          observer.error(error);
        });
    });
  }

  discoveringConstantsFromServer(currentUser: CurrentUser): Observable<any> {
    const fields = 'id,name,value';
    const resource = 'constants';
    const url = `/api/${resource}.json?paging=false&fields=${fields}`;
    return new Observable(observer => {
      this.httpCLientService
        .get(url, true, currentUser)
        .then((response: any) => {
          const { constants } = response;
          observer.next(constants);
          observer.complete();
        })
        .catch((error: any) => {
          observer.error(error);
        });
    });
  }

  savingReportsToLocalStorage(reports: any[]): Observable<any> {
    const reportRepository = getRepository(ReportEntity);
    const reportDesignRepository = getRepository(ReportDesignEntity);
    const chunk = 50;
    return new Observable(observer => {
      reportRepository
        .save(reports, { chunk })
        .then(() => {
          reportDesignRepository
            .save(reports, { chunk })
            .then(() => {
              observer.next();
              observer.complete();
            })
            .catch((error: any) => {
              observer.error(error);
            });
        })
        .catch((error: any) => {
          observer.error(error);
        });
    });
  }

  savingConstantsToLocalStorage(constants: any[]): Observable<any> {
    const repository = getRepository(ConstantEntity);
    const chunk = 50;
    return new Observable(observer => {
      repository
        .save(constants, { chunk })
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
