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
import { getRepository, Repository } from 'typeorm';
import { HttpClientService } from './http-client.service';
import { CurrentUser, DataElement } from 'src/models';
import { DEFAULT_APP_METADATA } from 'src/constants';
import { DataElementEntity } from 'src/entites';
import { CategoryComboService } from './category-combo.service';

@Injectable({
  providedIn: 'root'
})
export class DataElementService {
  constructor(
    private httpCLientService: HttpClientService,
    private categoryComboService: CategoryComboService
  ) {}

  downloaddataElementsFromServer(currentUser: CurrentUser): Observable<any> {
    return new Observable(observer => {
      this.getDataElementByProgramIdsOrDataSetIds(currentUser)
        .then((response: any) => {
          const { dataElements, error } = response;
          if (error && dataElements && dataElements.length === 0) {
            observer.error(error);
          } else {
            observer.next(dataElements);
            observer.complete();
          }
        })
        .catch((error: any) => {
          observer.error(error);
        });
    });
  }

  async getDataElementByProgramIdsOrDataSetIds(currentUser: CurrentUser) {
    const dataElementsIds = await this.getDataElementIds(currentUser);
    const fields = `fields=id,name,formName,aggregationType,categoryCombo[id],displayName,description,valueType,optionSet[name,options[name,id,code]]`;
    const resource = 'dataElements';
    const url = `/api/${resource}.json?paging=false&${fields}`;
    const dataElementResponse = [];
    let errorResponse = null;
    if (dataElementsIds && dataElementsIds.length > 0) {
      for (const dataElementArray of _.chunk(dataElementsIds, 500)) {
        const filter = `filter=id:in:[${dataElementArray.join(',')}]`;
        const apiUrl = `${url}&${filter}`;
        try {
          const response: any = await this.httpCLientService.get(
            apiUrl,
            true,
            currentUser
          );
          const { dataElements } = response;
          dataElementResponse.push(dataElements);
        } catch (error) {
          errorResponse = error;
        }
      }
    } else {
      try {
        const response: any = await this.httpCLientService.get(
          url,
          true,
          currentUser
        );
        const { dataElements } = response;
        dataElementResponse.push(dataElements);
      } catch (error) {
        errorResponse = error;
      }
    }
    return {
      dataElements: _.flattenDeep(dataElementResponse),
      error: errorResponse
    };
  }

  async getDataElementIds(currentUser: CurrentUser) {
    const dataSetMetadata = DEFAULT_APP_METADATA.dataSets;
    const programMetadata = DEFAULT_APP_METADATA.programs;
    const dataElementsIds = [];
    if (
      dataSetMetadata &&
      dataSetMetadata.defaultIds &&
      dataSetMetadata.defaultIds.length > 0
    ) {
      const uids = await this.getDataSetDataElementIds(
        currentUser,
        dataSetMetadata.defaultIds
      );
      dataElementsIds.push(uids);
    }
    if (
      programMetadata &&
      programMetadata.defaultIds &&
      programMetadata.defaultIds.length > 0
    ) {
      const uids = await this.getProgramDataElementIds(
        currentUser,
        programMetadata.defaultIds
      );
      dataElementsIds.push(uids);
    }
    return _.uniq(_.flattenDeep(dataElementsIds));
  }

  async getDataSetDataElementIds(
    currentUser: CurrentUser,
    dataSetIds: string[]
  ) {
    let dataElementIds = [];
    try {
      const filter = `filter=id:in:[${dataSetIds.join(',')}]`;
      const fields = `fields=dataSetElements[dataElement[id]],dataElements[id]`;
      const url = `/api/dataSets.json?paging=false&${fields}&${filter}`;
      const dataSetResponse: any = await this.httpCLientService.get(
        url,
        true,
        currentUser
      );
      const { dataSets } = dataSetResponse;
      dataElementIds = _.flattenDeep(
        _.map(dataSets, (dataSet: any) => {
          const { dataSetElements, dataElements } = dataSet;
          return dataElements
            ? _.map(dataElements, (dataElement: any) => dataElement.id)
            : _.map(
                dataSetElements,
                (dataSetElement: any) => dataSetElement.dataElement.id
              );
        })
      );
    } catch (error) {
      console.log(JSON.stringify({ type: 'Get dataset de', error }));
    }
    return dataElementIds;
  }

  async getProgramDataElementIds(
    currentUser: CurrentUser,
    programIds: string[]
  ) {
    let dataElementIds = [];
    try {
      const filter = `filter=id:in:[${programIds.join(',')}]`;
      const fields = `fields=programStages[programStageDataElements[dataElement`;
      const url = `/api/programs.json?paging=false&${fields}&${filter}`;
      const programResponse: any = await this.httpCLientService.get(
        url,
        true,
        currentUser
      );
      const { programs } = programResponse;
      dataElementIds = _.flattenDeep(
        _.map(programs, (program: any) => {
          const { programStages } = program;
          return _.map(programStages, (programStage: any) => {
            const { programStageDataElements } = programStage;
            return _.map(
              programStageDataElements,
              (programStageDataElement: any) =>
                programStageDataElement.dataElement.id
            );
          });
        })
      );
    } catch (error) {
      console.log(JSON.stringify({ type: 'Get program de', error }));
    }
    return dataElementIds;
  }

  savingdataElementsToLocalStorage(dataElements: any[]): Observable<any> {
    const repository = getRepository(DataElementEntity);
    const chunk = 500;
    return new Observable(observer => {
      repository
        .save(dataElements, { chunk })
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch((error: any) => {
          observer.error(error);
        });
    });
  }

  async getSavedDataElementsByIds(dataElementIds: string[]) {
    const repository = getRepository(DataElementEntity);
    const dataElements = await repository.findByIds(dataElementIds);
    const categoryComboIds = _.uniq(
      _.flattenDeep(
        _.map(dataElements, (dataElement: DataElement) => {
          const categoryCombo = dataElement.categoryCombo;
          return categoryCombo.id || '';
        })
      )
    );
    const categoryCombos = await this.categoryComboService.getCategoryCombosByIds(
      categoryComboIds
    );
    return _.flattenDeep(
      _.filter(
        _.map(_.uniq(dataElementIds), (dataElementId: string) => {
          const dataElement = _.find(dataElements, { id: dataElementId });
          const categoryComboId =
            dataElement &&
            dataElement.categoryCombo &&
            dataElement.categoryCombo.id
              ? dataElement.categoryCombo.id
              : '';
          const categoryCombo = _.find(categoryCombos, { id: categoryComboId });
          return dataElement
            ? {
                ...dataElement,
                categoryCombo: categoryCombo || dataElement.categoryCombo
              }
            : null;
        }),
        (dataElement: DataElement) => dataElement && dataElement.id
      )
    );
  }
}
