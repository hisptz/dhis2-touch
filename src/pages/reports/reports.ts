import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { AppProvider } from '../../providers/app/app';
import { StandardReportProvider } from '../../providers/standard-report/standard-report';
import { SqlLiteProvider } from '../../providers/sql-lite/sql-lite';
import { AppTranslationProvider } from '../../providers/app-translation/app-translation';
import * as _ from 'lodash';
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
  public loadingMessages: any = [];
  public currentUser: any;
  reportList: Array<any>;
  reportListCopy: Array<any>;
  currentPage: number;
  currentValue: string;
  isLoading: boolean = true;

  public numberItems: number = 10;
  public p: number = 1;
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
  ) {
    this.reportList = [];
    this.reportListCopy = [];
    this.isLoading = false;
    this.currentPage = 1;
    this.currentValue = '';
  }

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
                              'Failed to save reports'
                            );
                          }
                        );
                    },
                    error => {
                      this.isLoading = true;
                      this.appProvider.setNormalNotification(
                        'Failed to prepare local storage for updates'
                      );
                    }
                  );
              },
              error => {
                this.isLoading = true;
                this.appProvider.setNormalNotification(
                  'Failed to prepare local storage for updates'
                );
              }
            );
        },
        error => {
          this.isLoading = true;
          this.appProvider.setNormalNotification('Failed to download reports');
        }
      );
  }

  loadReportsList(user) {
    let key = 'Discovering reports';
    this.loadingMessage = this.translationMapper[key]
      ? this.translationMapper[key]
      : key;
    this.standardReportProvider.getReportList(user).subscribe(
      (reportList: any) => {
        const { reports } = reportList;
        const { currentValue } = reportList;
        this.reportList = reportList;
        this.reportListCopy = reportList;
        this.filteringReports('all');
        this.isLoading = false;
      },
      error => {
        this.appProvider.setNormalNotification('Fail  to discover reports');
        this.isLoading = false;
      }
    );
  }
  getFilteredList(ev: any) {
    let val = ev.target.value;
    this.reportList = this.reportListCopy;
    if (val && val.trim() != '') {
      const reports = this.reportList.filter((report: any) => {
        return report.name.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
      this.reportList = this.getReportsWithPaginations(reports);
      this.currentPage = 1;
    } else {
      if (this.reportList.length != this.reportListCopy.length) {
        this.reportList = this.reportListCopy;
        this.currentPage = 1;
      }
    }
  }

  trackByFn(index, item) {
    return item && item.id ? item.id : index;
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

  filteringReports(reportType: any) {
    if (reportType == 'all') {
      const reports = this.reportListCopy;
      this.reportList = this.getReportsWithPaginations(reports);
      this.currentPage = 1;
    } else {
      const reports = _.filter(this.reportListCopy, ['type', reportType]);
      this.reportList = this.getReportsWithPaginations(reports);
      this.currentPage = 1;
    }
  }
  previousPage() {
    this.currentPage--;
  }

  nextPage() {
    if (this.currentPage < this.reportList.length) {
      this.currentPage++;
    }
  }
  changenumberItems(Items: any) {
    this.numberItems = Items;
    this.reportList = this.getReportsPaginations(
      this.reportListCopy,
      this.numberItems
    );
    this.currentPage = 1;
  }
  getReportsWithPaginations(reports) {
    const pageSize = 10;
    return _.chunk(reports, pageSize);
  }
  getReportsPaginations(reportListCopy, numberItems) {
    return _.chunk(reportListCopy, numberItems);
  }
  getSubArryByPagination(array, pageSize, pageNumber) {
    return array.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize);
  }
}
