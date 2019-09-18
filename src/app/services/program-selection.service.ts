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
import { ProgramEntity, ProgramOrganisationUnitEntity } from 'src/entites';
import { ProgramOrganisationUnit, Program } from 'src/models';

@Injectable({
  providedIn: 'root'
})
export class ProgramSelectionService {
  constructor() {}

  async getProgramListBySelectedOrganisationUnitAndRoles(
    organisationUnitId: string,
    programType: string,
    programIdsByUserRoles: string[],
    authorities: string[]
  ) {
    const programRepository = getRepository('ProgramEntity') as Repository<
      ProgramEntity
    >;
    const ProgramOrganisationUnits = await this.getProgramsByOrganisationUnits([
      organisationUnitId
    ]);
    const programIds = _.flattenDeep(
      _.map(
        ProgramOrganisationUnits,
        (programOrganisationUnit: ProgramOrganisationUnit) => {
          return programOrganisationUnit.id;
        }
      )
    );
    const ids = authorities.includes('ALL')
      ? programIds
      : _.filter(programIds, (id: string) => {
          return programIdsByUserRoles.includes(id);
        });
    const programs: Program[] = await programRepository.findByIds(ids);
    return _.sortBy(
      _.map(
        _.filter(programs, (program: Program) => {
          return program.programType === programType;
        }),
        (program: Program) => {
          const { id, displayName } = program;
          return { ...program, code: id, name: displayName };
        }
      ),
      'name'
    );
  }

  async getProgramCategoryComboCategories(
    selectedOrgUnitId: string,
    categories: any[]
  ) {
    return _.flattenDeep(
      _.map(categories, (category: any) => {
        const { id, name, categoryOptions } = category;
        const filteredCategoryOptions = _.filter(
          categoryOptions,
          (categoryOption: any) => {
            return this.isOrganisationUnitAllowed(
              selectedOrgUnitId,
              categoryOption
            );
          }
        );
        return { id, name, categoryOptions: filteredCategoryOptions };
      })
    );
  }

  isOrganisationUnitAllowed(selectedOrgUnitId: string, categoryOption: any) {
    let isAllowed = true;
    if (
      categoryOption &&
      categoryOption.organisationUnits &&
      categoryOption.organisationUnits.length > 0
    ) {
      const matchedOus = _.filter(categoryOption.organisationUnits, {
        id: selectedOrgUnitId
      });
      isAllowed = matchedOus && matchedOus.length > 0;
    }
    return isAllowed;
  }

  async getProgramsByOrganisationUnits(organisationUnitIds: string[]) {
    const programOrganisationUnitRepository = getRepository(
      'ProgramOrganisationUnitEntity'
    ) as Repository<ProgramOrganisationUnitEntity>;
    const ProgramOrganisationUnits = await programOrganisationUnitRepository.find();
    return _.filter(
      ProgramOrganisationUnits,
      (programOrganisationUnit: ProgramOrganisationUnit) => {
        const { orgUnitIds } = programOrganisationUnit;
        return organisationUnitIds.every(
          (organisationUnitId: string) =>
            orgUnitIds.indexOf(organisationUnitId) > -1
        );
      }
    );
  }
}
