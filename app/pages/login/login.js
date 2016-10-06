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
var app_provider_1 = require('../../providers/app-provider/app-provider');
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
                                    _this.user.setUserData(data).then(function (userData) {
                                        _this.setLoadingMessages('Loading system information');
                                        _this.httpClient.get('/api/system/info', user).subscribe(function (data) {
                                            data = data.json();
                                            _this.user.setCurrentUserSystemInformation(data).then(function () {
                                                _this.downloadingOrganisationUnits(userData);
                                            }, function (error) {
                                                _this.loadingData = false;
                                                _this.setLoadingMessages('Fail to set system information');
                                            });
                                        }, function (error) {
                                            _this.loadingData = false;
                                            _this.setLoadingMessages('Fail to load system information');
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
    LoginPage.prototype.downloadingOrganisationUnits = function (userData) {
        var _this = this;
        this.setLoadingMessages('Downloading assigned organisation data');
        var resource = 'organisationUnits';
        var ids = [];
        userData.organisationUnits.forEach(function (organisationUnit) {
            if (organisationUnit.id) {
                ids.push(organisationUnit.id);
            }
        });
        var tableMetadata = this.sqlLite.getDataBaseStructure()[resource];
        var fields = tableMetadata.fields;
        this.app.downloadMetadataByResourceIds(this.loginData, resource, ids, fields, null).then(function (response) {
            _this.setLoadingMessages('Start saving organisation data');
            _this.app.saveMetadata(resource, response, _this.loginData.currentDatabase).then(function () {
                _this.downloadingDataSets();
            }, function (error) {
                _this.loadingData = false;
                _this.setStickToasterMessage('Fail to save organisation data. ' + JSON.stringify(error));
            });
        }, function (error) {
            _this.loadingData = false;
            _this.setStickToasterMessage('Fail to download organisation data. ' + JSON.stringify(error));
        });
    };
    LoginPage.prototype.downloadingDataSets = function () {
        var _this = this;
        this.setLoadingMessages('Downloading data entry forms');
        var resource = 'dataSets';
        var tableMetadata = this.sqlLite.getDataBaseStructure()[resource];
        var fields = tableMetadata.fields;
        this.app.downloadMetadata(this.loginData, resource, null, fields, null).then(function (response) {
            _this.setLoadingMessages('Start saving ' + response[resource].length + ' data entry form');
            _this.app.saveMetadata(resource, response[resource], _this.loginData.currentDatabase).then(function () {
                _this.downloadingSections();
            }, function (error) {
                _this.loadingData = false;
                _this.setStickToasterMessage('Fail to save data entry form. ' + JSON.stringify(error));
            });
        }, function (error) {
            _this.loadingData = false;
            _this.setStickToasterMessage('Fail to download data entry form. ' + JSON.stringify(error));
        });
    };
    LoginPage.prototype.downloadingSections = function () {
        var _this = this;
        this.setLoadingMessages('Downloading data entry form sections');
        var resource = 'sections';
        var tableMetadata = this.sqlLite.getDataBaseStructure()[resource];
        var fields = tableMetadata.fields;
        this.app.downloadMetadata(this.loginData, resource, null, fields, null).then(function (response) {
            _this.setLoadingMessages('Start saving ' + response[resource].length + ' data entry form sections');
            _this.app.saveMetadata(resource, response[resource], _this.loginData.currentDatabase).then(function () {
                _this.downloadingIndicators();
            }, function (error) {
                _this.loadingData = false;
                _this.setStickToasterMessage('Fail to save data entry form sections. ' + JSON.stringify(error));
            });
        }, function (error) {
            _this.loadingData = false;
            _this.setStickToasterMessage('Fail to download data entry form sections. ' + JSON.stringify(error));
        });
    };
    LoginPage.prototype.downloadingIndicators = function () {
        var _this = this;
        this.setLoadingMessages('Downloading indicators');
        var resource = 'indicators';
        var tableMetadata = this.sqlLite.getDataBaseStructure()[resource];
        var fields = tableMetadata.fields;
        this.app.downloadMetadata(this.loginData, resource, null, fields, null).then(function (response) {
            _this.setLoadingMessages('Start saving ' + response[resource].length + ' indicators');
            _this.app.saveMetadata(resource, response[resource], _this.loginData.currentDatabase).then(function () {
                _this.downloadingReports();
            }, function (error) {
                _this.loadingData = false;
                _this.setStickToasterMessage('Fail to save indicators. ' + JSON.stringify(error));
            });
        }, function (error) {
            _this.loadingData = false;
            _this.setStickToasterMessage('Fail to download indicators. ' + JSON.stringify(error));
        });
    };
    LoginPage.prototype.downloadingReports = function () {
        var _this = this;
        this.setLoadingMessages('Downloading reports');
        var resource = 'reports';
        var tableMetadata = this.sqlLite.getDataBaseStructure()[resource];
        var fields = tableMetadata.fields;
        this.app.downloadMetadata(this.loginData, resource, null, fields, null).then(function (response) {
            _this.setLoadingMessages('Start saving ' + response[resource].length + ' reports');
            _this.app.saveMetadata(resource, response[resource], _this.loginData.currentDatabase).then(function () {
                _this.downloadingConstants();
            }, function (error) {
                _this.loadingData = false;
                _this.setStickToasterMessage('Fail to save reports. ' + JSON.stringify(error));
            });
        }, function (error) {
            _this.loadingData = false;
            _this.setStickToasterMessage('Fail to download reports. ' + JSON.stringify(error));
        });
    };
    LoginPage.prototype.downloadingConstants = function () {
        var _this = this;
        this.setLoadingMessages('Downloading constants');
        var resource = 'constants';
        var tableMetadata = this.sqlLite.getDataBaseStructure()[resource];
        var fields = tableMetadata.fields;
        this.app.downloadMetadata(this.loginData, resource, null, fields, null).then(function (response) {
            _this.setLoadingMessages('Start saving ' + response[resource].length + ' constants');
            _this.app.saveMetadata(resource, response[resource], _this.loginData.currentDatabase).then(function () {
                _this.setLandingPage();
            }, function (error) {
                _this.loadingData = false;
                _this.setStickToasterMessage('Fail to save constants. ' + JSON.stringify(error));
            });
        }, function (error) {
            _this.loadingData = false;
            _this.setStickToasterMessage('Fail to download constants. ' + JSON.stringify(error));
        });
    };
    LoginPage.prototype.setLandingPage = function () {
        var _this = this;
        this.loginData.isLogin = true;
        this.user.setCurrentUser(this.loginData).then(function (user) {
            _this.navCtrl.setRoot(tabs_1.TabsPage);
        });
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
            providers: [app_provider_1.AppProvider, http_client_1.HttpClient, user_1.User, sql_lite_1.SqlLite]
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavController, sql_lite_1.SqlLite, user_1.User, app_provider_1.AppProvider, http_client_1.HttpClient, ionic_angular_1.ToastController])
    ], LoginPage);
    return LoginPage;
})();
exports.LoginPage = LoginPage;
