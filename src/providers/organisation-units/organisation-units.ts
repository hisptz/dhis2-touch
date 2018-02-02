import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {SqlLiteProvider} from "../sql-lite/sql-lite";
import {HttpClientProvider} from "../http-client/http-client";
import {Observable} from "rxjs/Observable";

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

  constructor(private sqlLite: SqlLiteProvider, private HttpClient: HttpClientProvider) {
    this.resource = "organisationUnits";
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
  downloadingOrganisationUnitsFromServer(orgUnitIds, currentUser): Observable<any> {
    let orgUnits = [];
    return new Observable(observer => {
      let counts = 0;
      for (let orgUnitId of orgUnitIds) {
        let fields = "fields=id,name,path,ancestors[id,name,children[id]],openingDate,closedDate,level,children[id,name,children[id],parent";
        let filter = "filter=path:ilike:";
        let url = "/api/25/" + this.resource + ".json?";
        url += fields + "&" + filter + orgUnitId;
        this.HttpClient.get(url, false, currentUser, this.resource, 800).subscribe((response: any) => {
          try {
            counts = counts + 1;
            orgUnits = this.appendOrgUnitsFromServerToOrgUnitArray(orgUnits, response);
            if (counts == orgUnitIds.length) {
              observer.next(orgUnits);
              observer.complete();
            }
          } catch (e) {
            observer.error(e);
          }
        }, error => {
          observer.error(error);
        })
      }
    });
  }

  /**
   * appendOrgUnitsFromServerToOrgUnitArray
   * @param orgUnitArray
   * @param orgUnitResponse
   * @returns {any}
   */
  appendOrgUnitsFromServerToOrgUnitArray(orgUnitArray, orgUnitResponse) {
    if (orgUnitResponse[this.resource]) {
      for (let orgUnit of orgUnitResponse[this.resource]) {
        orgUnitArray.push(orgUnit);
      }
    }
    return orgUnitArray;
  }

  /**
   *
   * @param orgUnits
   * @param currentUser
   * @returns {Observable<any>}
   */
  savingOrganisationUnitsFromServer(orgUnits, currentUser): Observable<any> {
    return new Observable(observer => {
      this.sqlLite.insertBulkDataOnTable(this.resource, orgUnits, currentUser.currentDatabase).subscribe(() => {
        observer.next();
        observer.complete();
      }, error => {
        observer.error(error);
      });
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
        this.getOrganisationUnits(currentUser).subscribe((organisationUnits: any) => {
          if (organisationUnits && organisationUnits.length > 0) {
            this.lastSelectedOrgUnit = organisationUnits[0];
            observer.next(organisationUnits[0]);
          } else {
            observer.next({});
          }
          observer.complete();
        }, error => {
          observer.error(error)
        })
      }
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
        observer.next({organisationUnits: this.organisationUnits, lastSelectedOrgUnit: this.lastSelectedOrgUnit})
        observer.complete();
      } else {
        if (userOrgUnitIds && userOrgUnitIds.length > 0) {
          this.sqlLite.getDataFromTableByAttributes(this.resource, "id", userOrgUnitIds, currentUser.currentDatabase).subscribe((organisationUnits: any) => {
            this.getSortedOrganisationUnits(organisationUnits).subscribe((organisationUnits: any) => {
              observer.next(organisationUnits);
              observer.complete();
            });
          }, error => {
            observer.error(error);
          });
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
        this.sqlLite.getDataFromTableByAttributes(this.resource, "id", organisationUnitIds, currentUser.currentDatabase).subscribe((organisationUnits: any) => {
          this.getSortedOrganisationUnits(organisationUnits).subscribe((organisationUnits: any) => {
            if (organisationUnits && organisationUnits.length > 0) {
              observer.next(organisationUnits);
            } else {
              observer.next([]);
            }
            observer.complete();
          });
        }, error => {
          observer.error(error);
        });
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
      this.getOrganisationUnitsByIds(parentIds, currentUser).subscribe((organisationUnits: any) => {
        for (let organisationUnit of organisationUnits) {
          organisationUnitIdToOrganisationUnits[organisationUnit.id] = organisationUnit;
        }
        let parentId = parentIds.splice(0, 1)[0];
        let orgUnitTree = organisationUnitIdToOrganisationUnits[parentId];
        this.recursiveFetch(parentIds, organisationUnitIdToOrganisationUnits, orgUnitTree);
        observer.next(orgUnitTree);
        observer.complete();
      }, error => {
        observer.error(error);
      });
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
      orgUnit.children.forEach(function (child) {
        if (child.id == parentId) {
          newChildren.push(organisationUnitIdToOrganisationUnits[parentId]);
        } else {
          newChildren.push(child);
        }
      });
      orgUnit.children = newChildren;
      orgUnit.children.forEach(function (child) {
        if (child.id == parentId) {
          self.recursiveFetch(parentIds, organisationUnitIdToOrganisationUnits, child);
        }
      })
    }
  }


  /**
   *
   * @param organisationUnits
   * @returns {Observable<any>}
   */
  getSortedOrganisationUnits(organisationUnits): Observable<any> {
    return new Observable(observer => {
      organisationUnits.sort((a, b) => {
        if (a.name > b.name) {
          return 1;
        }
        if (a.name < b.name) {
          return -1;
        }
        return 0;
      });
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
      organisationUnit.children.sort((a, b) => {
        if (a.name > b.name) {
          return 1;
        }
        if (a.name < b.name) {
          return -1;
        }
        return 0;
      });
      organisationUnit.children.forEach((child) => {
        this.sortOrganisationUnits(child);
      })
    }
  }
}
