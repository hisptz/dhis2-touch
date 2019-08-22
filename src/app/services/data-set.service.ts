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
import { CurrentUser } from 'src/models';
import {
  DataSetEntity,
  DataSetDesignEntity,
  DataSetIndicatorEntity,
  DataSetSourceEntity,
  DataSetSectionEntity,
  DataSetOperandEntity,
  DataSetElementEntity
} from 'src/entites';
import { DEFAULT_APP_METADATA } from 'src/constants';

@Injectable({
  providedIn: 'root'
})
export class DataSetService {
  constructor(private httpCLientService: HttpClientService) {}

  discoveringDataSetsFromServer(currentUser: CurrentUser): Observable<any> {
    let dataSetSResponse = [];
    const resource = 'dataSets';
    const { userOrgUnitIds } = currentUser;
    const dataSetMetadata = DEFAULT_APP_METADATA.dataSets;
    const { defaultIds } = dataSetMetadata;
    return new Observable(observer => {
      if (userOrgUnitIds && userOrgUnitIds.length === 0) {
        observer.next(dataSetSResponse);
        observer.complete();
      } else {
        const fields = `fields=id,name,timelyDays,formType,dataEntryForm[htmlCode],compulsoryDataElementOperands[id,name,dimensionItemType,dimensionItem],version,periodType,openFuturePeriods,expiryDays,dataSetElements[dataElement[id]],dataElements[id],organisationUnits[id],sections[id],indicators[id],categoryCombo[id,name,categoryOptionCombos[id,name,categoryOptions[id]],categories[id,name,categoryOptions[id,name,organisationUnits[id]]]]`;
        const filter =
          defaultIds && defaultIds.length > 0
            ? `filter=id:in:[${defaultIds.join(',')}]`
            : `filter=organisationUnits.path:ilike:${userOrgUnitIds.join(
                '&filter=organisationUnits.path:ilike:'
              )}&rootJunction=OR`;
        const url = `/api/${resource}.json?${fields}&${filter}`;
        const pageSize = defaultIds && defaultIds.length > 0 ? 10 : 15;
        this.httpCLientService
          .get(url, false, currentUser, resource, pageSize)
          .then((response: any) => {
            const { dataSets } = response;
            dataSetSResponse = this.getFitlteredListOfDataSets(
              dataSets,
              currentUser
            );
            observer.next(_.uniqBy(dataSetSResponse, 'id'));
            observer.complete();
          })
          .catch((error: any) => {
            observer.error(error);
          });
      }
    });
  }

  getFitlteredListOfDataSets(
    dataSetsResponse: any[],
    currentUser: CurrentUser
  ) {
    const { dataSets } = currentUser;
    const { authorities } = currentUser;
    return authorities && _.indexOf(authorities, 'ALL') > -1
      ? dataSetsResponse
      : _.filter(dataSetsResponse, (dataSetObject: any) => {
          return (
            dataSets &&
            dataSetObject &&
            dataSetObject.id &&
            _.indexOf(dataSets, dataSetObject.id)
          );
        });
  }

  savingDataSetsToLocalStorage(dataSets: any[]): Observable<any> {
    return new Observable(observer => {
      if (dataSets.length === 0) {
        observer.next();
        observer.complete();
      } else {
        this.savingDataSetInformation(dataSets)
          .then(() => {
            observer.next();
            observer.complete();
          })
          .catch((error: any) => {
            observer.error(error);
          });
      }
    });
  }

  async savingDataSetInformation(dataSets: any[]) {
    await this.savingDataSetBasicInfo(dataSets);
    await this.savingDataSetEntryForm(dataSets);
    await this.savingDataSetIndicators(dataSets);
    await this.savingDataSetDataSource(dataSets);
    await this.savingDataSetSections(dataSets);
    await this.savingDataSetOperands(dataSets);
    await this.savingDataSetDataElements(dataSets);
  }

