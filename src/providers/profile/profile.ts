import { Injectable } from '@angular/core';

/*
  Generated class for the ProfileProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ProfileProvider {

  constructor() {
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

}
