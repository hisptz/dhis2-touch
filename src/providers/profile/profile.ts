import { Injectable } from "@angular/core";
import { UserProvider } from "../user/user";
import { Observable } from "rxjs/Observable";

/*
  Generated class for the ProfileProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ProfileProvider {
  constructor(private userProvider: UserProvider) {}

  getProfileContentDetails() {
    let profileContents = [
      {
        id: "userInfo",
        name: "user information",
        icon: "assets/icon/user-info.png"
      },
      {
        id: "orgUnits",
        name: "assigned organisation units",
        icon: "assets/icon/orgUnit.png"
      },
      { id: "roles", name: "assigned roles", icon: "assets/icon/roles.png" },
      {
        id: "program",
        name: "assigned program",
        icon: "assets/icon/program.png"
      },
      { id: "form", name: "assigned form", icon: "assets/icon/form.png" }
    ];
    return profileContents;
  }

  /**
   *
   * @returns {Observable<any>}
   */
  getSavedUserData(): Observable<any> {
    let userData = {};
    return new Observable(observer => {
      this.userProvider.getUserData().subscribe(
        (savedUserData: any) => {
          userData["userInfo"] = this.getUserInformation(savedUserData);
          userData["orgUnits"] = this.getAssignedOrgUnits(savedUserData);
          userData["roles"] = this.getUserRoles(savedUserData);
          userData["program"] = this.getAssignedProgram(savedUserData);
          userData["form"] = this.getAssignedForm(savedUserData);
          observer.next(userData);
          observer.complete();
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
      "userRoles",
      "organisationUnits",
      "dataViewOrganisationUnits"
    ];
    Object.keys(userData).forEach(key => {
      if (omittedKey.indexOf(key) == -1) {
        let value = userData[key];
        if (Date.parse(value)) {
          value = value.split("T")[0];
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
      userData.userRoles.forEach((userRole: any) => {
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
      userData.organisationUnits.forEach((organisationUnit: any) => {
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
  getAssignedProgram(userData) {
    let programs = [];
    if (userData && userData.userRoles) {
      userData.userRoles.forEach((userRole: any) => {
        userRole.programs.forEach((program: any) => {
          if (programs.indexOf(program.name) == -1) {
            programs.push(program.name);
          }
        });
      });
    }
    return programs.sort();
  }

  /**
   * get assigned form
   * @param userData
   * @returns {Array}
   */
  getAssignedForm(userData) {
    let dataSets = [];
    if (userData && userData.userRoles) {
      userData.userRoles.forEach((userRole: any) => {
        userRole.dataSets.forEach((dataSet: any) => {
          if (dataSets.indexOf(dataSet.name) == -1) {
            dataSets.push(dataSet.name);
          }
        });
      });
    }
    return dataSets.sort();
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
      if (newValue instanceof Object) {
        newValue = JSON.stringify(newValue);
      }
      let newKey = (key.charAt(0).toUpperCase() + key.slice(1))
        .replace(/([A-Z])/g, " $1")
        .trim();
      array.push({ key: newKey, value: newValue });
    }
    return array;
  }
}
