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
var dashboard_home_1 = require('../dashboard-home/dashboard-home');
var data_entry_home_1 = require('../data-entry-home/data-entry-home');
var event_capture_home_1 = require('../event-capture-home/event-capture-home');
var report_home_1 = require('../report-home/report-home');
var tracker_capture_home_1 = require('../tracker-capture-home/tracker-capture-home');
/*
  Generated class for the AppsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
var AppsPage = (function () {
    function AppsPage(navCtrl) {
        this.navCtrl = navCtrl;
        this.viewMapperObject = {
            "dataEntry": data_entry_home_1.DataEntryHomePage,
            "eventCapture": event_capture_home_1.EventCaptureHomePage,
            "report": report_home_1.ReportHomePage,
            "dashboard": dashboard_home_1.DashboardHomePage,
            "trackerCapture": tracker_capture_home_1.TrackerCaptureHomePage
        };
    }
    AppsPage.prototype.goToView = function (viewName) {
        this.navCtrl.push(this.viewMapperObject[viewName]);
    };
    AppsPage = __decorate([
        core_1.Component({
            templateUrl: 'build/pages/apps/apps.html',
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavController])
    ], AppsPage);
    return AppsPage;
})();
exports.AppsPage = AppsPage;
