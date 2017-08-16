import { Injectable } from '@angular/core';
import {User} from "./user";

/*
  Generated class for the ProfileProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ProfileProvider {

  constructor(private userProvider : User) {
  }

  getProfileContentDetails() {
    let profileContents = [
      {id : 'userInfo',name : 'User information',icon: 'assets/profile-icons/user-info.png'},
      {id : 'orgUnits',name : 'Assigned organisation units',icon: 'assets/profile-icons/orgUnit.png'},
      {id : 'roles',name : 'Assigned roles',icon: 'assets/profile-icons/roles.png'},
      {id : 'program',name : 'Assigned program',icon: 'assets/profile-icons/program.png'},
      {id : 'form',name : 'Assigned form',icon: 'assets/profile-icons/form.png'},
    ];
    return profileContents;
  }

  /**
   * get user data
   * @returns {Promise<any>}
   */
  getSavedUserData(){
    let userData = {};
    return new Promise((resolve, reject) =>{
      this.userProvider.getUserData().then((savedUserData : any)=>{
        userData['userInfo'] = this.getUserInformation(savedUserData);
        userData['orgUnits'] = this.getAssignedOrgUnits(savedUserData);
        userData['roles'] = this.getUserRoles(savedUserData);
        userData['program'] = this.getAssignedProgram(savedUserData);
        userData['form'] = this.getAssignedForm(savedUserData);
        resolve(userData);
      }).catch(error=>{
        reject(error);
      });
    });
  }

  /**
   * get user info
   * @param userData
   * @returns {any}
   */
  getUserInformation(userData){
    let userInfo = {};
    let omittedKey = ['userRoles','organisationUnits','dataViewOrganisationUnits'];
    Object.keys(userData).forEach(key=>{
      if(omittedKey.indexOf(key)  == -1){
        let value = userData[key];
        if(Date.parse(value)){
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
  getUserRoles(userData){
    let userRoles = [];
    if(userData && userData.userRoles){
      userData.userRoles.forEach((userRole: any)=>{
        if(userRoles.indexOf(userRole.name) == -1){
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
  getAssignedOrgUnits(userData){
    let organisationUnits = [];
    if(userData && userData.organisationUnits){
      userData.organisationUnits.forEach((organisationUnit: any)=>{
        if(organisationUnits.indexOf(organisationUnit.name) == -1){
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
  getAssignedProgram(userData){
    let programs = [];
    if(userData && userData.userRoles){
      userData.userRoles.forEach((userRole: any)=>{
        userRole.programs.forEach((program: any)=>{
          if(programs.indexOf(program.name) == -1){
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
  getAssignedForm(userData){
    let dataSets = [];
    if(userData && userData.userRoles){
      userData.userRoles.forEach((userRole: any)=>{
        userRole.dataSets.forEach((dataSet: any)=>{
          if(dataSets.indexOf(dataSet.name) == -1){
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
  getArrayFromObject(object){
    let array = [];
    for(let key in object){
      let newValue = object[key];
      if(newValue instanceof Object) {
        newValue = JSON.stringify(newValue)
      }
      let newKey = (key.charAt(0).toUpperCase() + key.slice(1)).replace(/([A-Z])/g, ' $1').trim();
      array.push({key : newKey,value : newValue})
    }
    return array;
  }

}
