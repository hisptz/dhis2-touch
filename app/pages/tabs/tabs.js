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
var apps_1 = require('../apps/apps');
var account_1 = require('../account/account');
var TabsPage = (function () {
    function TabsPage() {
        // this tells the tabs component which Pages
        // should be each tab's root Page
        this.tab1Root = apps_1.AppsPage;
        this.tab2Root = account_1.AccountPage;
    }
    TabsPage = __decorate([
        core_1.Component({
            templateUrl: 'build/pages/tabs/tabs.html'
        }), 
        __metadata('design:paramtypes', [])
    ], TabsPage);
    return TabsPage;
})();
exports.TabsPage = TabsPage;
