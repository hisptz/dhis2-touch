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
import * as _ from 'lodash';
import { getRepository, Repository } from 'typeorm';
import { DataSet, DataSetSource } from 'src/models';
import { DataSetSourceEntity, DataSetEntity } from 'src/entites';

@Injectable({
  providedIn: 'root'
})
export class DataSetSelectionService {
  constructor() {}

  async getDataSetListBySelectedOrganisationUnitAndRoles(
    organisationUnitId: string,
    dataSetIdsByUserRoles: string[],
    authorities: string[]
  ) {
    const dataSetRepository = getRepository('DataSetEntity') as Repository<
      DataSetEntity
    >;
    const dataSetOrganisationUnits = await this.getProgramsByOrganisationUnits([
      organisationUnitId
    ]);
    const dataSetIds = _.flattenDeep(
      _.map(dataSetOrganisationUnits, (dataSetOrganisationUnit: DataSet) => {
        return dataSetOrganisationUnit.id;
      })
    );
    const ids = authorities.includes('ALL')
      ? dataSetIds
      : _.filter(dataSetIds, (id: string) => {
          return dataSetIdsByUserRoles.includes(id);
        });
    const dataSets: any[] = await dataSetRepository.findByIds(ids);
    return _.sortBy(
      _.map(dataSets, (dataSet: DataSet) => {
        const { id, name } = dataSet;
        return { ...dataSet, code: id, name };
      }),
      'name'
    );
  }

  async getProgramsByOrganisationUnits(organisationUnitIdArry: string[]) {
    const dataSetrganisationUnitRepository = getRepository(
      'DataSetSourceEntity'
    ) as Repository<DataSetSourceEntity>;
    const dataSetOrganisationUnits = await dataSetrganisationUnitRepository.find();
    return _.filter(
      dataSetOrganisationUnits,
      (dataSetOrganisationUnit: DataSetSource) => {
        const { organisationUnitIds } = dataSetOrganisationUnit;
        return organisationUnitIdArry.every(
          (organisationUnitId: string) =>
            organisationUnitIds.indexOf(organisationUnitId) > -1
        );
      }
    );
  }
}
