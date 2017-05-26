import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

/*
  Generated class for the AppPermission provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
declare var cordova;

@Injectable()
export class AppPermission {

  private appBasicPermissions : any;

  constructor(public toastCtrl: ToastController) {
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
            this.setToasterMessage("Fail to grant one or more permission, try to allow all permission manually on setting");
          }
        },(error)=>{
          this.setToasterMessage("Fail to grant one or more permission, try to allow all permission manually on setting " + JSON.stringify(error));
        })
      }
    });

    //var permissions = cordova.plugins.permissions;
    //permissions.checkPermission(permission, successCallback, errorCallback);
    //permissions.requestPermission(permission, successCallback, errorCallback);
    //permissions.requestPermissions(permissions, successCallback, errorCallback);
  }

  setToasterMessage(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 5000
    });
    toast.present();
  }

}
