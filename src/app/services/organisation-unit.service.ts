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
import { CurrentUser, OrganisationUnit } from 'src/models';
import { OrganisationUnitEntity } from 'src/entites';

declare var dhis2;

@Injectable({
  providedIn: 'root'
})
export class OrganisationUnitService {
  constructor(private httpCLientService: HttpClientService) {}

  discoveringOrganisationUnitsFromServer(
    currentUser: CurrentUser
  ): Observable<OrganisationUnit[]> {
    const { userOrgUnitIds } = currentUser;
    const batchsize = 800;
    return new Observable(observer => {
      if (userOrgUnitIds && userOrgUnitIds.length > 0) {
        const resource = 'organisationUnits';
        const fields = `id,name,path,ancestors[id,name,children[id]],openingDate,closedDate,level,children[id,name,children[id],parent`;
        const filter = `path:ilike:${userOrgUnitIds.join(
          '&filter=path:ilike:'
        )}&rootJunction=OR`;
        const apiUrl = `/api/${resource}.json?fields=${fields}&filter=${filter}`;
        this.httpCLientService
          .get(apiUrl, false, currentUser, resource, batchsize)
          .then((response: any) => {
            const { organisationUnits } = response;
            observer.next(organisationUnits);
            observer.complete();
          })
          .catch((error: any) => {
            observer.error(error);
          });
      } else {
        observer.next([]);
        observer.complete();
      }
    });
  }

  savingOrgnisationUnitsToLocalStorage(
    organisationUnits: any[]
  ): Observable<any> {
    return new Observable(observer => {
      const ouRepository = getRepository(
        'OrganisationUnitEntity'
      ) as Repository<OrganisationUnitEntity>;
      const chunk = 500;
      ouRepository
        .save(organisationUnits, { chunk })
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch((error: any) => {
          console.log(JSON.stringify(error));
          observer.error(error);
        });
    });
  }

  async getOrganiisationUnitByIds(organisationUnitIds: string[]) {
    const ouRepository = getRepository('OrganisationUnitEntity') as Repository<
      OrganisationUnitEntity
    >;
    return await ouRepository.findByIds(organisationUnitIds);
  }

  async getAllOrganisationUnits() {
    const ouRepository = getRepository('OrganisationUnitEntity') as Repository<
      OrganisationUnitEntity
    >;
    return await ouRepository.find();
  }

  resetOrganisationUnit() {}
}
