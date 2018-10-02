/*
 *
 * Copyright 2015 HISP Tanzania
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301, USA.
 *
 * @since 2015
 * @author Joseph Chingalo <profschingalo@gmail.com>
 */
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { HTTP } from '@ionic-native/http';
import { Observable } from 'rxjs/Observable';
import { HttpClientProvider } from '../http-client/http-client';
import { CurrentUser } from '../../models/currentUser';
import { EncryptionProvider } from '../encryption/encryption';
import { LocalStorageProvider } from '../local-storage/local-storage';

/*
 Generated class for the UserProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class UserProvider {
  constructor(
    private localStorageProvider: LocalStorageProvider,
    private http: HTTP,
    private httpProvider: HttpClientProvider,
    private encryptionProvider: EncryptionProvider
  ) {}

  /**
   *
   * @param user
   * @returns {Observable<any>}
   */
  getUserAuthorities(user): Observable<any> {
    this.http.useBasicAuth(user.username, user.password);
    let fields = 'fields=authorities,id,name,dataViewOrganisationUnits';
    let url = user.serverUrl;
    url += '/api/me.json?' + fields;
    if (user.dhisVersion && parseInt(user.dhisVersion) > 25) {
      url = url.replace('/api', '/api/' + user.dhisVersion);
    }
    return new Observable(observer => {
      this.http
        .get(url, {}, {})
        .then((response: any) => {
          let data = JSON.parse(response.data);
          const { authorities } = data;
          if (authorities) {
            observer.next(data);
            observer.complete();
          } else {
            url = user.serverUrl + '/api/me/authorization';
            this.http
              .get(url, {}, {})
              .then((response: any) => {
                data['authorities'] = JSON.parse(response.data);
                observer.next(data);
                observer.complete();
              })
              .catch(error => {
                observer.error(error);
              });
          }
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }

  getUserDataOnAuthenticatedServer(
    currentUser: CurrentUser,
    serverUrl: string,
    withBaseUrl: boolean = false
  ): Observable<any> {
    this.http.useBasicAuth(currentUser.username, currentUser.password);
    return new Observable(observer => {
      const fields =
        'fields=[:all],organisationUnits[id,name],dataViewOrganisationUnits[id,name],userCredentials[userRoles[name,dataSets[id],programs[id]],programs,dataSets';
      serverUrl = serverUrl.split('/dhis-web-')[0];
      const url = serverUrl + '/api/me.json?' + fields;
      const apiurl = withBaseUrl
        ? this.httpProvider.getUrlBasedOnDhisVersion(url, currentUser)
        : url;
      this.http
        .get(apiurl, {}, {})
        .then(response => {
          const { data } = response;
          if (data && data.indexOf('login.action') > -1) {
            serverUrl = serverUrl.replace('http://', 'https://');
            this.getUserDataOnAuthenticatedServer(
              currentUser,
              serverUrl
            ).subscribe(
              responseData => {
                const { data } = responseData;
                observer.next({
                  serverUrl,
                  currentUser,
                  data: JSON.parse(data)
                });
                observer.complete();
              },
              error => {
                observer.error(error);
              }
            );
          } else {
            observer.next({ serverUrl, currentUser, data: JSON.parse(data) });
            observer.complete();
          }
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }

  offlineUserAuthentication(user: CurrentUser): Observable<any> {
    return new Observable(observer => {
      if (user && user.hashedKeyForOfflineAuthentication) {
        const hashedKeyForOfflineAuthentication = this.encryptionProvider.getHashedKeyForOfflineAuthentication(
          user
        );
        if (
          hashedKeyForOfflineAuthentication ==
          user.hashedKeyForOfflineAuthentication
        ) {
          observer.next(user);
          observer.complete();
        } else {
          observer.error({
            error: 'You have enter wrong username or password or server address'
          });
        }
      } else {
        observer.error({
          error:
            'You can not login offline, please make sure you have network and try in again'
        });
      }
    });
  }

  onlineUserAuthentication(
    currentUser: CurrentUser,
    serverUrl: string
  ): Observable<any> {
    this.http.useBasicAuth(currentUser.username, currentUser.password);
    return new Observable(observer => {
      this.http
        .get(serverUrl, {}, {})
        .then(data => {
          const { status } = data;
          if (status == 200) {
            const newServerUrl = this.getServerUrlBasedOnResponseHeader(
              data,
              serverUrl
            );
            this.getUserDataOnAuthenticatedServer(
              currentUser,
              newServerUrl
            ).subscribe(
              response => {
                const { serverUrl } = response;
                const { currentUser } = response;
                observer.next({ currentUser, serverUrl });
                observer.complete();
              },
              error => {
                observer.error(error);
                // try dhis , dev and demo redirect
              }
            );
          } else {
            observer.error(data);
          }
        })
        .catch(er => {
          observer.error(er);
        });
    });
  }

  getServerUrlBasedOnResponseHeader(response, serverUrl) {
    let newServerUrl = '';
    const { url } = response;
    const { headers } = response;
    if (url) {
      newServerUrl = url.split('/dhis-web-')[0];
    } else if (headers) {
      if (headers['set-cookie']) {
        headers['set-cookie']
          .replace(/\s/g, '')
          .split(';')
          .map(cookieValue => {
            if (cookieValue.indexOf('Path=/') > -1) {
              const path = cookieValue.split('Path=/').pop();
              const lastUrlPart = serverUrl.split('/').pop();
              if (lastUrlPart !== path) {
                if (lastUrlPart == '') {
                  newServerUrl = serverUrl + path;
                } else {
                  newServerUrl = serverUrl + '/' + path;
                }
              }
            }
          });
      } else if (headers['Set-cookie']) {
        headers['set-cookie']
          .replace(/\s/g, '')
          .split(';')
          .map(cookieValue => {
            if (cookieValue.indexOf('Path=/') > -1) {
              const path = cookieValue.split('Path=/').pop();
              const lastUrlPart = serverUrl.split('/').pop();
              if (lastUrlPart !== path) {
                if (lastUrlPart == '') {
                  newServerUrl = serverUrl + path;
                } else {
                  newServerUrl = serverUrl + '/' + path;
                }
              }
            }
          });
      }
    }
    return newServerUrl;
  }

  getCurrentUserSystemInformationFromServer(
    currentUser: CurrentUser
  ): Observable<any> {
    const url = '/api/system/info';
    return new Observable(observer => {
      this.httpProvider.get(url, true, currentUser).subscribe(
        response => {
          observer.next(response);
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
   * @param user
   * @returns {Observable<any>}
   */
  setCurrentUser(user: any): Observable<any> {
    user = JSON.stringify(user);
    return new Observable(observer => {
      this.localStorageProvider.setDataOnLocalStorage(user, 'user').subscribe(
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
    let dhisVersion = '22';
    if (systemInformation.version) {
      let versionArray = systemInformation.version.split('.');
      dhisVersion = versionArray.length > 0 ? versionArray[1] : dhisVersion;
    }
    dhisVersion = dhisVersion.split('-')[0];
    return new Observable(observer => {
      systemInformation = JSON.stringify(systemInformation);
      this.localStorageProvider
        .setDataOnLocalStorage(systemInformation, 'systemInformation')
        .subscribe(
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
    const userData = {
      Name: userDataResponse.name,
      Employer: userDataResponse.employer,
      'Job Title': userDataResponse.jobTitle,
      Education: userDataResponse.education,
      Gender: userDataResponse.gender,
      Birthday: userDataResponse.birthday,
      Nationality: userDataResponse.nationality,
      Interests: userDataResponse.interests,
      userRoles: userDataResponse.userCredentials.userRoles,
      organisationUnits: userDataResponse.organisationUnits,
      dataViewOrganisationUnits: userDataResponse.dataViewOrganisationUnits,
      dataSets: this.getAssignedDataSetIds(userDataResponse),
      programs: this.getAssignedProgramsId(userDataResponse)
    };
    return new Observable(observer => {
      this.localStorageProvider
        .setDataOnLocalStorage(JSON.stringify(userData), 'userData')
        .subscribe(
          () => {
            this.setProfileInformation(userDataResponse, true).subscribe(
              () => {
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
    });
  }

  setProfileInformation(userDataResponse, status?: boolean): Observable<any> {
    return new Observable(observer => {
      const ommittedKeys = [
        'access',
        'attributeValues',
        'userAccesses',
        'dataSets',
        'programs',
        'userGroups',
        'userCredentials',
        'userGroupAccesses',
        'favorites',
        'favorite',
        'teiSearchOrganisationUnits',
        'name',
        'organisationUnits',
        'translations',
        'dataViewOrganisationUnits',
        'lastCheckedInterpretations',
        'created',
        'id',
        'lastUpdated',
        'displayName',
        'externalAccess',
        'authorities',
        'settings'
      ];
      status = status ? status : false;
      const profileInfo = { status: status };
      Object.keys(userDataResponse).map(key => {
        if (ommittedKeys.indexOf(key) === -1) {
          profileInfo[key] = userDataResponse[key];
        }
      });
      this.localStorageProvider
        .setDataOnLocalStorage(JSON.stringify(profileInfo), 'profileInfo')
        .subscribe(
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

  getProfileInformation(): Observable<any> {
    return new Observable(observer => {
      this.localStorageProvider.getDataOnLocalStorage('profileInfo').subscribe(
        profileInfo => {
          observer.next(profileInfo);
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  getAssignedDataSetIds(userData) {
    let dataSetsIds = [];
    if (userData && userData.dataSets) {
      dataSetsIds = userData.dataSets;
    } else if (
      userData &&
      userData.userCredentials &&
      userData.userCredentials.userRoles
    ) {
      userData.userCredentials.userRoles.map((userRole: any) => {
        if (userRole.dataSets) {
          userRole.dataSets.map((dataset: any) => {
            if (dataSetsIds.indexOf(dataset.id) == -1) {
              dataSetsIds.push(dataset.id);
            }
          });
        }
      });
    }
    return dataSetsIds;
  }

  getAssignedProgramsId(userData) {
    let programIds = [];
    if (userData && userData.programs) {
      programIds = userData.programs;
    } else if (
      userData &&
      userData.userCredentials &&
      userData.userCredentials.userRoles
    ) {
      userData.userCredentials.userRoles.map((userRole: any) => {
        if (userRole.programs) {
          userRole.programs.map((program: any) => {
            if (programIds.indexOf(program.id) === -1) {
              programIds.push(program.id);
            }
          });
        }
      });
    }
    return programIds;
  }

  /**
   *
   * @returns {Observable<any>}
   */
  getUserData(): Observable<any> {
    return new Observable(observer => {
      this.localStorageProvider.getDataOnLocalStorage('userData').subscribe(
        userData => {
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
   *
   * @returns {Observable<any>}
   */
  getCurrentUserSystemInformation(): Observable<any> {
    return new Observable(observer => {
      this.localStorageProvider
        .getDataOnLocalStorage('systemInformation')
        .subscribe(
          systemInformation => {
            observer.next(systemInformation);
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
  getCurrentUser(): Observable<any> {
    return new Observable(observer => {
      this.localStorageProvider.getDataOnLocalStorage('user').subscribe(
        user => {
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
