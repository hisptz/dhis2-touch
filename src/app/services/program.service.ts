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
import { DEFAULT_APP_METADATA } from 'src/constants';
import {
  ProgramEntity,
  ProgramOrganisationUnitEntity,
  ProgramIndicatorEntity,
  ProgramProgramStageEntity,
  ProgramProgramTrackedEntityAttributeEntity,
  TrackerRegistrationFormEntity,
  ProgramStageEntryFormEntity,
  TrackedEntityAttributeEntity
} from 'src/entites';

@Injectable({
  providedIn: 'root'
})
export class ProgramService {
  constructor(private httpCLientService: HttpClientService) {}

  discoveringProgramsFromServer(currentUser: CurrentUser): Observable<any> {
    let programResponse = [];
    const resource = 'programs';
    const { userOrgUnitIds } = currentUser;
    const programMetadata = DEFAULT_APP_METADATA.programs;
    const { defaultIds } = programMetadata;
    return new Observable(observer => {
      if (userOrgUnitIds && userOrgUnitIds.length === 0) {
        observer.next(programResponse);
        observer.complete();
      } else {
        const fields = `fields=id,name,displayName,displayIncidentDate,programType,withoutRegistration,dataEntryForm[htmlCode],trackedEntityType[id,displayName],trackedEntity[id,displayName],ignoreOverdueEvents,skipOffline,captureCoordinates,enrollmentDateLabel,onlyEnrollOnce,selectIncidentDatesInFuture,incidentDateLabel,useFirstStageDuringRegistration,completeEventsExpiryDays,displayFrontPageList,categoryCombo[id,name,categories[id,name,categoryOptions[name,id,organisationUnits[id]]]],programStages[id,name,executionDateLabel,hideDueDate,dataEntryForm[htmlCode],allowGenerateNextVisit,blockEntryForm,repeatable,formType,sortOrder,standardInterval,minDaysFromStart,generatedByEnrollmentDate,autoGenerateEvent,captureCoordinates,dueDateLabel,programStageDataElements[id,displayInReports,compulsory,allowProvidedElsewhere,allowFutureDate,dataElement[id]],programStageSections[id]],organisationUnits[id],programIndicators[id,name,description,filter,expression],translations,attributeValues[value,attribute[name]],validationCriterias,programRuleVariables,programTrackedEntityAttributes[id,mandatory,externalAccess,allowFutureDate,displayInList,sortOrder,trackedEntityAttribute[id,name,code,name,formName,description,confidential,searchScope,translations,inherit,legendSets,optionSet[name,options[name,id,code]]unique,orgunitScope,programScope,displayInListNoProgramaggregationType,displayInListNoProgram,pattern,sortOrderInListNoProgram,generated,displayOnVisitSchedule,valueType,sortOrderInVisitSchedule]]`;
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
            const { programs } = response;
            programResponse = this.getFitlteredListOfPrograms(
              programs,
              currentUser
            );
            observer.next(_.uniqBy(programResponse, 'id'));
            observer.complete();
          })
          .catch((error: any) => {
            observer.error(error);
          });
      }
    });
  }

  getFitlteredListOfPrograms(
    programsResponse: any[],
    currentUser: CurrentUser
  ) {
    const { programs } = currentUser;
    const { authorities } = currentUser;
    return authorities && _.indexOf(authorities, 'ALL') > -1
      ? programsResponse
      : _.filter(programsResponse, (programObject: any) => {
          return (
            programs &&
            programObject &&
            programObject.id &&
            _.indexOf(programs, programObject.id)
          );
        });
  }

  savingProgramsToLocalStorage(programs: any[]): Observable<any> {
    return new Observable(observer => {
      this.savingProgramInformation(programs)
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch((error: any) => {
          observer.error(error);
        });
    });
  }

  async savingProgramInformation(programs: any[]) {
    await this.savingProgramBasicInfo(programs);
    await this.savingProgramDataSource(programs);
    await this.savingProgramProgramIndicators(programs);
    await this.savingProgramProgramStage(programs);
    await this.savingProgramProgramTrackedEntityAttributes(programs);
    await this.savingTrackerRegistrationForm(programs);
    await this.savingProgramStageEntryForm(programs);
  }

  async savingProgramBasicInfo(programs: any[]) {
    const repository = getRepository(ProgramEntity);
    const chunk = 50;
    await repository.save(programs, { chunk });
  }

  async savingProgramDataSource(programs: any[]) {
    const repository = getRepository(ProgramOrganisationUnitEntity);
    const chunk = 50;
    const programOrganisationUnits = _.flattenDeep(
      _.map(
        _.filter(programs, (program: any) => {
          return (
            program &&
            program.organisationUnits &&
            program.organisationUnits.length > 0
          );
        }),
        (program: any) => {
          const { id, organisationUnits } = program;
          const orgUnitIds = _.map(
            organisationUnits,
            (organisationUnit: any) => organisationUnit.id
          );
          return { id, orgUnitIds };
        }
      )
    );
    await repository.save(programOrganisationUnits, { chunk });
  }

  async savingProgramProgramIndicators(programs: any[]) {
    const repository = getRepository(ProgramIndicatorEntity);
    const chunk = 50;
    const programIndicatorsData = _.flattenDeep(
      _.map(
        _.filter(programs, (program: any) => {
          return (
            program &&
            program.programIndicators &&
            program.programIndicators.length > 0
          );
        }),
        (program: any) => {
          const { id, programIndicators } = program;
          return _.map(programIndicators, (programIndicator: any) => {
            return { ...programIndicator, programId: id };
          });
        }
      )
    );
    await repository.save(programIndicatorsData, { chunk });
  }

  async savingProgramProgramStage(programs: any) {
    const repository = getRepository(ProgramProgramStageEntity);
    const chunk = 50;
    const programProgramStages = _.flattenDeep(
      _.map(
        _.filter(programs, (program: any) => {
          return (
            program && program.programStages && program.programStages.length > 0
          );
        }),
        (program: any) => {
          const { id, programStages } = program;
          return _.map(programStages, (programStage: any) => {
            return { ...programStage, programId: id };
          });
        }
      )
    );
    await repository.save(programProgramStages, { chunk });
  }

  async savingProgramProgramTrackedEntityAttributes(programs: any[]) {
    const repository = getRepository(
      ProgramProgramTrackedEntityAttributeEntity
    );
    const chunk = 50;
    const programTrackedEntityAttributesData = _.flattenDeep(
      _.map(
        _.filter(programs, (program: any) => {
          return (
            program &&
            program.programTrackedEntityAttributes &&
            program.programTrackedEntityAttributes.length > 0
          );
        }),
        (program: any) => {
          const { id, programTrackedEntityAttributes } = program;
          return _.map(
            programTrackedEntityAttributes,
            (programTrackedEntityAttribute: any) => {
              return { ...programTrackedEntityAttribute, programId: id };
            }
          );
        }
      )
    );
    await repository.save(programTrackedEntityAttributesData, { chunk });
    await this.savingTrackedEntityAttributes(
      programTrackedEntityAttributesData
    );
  }

  async savingTrackedEntityAttributes(programTrackedEntityAttributes: any[]) {
    const repository = getRepository(TrackedEntityAttributeEntity);
    const chunk = 50;
    const trackedEntityAttributes = _.flattenDeep(
      _.map(
        _.filter(
          programTrackedEntityAttributes,
          (programTrackedEntityAttribute: any) => {
            return (
              programTrackedEntityAttribute &&
              programTrackedEntityAttribute.trackedEntityAttribute &&
              programTrackedEntityAttribute.trackedEntityAttribute.id
            );
          }
        ),
        (programTrackedEntityAttribute: any) => {
          const { id, trackedEntityAttribute } = programTrackedEntityAttribute;
          return {
            id: `${id}_${trackedEntityAttribute.id}`,
            programTrackedEntityAttributeId: id,
            trackedEntityAttribute
          };
        }
      )
    );
    await repository.save(trackedEntityAttributes, { chunk });
  }

  async savingTrackerRegistrationForm(programs: any[]) {
    const repository = getRepository(TrackerRegistrationFormEntity);
    const chunk = 50;
    const trackerRegistrationForms = _.flattenDeep(
      _.map(
        _.filter(programs, (program: any) => {
          return (
            program && program.dataEntryForm && program.dataEntryForm.htmlCode
          );
        }),
        (program: any) => {
          const { id, dataEntryForm } = program;
          return { id, dataEntryForm };
        }
      )
    );
    await repository.save(trackerRegistrationForms, { chunk });
  }

  async savingProgramStageEntryForm(programs: any) {
    const repository = getRepository(ProgramStageEntryFormEntity);
    const chunk = 50;
    const programStageEntryForm = _.flattenDeep(
      _.map(
        _.filter(
          _.flattenDeep(
            _.filter(programs, (program: any) => {
              return (
                program &&
                program.programStages &&
                program.programStages.length > 0
              );
            }),
            (program: any) => program.programStages
          ),
          (programStage: any) => {
            return (
              programStage &&
              programStage.dataEntryForm &&
              programStage.dataEntryForm.htmlCode
            );
          }
        ),
        (programStage: any) => {
          const { id, dataEntryForm } = programStage;
          return { id, dataEntryForm };
        }
      )
    );
    await repository.save(programStageEntryForm, { chunk });
  }
}
