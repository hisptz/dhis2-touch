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
import {
  IonicPage,
  ModalController,
  NavController,
  NavParams
} from 'ionic-angular';
import { UserProvider } from '../../../providers/user/user';
import { OrganisationUnitsProvider } from '../../../providers/organisation-units/organisation-units';
import { PeriodSelectionProvider } from '../../../providers/period-selection/period-selection';
import { StandardReportProvider } from '../../../providers/standard-report/standard-report';
import { Store } from '@ngrx/store';
import { State, getCurrentUserColorSettings } from '../../../store';
import { Observable } from 'rxjs';

/**
 * Generated class for the ReportParameterSelectionPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-report-parameter-selection',
  templateUrl: 'report-parameter-selection.html'
})
export class ReportParameterSelectionPage implements OnInit {
  reportId: string;
  reportName: string;
  reportType: string;
  reportParams: any;
  currentUser: any;
  loadingData: boolean = false;
  selectedOrganisationUnitLabel: string;
  selectedPeriodLabel: string;
  selectedPeriod: any = {};
  selectedOrgUnit: any;
  icons: any = {};
  reportPeriodType: any;
  currentPeriodOffset: number = 0;
  isAllReportParameterSet: boolean;
  openFuturePeriods: any;
  colorSettings$: Observable<any>;

  constructor(
    private store: Store<State>,
    private user: UserProvider,
    private modalCtrl: ModalController,
    private params: NavParams,
    private navCtrl: NavController,
    private organisationUnitsProvider: OrganisationUnitsProvider,
    private periodSelectionProvider: PeriodSelectionProvider,
    private standardReportProvider: StandardReportProvider
  ) {
    this.colorSettings$ = this.store.select(getCurrentUserColorSettings);
    this.icons.orgUnit = 'assets/icon/orgUnit.png';
    this.icons.period = 'assets/icon/period.png';
    this.icons.report = 'assets/icon/reports.png';
    this.isAllReportParameterSet = false;
  }

  ngOnInit() {
    this.openFuturePeriods = this.params.get('openFuturePeriods');
    this.reportName = this.params.get('name');
    this.reportId = this.params.get('id');
    this.reportParams = this.params.get('reportParams');
    this.reportType = this.params.get('reportType');
    this.reportPeriodType = this.standardReportProvider.getReportPeriodType(
      this.params.get('relativePeriods')
    );
    this.user.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      this.organisationUnitsProvider
        .getLastSelectedOrganisationUnitUnit(user)
        .subscribe(lastSelectedOrgunit => {
          this.selectedOrgUnit = lastSelectedOrgunit;
          let periods = this.periodSelectionProvider.getPeriods(
            this.reportPeriodType,
            this.openFuturePeriods,
            this.currentPeriodOffset
          );
          if (periods && periods.length > 0) {
            this.selectedPeriod = periods[0];
          }
          this.updateReportParameterSelections();
        });
    });
  }

  updateReportParameterSelections() {
    if (this.selectedOrgUnit && this.selectedOrgUnit.id) {
      this.selectedOrgUnit = this.organisationUnitsProvider.lastSelectedOrgUnit;
      this.selectedOrganisationUnitLabel = this.selectedOrgUnit.name;
    } else {
      this.selectedOrganisationUnitLabel = 'Touch to select organisation unit';
    }
    if (this.selectedPeriod && this.selectedPeriod.name) {
      this.selectedPeriodLabel = this.selectedPeriod.name;
    } else {
      this.selectedPeriodLabel = 'Touch to select period';
    }
    this.isAllReportParameterSet = this.isAllReportParameterSelected();
  }

  openOrganisationUnitTree() {
    let modal = this.modalCtrl.create('OrganisationUnitSelectionPage', {});
    modal.onDidDismiss((selectedOrgUnit: any) => {
      if (selectedOrgUnit && selectedOrgUnit.id) {
        this.selectedOrgUnit = selectedOrgUnit;
        this.updateReportParameterSelections();
      }
    });
    modal.present();
  }

  openReportPeriodSelection() {
    if (this.selectedOrganisationUnitLabel) {
      let modal = this.modalCtrl.create('PeriodSelectionPage', {
        periodType: this.reportPeriodType,
        currentPeriodOffset: this.currentPeriodOffset,
        openFuturePeriods: this.openFuturePeriods,
        currentPeriod: this.selectedPeriod
      });
      modal.onDidDismiss((response: any) => {
        if (response && response.selectedPeriod) {
          this.selectedPeriod = response.selectedPeriod;
          this.currentPeriodOffset = response.currentPeriodOffset;
          this.updateReportParameterSelections();
        }
      });
      modal.present();
    }
  }

  isAllReportParameterSelected() {
    let isAllReportParameterSet = true;
    if (this.reportParams.paramOrganisationUnit) {
      if (!(this.selectedOrgUnit && this.selectedOrgUnit.id)) {
        isAllReportParameterSet = false;
      }
    }
    if (this.reportParams.paramReportingPeriod) {
      if (!(this.selectedPeriod && this.selectedPeriod.name)) {
        isAllReportParameterSet = false;
      }
    }
    return isAllReportParameterSet;
  }

  goToView() {
    let parameter = {
      id: this.reportId,
      name: this.reportName,
      reportType: this.reportType,
      period:
        this.reportParams.paramReportingPeriod &&
        this.selectedPeriod &&
        this.selectedPeriod.name
          ? this.selectedPeriod
          : null,
      organisationUnit:
        this.reportParams.paramOrganisationUnit &&
        this.selectedOrgUnit &&
        this.selectedOrgUnit.id
          ? this.selectedOrgUnit
          : null,
      organisationUnitChildren: []
    };
    this.navCtrl.push('ReportViewPage', parameter);
  }
}
