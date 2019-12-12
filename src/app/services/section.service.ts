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
import { CurrentUser, Section } from 'src/models';
import { DEFAULT_APP_METADATA } from 'src/constants';
import {
  SectionEntity,
  SectionDataElementEntity,
  SectionIndicatorEntity
} from 'src/entites';

@Injectable({
  providedIn: 'root'
})
export class SectionService {
  constructor(private httpCLientService: HttpClientService) {}

  downloadSectionsFromServer(currentUser: CurrentUser): Observable<any> {
    const resource = 'sections';
    const fields =
      'fields=id,name,code,description,sortOrder,indicators[id],dataElements[id]';
    const dataSetMetadata = DEFAULT_APP_METADATA.dataSets;
    const { defaultIds } = dataSetMetadata;
    const filter =
      defaultIds && defaultIds.length > 0
        ? `filter=dataSet.id:in:[${defaultIds.join(',')}]`
        : ``;
    const url = `/api/${resource}.json?paging=false&${fields}&${filter}`;
    const pageSize = defaultIds && defaultIds.length > 0 ? 10 : 15;
    return new Observable(observer => {
      this.httpCLientService
        .get(url, false, currentUser, resource, pageSize)
        .then((response: any) => {
          const { sections } = response;
          observer.next(_.uniqBy(sections, 'id'));
          observer.complete();
        })
        .catch((error: any) => {
          observer.error(error);
        });
    });
  }

  savingSectionsToLocalStorage(sections: any[]): Observable<any> {
    return new Observable(observer => {
      if (sections.length === 0) {
        observer.next();
        observer.complete();
      } else {
        this.savingSectionInformation(sections)
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

  async savingSectionInformation(sections: any[]) {
    await this.savingSectionBasicInfo(sections);
    await this.savingSectionDataElements(sections);
    await this.savingSectionIndicators(sections);
  }

  async savingSectionBasicInfo(sections: any) {
    const repository = getRepository(SectionEntity);
    const chunk = 50;
    await repository.save(sections, { chunk });
  }
  async savingSectionDataElements(sections: any) {
    const repository = getRepository(SectionDataElementEntity);
    const chunk = 50;
    const sectionDataElements = _.map(
      _.filter(sections, (section: any) => {
        return (
          section && section.dataElements && section.dataElements.length > 0
        );
      }),
      (section: any) => {
        const { id, dataElements } = section;
        const dataElementIds = _.map(
          dataElements,
          (dataElement: any) => dataElement.id
        );
        return { id, dataElementIds };
      }
    );
    await repository.save(sectionDataElements, { chunk });
  }
  async savingSectionIndicators(sections: any) {
    const repository = getRepository(SectionIndicatorEntity);
    const chunk = 50;
    const sectionIndicators = _.map(
      _.filter(sections, (section: any) => {
        return section && section.indicators && section.indicators.length > 0;
      }),
      (section: any) => {
        const { id, indicators } = section;
        const indicatorIds = _.map(
          indicators,
          (indicator: any) => indicator.id
        );
        return { id, indicatorIds };
      }
    );
    await repository.save(sectionIndicators, { chunk });
  }

  async getSavedSections(sectionIds: string[]): Promise<Section[]> {
    const sectionRepository = getRepository(SectionEntity);
    const sectionDataElementRepository = getRepository(
      SectionDataElementEntity
    );
    const sectionIndicatorRepository = getRepository(SectionIndicatorEntity);
    const sectionsResponse = await sectionRepository.findByIds(sectionIds);
    const sectionDataElements = await sectionDataElementRepository.findByIds(
      sectionIds
    );
    const sectionIndicators = await sectionIndicatorRepository.findByIds(
      sectionIds
    );
    return _.map(sectionsResponse, (section: Section) => {
      const { id } = section;
      const sectionDataElementObject = _.find(
        sectionDataElements,
        (sectionDataElement: any) =>
          sectionDataElement && sectionDataElement.id === id
      );
      const sectionIndicatorObject = _.find(
        sectionIndicators,
        (sectionIndicator: any) =>
          sectionIndicator && sectionIndicator.id === id
      );
      return {
        ...section,
        dataElementIds:
          sectionDataElementObject && sectionDataElementObject.dataElementIds
            ? sectionDataElementObject.dataElementIds
            : [],
        indicatorIds:
          sectionIndicatorObject && sectionIndicatorObject.indicatorIds
            ? sectionIndicatorObject.indicatorIds
            : []
      };
    });
  }
}
