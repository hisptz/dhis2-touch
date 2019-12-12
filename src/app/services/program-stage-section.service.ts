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
import { DEFAULT_APP_METADATA } from 'src/constants';
import { ProgramStageSectionEntity } from 'src/entites';

@Injectable({
  providedIn: 'root'
})
export class ProgramStageSectionService {
  constructor(private httpCLientService: HttpClientService) {}

  discoveringProgramStageSectionsFromServer(
    currentUser: CurrentUser
  ): Observable<any> {
    const resource = 'programStageSections';
    const programMetadata = DEFAULT_APP_METADATA.programs;
    const { defaultIds } = programMetadata;
    const filter =
      defaultIds && defaultIds.length > 0
        ? `filter=programStage.program.id:in:[${defaultIds.join(',')}]`
        : ``;
    const fields =
      'id,name,displayName,sortOrder,programStage[id],attributeValues[value,attribute[name]],translations[*],programStageDataElements[dataElement[id]],dataElements[id]';
    const url = `/api/${resource}.json?paging=false&fields=${fields}&${filter}`;
    return new Observable(observer => {
      this.httpCLientService
        .get(url, true, currentUser)
        .then((response: any) => {
          const { programStageSections } = response;
          observer.next(programStageSections);
          observer.complete();
        })
        .catch((error: any) => {
          observer.error(error);
        });
    });
  }

  savingProgramStageSectionsToLocalStorage(
    programStageSections: any[]
  ): Observable<any> {
    const repository = getRepository(ProgramStageSectionEntity);
    const chunk = 50;
    const programStageSectionData = _.flattenDeep(
      _.map(
        _.filter(programStageSections, (programStageSection: any) => {
          return (
            programStageSection &&
            programStageSection.programStage &&
            programStageSection.programStage
          );
        }),
        (programStageSection: any) => {
          const {
            programStage,
            programStageDataElements,
            dataElements
          } = programStageSection;
          const dataElementsData = programStageDataElements
            ? _.map(
                programStageDataElements,
                (programStageDataElement: any) => {
                  return { id: programStageDataElement.dataElement.id };
                }
              )
            : dataElements;
          const programStageId = programStage.id;
          return {
            ...programStageSection,
            dataElements: dataElementsData,
            programStageId
          };
        }
      )
    );
    return new Observable(observer => {
      repository
        .save(programStageSectionData, { chunk })
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