  async savingDataSetBasicInfo(dataSets: any[]) {
    const repository = getRepository('DataSetEntity') as Repository<
      DataSetEntity
    >;
    const chunk = 50;
    await repository.save(dataSets, { chunk });
  }
  async savingDataSetEntryForm(dataSets: any[]) {
    const repository = getRepository('DataSetDesignEntity') as Repository<
      DataSetDesignEntity
    >;
    const entryForms = _.map(
      _.filter(dataSets, (dataSet: any) => {
        return (
          dataSet && dataSet.dataEntryForm && dataSet.dataEntryForm.htmlCode
        );
      }),
      (dataSet: any) => {
        const { id, dataEntryForm } = dataSet;
        const { htmlCode } = dataEntryForm;
        return { id, dataSetDesign: htmlCode };
      }
    );
    await repository.save(entryForms, { chunk: 50 });
  }
  async savingDataSetIndicators(dataSets: any[]) {
    const repository = getRepository('DataSetIndicatorEntity') as Repository<
      DataSetIndicatorEntity
    >;
    const dataSetIndicators = _.map(
      _.filter(dataSets, (dataSet: any) => {
        return dataSet && dataSet.indicators;
      }),
      (dataSet: any) => {
        const { id, indicators } = dataSet;
        const indicatorIds = _.map(
          indicators,
          (indicator: any) => indicator.id
        );
        return {
          id,
          indicatorIds
        };
      }
    );
    await repository.save(dataSetIndicators, { chunk: 100 });
  }
  async savingDataSetDataSource(dataSets: any[]) {
    const repository = getRepository('DataSetSourceEntity') as Repository<
      DataSetSourceEntity
    >;
    const dataSetSources = _.map(
      _.filter(dataSets, (dataSet: any) => {
        return (
          dataSet &&
          dataSet.organisationUnits &&
          dataSet.organisationUnits.length > 0
        );
      }),
      (dataSet: any) => {
        const { id, organisationUnits } = dataSet;
        const organisationUnitIds = _.map(
          organisationUnits,
          (organisationUnit: any) => organisationUnit.id
        );
        return { id, organisationUnitIds };
      }
    );
    await repository.save(dataSetSources, { chunk: 100 });
  }
  async savingDataSetSections(dataSets: any[]) {
    const repository = getRepository('DataSetSectionEntity') as Repository<
      DataSetSectionEntity
    >;
    const dataSetSections = _.map(
      _.filter(dataSets, (dataSet: any) => {
        return dataSet && dataSet.sections && dataSet.sections.length > 0;
      }),
      (dataSet: any) => {
        const { id, sections } = dataSet;
        const sectionIds = _.map(sections, (section: any) => id);
        return { id, sectionIds };
      }
    );
    await repository.save(dataSetSections, { chunk: 100 });
  }
  async savingDataSetOperands(dataSets: any[]) {
    const repository = getRepository('DataSetOperandEntity') as Repository<
      DataSetOperandEntity
    >;
    const dataSetOperands = _.flattenDeep(
      _.map(
        _.filter(dataSets, (dataSet: any) => {
          return (
            dataSet &&
            dataSet.compulsoryDataElementOperands &&
            dataSet.compulsoryDataElementOperands.length > 0
          );
        }),
        (dataSet: any) => {
          const { id, compulsoryDataElementOperands } = dataSet;
          return _.map(
            compulsoryDataElementOperands,
            (compulsoryDataElementOperand: any) => {
              return { ...compulsoryDataElementOperand, dataSetId: id };
            }
          );
        }
      )
    );
    await repository.save(dataSetOperands, { chunk: 100 });
  }
  async savingDataSetDataElements(dataSets: any[]) {
    const repository = getRepository('DataSetElementEntity') as Repository<
      DataSetElementEntity
    >;
    const data = _.map(
      _.filter(dataSets, (dataSet: any) => {
        return dataSet && (dataSet.dataElements || dataSet.dataSetElements);
      }),
      (dataSet: any) => {
        const { id, dataSetElements, dataElements } = dataSet;
        const dataElementIds = dataElements
          ? _.map(dataElements, (dataElement: any) => dataElement.id)
          : _.map(
              dataSetElements,
              (dataSetElement: any) => dataSetElement.dataElement.id
            );
        return { id, dataElementIds };
      }
    );
    repository.save(data, { chunk: 100 });
  }
}
