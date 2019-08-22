/*
 *
 * Copyright 2019 HISP Tanzania
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
 * @since 2019
 * @author Joseph Chingalo <profschingalo@gmail.com>
 *
 */
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { CurrentUser } from 'src/models';
import { HttpClientService } from './http-client.service';
import { EncryptionService } from './encryption.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserAuthorizationService {
  constructor(
    private httpCLientService: HttpClientService,
    private encryptionService: EncryptionService
  ) {}

  getUserAuthorities(user: CurrentUser): Observable<any> {
    return new Observable(observer => {
      const fields =
        'fields=authorities,id,name,settings,dataViewOrganisationUnits';
      this.httpCLientService
        .get(`/api/me.json?${fields}`, true, user)
        .then((response: any) => {
          const { authorities } = response;
          if (authorities) {
            observer.next(response);
            observer.complete();
          } else {
            this.httpCLientService
              .get(`/api/me/authorization`, true, user)
              .then((authoritiesResponse: string[]) => {
                response = { ...response, authorities: authoritiesResponse };
                observer.next(response);
                observer.complete();
              })
              .catch((error: any) => {
                observer.error(error);
              });
          }
        })
        .catch((error: any) => {
          observer.error(error);
        });
    });
  }

  offlineUserAuthentication(user: CurrentUser): Promise<CurrentUser> {
    return new Promise((resolve, reject) => {
      const { hashedKeyForOfflineAuthentication } = user;
      if (hashedKeyForOfflineAuthentication) {
        const newHasedKeyForOfflineAuthentication = this.encryptionService.getHashedKeyForOfflineAuthentication(
          user
        );
        if (
          newHasedKeyForOfflineAuthentication ===
          hashedKeyForOfflineAuthentication
        ) {
          resolve(user);
        } else {
          const error = `You have enter wrong username or password or server address`;
          reject(error);
        }
      } else {
        const error = `You can not login offline, please make sure you have network and try in again`;
        reject(error);
      }
    });
  }

  onlineUserAuthentication(user: CurrentUser): Observable<any> {
    return new Observable(observer => {
      const apiUrl = `/api/me.json`;
      const { serverUrl } = user;
      this.httpCLientService
        .get(apiUrl, false, user)
        .then((response: any) => {
          const { status, data } = response;
          if (status === 200) {
            const newServerUrl = this.getServerUrlBasedOnResponseHeader(
              response,
              serverUrl
            );
            user = {
              ...user,
              serverUrl: newServerUrl.replace('/api/me.json', '')
            };
            if (data && data.indexOf('login.action') === -1) {
              observer.next(user);
              observer.complete();
            } else {
              const error = `HTTP Status 401 – Unauthorized`;
              observer.error({ error });
            }
          } else if (
            (status === 301 || status === 302) &&
            serverUrl.indexOf('http://') > -1
          ) {
            user = {
              ...user,
              serverUrl: serverUrl.replace('http://', 'https://')
            };
            this.onlineUserAuthentication(user).subscribe(
              (userResponse: any) => {
                observer.next(userResponse);
                observer.complete();
              },
              error => {
                observer.error(error);
              }
            );
          } else {
            observer.error(response);
          }
        })
        .catch((error: any) => {
          const { status } = error;
          if (
            (status === 301 || status === 302) &&
            serverUrl.indexOf('http://') > -1
          ) {
            user = {
              ...user,
              serverUrl: serverUrl.replace('http://', 'https://')
            };
            this.onlineUserAuthentication(user).subscribe(
              (userResponse: any) => {
                observer.next(userResponse);
                observer.complete();
              },
              errorResponse => {
                observer.error(errorResponse);
              }
            );
          } else {
            observer.error(error);
          }
        });
    });
  }

  getServerUrlBasedOnResponseHeader(response: any, serverUrl: string) {
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
                if (lastUrlPart === '') {
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
                if (lastUrlPart === '') {
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

  getUserDataOnAuthenticatedServer(user: CurrentUser): Observable<any> {
    return new Observable(observer => {
      const fields =
        'fields=[:all],organisationUnits[id,name],dataViewOrganisationUnits[id,name],userCredentials[userRoles[name,dataSets[id],programs[id]],programs,dataSets';
      const apiurl = `/api/me.json?fields=${fields}`;
      this.httpCLientService
        .get(apiurl, true, user)
        .then(response => {
          observer.next(response);
          observer.complete();
        })
        .catch((error: any) => {
          observer.error(error);
        });
    });
  }
}
