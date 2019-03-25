/*
 *
 * Copyright 2015 HISP Tanzania
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301, USA.
 *
 * @since 2015
 * @author Joseph Chingalo <profschingalo@gmail.com>
 *
 */
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { AppProvider } from '../../providers/app/app';
import { StandardReportProvider } from '../../providers/standard-report/standard-report';
import { SqlLiteProvider } from '../../providers/sql-lite/sql-lite';
import { AppTranslationProvider } from '../../providers/app-translation/app-translation';
import * as _ from 'lodash';
import { Store } from '@ngrx/store';
import { State, getCurrentUserColorSettings } from '../../store';
import { Observable } from 'rxjs';
import { CurrentUser } from '../../models';
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
  currentUser: CurrentUser;
  reportList: Array<any>;
  reportListCopy: Array<any>;
  currentPage: number;
  isLoading: boolean;
  loadingMessage: string;

  icons: any = {};

  colorSettings$: Observable<any>;

  constructor(
    private store: Store<State>,
    public navCtrl: NavController,
    public navParams: NavParams,
    public user: UserProvider,
    public appProvider: AppProvider,
    public standardReportProvider: StandardReportProvider,
    private sqLite: SqlLiteProvider
  ) {
    this.reportList = [];
    this.reportListCopy = [];
    this.isLoading = false;
    this.currentPage = 1;
    this.colorSettings$ = this.store.select(getCurrentUserColorSettings);
  }

  ngOnInit() {
    this.icons.standardReport = 'assets/icon/reports.png';
    this.icons.dataSetReport = 'assets/icon/form.png';
    this.isLoading = true;
    this.reportList = [];
    this.user.getCurrentUser().subscribe((user: any) => {
      this.currentUser = user;
      this.loadReportsList(user);
    });
  }

  loadReportsList(user) {
    this.loadingMessage = 'Discovering reports';
    this.standardReportProvider.getReportList(user).subscribe(
      (reportList: any) => {
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

  selectReport(report) {
    const parameter = {
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

  reloadReports(refresher) {
    refresher.complete();
    this.loadingMessage = 'Downloading reports from server';
    this.isLoading = true;
    let resource = 'reports';
    this.standardReportProvider
      .downloadReportsFromServer(this.currentUser)
      .subscribe(
        (response: any) => {
          this.loadingMessage = 'Preparing local storage for updates';
          this.sqLite
            .dropTable(resource, this.currentUser.currentDatabase)
            .subscribe(
              () => {
                this.sqLite
                  .createTable(resource, this.currentUser.currentDatabase)
                  .subscribe(
                    () => {
                      this.loadingMessage = 'Saving reports from server';

                      this.standardReportProvider
                        .saveReportsFromServer(response, this.currentUser)
                        .subscribe(
                          () => {
                            this.loadReportsList(this.currentUser);
                          },
                          () => {
                            this.isLoading = true;
                            this.appProvider.setNormalNotification(
                              'Failed to save reports'
                            );
                          }
                        );
                    },
                    () => {
                      this.isLoading = true;
                      this.appProvider.setNormalNotification(
                        'Failed to prepare local storage for updates'
                      );
                    }
                  );
              },
              () => {
                this.isLoading = true;
                this.appProvider.setNormalNotification(
                  'Failed to prepare local storage for updates'
                );
              }
            );
        },
        () => {
          this.isLoading = true;
          this.appProvider.setNormalNotification('Failed to download reports');
        }
      );
  }

  getFilteredReportList(event: any) {
    const value = event.target.value;
    const reportData = this.reportListCopy;
    if (value && value.trim() !== '') {
      const reports = reportData.filter((report: any) => {
        return report.name.toLowerCase().indexOf(value.toLowerCase()) > -1;
      });
      this.reportList = this.getReportsWithPaginations(reports);
      this.currentPage = 1;
    } else {
      if (this.reportList.length !== this.reportListCopy.length) {
        this.reportList = this.getReportsWithPaginations(reportData);
        this.currentPage = 1;
      }
    }
  }

  trackByFn(index, item) {
    return item && item.id ? item.id : index;
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

  getReportsWithPaginations(reports) {
    const pageSize = 10;
    return _.chunk(reports, pageSize);
  }

  getSubArryByPagination(array, pageSize, pageNumber) {
    return array.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize);
  }
}
