var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
require('rxjs/add/operator/map');
var http_client_1 = require('../../providers/http-client/http-client');
var Rx_1 = require('rxjs/Rx');
var sql_lite_1 = require("../../providers/sql-lite/sql-lite");
var ionic_native_1 = require('ionic-native');
/*
 Generated class for the App provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
var AppProvider = (function () {
    function AppProvider(http, sqlLite) {
        this.http = http;
        this.sqlLite = sqlLite;
        this.multipleIdsData = [];
    }
    AppProvider.prototype.getAppInformation = function () {
        var appInformation = {};
        var promises = [];
        return new Promise(function (resolve, reject) {
            promises.push(ionic_native_1.AppVersion.getAppName().then(function (appName) {
                appInformation['appName'] = appName;
            }));
            promises.push(ionic_native_1.AppVersion.getPackageName().then(function (packageName) {
                appInformation['packageName'] = packageName;
            }));
            promises.push(ionic_native_1.AppVersion.getVersionCode().then(function (versionCode) {
                appInformation['versionCode'] = versionCode;
            }));
            promises.push(ionic_native_1.AppVersion.getVersionNumber().then(function (versionNumber) {
                appInformation['versionNumber'] = versionNumber;
            }));
            Rx_1.Observable.forkJoin(promises).subscribe(function () {
                resolve(appInformation);
            }, function (error) {
                reject();
            });
        });
    };
    AppProvider.prototype.getFormattedBaseUrl = function (url) {
        this.formattedBaseUrl = "";
        var urlToBeFormatted = "", urlArray = [], baseUrlString;
        if (!(url.split('/')[0] == "https:" || url.split('/')[0] == "http:")) {
            urlToBeFormatted = "http://" + url;
        }
        else {
            urlToBeFormatted = url;
        }
        baseUrlString = urlToBeFormatted.split('/');
        for (var index in baseUrlString) {
            if (baseUrlString[index]) {
                urlArray.push(baseUrlString[index]);
            }
        }
        this.formattedBaseUrl = urlArray[0] + '/';
        for (var i = 0; i < urlArray.length; i++) {
            if (i != 0) {
                this.formattedBaseUrl = this.formattedBaseUrl + '/' + urlArray[i];
            }
        }
        return Promise.resolve(this.formattedBaseUrl);
    };
    AppProvider.prototype.getDataBaseName = function (url) {
        var databaseName = url.replace('://', '_').replace('/', '_').replace('.', '_').replace(':', '_');
        return Promise.resolve(databaseName);
    };
    AppProvider.prototype.saveMetadata = function (resource, resourceValues, databaseName) {
        var promises = [];
        var self = this;
        return new Promise(function (resolve, reject) {
            if (resourceValues.length == 0) {
                resolve();
            }
            resourceValues.forEach(function (resourceValue) {
                promises.push(self.sqlLite.insertDataOnTable(resource, resourceValue, databaseName).then(function () {
                    //saving success
                }, function (error) {
                }));
            });
            Rx_1.Observable.forkJoin(promises).subscribe(function () {
                resolve();
            }, function (error) {
                reject(error.failure);
            });
        });
    };
    AppProvider.prototype.downloadMetadata = function (user, resource, resourceId, fields, filter) {
        var self = this;
        var resourceUrl = self.getResourceUrl(resource, resourceId, fields, filter);
        return new Promise(function (resolve, reject) {
            self.http.get(resourceUrl, user).subscribe(function (response) {
                response = response.json();
                resolve(response);
            }, function (error) {
                reject(error);
            });
        });
    };
    AppProvider.prototype.downloadMetadataByResourceIds = function (user, resource, resourceIds, fields, filter) {
        var self = this;
        var data = [];
        var promises = [];
        return new Promise(function (resolve, reject) {
            self.multipleIdsData = [];
            resourceIds.forEach(function (resourceId) {
                promises.push(self.downloadMetadata(user, resource, resourceId, fields, filter).then(function (response) {
                    data.push(response);
                }, function (error) { }));
            });
            Rx_1.Observable.forkJoin(promises).subscribe(function () {
                resolve(data);
            }, function (error) {
                reject(error);
            });
        });
    };
    AppProvider.prototype.getResourceUrl = function (resource, resourceId, fields, filter) {
        var url = '/api/' + resource;
        if (resourceId || resourceId != null) {
            url += "/" + resourceId + ".json?paging=false";
        }
        else {
            url += ".json?paging=false";
        }
        if (fields || fields != null) {
            url += '&fields=' + fields;
        }
        if (filter || filter != null) {
            url += '&filter=' + filter;
        }
        return url;
    };
    AppProvider = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_client_1.HttpClient, sql_lite_1.SqlLite])
    ], AppProvider);
    return AppProvider;
})();
exports.AppProvider = AppProvider;
