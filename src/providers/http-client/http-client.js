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
var http_1 = require('@angular/http');
var ionic_angular_1 = require('ionic-angular');
require('rxjs/add/operator/map');
//import {Observable} from "../../../../sample/node_modules/rxjs/Observable";
/*
 Generated class for the HttpClient provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
var HttpClient = (function () {
    function HttpClient(http) {
        this.http = http;
        this.localStorage = new ionic_angular_1.Storage(ionic_angular_1.LocalStorage);
    }
    HttpClient.prototype.get = function (url, user) {
        var headers = new http_1.Headers();
        headers.append('Authorization', 'Basic ' +
            btoa(user.username + ':' + user.password));
        return this.http.get(user.serverUrl + url, { headers: headers });
    };
    HttpClient.prototype.post = function (url, data, user) {
        var headers = new http_1.Headers();
        headers.append('Authorization', 'Basic ' +
            btoa(user.username + ':' + user.password));
        return this.http.post(user.serverUrl + url, data, { headers: headers });
    };
    HttpClient = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], HttpClient);
    return HttpClient;
})();
exports.HttpClient = HttpClient;
