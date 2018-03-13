import { Injectable } from '@angular/core';
import { UserProvider } from '../user/user';
import { Observable } from 'rxjs/Observable';
import { DataSetsProvider } from '../data-sets/data-sets';
import { ProgramsProvider } from '../programs/programs';
import { CurrentUser } from '../../models/currentUser';
import { DataSet } from '../../modules/data-filter/model/dataset';

/*
  Generated class for the ProfileProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ProfileProvider {
  constructor(
    private userProvider: UserProvider,
    private dataSetProvider: DataSetsProvider,
    private programProvider: ProgramsProvider
  ) {}

  getProfileContentDetails() {
    let profileContents = [
      {
        id: 'userInfo',
        name: 'User information',
        icon: 'assets/icon/user-info.png'
      },
      {
        id: 'orgUnits',
        name: 'Assigned organisation units',
        icon: 'assets/icon/orgUnit.png'
      },
      { id: 'roles', name: 'Assigned roles', icon: 'assets/icon/roles.png' },
      {
        id: 'program',
        name: 'Assigned programs',
        icon: 'assets/icon/program.png'
      },
      { id: 'form', name: 'Assigned entry forms', icon: 'assets/icon/form.png' }
    ];
    return profileContents;
  }

  /**
   *
   * @returns {Observable<any>}
   */
  getSavedUserData(currentUser: CurrentUser): Observable<any> {
    let userData = {};
    return new Observable(observer => {
      this.userProvider.getUserData().subscribe(
        (savedUserData: any) => {
          this.dataSetProvider.getAllDataSets(currentUser).subscribe(
            (dataSets: any) => {
              this.programProvider.getAllPrograms(currentUser).subscribe(
                programs => {
                  userData['userInfo'] = this.getUserInformation(savedUserData);
                  userData['orgUnits'] = this.getAssignedOrgUnits(
                    savedUserData
                  );
                  userData['roles'] = this.getUserRoles(savedUserData);
                  userData['program'] = this.getAssignedProgram(
                    savedUserData,
                    programs
                  );
                  userData['form'] = this.getAssignedForm(
                    savedUserData,
                    dataSets
                  );
                  observer.next(userData);
                  observer.complete();
                },
                error => {
                  observer.error(error);
                }
              );
            },
            error => {
              observer.error(error);
            }
          );
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  /**
   * get user info
   * @param userData
   * @returns {any}
   */
  getUserInformation(userData) {
    let userInfo = {};
    let omittedKey = [
      'userRoles',
      'organisationUnits',
      'dataViewOrganisationUnits',
      'dataSets',
      'programs'
    ];
    Object.keys(userData).map(key => {
      if (omittedKey.indexOf(key) == -1) {
        let value = userData[key];
        if (Date.parse(value)) {
          value = value.split('T')[0];
        }
        userInfo[key] = value;
      }
    });
    return this.getArrayFromObject(userInfo);
  }

  /**
   * get user roles
   * @param userData
   * @returns {Array}
   */
  getUserRoles(userData) {
    let userRoles = [];
    if (userData && userData.userRoles) {
      userData.userRoles.map((userRole: any) => {
        if (userRoles.indexOf(userRole.name) == -1) {
          userRoles.push(userRole.name);
        }
      });
    }
    return userRoles.sort();
  }

  /**
   * get assigned org units
   * @param userData
   * @returns {Array}
   */
  getAssignedOrgUnits(userData) {
    let organisationUnits = [];
    if (userData && userData.organisationUnits) {
      userData.organisationUnits.map((organisationUnit: any) => {
        if (organisationUnits.indexOf(organisationUnit.name) == -1) {
          organisationUnits.push(organisationUnit.name);
        }
      });
    }
    return organisationUnits.sort();
  }

  /**
   * get assigned program
   * @param userData
   * @returns {Array}
   */
  getAssignedProgram(userData, programs) {
    let assignedPrograms = [];
    programs.map((program: any) => {
      if (userData.programs && userData.programs.indexOf(program.id) > -1) {
        assignedPrograms.push(program.name);
      }
    });
    return assignedPrograms.sort();
  }

  /**
   * get assigned form
   * @param userData
   * @returns {Array}
   */
  getAssignedForm(userData, dataSets) {
    let assignedDataSets = [];
    dataSets.map((dataSet: any) => {
      if (userData.dataSets && userData.dataSets.indexOf(dataSet.id) > -1) {
        assignedDataSets.push(dataSet.name);
      }
    });
    return assignedDataSets.sort();
  }

  /**
   *
   * @param object
   * @returns {Array}
   */
  getArrayFromObject(object) {
    let array = [];
    for (let key in object) {
      let newValue = object[key];
      const id = key;
      if (newValue instanceof Object) {
        newValue = JSON.stringify(newValue);
      }
      let newKey = (key.charAt(0).toUpperCase() + key.slice(1))
        .replace(/([A-Z])/g, ' $1')
        .trim();
      array.push({ key: newKey, value: newValue, id: id });
    }
    return array;
  }
}
