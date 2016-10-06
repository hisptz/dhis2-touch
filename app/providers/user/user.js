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
var ionic_angular_1 = require('ionic-angular');
var http_1 = require('@angular/http');
require('rxjs/add/operator/map');
/*
  Generated class for the User provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
var User = (function () {
    function User(http) {
        this.http = http;
        this.localStorage = new ionic_angular_1.Storage(ionic_angular_1.LocalStorage);
    }
    User.prototype.setCurrentUser = function (user) {
        this.localStorage.set('user', JSON.stringify(user));
        return Promise.resolve(user);
    };
    User.prototype.setUserData = function (userDataResponse) {
        //userDataResponse= eval('('++')');
        var userData = {
            "Name": userDataResponse.name,
            "Employer": userDataResponse.employer,
            "Job Title": userDataResponse.jobTitle,
            "Education": userDataResponse.education,
            "Gender": userDataResponse.gender,
            "Birthday": userDataResponse.birthday,
            "Nationality": userDataResponse.nationality,
            "Interests": userDataResponse.interests,
            "userRoles": userDataResponse.userCredentials.userRoles,
            "organisationUnits": userDataResponse.organisationUnits
        };
        this.localStorage.set('userData', JSON.stringify(userData));
        return Promise.resolve(userData);
    };
    User.prototype.getUserData = function () {
        var self = this;
        return new Promise(function (resolve, reject) {
            self.localStorage.get('userData').then(function (userData) {
                userData = JSON.parse(userData);
                resolve(userData);
            }, function (err) {
                reject();
            }).catch(function (err) {
                reject();
            });
        });
    };
    User.prototype.getCurrentUser = function () {
        var self = this;
        return new Promise(function (resolve, reject) {
            self.localStorage.get('user').then(function (user) {
                user = JSON.parse(user);
                resolve(user);
            }, function (err) {
                reject();
            }).catch(function (err) {
                reject();
            });
        });
    };
    User = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], User);
    return User;
})();
exports.User = User;
