import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import * as async from 'async';

import { CurrentUser } from 'src/models';
import { UserService } from './user.service';
import { NetworkService } from './network.service';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {
  constructor(
    private http: HTTP,
    private userServices: UserService,
    private networkService: NetworkService
  ) {}

  getUrlBasedOnDhisVersion(url: string, currentUser: CurrentUser) {
    if (url.indexOf('/api/') === -1 && url.indexOf('.json') > 0) {
      url = '/api/' + url;
    }
    const { dhisVersion } = currentUser;
    if (dhisVersion && parseInt(dhisVersion, 10) < 25) {
      const pattern = '/api/' + dhisVersion;
      url = url.replace(pattern, '/api/');
    } else if (dhisVersion && parseInt(dhisVersion, 10) >= 25) {
      const pattern = '/api/' + dhisVersion;
      url = url.replace('/api', '/api');
      url = url.replace('/api', pattern);
    }
    return encodeURI(url);
  }

  get(
    url: string,
    dataOnly: boolean = false,
    user?: CurrentUser,
    resourceName?: string,
    pageSize?: number
  ) {
    let apiUrl = '';
    const { isAvailable, message } = this.networkService.getNetWorkStatus();
    return new Promise((resolve, reject) => {
      if (isAvailable) {
        this.userServices
          .getSanizitizedUser(user)
          .then((sanitizedUser: CurrentUser) => {
            const { username, password, serverUrl } = sanitizedUser;
            this.http.clearCookies();
            const headers = this.http.getBasicAuthHeader(username, password);
            this.http.setDataSerializer('json');
            apiUrl =
              serverUrl + this.getUrlBasedOnDhisVersion(url, sanitizedUser);
            if (resourceName && pageSize) {
              const testUrl =
                serverUrl +
                `/api/${resourceName}.json?fields=none&pageSize=${pageSize}`;
              this.getResponseWithPaginations(
                apiUrl,
                testUrl,
                resourceName,
                pageSize,
                headers
              )
                .then(response => {
                  resolve(response);
                })
                .catch((error: any) => {
                  reject(error);
                });
            } else {
              this.getResponseWithoutPaginations(apiUrl, headers, dataOnly)
                .then(response => {
                  resolve(response);
                })
                .catch((error: any) => {
                  reject(error);
                });
            }
          })
          .catch((error: any) => {
            reject(error);
          });
      } else {
        reject({ error: message });
      }
    });
  }

  getResponseWithPaginations(
    apiUrl: string,
    testUrl: string,
    resourceName: string,
    pageSize: number,
    headers: any
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get(testUrl, {}, headers)
        .then((initialResponse: any) => {
          initialResponse = JSON.parse(initialResponse.data);
          initialResponse[resourceName] = [];
          const paginatedUrls = [];
          for (let i = 1; i <= initialResponse.pager.pageCount; i++) {
            const paginatedUrl =
              apiUrl + '&pageSize=' + pageSize + '&page=' + i;
            paginatedUrls.push(paginatedUrl);
          }
          const that = this;
          let completedStages = 0;
          async.mapLimit(
            paginatedUrls,
            paginatedUrls.length,
            async function(paginatedUrl) {
              try {
                let response = await that.http.get(paginatedUrl, {}, headers);
                response = JSON.parse(response.data);
                initialResponse[resourceName] = initialResponse[
                  resourceName
                ].concat(response[resourceName]);
                completedStages++;
                if (completedStages === paginatedUrls.length) {
                  resolve(initialResponse);
                }
              } catch (error) {
                reject(error);
              }
            },
            (error, results) => {
              if (error) {
                reject(error);
              } else {
                resolve(initialResponse);
              }
            }
          );
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }
  getResponseWithoutPaginations(
    apiUrl: string,
    headers: any,
    dataOnly: boolean
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get(apiUrl, {}, headers)
        .then((response: any) => {
          const responseData = dataOnly ? JSON.parse(response.data) : response;
          resolve(responseData);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  post(url: string, data: any, user?: CurrentUser): Promise<any> {
    let apiUrl = '';
    const { isAvailable, message } = this.networkService.getNetWorkStatus();
    return new Promise((resolve, reject) => {
      if (isAvailable) {
        this.userServices
          .getSanizitizedUser(user)
          .then((sanitizedUser: CurrentUser) => {
            const { username, password } = sanitizedUser;
            this.http.clearCookies();
            const headers = this.http.getBasicAuthHeader(username, password);
            this.http.setDataSerializer('json');
            apiUrl =
              user.serverUrl +
              this.getUrlBasedOnDhisVersion(url, sanitizedUser);
            this.http
              .post(apiUrl, data, headers)
              .then(response => {
                resolve(response);
              })
              .catch((error: any) => {
                reject(error);
              });
          })
          .catch((error: any) => {
            reject(error);
          });
      } else {
        reject({ error: message });
      }
    });
  }
  put(url: string, data: any, user?: CurrentUser): Promise<any> {
    let apiUrl = '';
    const { isAvailable, message } = this.networkService.getNetWorkStatus();
    return new Promise((resolve, reject) => {
      if (isAvailable) {
        this.userServices
          .getSanizitizedUser(user)
          .then((sanitizedUser: CurrentUser) => {
            const { username, password } = sanitizedUser;
            this.http.clearCookies();
            const headers = this.http.getBasicAuthHeader(username, password);
            this.http.setDataSerializer('json');
            apiUrl =
              user.serverUrl +
              this.getUrlBasedOnDhisVersion(url, sanitizedUser);
            this.http
              .put(apiUrl, data, headers)
              .then(response => {
                resolve(response);
              })
              .catch((error: any) => {
                reject(error);
              });
          })
          .catch((error: any) => {
            reject(error);
          });
      } else {
        reject({ error: message });
      }
    });
  }
  delete(url: string, user?: CurrentUser): Promise<any> {
    let apiUrl = '';
    const { isAvailable, message } = this.networkService.getNetWorkStatus();
    return new Promise((resolve, reject) => {
      if (isAvailable) {
        this.userServices
          .getSanizitizedUser(user)
          .then((sanitizedUser: CurrentUser) => {
            const { username, password } = sanitizedUser;
            this.http.clearCookies();
            const headers = this.http.getBasicAuthHeader(username, password);
            this.http.setDataSerializer('json');
            apiUrl =
              user.serverUrl +
              this.getUrlBasedOnDhisVersion(url, sanitizedUser);
            this.http
              .delete(apiUrl, {}, headers)
              .then(response => {
                resolve(response);
              })
              .catch((error: any) => {
                reject(error);
              });
          })
          .catch((error: any) => {
            reject(error);
          });
      } else {
        reject({ error: message });
      }
    });
  }
}
