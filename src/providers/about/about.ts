import { Injectable } from "@angular/core";
import { AppProvider } from "../app/app";
import { UserProvider } from "../user/user";
import { Observable } from "rxjs/Observable";

/*
  Generated class for the AboutProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class AboutProvider {
  constructor(
    private appProvider: AppProvider,
    private userProvider: UserProvider
  ) {}

  /**
   *
   * @returns {{id: string; name: string; icon: string}[]}
   */
  getAboutContentDetails() {
    let syncContents = [
      //{id : 'appInformation',name : 'App information',icon: 'assets/icon/app-information.png'},
      {
        id: "dataValues",
        name: "Aggregate status",
        icon: "assets/icon/data-values.png"
      },
      {
        id: "eventStatus",
        name: "Event status",
        icon: "assets/icon/event-status.png"
      },
      {
        id: "eventForTrackerStatus",
        name: "Event for tracker status",
        icon: "assets/icon/event-status.png"
      },
      {
        id: "enrollment",
        name: "Enrollments",
        icon: "assets/icon/profile-tracker.png"
      },
      {
        id: "systemInfo",
        name: "System info",
        icon: "assets/icon/system-info.png"
      }
    ];
    return syncContents;
  }

  /**
   *
   * @returns {Observable<any>}
   */
  getAppInformation(): Observable<any> {
    let appInformation = { name: "", version: "", package: "" };
    return new Observable(observer => {
      this.appProvider.getAppInformation().subscribe(
        (response: any) => {
          appInformation.name = response.appName;
          appInformation.version = response.versionNumber;
          appInformation.package = response.packageName;
          observer.next(appInformation);
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
   * @returns {Observable<any>}
   */
  getSystemInformation(): Observable<any> {
    return new Observable(observer => {
      this.userProvider.getCurrentUserSystemInformation().subscribe(
        systemInfo => {
          observer.next(this.getArrayFromObject(systemInfo));
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
