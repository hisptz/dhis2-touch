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
var objectToArray_1 = require('../../pipes/objectToArray');
var user_1 = require('../../providers/user/user');
var app_provider_1 = require('../../providers/app-provider/app-provider');
var http_client_1 = require("../../providers/http-client/http-client");
var sql_lite_1 = require("../../providers/sql-lite/sql-lite");
/*
 Generated class for the ProfilePage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
var ProfilePage = (function () {
    function ProfilePage(navCtrl, toastCtrl, user, appProvider, sqlLite, httpClient) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.toastCtrl = toastCtrl;
        this.user = user;
        this.appProvider = appProvider;
        this.sqlLite = sqlLite;
        this.httpClient = httpClient;
        this.loadingData = false;
        this.loadingMessages = [];
        this.user.getCurrentUser().then(function (currentUser) {
            _this.currentUser = currentUser;
        });
        this.loadingProfileInformation();
    }
    ProfilePage.prototype.loadingProfileInformation = function () {
        var _this = this;
        this.loadingData = true;
        this.loadingMessages = [];
        this.profileInformation = {};
        this.setLoadingMessages('Loading profiles information');
        this.user.getUserData().then(function (userData) {
            for (var key in userData) {
                var value = userData[key];
                if (!(value instanceof Object)) {
                    _this.profileInformation[key] = value;
                }
            }
            _this.setUserRoles(userData);
        }, function (error) {
            _this.loadingData = false;
            _this.setToasterMessage('Fail to load profile information');
        });
    };
    ProfilePage.prototype.setUserRoles = function (userData) {
        var _this = this;
        this.setLoadingMessages('Loading user roles');
        this.userRoles = [];
        this.assignedForms = [];
        this.assignedPrograms = [];
        userData.userRoles.forEach(function (userRole) {
            _this.userRoles.push(userRole.name);
            _this.setAssignedForms(userRole.dataSets);
            _this.setAssignedPrograms(userRole.programs);
        });
        this.loadingAssignedOrganisationUnits(userData.organisationUnits);
    };
    ProfilePage.prototype.setAssignedForms = function (dataSets) {
        var _this = this;
        dataSets.forEach(function (dataSet) {
            if (_this.assignedForms.indexOf(dataSet.name) == -1) {
                _this.assignedForms.push(dataSet.name);
            }
        });
    };
    ProfilePage.prototype.setAssignedPrograms = function (programs) {
        var _this = this;
        programs.forEach(function (program) {
            if (_this.assignedPrograms.indexOf(program.name) == -1) {
                _this.assignedPrograms.push(program.name);
            }
        });
    };
    ProfilePage.prototype.loadingAssignedOrganisationUnits = function (organisationUnits) {
        var _this = this;
        this.setLoadingMessages('Loading assigned organisation units');
        this.assignOrgUnits = [];
        var resource = 'organisationUnits';
        var attribute = 'id';
        var attributeValue = [];
        organisationUnits.forEach(function (organisationUnit) {
            attributeValue.push(organisationUnit.id);
        });
        this.sqlLite.getDataFromTableByAttributes(resource, attribute, attributeValue, this.currentUser.currentDatabase).then(function (assignedOrganisationUnits) {
            assignedOrganisationUnits.forEach(function (assignedOrganisationUnit) {
                _this.assignOrgUnits.push(assignedOrganisationUnit.name);
            });
            _this.loadingData = false;
        }, function (error) {
            _this.loadingData = false;
            _this.setToasterMessage('Fail to load assigned organisation units');
        });
    };
    ProfilePage.prototype.setLoadingMessages = function (message) {
        this.loadingMessages.push(message);
    };
    ProfilePage.prototype.setToasterMessage = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000
        });
        toast.present();
    };
    ProfilePage.prototype.setStickToasterMessage = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            showCloseButton: true
        });
        toast.present();
    };
    ProfilePage = __decorate([
        core_1.Component({
            templateUrl: 'build/pages/profile/profile.html',
            providers: [user_1.User, app_provider_1.AppProvider, http_client_1.HttpClient, sql_lite_1.SqlLite],
            pipes: [objectToArray_1.ObjectToArray]
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavController, ionic_angular_1.ToastController, user_1.User, app_provider_1.AppProvider, sql_lite_1.SqlLite, http_client_1.HttpClient])
    ], ProfilePage);
    return ProfilePage;
})();
exports.ProfilePage = ProfilePage;
