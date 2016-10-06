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
var tabs_1 = require('../tabs/tabs');
var app_1 = require('../../providers/app/app');
var user_1 = require('../../providers/user/user');
var http_client_1 = require('../../providers/http-client/http-client');
var sql_lite_1 = require("../../providers/sql-lite/sql-lite");
/*
  Generated class for the LoginPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
var LoginPage = (function () {
    function LoginPage(navCtrl, sqlLite, user, app, httpClient, toastCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.sqlLite = sqlLite;
        this.user = user;
        this.app = app;
        this.httpClient = httpClient;
        this.toastCtrl = toastCtrl;
        this.loginData = {};
        this.loadingData = false;
        this.loadingMessages = [];
        this.loginData.logoUrl = 'img/logo.png';
        this.user.getCurrentUser().then(function (user) {
            _this.reAuthenticateUser(user);
        });
    }
    LoginPage.prototype.reAuthenticateUser = function (user) {
        if (user) {
            if (user.isLogin) {
                this.navCtrl.setRoot(tabs_1.TabsPage);
            }
            else if (user.serverUrl) {
                this.loginData.serverUrl = user.serverUrl;
                if (user.username) {
                    this.loginData.username = user.username;
                }
            }
        }
    };
    LoginPage.prototype.login = function () {
        var _this = this;
        if (this.loginData.serverUrl) {
            this.app.getFormattedBaseUrl(this.loginData.serverUrl)
                .then(function (formattedBaseUrl) {
                _this.loginData.serverUrl = formattedBaseUrl;
                if (!_this.loginData.username) {
                    _this.setToasterMessage('Please Enter username');
                }
                else if (!_this.loginData.password) {
                    _this.setToasterMessage('Please Enter password');
                }
                else {
                    _this.loadingData = true;
                    _this.loadingMessages = [];
                    _this.app.getDataBaseName(_this.loginData.serverUrl).then(function (databaseName) {
                        _this.setLoadingMessages('Opening database');
                        _this.sqlLite.generateTables(databaseName).then(function () {
                            _this.loginData.currentDatabase = databaseName;
                            _this.setLoadingMessages('Authenticating user');
                            _this.user.setCurrentUser(_this.loginData).then(function (user) {
                                var fields = "fields=[:all],userCredentials[userRoles[name,dataSets[id,name],programs[id,name]]";
                                _this.httpClient.get('/api/me.json?' + fields, user).subscribe(function (data) {
                                    data = data.json();
                                    _this.setStickToasterMessage('success to login ');
                                    _this.user.setUserData(data).then(function (userData) {
                                        _this.loginData.isLogin = true;
                                        _this.user.setCurrentUser(_this.loginData).then(function (user) {
                                            _this.navCtrl.setRoot(tabs_1.TabsPage);
                                        });
                                    });
                                }, function (err) {
                                    _this.loadingData = false;
                                    _this.setStickToasterMessage('Fail to login Fail to load System information, please checking your network connection');
                                    console.log(err);
                                });
                            }).catch(function (err) {
                                console.log(JSON.stringify(err));
                                _this.loadingData = false;
                                _this.setStickToasterMessage('Fail set current user');
                            });
                        }, function () {
                            //error on create database
                            _this.loadingData = false;
                            _this.setStickToasterMessage('Fail to open local storage');
                        });
                    });
                }
            });
        }
        else {
            this.setToasterMessage('Please Enter server url');
        }
    };
    LoginPage.prototype.setLoadingMessages = function (message) {
        this.loadingMessages.push(message);
    };
    LoginPage.prototype.setToasterMessage = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000
        });
        toast.present();
    };
    LoginPage.prototype.setStickToasterMessage = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            showCloseButton: true
        });
        toast.present();
    };
    LoginPage = __decorate([
        core_1.Component({
            templateUrl: 'build/pages/login/login.html',
            providers: [app_1.AppProvider, http_client_1.HttpClient, user_1.User, sql_lite_1.SqlLite]
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavController, sql_lite_1.SqlLite, user_1.User, app_1.AppProvider, http_client_1.HttpClient, ionic_angular_1.ToastController])
    ], LoginPage);
    return LoginPage;
})();
exports.LoginPage = LoginPage;
