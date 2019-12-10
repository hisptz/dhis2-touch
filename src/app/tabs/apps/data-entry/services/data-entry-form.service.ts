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
import { Injectable } from '@angular/core';
import { getRepository } from 'typeorm';
import {
  DataSetEntity,
  DataSetSectionEntity,
  DataSetIndicatorEntity
} from 'src/entites';

@Injectable({
  providedIn: 'root'
})
export class DataEntryFormService {
  constructor() {}

  async discoveringDataSetInformation(dataSetId: string) {
    const response = { data: null, error: null };
    try {
      const dataSet = await this.discoveringDataSetById(dataSetId);
      const sectionIds = await this.discoveringSectionIdsByDataSetId(dataSetId);
      const indicatorIds = await this.disoveringIndicatorIdsByDataSetId(
        dataSetId
      );
      response.data = { dataSet, sectionIds, indicatorIds };
    } catch (error) {
      response.error = error;
    }
    return response;
  }

  async discoveringDataSetById(dataSetId: string) {
    const dataSetRepository = getRepository(DataSetEntity);
    return await dataSetRepository.findOne(dataSetId);
  }

  async discoveringSectionIdsByDataSetId(dataSetId: string) {
    const dataSetRepository = getRepository(DataSetSectionEntity);
    return await dataSetRepository.find({ id: dataSetId });
  }

  async disoveringIndicatorIdsByDataSetId(dataSetId: string) {
    const dataSetRepository = getRepository(DataSetIndicatorEntity);
    return await dataSetRepository.find({ id: dataSetId });
  }
}
