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
var settings_1 = require('../settings/settings');
var profile_1 = require('../profile/profile');
var help_1 = require('../help/help');
var about_1 = require('../about/about');
var update_manager_1 = require('../update-manager/update-manager');
var login_1 = require('../login/login');
var user_1 = require('../../providers/user/user');
/*
  Generated class for the AccountPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
var AccountPage = (function () {
    function AccountPage(navCtrl, user, app) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.user = user;
        this.app = app;
        this.user.getCurrentUser().then(function (user) {
            _this.currentUser = user;
        });
        this.generateViewAction();
    }
    AccountPage.prototype.generateViewAction = function () {
        this.viewMapperObject = {
            "profile": profile_1.ProfilePage,
            "about": about_1.AboutPage,
            "help": help_1.HelpPage,
            "settings": settings_1.SettingsPage,
            "updateManager": update_manager_1.UpdateManagerPage
        };
    };
    AccountPage.prototype.goToView = function (viewName) {
        this.navCtrl.push(this.viewMapperObject[viewName]);
    };
    AccountPage.prototype.logOut = function () {
        var _this = this;
        this.currentUser.isLogin = false;
        //todo delete org unit o a given user
        this.user.setCurrentUser(this.currentUser).then(function (user) {
            _this.app.getRootNav().setRoot(login_1.LoginPage);
        }, function (error) { });
    };
    AccountPage = __decorate([
        core_1.Component({
            templateUrl: 'build/pages/account/account.html',
            providers: [user_1.User]
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavController, user_1.User, ionic_angular_1.App])
    ], AccountPage);
    return AccountPage;
})();
exports.AccountPage = AccountPage;
