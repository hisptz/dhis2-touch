import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import "rxjs/add/operator/map";
import { HTTP } from "@ionic-native/http";
import { Observable } from "rxjs/Observable";

/*
 Generated class for the UserProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class UserProvider {
  public userData: any;

  constructor(public storage: Storage, public http: HTTP) {}

  /**
   *
   * @param user
   * @returns {Observable<any>}
   */
  getUserDataFromServer(user): Observable<any> {
    this.http.useBasicAuth(user.username, user.password);
    let fields =
      "fields=[:all],organisationUnits[id,name],dataViewOrganisationUnits[id,name],userCredentials[userRoles[name,dataSets[id,name],programs[id,name]]";
    let url = user.serverUrl.split("/dhis-web-commons")[0];
    url = url.split("/dhis-web-dashboard-integration")[0];
    url = url.split("/api/apps")[0];
    user.serverUrl = url;
    url += "/api/me.json?" + fields;
    return new Observable(observer => {
      this.http
        .get(url, {}, {})
        .then(
          (data: any) => {
            if (data.data.indexOf("login.action") > -1) {
              user.serverUrl = user.serverUrl.replace("http://", "https://");
              this.getUserDataFromServer(user).subscribe(
                (data: any) => {
                  let url = user.serverUrl.split("/dhis-web-commons")[0];
                  url = url.split("/dhis-web-dashboard-integration")[0];
                  user.serverUrl = url;
                  observer.next({ data: data.data, user: user });
                  observer.complete();
                },
                error => {
                  observer.error(error);
                }
              );
            } else {
              observer.next({ data: data.data, user: user });
              observer.complete();
            }
          },
          error => {
            observer.error(error);
          }
        )
        .catch(error => {
          observer.error(error);
        });
    });
  }

  /**
   *
   * @param user
   * @returns {Observable<any>}
   */
  getUserAuthorities(user): Observable<any> {
    this.http.useBasicAuth(user.username, user.password);
    let fields = "fields=authorities,id,name,dataViewOrganisationUnits";
    let url = user.serverUrl;
    url += "/api/me.json?" + fields;
    if (user.dhisVersion && parseInt(user.dhisVersion) > 25) {
      url = url.replace("/api", "/api/" + user.dhisVersion);
    }
    return new Observable(observer => {
      this.http
        .get(url, {}, {})
        .then(
          (response: any) => {
            observer.next(JSON.parse(response.data));
            observer.complete();
          },
          error => {
            observer.error(error);
          }
        )
        .catch(error => {
          observer.error(error);
        });
    });
  }

  /**
   *
   * @param user
   * @returns {Observable<any>}
   */
  authenticateUser(user): Observable<any> {
    this.http.useBasicAuth(user.username, user.password);
    return new Observable(observer => {
      this.http
        .get(user.serverUrl + "", {}, {})
        .then((data: any) => {
          if (data.status == 200) {
            if (data.headers && data.headers["Set-Cookie"]) {
              let setCookieArray = data.headers["Set-Cookie"].split(";");
              let path = "";
              let url = "";
              let serverUrlArray = user.serverUrl.split("/");
              setCookieArray.forEach((value: any) => {
                if (value.indexOf("Path=/") > -1) {
                  let pathValues = value.split("Path=/");
                  path = pathValues[pathValues.length - 1].split("/")[0];
                }
              });
              if (serverUrlArray[serverUrlArray.length - 1] != path) {
                url =
                  serverUrlArray[serverUrlArray.length - 1] == ""
                    ? user.serverUrl + path
                    : user.serverUrl + "/" + path;
              } else {
                url = user.serverUrl;
              }
              user.serverUrl = url;
            }
            this.getUserDataFromServer(user).subscribe(
              (data: any) => {
                let url = user.serverUrl.split("/dhis-web-commons")[0];
                url = url.split("/dhis-web-dashboard-integration")[0];
                user.serverUrl = url;
                observer.next({ data: data.data, user: data.user });
                observer.complete();
              },
              error => {
                observer.error(error);
              }
            );
          } else {
            observer.error(data);
          }
        })
        .catch(error => {
          if (error.status == 301 || error.status == 302) {
            if (error.headers && error.headers.Location) {
              user.serverUrl = error.headers.Location;
              this.authenticateUser(user).subscribe(
                (data: any) => {
                  let url = user.serverUrl.split("/dhis-web-commons")[0];
                  url = url.split("/dhis-web-dashboard-integration")[0];
                  user.serverUrl = url;
                  observer.next({ data: data, user: user });
                  observer.complete();
                },
                error => {
                  observer.error(error);
                }
              );
            } else if (error.headers && error.headers.location) {
              user.serverUrl = error.headers.location;
              this.authenticateUser(user).subscribe(
                (data: any) => {
                  let url = user.serverUrl.split("/dhis-web-commons")[0];
                  url = url.split("/dhis-web-dashboard-integration")[0];
                  user.serverUrl = url;
                  observer.next({ data: data, user: user });
                  observer.complete();
                },
                error => {
                  observer.error(error);
                }
              );
            } else {
              observer.error(error);
            }
          } else {
            observer.error(error);
          }
        });
    });
  }

  /**
   *
   * @param user
   * @returns {Observable<any>}
   */
  setCurrentUser(user: any): Observable<any> {
    user = JSON.stringify(user);
    return new Observable(observer => {
      this.storage.set("user", user).then(
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
   *
   * @param systemInformation
   * @returns {Observable<any>}
   */
  setCurrentUserSystemInformation(systemInformation: any): Observable<any> {
    let dhisVersion = "22";
    if (systemInformation.version) {
      let versionArray = systemInformation.version.split(".");
      dhisVersion = versionArray.length > 0 ? versionArray[1] : dhisVersion;
    }
    return new Observable(observer => {
      systemInformation = JSON.stringify(systemInformation);
      this.storage.set("systemInformation", systemInformation).then(
        () => {
          observer.next(dhisVersion);
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
   * @param userDataResponse
   * @returns {Promise<T>}
   */
  setUserData(userDataResponse): Observable<any> {
    this.userData = {
      Name: userDataResponse.name,
      Employer: userDataResponse.employer,
      "Job Title": userDataResponse.jobTitle,
      Education: userDataResponse.education,
      Gender: userDataResponse.gender,
      Birthday: userDataResponse.birthday,
      Nationality: userDataResponse.nationality,
      Interests: userDataResponse.interests,
      userRoles: userDataResponse.userCredentials.userRoles,
      organisationUnits: userDataResponse.organisationUnits,
      dataViewOrganisationUnits: userDataResponse.dataViewOrganisationUnits
    };
    let userData = JSON.stringify(this.userData);
    return new Observable(observer => {
      this.storage.set("userData", userData).then(
        () => {
          observer.next(JSON.parse(userData));
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
  getUserData(): Observable<any> {
    return new Observable(observer => {
      this.storage
        .get("userData")
        .then(
          userData => {
            userData = JSON.parse(userData);
            observer.next(userData);
            observer.complete();
          },
          error => {
            observer.error(error);
          }
        )
        .catch(error => {
          observer.error(error);
        });
    });
  }

  /**
   *
   * @returns {Observable<any>}
   */
  getCurrentUserSystemInformation(): Observable<any> {
    return new Observable(observer => {
      this.storage
        .get("systemInformation")
        .then(
          systemInformation => {
            systemInformation = JSON.parse(systemInformation);
            observer.next(systemInformation);
            observer.complete();
          },
          error => {
            observer.error(error);
          }
        )
        .catch(error => {
          observer.error(error);
        });
    });
  }

  /**
   *
   * @returns {Observable<any>}
   */
  getCurrentUser(): Observable<any> {
    return new Observable(observer => {
      this.storage.get("user").then(
        user => {
          user = JSON.parse(user);
          observer.next(user);
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      );
    });
  }
}
