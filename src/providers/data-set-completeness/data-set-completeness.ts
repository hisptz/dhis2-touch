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
import { Injectable } from '@angular/core';
import { HttpClientProvider } from '../http-client/http-client';
import { Observable } from 'rxjs/Observable';
import { CurrentUser } from '../../models';
import { OfflineCompletenessProvider } from '../offline-completeness/offline-completeness';

@Injectable()
export class DataSetCompletenessProvider {
  constructor(
    private httpClient: HttpClientProvider,
    private offlineCompletenessProvider: OfflineCompletenessProvider
  ) {}

  savingEntryFormCompletenessData(
    entryFormSelection: any,
    dataSetCompletenessInfo: any,
    currentUser: CurrentUser
  ): Observable<any> {
    return new Observable(observer => {
      this.discoverAndUpdateEntryFormCompletenessInfo(
        entryFormSelection,
        dataSetCompletenessInfo,
        currentUser
      )
        .then(response => {
          observer.next(response);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }

  async discoverAndUpdateEntryFormCompletenessInfo(
    entryFormSelection: any,
    dataSetCompletenessInfo: any,
    currentUser: CurrentUser
  ) {
    const id = this.offlineCompletenessProvider.getEntryFormConpletenessDataId(
      entryFormSelection
    );
    const offlineData = await this.offlineCompletenessProvider
      .getOfflineCompletenessesByIds([id], currentUser)
      .toPromise();
    // @TODO take handlig preference from setting default is device
    if (offlineData && offlineData.length > 0) {
      const data = {
        ...offlineData[0],
        isDeleted: JSON.parse(offlineData[0].isDeleted)
      };
      const { completedDate, completedBy, isDeleted } = data;
      dataSetCompletenessInfo = {
        ...dataSetCompletenessInfo,
        complete: !isDeleted,
        storedBy: completedBy,
        date: completedDate
      };
    } else {
      const { complete } = dataSetCompletenessInfo;
      if (complete) {
        dataSetCompletenessInfo = await this.offlineCompletenessProvider
          .offlneEntryFormCompleteness(
            entryFormSelection,
            currentUser,
            dataSetCompletenessInfo
          )
          .toPromise();
      } else {
        await this.offlineCompletenessProvider
          .offlneEntryFormUncompleteness(entryFormSelection, currentUser)
          .toPromise();
      }
    }
    return dataSetCompletenessInfo;
  }

  completeOnDataSetRegistrations(
    dataSetId: string,
    period: string,
    orgUnitId: string,
    dataDimension: any,
    currentUser: CurrentUser
  ): Observable<any> {
    let parameter = this.getDataSetCompletenessParameter(
      dataSetId,
      period,
      orgUnitId,
      dataDimension
    );
    return new Observable(observer => {
      let data: any = {
        dataSet: dataSetId,
        period: period,
        organisationUnit: orgUnitId
      };
      if (dataDimension.cp !== '') {
        data = {
          ...data,
          cc: dataDimension.cc,
          cp: dataDimension.cp
        };
      }
      const url = `/api/completeDataSetRegistrations?${parameter}`;
      this.httpClient
        .post(
          url,
          {
            completeDataSetRegistrations: [data]
          },
          currentUser
        )
        .subscribe(
          () => {
            observer.next();
            observer.complete();
          },
          error => {
            observer.error(error);
          }
        );
    });
  }

  unDoCompleteOnDataSetRegistrations(
    dataSetId: string,
    period: string,
    orgUnitId: string,
    dataDimension: any,
    currentUser: CurrentUser
  ): Observable<any> {
    let parameter = this.getDataSetCompletenessParameter(
      dataSetId,
      period,
      orgUnitId,
      dataDimension
    );
    return new Observable(observer => {
      const url = `/api/completeDataSetRegistrations?${parameter}`;
      this.httpClient.delete(url, currentUser).subscribe(
        () => {
          observer.next();
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  getDataSetCompletenessInfo(
    dataSetId: string,
    period: string,
    orgUnitId: string,
    dataDimension: any,
    currentUser: CurrentUser
  ): Observable<any> {
    let parameter = `dataSetId=${dataSetId}&periodId=${period}&organisationUnitId=${orgUnitId}`;
    if (dataDimension.cp != '') {
      parameter += `&cc=${dataDimension.cc}&cp=${dataDimension.cp}`;
    }
    const url = '/dhis-web-dataentry/getDataValues.action?' + parameter;
    return new Observable(observer => {
      this.httpClient.get(url, true, currentUser).subscribe(
        (response: any) => {
          if (response && response.dataValues) {
            delete response.dataValues;
          }
          observer.next(response);
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  getUserCompletenessInformation(
    username: string,
    currentUser: CurrentUser
  ): Observable<any> {
    return new Observable(observer => {
      const url = `/dhis-web-commons-ajax-json/getUser.action?username=${username}`;
      this.httpClient.get(url, true, currentUser).subscribe(
        (response: any) => {
          observer.next(response);
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  getDataSetCompletenessParameter(
    dataSetId: string,
    period: string,
    orgUnitId: string,
    dataDimension: any
  ): string {
    let parameter = 'ds=' + dataSetId + '&pe=' + period + '&ou=' + orgUnitId;
    if (dataDimension.cp != '') {
      parameter += '&cc=' + dataDimension.cc + '&cp=' + dataDimension.cp;
    }
    return parameter;
  }
}
