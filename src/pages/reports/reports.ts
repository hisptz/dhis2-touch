import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { AppProvider } from '../../providers/app/app';
import { StandardReportProvider } from '../../providers/standard-report/standard-report';
import { SqlLiteProvider } from '../../providers/sql-lite/sql-lite';
import { AppTranslationProvider } from '../../providers/app-translation/app-translation';

/**
 * Generated class for the ReportsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reports',
  templateUrl: 'reports.html'
})
export class ReportsPage implements OnInit {
  public isLoading: boolean = false;
  public loadingMessages: any = [];
  public currentUser: any;
  public reportList: any;
  public reportListCopy: any;
  icons: any = {};
  loadingMessage: string;
  translationMapper: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public user: UserProvider,
    public appProvider: AppProvider,
    public standardReportProvider: StandardReportProvider,
    private sqLite: SqlLiteProvider,
    private appTranslation: AppTranslationProvider
  ) {}

  ngOnInit() {
    this.icons.standardReport = 'assets/icon/reports.png';
    this.icons.dataSetReport = 'assets/icon/form.png';
    this.loadingMessages = [];
    this.isLoading = true;
    this.reportList = [];
    this.translationMapper = {};
    this.user.getCurrentUser().subscribe((user: any) => {
      this.currentUser = user;
      this.appTranslation
        .getTransalations(this.getValuesToTranslate())
        .subscribe(
          (data: any) => {
            this.translationMapper = data;
            this.loadReportsList(user);
          },
          error => {
            this.loadReportsList(user);
          }
        );
    });
  }

  loadReportsList(user) {
    let key = 'Discovering reports';
    this.loadingMessage = this.translationMapper[key]
      ? this.translationMapper[key]
      : key;
    this.standardReportProvider.getReportList(user).subscribe(
      (reportList: any) => {
        this.reportList = reportList;
        this.reportListCopy = reportList;
        this.isLoading = false;
      },
      error => {
        this.appProvider.setNormalNotification('Fail  to discover reports');
        this.isLoading = false;
      }
    );
  }

  selectReport(report) {
    let parameter = {
      id: report.id,
      reportType: report.type,
      name: report.name,
      openFuturePeriods: report.openFuturePeriods,
      reportParams: report.reportParams,
      relativePeriods: report.relativePeriods
    };
    if (
      this.standardReportProvider.hasReportRequireParameterSelection(
        report.reportParams
      )
    ) {
      this.navCtrl.push('ReportParameterSelectionPage', parameter);
    } else {
      this.navCtrl.push('ReportViewPage', parameter);
    }
  }

  getFilteredList(ev: any) {
    let val = ev.target.value;
    this.reportList = this.reportListCopy;
    if (val && val.trim() != '') {
      this.reportList = this.reportList.filter((report: any) => {
        return report.name.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
    }
  }

  doRefresh(refresher) {
    refresher.complete();
    let key = 'Downloading reports from server';
    this.loadingMessage = this.translationMapper[key]
      ? this.translationMapper[key]
      : key;
    this.isLoading = true;
    let resource = 'reports';
    this.standardReportProvider
      .downloadReportsFromServer(this.currentUser)
      .subscribe(
        (response: any) => {
          key = 'Preparing local storage for updates';
          this.loadingMessage = this.translationMapper[key]
            ? this.translationMapper[key]
            : key;
          this.sqLite
            .dropTable(resource, this.currentUser.currentDatabase)
            .subscribe(
              () => {
                this.sqLite
                  .createTable(resource, this.currentUser.currentDatabase)
                  .subscribe(
                    () => {
                      key = 'Saving reports from server';
                      this.loadingMessage = this.translationMapper[key]
                        ? this.translationMapper[key]
                        : key;
                      this.standardReportProvider
                        .saveReportsFromServer(
                          response[resource],
                          this.currentUser
                        )
                        .subscribe(
                          () => {
                            this.loadReportsList(this.currentUser);
                          },
                          error => {
                            this.isLoading = true;
                            this.appProvider.setNormalNotification(
                              'Fail to save reports'
                            );
                          }
                        );
                    },
                    error => {
                      this.isLoading = true;
                      this.appProvider.setNormalNotification(
                        'Fail to prepare local storage for updates'
                      );
                    }
                  );
              },
              error => {
                this.isLoading = true;
                this.appProvider.setNormalNotification(
                  'Fail to prepare local storage for updates'
                );
              }
            );
        },
        error => {
          this.isLoading = true;
          this.appProvider.setNormalNotification('Fail to download reports');
        }
      );
  }

  getValuesToTranslate() {
    return [
      'Discovering reports',
      'Downloading reports from server',
      'Preparing local storage for updates',
      'Saving reports from server',
      'there is no report to select'
    ];
  }
}
