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
import * as _ from 'lodash';
import { LocalStorageService } from './local-storage.service';
import { CurrentUser } from 'src/models';
import { EncryptionService } from './encryption.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private localStoregeService: LocalStorageService,
    private encryptionService: EncryptionService
  ) {}

  async getCurrentUser() {
    const key = 'currentUser';
    return await this.localStoregeService.getDataFromLocalStorage(key);
  }

  async setCurrentUser(currentUser: CurrentUser) {
    const key = 'currentUser';
    return await this.localStoregeService.setDataOnLocalStorage(
      currentUser,
      key
    );
  }

  async getSanizitizedUser(user: CurrentUser) {
    let sanitizedUser: CurrentUser = await this.getCurrentUser();
    if (user) {
      sanitizedUser = _.assign({}, user);
    }
    const { isPasswordEncode, password } = sanitizedUser;
    sanitizedUser = {
      ...sanitizedUser,
      password: isPasswordEncode
        ? this.encryptionService.decode(password)
        : password
    };
    return sanitizedUser;
  }

  setCurrentUserUserData(userDataResponse): Observable<any> {
    const userData = {
      Name: userDataResponse.name,
      Employer: userDataResponse.employer,
      'Job Title': userDataResponse.jobTitle,
      Education: userDataResponse.education,
      Gender: userDataResponse.gender,
      Birthday: userDataResponse.birthday,
      Nationality: userDataResponse.nationality,
      Interests: userDataResponse.interests,
      userRoles: userDataResponse.userCredentials.userRoles,
      organisationUnits: userDataResponse.organisationUnits,
      dataViewOrganisationUnits: userDataResponse.dataViewOrganisationUnits,
      dataSets: this.getAssignedDataSetIds(userDataResponse),
      programs: this.getAssignedProgramsId(userDataResponse)
    };
    const key = 'userData';
    return new Observable(observer => {
      this.localStoregeService
        .setDataOnLocalStorage(userData, key)
        .then(() => {
          this.setProfileInformation(userDataResponse)
            .then(() => {
              observer.next(userData);
              observer.complete();
            })
            .catch((error: any) => {
              observer.error(error);
            });
        })
        .catch((error: any) => {
          observer.error(error);
        });
    });
  }
  setProfileInformation(userDataResponse, status?: boolean): Promise<any> {
    const key = 'profileInfo';
    const ommittedKeys = [
      'access',
      'attributeValues',
      'userAccesses',
      'dataSets',
      'programs',
      'userGroups',
      'userCredentials',
      'userGroupAccesses',
      'favorites',
      'favorite',
      'teiSearchOrganisationUnits',
      'name',
      'organisationUnits',
      'translations',
      'dataViewOrganisationUnits',
      'lastCheckedInterpretations',
      'created',
      'id',
      'lastUpdated',
      'displayName',
      'externalAccess',
      'authorities',
      'settings'
    ];
    let profileInfo = _.omit(userDataResponse, ommittedKeys);
    profileInfo = { ...userDataResponse, status: status ? status : false };
    return this.localStoregeService.setDataOnLocalStorage(profileInfo, key);
  }

  async getProfileInformation(): Promise<any> {
    const key = 'profileInfo';
    return await this.localStoregeService.getDataFromLocalStorage(key);
  }

  getAssignedDataSetIds(userData) {
    let dataSetsIds = [];
    if (userData && userData.dataSets) {
      dataSetsIds = userData.dataSets;
    } else if (
      userData &&
      userData.userCredentials &&
      userData.userCredentials.userRoles
    ) {
      userData.userCredentials.userRoles.map((userRole: any) => {
        if (userRole.dataSets) {
          userRole.dataSets.map((dataset: any) => {
            if (dataSetsIds.indexOf(dataset.id) === -1) {
              dataSetsIds.push(dataset.id);
            }
          });
        }
      });
    }
    return dataSetsIds;
  }

  getAssignedProgramsId(userData) {
    let programIds = [];
    if (userData && userData.programs) {
      programIds = userData.programs;
    } else if (
      userData &&
      userData.userCredentials &&
      userData.userCredentials.userRoles
    ) {
      userData.userCredentials.userRoles.map((userRole: any) => {
        if (userRole.programs) {
          userRole.programs.map((program: any) => {
            if (programIds.indexOf(program.id) === -1) {
              programIds.push(program.id);
            }
          });
        }
      });
    }
    return programIds;
  }
}
