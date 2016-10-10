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
/*
  Generated class for the ReportParameterSelectionPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
var ReportParameterSelectionPage = (function () {
    function ReportParameterSelectionPage(params, navCtrl, toastCtrl, user, appProvider, sqlLite, httpClient) {
        var _this = this;
        this.params = params;
        this.navCtrl = navCtrl;
        this.toastCtrl = toastCtrl;
        this.user = user;
        this.appProvider = appProvider;
        this.sqlLite = sqlLite;
        this.httpClient = httpClient;
        this.loadingData = false;
        this.loadingMessages = [];
        this.reportName = this.params.get('reportName');
        this.reportId = this.params.get('reportName');
        this.user.getCurrentUser().then(function (currentUser) {
            _this.currentUser = currentUser;
            _this.loadingSelectedReport();
        });
    }
    ReportParameterSelectionPage.prototype.loadingSelectedReport = function () {
        var _this = this;
        this.loadingData = true;
        this.loadingMessages = [];
        this.setLoadingMessages('Loading selected report');
        var resource = 'reports';
        var attribute = 'id';
        var attributeValue = [];
        attributeValue.push(this.reportId);
        this.sqlLite.getDataFromTableByAttributes(resource, attribute, attributeValue, this.currentUser.currentDatabase).then(function (selectedReportList) {
            _this.selectedReport = selectedReportList[0];
            _this.loadingData = false;
        }, function (error) {
            _this.loadingData = false;
            _this.setToasterMessage('Fail to load selected report');
        });
    };
    ReportParameterSelectionPage.prototype.setLoadingMessages = function (message) {
        this.loadingMessages.push(message);
    };
    ReportParameterSelectionPage.prototype.setToasterMessage = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000
        });
        toast.present();
    };
    ReportParameterSelectionPage.prototype.setStickToasterMessage = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            showCloseButton: true
        });
        toast.present();
    };
    ReportParameterSelectionPage = __decorate([
        core_1.Component({
            templateUrl: 'build/pages/report-parameter-selection/report-parameter-selection.html',
            providers: [user_1.User, app_provider_1.AppProvider, http_client_1.HttpClient, sql_lite_1.SqlLite],
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavParams, ionic_angular_1.NavController, ionic_angular_1.ToastController, user_1.User, app_provider_1.AppProvider, sql_lite_1.SqlLite, http_client_1.HttpClient])
    ], ReportParameterSelectionPage);
    return ReportParameterSelectionPage;
})();
exports.ReportParameterSelectionPage = ReportParameterSelectionPage;
