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
import * as _ from 'lodash';
import { SectionService } from 'src/app/services/section.service';
import {
  DataSetEntity,
  DataSetSectionEntity,
  DataSetIndicatorEntity
} from 'src/entites';
import {
  DataEntryFormSection,
  DataSet,
  Section,
  AppSetting,
  DataElement
} from 'src/models';
import { DataSetService } from 'src/app/services/data-set.service';
import { DataElementService } from 'src/app/services/data-element.service';
import { ValidationRuleService } from 'src/app/services/validation-rule.service';

@Injectable({
  providedIn: 'root'
})
export class DataEntryFormService {
  constructor(
    private sectionService: SectionService,
    private dataSetService: DataSetService,
    private dataElementService: DataElementService,
    private validationRuleService: ValidationRuleService
  ) {}

  async discoveringDataSetInformation(dataSetId: string) {
    const response = { data: null, error: null };
    try {
      const dataSet = await this.discoveringDataSetById(dataSetId);
      const sectionIds = await this.discoveringSectionIdsByDataSetId(dataSetId);
      const indicatorIds = await this.disoveringIndicatorIdsByDataSetId(
        dataSetId
      );
      response.data = { dataSet, sectionIds: sectionIds, indicatorIds };
    } catch (error) {
      response.error = error;
    }
    return response;
  }

  async getEntryFormMetadata(
    dataSet: DataSet,
    sectionIds: string[],
    appSettings: AppSetting
  ) {
    const dataSetId = dataSet.id || '';
    const dataEntryFormDesign = await this.dataSetService.getDataSetEntryForm(
      dataSetId
    );
    const sections: Section[] = await this.sectionService.getSavedSections(
      sectionIds
    );
    const dataElementIds = await this.dataSetService.getDatsSetDataElements(
      dataSetId
    );
    const dataElements = await this.dataElementService.getSavedDataElementsByIds(
      dataElementIds
    );
    const validationRules = await this.getValidationRulesByDateElementIds(
      dataElementIds
    );
    const dataEntryFormSection = await this.getDataEntryFormSection(
      appSettings,
      sectionIds,
      sections,
      dataElements
    );
    return {
      dataEntryFormSection,
      dataEntryFormDesign:
        appSettings &&
        appSettings.entryForm &&
        appSettings.entryForm.formLayout &&
        appSettings.entryForm.formLayout === 'customLayout' &&
        dataEntryFormDesign &&
        dataEntryFormDesign.htmlCode
          ? dataEntryFormDesign.htmlCode
          : '',
      validationRules
    };
  }

  async getValidationRulesByDateElementIds(dataElementIds: string[]) {
    return await this.validationRuleService.getValidationRulesByDateElementIds(
      dataElementIds
    );
  }

  async getDataEntryFormSection(
    appSettings: AppSetting,
    sectionIds: string[],
    sections: Section[],
    dataElements: DataElement[]
  ): Promise<DataEntryFormSection[]> {
    let dataEntryFormSection: DataEntryFormSection[] = [];
    if (sectionIds && sectionIds.length > 0) {
      dataEntryFormSection = await this.getSectionEntryForm(
        sections,
        dataElements
      );
    } else {
      dataEntryFormSection = await this.getDefaultEntryForm(
        dataElements,
        appSettings
      );
    }
    return dataEntryFormSection;
  }

  async getDefaultEntryForm(
    dataElements: DataElement[],
    appSettings: AppSetting
  ) {
    let sections = [];
    const maxDataElements =
      appSettings &&
      appSettings.entryForm &&
      appSettings.entryForm.maxDataElementOnDefaultForm
        ? appSettings.entryForm.maxDataElementOnDefaultForm
        : 10;
    const sectionsCounter = Math.ceil(dataElements.length / maxDataElements);
    for (let index = 0; index < sectionsCounter; index++) {
      sections = _.concat(sections, {
        name: `Page ${index + 1} of ${sectionsCounter}`,
        id: `index_${index}`,
        dataElements: dataElements.splice(0, maxDataElements)
      });
    }
    return sections;
  }

  async getSectionEntryForm(sections: Section[], dataElements: DataElement[]) {
    const formSections = _.sortBy(
      _.flattenDeep(
        _.map(sections, (section: Section) => {
          const { id, name, sortOrder, description, dataElementIds } = section;
          const sectionDataElements = _.filter(
            _.map(dataElementIds, (dataElementId: string) => {
              const dataElement = _.find(dataElements, { id: dataElementId });
              return dataElement;
            }),
            (dataElement: DataElement) => dataElement && dataElement.id
          );
          return {
            id,
            name,
            sortOrder: parseInt(sortOrder, 10),
            description,
            dataElements: sectionDataElements
          };
        })
      ),
      (section: any) => section.sortOrder
    );
    return _.map(formSections, (section: any) => {
      section = _.omit(section, ['sortOrder']);
      return section;
    });
  }

  async getDataSetOperandsByDataSetId(dataSetId: string) {
    return await this.dataSetService.getDataSetOperandsByDataSetId(dataSetId);
  }

  async discoveringDataSetById(dataSetId: string) {
    const dataSetRepository = getRepository(DataSetEntity);
    return await dataSetRepository.findOne(dataSetId);
  }

  async discoveringSectionIdsByDataSetId(dataSetId: string) {
    const dataSetRepository = getRepository(DataSetSectionEntity);
    const sectionIdResponse = await dataSetRepository.find({ id: dataSetId });
    const sectionIdObj = _.head(sectionIdResponse);
    const sectionIds =
      sectionIdObj && sectionIdObj.sectionIds ? sectionIdObj.sectionIds : [];
    return sectionIds;
  }

  async disoveringIndicatorIdsByDataSetId(dataSetId: string) {
    const dataSetRepository = getRepository(DataSetIndicatorEntity);
    const indicatorIdResponse = await dataSetRepository.find({ id: dataSetId });
    const indicatorIdObj = _.head(indicatorIdResponse);
    const indicatorIds =
      indicatorIdObj && indicatorIdObj.indicatorIds
        ? indicatorIdObj.indicatorIds
        : [];
    return indicatorIds;
  }
}
