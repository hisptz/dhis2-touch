/*
 *
 * Copyright 2015 HISP Tanzania
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
 * @since 2015
 * @author Joseph Chingalo <profschingalo@gmail.com>
 *
 */
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { SqlLiteProvider } from '../sql-lite/sql-lite';
import { HttpClientProvider } from '../http-client/http-client';
import { Observable } from 'rxjs/Observable';
import { CurrentUser } from '../../models/currentUser';
import * as _ from 'lodash';

/*
  Generated class for the OrganisationUnitsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
export interface OrganisationUnitModel {
  id: string;
  name: string;
  level: string;
  path: string;
  displayName?: string;
  openingDate: string;
  closedDate: string;
  children: Array<any>;
  dataSets: Array<any>;
  programs: Array<any>;
  ancestors: Array<any>;
  parent: Array<any>;
}

@Injectable()
export class OrganisationUnitsProvider {
  organisationUnits: OrganisationUnitModel[];
  lastSelectedOrgUnit: OrganisationUnitModel;
  resource: string;

  constructor(
    private sqlLite: SqlLiteProvider,
    private HttpClient: HttpClientProvider
  ) {
    this.resource = 'organisationUnits';
  }

  /**
   * reset organisation unit
   */
  resetOrganisationUnit() {
    this.organisationUnits = [];
    this.lastSelectedOrgUnit = null;
  }

  /**
   * downloadingOrganisationUnitsFromServer
   * @param orgUnitIds
   * @param currentUser
   * @returns {Promise<T>}
   */
  downloadingOrganisationUnitsFromServer(
    currentUser: CurrentUser
  ): Observable<any> {
    let orgUnits = [];
    const { userOrgUnitIds } = currentUser;
    return new Observable(observer => {
      if (userOrgUnitIds && userOrgUnitIds.length == 0) {
        observer.next(orgUnits);
        observer.complete();
      } else {
        const fields =
          'fields=id,name,path,ancestors[id,name],openingDate,closedDate,level,children[id,name,children[id],parent';
        const filter =
          'filter=path:ilike:' +
          userOrgUnitIds.join('&filter=path:ilike:') +
          '&rootJunction=OR';
        const url = '/api/' + this.resource + '.json?' + fields + '&' + filter;
        this.HttpClient.get(
          url,
          false,
          currentUser,
          this.resource,
          800
        ).subscribe(
          (response: any) => {
            try {
              orgUnits = response[this.resource];
              observer.next(orgUnits);
              observer.complete();
            } catch (e) {
              observer.error(e);
            }
          },
          error => {
            observer.error(error);
          }
        );
      }
    });
  }

  /**
   *
   * @param orgUnits
   * @param currentUser
   * @returns {Observable<any>}
   */
  savingOrganisationUnitsFromServer(orgUnits, currentUser): Observable<any> {
    return new Observable(observer => {
      this.sqlLite
        .insertBulkDataOnTable(
          this.resource,
          orgUnits,
          currentUser.currentDatabase
        )
        .subscribe(
          () => {
            observer.next();
            observer.complete();
          },
          error => {
            observer.error(error);
          }
        );
    });
  }

  /**
   *setLastSelectedOrganisationUnitUnit
   * @param lastSelectedOrgUnit
   */
  setLastSelectedOrganisationUnitUnit(lastSelectedOrgUnit) {
    this.lastSelectedOrgUnit = lastSelectedOrgUnit;
  }

  /**
   *
   * @param currentUser
   * @returns {Observable<any>}
   */
  getLastSelectedOrganisationUnitUnit(currentUser): Observable<any> {
    return new Observable(observer => {
      if (this.lastSelectedOrgUnit) {
        observer.next(this.lastSelectedOrgUnit);
        observer.complete();
      } else {
        this.getOrganisationUnits(currentUser).subscribe(
          (organisationUnits: any) => {
            if (organisationUnits && organisationUnits.length > 0) {
              this.lastSelectedOrgUnit = organisationUnits[0];
              observer.next(organisationUnits[0]);
            } else {
              observer.next({});
            }
            observer.complete();
          },
          error => {
            observer.error(error);
          }
        );
      }
    });
  }

  getAllOrganisationUnits(currentUser: CurrentUser): Observable<any> {
    return new Observable(observer => {
      this.sqlLite
        .getAllDataFromTable(this.resource, currentUser.currentDatabase)
        .subscribe(
          (organisationUnits: any) => {
            this.getSortedOrganisationUnits(organisationUnits).subscribe(
              (organisationUnits: any) => {
                observer.next(organisationUnits);
                observer.complete();
              }
            );
          },
          error => {
            observer.error(error);
          }
        );
    });
  }

  getAllOrganisationUnitsForSearching(
    currentUser: CurrentUser
  ): Observable<any> {
    let searchedOrganisationUnits = [];
    return new Observable(observer => {
      this.getAllOrganisationUnits(currentUser).subscribe(
        (organisationUnits: Array<OrganisationUnitModel>) => {
          searchedOrganisationUnits = _.map(
            organisationUnits,
            (organisationUnit: OrganisationUnitModel) => {
              const ancestors = _.reverse(organisationUnit.ancestors);
              let label = organisationUnit.name;
              if (ancestors && ancestors.length > 0) {
                label = ancestors[0].name + '/' + label;
              }
              organisationUnit['displayName'] = label;
              return organisationUnit;
            }
          );
          searchedOrganisationUnits = _.sortBy(searchedOrganisationUnits, [
            'displayName'
          ]);
          observer.next(searchedOrganisationUnits);
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  /**
   *
   * @param currentUser
   * @returns {Observable<any>}
   */
  getOrganisationUnits(currentUser): Observable<any> {
    let userOrgUnitIds = currentUser.userOrgUnitIds;
    return new Observable(observer => {
      if (this.organisationUnits && this.organisationUnits.length > 0) {
        observer.next({
          organisationUnits: this.organisationUnits,
          lastSelectedOrgUnit: this.lastSelectedOrgUnit
        });
        observer.complete();
      } else {
        if (userOrgUnitIds && userOrgUnitIds.length > 0) {
          this.sqlLite
            .getDataFromTableByAttributes(
              this.resource,
              'id',
              userOrgUnitIds,
              currentUser.currentDatabase
            )
            .subscribe(
              (organisationUnits: any) => {
                this.getSortedOrganisationUnits(organisationUnits).subscribe(
                  (organisationUnits: any) => {
                    observer.next(organisationUnits);
                    observer.complete();
                  }
                );
              },
              error => {
                observer.error(error);
              }
            );
        } else {
          observer.next([]);
          observer.complete();
        }
      }
    });
  }

  /**
   *
   * @param organisationUnitIds
   * @param currentUser
   * @returns {Observable<any>}
   */
  getOrganisationUnitsByIds(organisationUnitIds, currentUser): Observable<any> {
    return new Observable(observer => {
      if (organisationUnitIds && organisationUnitIds.length > 0) {
        this.sqlLite
          .getDataFromTableByAttributes(
            this.resource,
            'id',
            organisationUnitIds,
            currentUser.currentDatabase
          )
          .subscribe(
            (organisationUnits: any) => {
              this.getSortedOrganisationUnits(organisationUnits).subscribe(
                (organisationUnits: any) => {
                  if (organisationUnits && organisationUnits.length > 0) {
                    observer.next(organisationUnits);
                  } else {
                    observer.next([]);
                  }
                  observer.complete();
                }
              );
            },
            error => {
              observer.error(error);
            }
          );
      } else {
        observer.next([]);
        observer.complete();
      }
    });
  }

  /**
   *
   * @param parentIds
   * @param currentUser
   * @returns {Observable<any>}
   */
  getOrganisationUnitsByLevels(parentIds, currentUser): Observable<any> {
    let organisationUnitIdToOrganisationUnits = {};
    return new Observable(observer => {
      this.getOrganisationUnitsByIds(parentIds, currentUser).subscribe(
        (organisationUnits: any) => {
          for (let organisationUnit of organisationUnits) {
            organisationUnitIdToOrganisationUnits[
              organisationUnit.id
            ] = organisationUnit;
          }
          let parentId = parentIds.splice(0, 1)[0];
          let orgUnitTree = organisationUnitIdToOrganisationUnits[parentId];
          this.recursiveFetch(
            parentIds,
            organisationUnitIdToOrganisationUnits,
            orgUnitTree
          );
          observer.next(orgUnitTree);
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  /**
   *
   * @param parentIds
   * @param organisationUnitIdToOrganisationUnits
   * @param orgUnit
   */
  recursiveFetch(parentIds, organisationUnitIdToOrganisationUnits, orgUnit) {
    let self = this;
    let parentId = parentIds.splice(0, 1)[0];
    let newChildren = [];
    if (orgUnit && orgUnit.children) {
      orgUnit.children.forEach(function(child) {
        if (child.id == parentId) {
          newChildren.push(organisationUnitIdToOrganisationUnits[parentId]);
        } else {
          newChildren.push(child);
        }
      });
      orgUnit.children = newChildren;
      orgUnit.children.forEach(function(child) {
        if (child.id == parentId) {
          self.recursiveFetch(
            parentIds,
            organisationUnitIdToOrganisationUnits,
            child
          );
        }
      });
    }
  }

  /**
   *
   * @param organisationUnits
   * @returns {Observable<any>}
   */
  getSortedOrganisationUnits(organisationUnits): Observable<any> {
    return new Observable(observer => {
      organisationUnits = _.sortBy(organisationUnits, ['name']);
      organisationUnits.forEach((organisationUnit: any) => {
        this.sortOrganisationUnits(organisationUnit);
      });
      observer.next(organisationUnits);
      observer.complete();
    });
  }

  /**
   * organisation unit sorter
   * @param organisationUnit
   */
  sortOrganisationUnits(organisationUnit) {
    if (organisationUnit.children) {
      organisationUnit.children = _.sortBy(organisationUnit.children, ['name']);
      organisationUnit.children.forEach(child => {
        this.sortOrganisationUnits(child);
      });
    }
  }
}
