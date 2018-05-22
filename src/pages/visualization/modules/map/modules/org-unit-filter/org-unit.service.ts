import {Injectable} from '@angular/core';
import {HttpClientService} from '../../services/http-client.service';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class OrgUnitService {

  nodes: any[] = null;
  orgUnitLevels: any[] = [];
  userOrgUnits: any[] = [];
  orgUnitGroups: any[] = [];
  initialOrgUnits: any[] = [];
  private _userInfo: any = null;

  constructor(private http: HttpClientService) {
  }

  // Get current user information
  getUserInformation(priority = null) {
    return Observable.create(observer => {
      if (this._userInfo !== null) {
        observer.next(this._userInfo);
        observer.complete();
      } else {
        const userInfoCall: Observable<any> = priority === false ?
          this.http.get('me.json?fields=dataViewOrganisationUnits[id,name,level],organisationUnits[id,name,level]') :
          this.http.get('me.json?fields=organisationUnits[id,name,level]');

        userInfoCall.subscribe((userInfo: any) => {
          this._userInfo = Object.assign({}, userInfo);
          observer.next(this._userInfo);
          observer.complete();
        }, error => {
          console.log(error);
        });
      }
    });
  }


  getuserOrganisationUnitsWithHighestlevel(level, userOrgunits) {
    const orgunits = [];
    if (!userOrgunits.hasOwnProperty('dataViewOrganisationUnits')) {
      userOrgunits.organisationUnits.forEach((orgunit) => {
        if (orgunit.level === level) {
          orgunits.push(orgunit.id);
        }
      });
    } else {
      if (userOrgunits.dataViewOrganisationUnits.length === 0) {
        userOrgunits.organisationUnits.forEach((orgunit) => {
          if (orgunit.level === level) {
            orgunits.push(orgunit.id);
          }
        });
      } else {
        level = userOrgunits.dataViewOrganisationUnits[0].level;
        userOrgunits.dataViewOrganisationUnits.forEach((orgunit) => {
          if (orgunit.level === level) {
            orgunits.push(orgunit.id);
          }
        });
      }
    }
    return orgunits;
  }

  /**
   * get the highest level among organisation units that user belongs to
   * @param userOrgunits
   * @returns {any}
   */
  getUserHighestOrgUnitlevel(userOrgunits) {
    let level: any;
    if (!userOrgunits.hasOwnProperty('dataViewOrganisationUnits')) {
      level = userOrgunits.organisationUnits[0].level;
      userOrgunits.organisationUnits.forEach((orgunit) => {
        if (orgunit.level <= level) {
          level = orgunit.level;
        }
      });
    } else {
      if (userOrgunits.dataViewOrganisationUnits.length === 0) {
        level = userOrgunits.organisationUnits[0].level;
        userOrgunits.organisationUnits.forEach((orgunit) => {
          if (orgunit.level <= level) {
            level = orgunit.level;
          }
        });
      } else {
        level = userOrgunits.dataViewOrganisationUnits[0].level;
        userOrgunits.dataViewOrganisationUnits.forEach((orgunit) => {
          if (orgunit.level <= level) {
            level = orgunit.level;
          }
        });
      }

    }
    return level;
  }

  /**
   * get the list of user orgunits as an array
   * @param userOrgunits
   * @returns {any}
   */
  getUserOrgUnits(userOrgunits) {
    const orgunits = [];
    if (!userOrgunits.hasOwnProperty('dataViewOrganisationUnits')) {
      userOrgunits.organisationUnits.forEach((orgunit) => {
        orgunits.push(orgunit);
      });
    } else {
      if (userOrgunits.dataViewOrganisationUnits.length === 0) {
        userOrgunits.organisationUnits.forEach((orgunit) => {
          orgunits.push(orgunit);
        });
      } else {
        userOrgunits.dataViewOrganisationUnits.forEach((orgunit) => {
          orgunits.push(orgunit);
        });
      }
    }
    return orgunits;
  }


  // Generate Organisation unit url based on the level needed
  generateUrlBasedOnLevels(level) {
    let childrenLevels = '[]';
    for (let i = 1; i < level + 1; i++) {
      childrenLevels = childrenLevels.replace('[]', '[id,name,level,children[]]');
    }
    let new_string = childrenLevels.substring(1);
    new_string = new_string.replace(',children[]]', '');
    return new_string;
  }

  // Get system wide settings
  getOrgunitLevelsInformation() {
    return Observable.create(observer => {
      if (this.orgUnitLevels.length !== 0) {
        observer.next(this.orgUnitLevels);
        observer.complete();
      } else {
        this.http.get('organisationUnitLevels.json?fields=id,name,level&order=level:asc')
          .subscribe((levels: any[]) => {
              this.orgUnitLevels = levels;
              observer.next(this.orgUnitLevels);
              observer.complete();
            },
            error => {
              observer.error('some error occur');
            });
      }
    });
  }

  // Get organisation unit groups information
  getOrgunitGroups() {
    return Observable.create(observer => {
      if (this.orgUnitGroups.length !== 0) {
        observer.next(this.orgUnitGroups);
        observer.complete();
      } else {
        this.http.get('organisationUnitGroups.json?fields=id,name&paging=false')
          .subscribe((groups: any) => {
              this.orgUnitGroups = groups.organisationUnitGroups;
              observer.next(this.orgUnitGroups);
              observer.complete();
            },
            error => {
              observer.error('some error occur');
            });
      }
    });
  }

  // Get orgunit for specific
  getAllOrgunitsForTree1(fields = null, orgunits = null) {
    return Observable.create(observer => {
      if (this.nodes !== null) {
        observer.next(this.nodes);
        observer.complete();
      } else {
        this.http.get('organisationUnits.json?fields=' + fields + '&filter=id:in:[' + orgunits.join(',') + ']&paging=false')
          .subscribe((nodes: any) => {
            this.nodes = nodes.organisationUnits;
            observer.next(this.nodes);
            observer.complete();
          }, error => {
            observer.error('some error occured');
          });
      }
    });

  }

  // Get initial organisation units to speed up things during loading
  getInitialOrgunitsForTree(orgunits) {
    return Observable.create(observer => {
      if (this.initialOrgUnits !== null) {
        observer.next(this.initialOrgUnits);
        observer.complete();
      } else {
        this.http.get('organisationUnits.json?fields=id,name,level,children[id,name]&' +
          'filter=id:in:[' + orgunits.join(',') + ']&paging=false')
          .subscribe((nodes: any) => {
            this.initialOrgUnits = nodes.organisationUnits;
            observer.next(this.initialOrgUnits);
            observer.complete();
          }, error => {
            observer.error('some error occured');
          });
      }
    });
  }


}


