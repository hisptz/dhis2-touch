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
import { createConnection } from 'typeorm';
import { Platform } from '@ionic/angular';
import {
  CategoryComboEntity,
  ConstantEntity,
  DataElementEntity,
  DataSetCompletenessEntity,
  DataSetEntity,
  DataSetElementEntity,
  DataSetIndicatorEntity,
  DataSetDesignEntity,
  DataSetSourceEntity,
  DataSetSectionEntity,
  DataSetOperandEntity,
  DataStoreEntity,
  DataValueEntity,
  EventEntity,
  IndicatorEntity,
  OrganisationUnitEntity,
  ProgramRuleEntity,
  ProgramRuleActionEntity,
  ProgramRuleVariableEntity,
  ProgramEntity,
  ProgramProgramTrackedEntityAttributeEntity,
  TrackedEntityAttributeEntity,
  ProgramIndicatorEntity,
  ProgramProgramStageEntity,
  ProgramStageSectionEntity,
  ProgramOrganisationUnitEntity,
  TrackerRegistrationFormEntity,
  ProgramStageEntryFormEntity,
  ProgramTrackedEntityAttributeEntity,
  TrackedEntityInstanceEntity,
  TrackedEntityAttributeValueEntity,
  EnrollmentEntity,
  ReportEntity,
  ReportDesignEntity,
  SectionEntity,
  SectionDataElementEntity,
  SectionIndicatorEntity,
  SmsCommandEntity,
  ValidationRuleEntity
} from 'src/entites';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  connection: any;
  constructor(private platform: Platform) {}

  async initateDataBaseConnection(
    dataBaseName: string,
    synchronize: boolean = true
  ) {
    try {
      await this.platform.ready();
      const entities = this.getAllEntites();
      if (this.platform.is('cordova')) {
        try {
          if (this.connection) {
            await this.connection.close();
          }
        } catch (error) {
          console.log(JSON.stringify({ type: 'close connection', error }));
        } finally {
          setTimeout(async () => {
            try {
              const connection = await this.startConnection(
                dataBaseName,
                entities,
                synchronize
              );
              this.connection = connection;
            } catch (error) {
              synchronize = false;
              const connection = await this.startConnection(
                dataBaseName,
                entities,
                synchronize
              );
              this.connection = connection;
            }
          }, 100);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async startConnection(
    dataBaseName: string,
    entities: any,
    synchronize: boolean
  ) {
    return await createConnection({
      type: 'cordova',
      database: `${dataBaseName}`,
      location: 'default',
      logging: ['error', 'schema', 'log', 'info'],
      synchronize,
      entities
    });
  }

  getAllEntites(): any[] {
    return [
      CategoryComboEntity,
      ConstantEntity,
      DataElementEntity,
      DataSetCompletenessEntity,
      DataSetEntity,
      DataSetElementEntity,
      DataSetIndicatorEntity,
      DataSetDesignEntity,
      DataSetSourceEntity,
      DataSetSectionEntity,
      DataSetOperandEntity,
      DataStoreEntity,
      DataValueEntity,
      EventEntity,
      IndicatorEntity,
      OrganisationUnitEntity,
      ProgramRuleEntity,
      ProgramRuleActionEntity,
      ProgramRuleVariableEntity,
      ProgramEntity,
      ProgramProgramTrackedEntityAttributeEntity,
      TrackedEntityAttributeEntity,
      ProgramIndicatorEntity,
      ProgramProgramStageEntity,
      ProgramStageSectionEntity,
      ProgramOrganisationUnitEntity,
      TrackerRegistrationFormEntity,
      ProgramStageEntryFormEntity,
      ProgramTrackedEntityAttributeEntity,
      TrackedEntityInstanceEntity,
      TrackedEntityAttributeValueEntity,
      EnrollmentEntity,
      ReportEntity,
      ReportDesignEntity,
      SectionEntity,
      SectionDataElementEntity,
      SectionIndicatorEntity,
      SmsCommandEntity,
      ValidationRuleEntity
    ];
  }
}
