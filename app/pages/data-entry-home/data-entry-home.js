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
var user_1 = require('../../providers/user/user');
var app_provider_1 = require('../../providers/app-provider/app-provider');
var http_client_1 = require("../../providers/http-client/http-client");
var sql_lite_1 = require("../../providers/sql-lite/sql-lite");
var organisation_units_1 = require("../organisation-units/organisation-units");
/*
  Generated class for the DataEntryHomePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
var DataEntryHomePage = (function () {
    function DataEntryHomePage(modalCtrl, navCtrl, toastCtrl, user, appProvider, sqlLite, httpClient) {
        var _this = this;
        this.modalCtrl = modalCtrl;
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
            _this.loadOrganisationUnits();
        });
    }
    DataEntryHomePage.prototype.loadOrganisationUnits = function () {
        var _this = this;
        this.loadingData = true;
        this.loadingMessages = [];
        this.setLoadingMessages('Loading organisation units');
        var resource = "organisationUnits";
        this.sqlLite.getAllDataFromTable(resource, this.currentUser.currentDatabase).then(function (organisationUnits) {
            _this.organisationUnits = organisationUnits;
            _this.loadingData = false;
        }, function (error) {
            _this.loadingData = false;
            _this.setToasterMessage('Fail to load organisation units');
        });
    };
    DataEntryHomePage.prototype.openModal = function () {
        var _this = this;
        this.loadingMessages = [];
        this.loadingData = true;
        this.setLoadingMessages('Please wait...');
        var modal = this.modalCtrl.create(organisation_units_1.OrganisationUnitsPage, { data: this.organisationUnits });
        modal.onDidDismiss(function (data) {
            _this.loadingData = false;
            alert(JSON.stringify(data));
        });
        modal.present();
    };
    DataEntryHomePage.prototype.setLoadingMessages = function (message) {
        this.loadingMessages.push(message);
    };
    DataEntryHomePage.prototype.setToasterMessage = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000
        });
        toast.present();
    };
    DataEntryHomePage.prototype.setStickToasterMessage = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            showCloseButton: true
        });
        toast.present();
    };
    DataEntryHomePage = __decorate([
        core_1.Component({
            templateUrl: 'build/pages/data-entry-home/data-entry-home.html',
            providers: [user_1.User, app_provider_1.AppProvider, http_client_1.HttpClient, sql_lite_1.SqlLite],
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.ModalController, ionic_angular_1.NavController, ionic_angular_1.ToastController, user_1.User, app_provider_1.AppProvider, sql_lite_1.SqlLite, http_client_1.HttpClient])
    ], DataEntryHomePage);
    return DataEntryHomePage;
})();
exports.DataEntryHomePage = DataEntryHomePage;
