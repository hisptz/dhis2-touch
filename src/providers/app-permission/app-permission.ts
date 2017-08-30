import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {AppProvider} from "../app/app";

declare var cordova;

/*
  Generated class for the AppPermissionProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class AppPermissionProvider {

  private appBasicPermissions : any;

  constructor(public appProvider: AppProvider) {
    let permissions = cordova.plugins.permissions;
    this.appBasicPermissions = [
      permissions.READ_EXTERNAL_STORAGE,//permissions.READ_PHONE_STATE,
      permissions.WRITE_EXTERNAL_STORAGE
    ];
  }

  checkAndRequestAppPermission(requestedPermissions?){
    let permissions = cordova.plugins.permissions;
    let appPermissions = null;
    if(requestedPermissions){
      appPermissions = requestedPermissions;
    }else{
      appPermissions = this.appBasicPermissions;
    }
    permissions.checkPermission(appPermissions, ( status )=>{
      if(!status.hasPermission){
        permissions.requestPermissions(appPermissions,(grant)=>{
          if(!grant.hasPermission){
            this.appProvider.setNormalNotification("Fail to grant one or more permission, try to allow all permission manually on setting");
          }
        },(error)=>{
          this.appProvider.setNormalNotification("Fail to grant one or more permission, try to allow all permission manually on setting " + JSON.stringify(error));
        })
      }
    });

    //var permissions = cordova.plugins.permissions;
    //permissions.checkPermission(permission, successCallback, errorCallback);
    //permissions.requestPermission(permission, successCallback, errorCallback);
    //permissions.requestPermissions(permissions, successCallback, errorCallback);
  }

}
