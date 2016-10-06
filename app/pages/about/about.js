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
  Generated class for the AboutPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
var AboutPage = (function () {
    function AboutPage(navCtrl, toastCtrl, user, appProvider, sqlLite, httpClient) {
        this.navCtrl = navCtrl;
        this.toastCtrl = toastCtrl;
        this.user = user;
        this.appProvider = appProvider;
        this.sqlLite = sqlLite;
        this.httpClient = httpClient;
        this.loadingData = false;
        this.loadingMessages = [];
        this.loadingSystemInformation();
    }
    AboutPage.prototype.loadingSystemInformation = function () {
        var _this = this;
        this.loadingData = true;
        this.loadingMessages = [];
        this.setLoadingMessages('Loading system information');
        this.user.getCurrentUserSystemInformation().then(function (systemInformation) {
            _this.systemInformation = systemInformation;
            _this.loadAppInformation();
        });
    };
    AboutPage.prototype.loadAppInformation = function () {
        var _this = this;
        this.setLoadingMessages('Loading app information');
        this.appProvider.getAppInformation().then(function (appInformation) {
            _this.appInformation = appInformation;
            _this.loadingData = false;
        });
    };
    AboutPage.prototype.setLoadingMessages = function (message) {
        this.loadingMessages.push(message);
    };
    AboutPage.prototype.setToasterMessage = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000
        });
        toast.present();
    };
    AboutPage.prototype.setStickToasterMessage = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            showCloseButton: true
        });
        toast.present();
    };
    AboutPage = __decorate([
        core_1.Component({
            templateUrl: 'build/pages/about/about.html',
            providers: [user_1.User, app_provider_1.AppProvider, http_client_1.HttpClient, sql_lite_1.SqlLite],
            pipes: [objectToArray_1.ObjectToArray]
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavController, ionic_angular_1.ToastController, user_1.User, app_provider_1.AppProvider, sql_lite_1.SqlLite, http_client_1.HttpClient])
    ], AboutPage);
    return AboutPage;
})();
exports.AboutPage = AboutPage;
