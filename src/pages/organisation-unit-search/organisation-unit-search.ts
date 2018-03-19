import { Component, OnInit } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';
import { CurrentUser } from '../../models/currentUser';
import { UserProvider } from '../../providers/user/user';
import { OrganisationUnitsProvider } from '../../providers/organisation-units/organisation-units';
import { AppProvider } from '../../providers/app/app';

/**
 * Generated class for the OrganisationUnitSearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-organisation-unit-search',
  templateUrl: 'organisation-unit-search.html'
})
export class OrganisationUnitSearchPage implements OnInit {
  title: string;
  arrayOfOrganisationUnitsArray: Array<any>;
  arrayOfOrganisationUnitsArrayBackup: Array<any>;
  isLoading: boolean;
  currentPage: number;
  currentSelectedOrgUnitName: string;
  ouIdsWithAssigments: any;
  organisationUnits: any;
  filterType: string;

  constructor(
    private viewCtrl: ViewController,
    private userProvider: UserProvider,
    private organisationUnitProvider: OrganisationUnitsProvider,
    private navParams: NavParams,
    private appProvider: AppProvider
  ) {
    this.arrayOfOrganisationUnitsArray = [];
    this.arrayOfOrganisationUnitsArrayBackup = [];
    this.title = 'Organisation Unit search';
    this.isLoading = true;
    this.currentPage = 1;
    this.currentSelectedOrgUnitName = '';
    this.ouIdsWithAssigments = [];
  }

  ngOnInit() {
    const data = this.navParams.get('data');
    const { currentSelectedOrgUnitName } = data;
    const { ouIdsWithAssigments } = data;
    const { filterType } = data;
    if (filterType) {
      this.filterType = filterType;
    }
    if (currentSelectedOrgUnitName) {
      this.currentSelectedOrgUnitName = currentSelectedOrgUnitName;
    }
    if (ouIdsWithAssigments) {
      this.ouIdsWithAssigments = ouIdsWithAssigments;
    }
    this.userProvider.getCurrentUser().subscribe(
      (user: CurrentUser) => {
        this.organisationUnitProvider.getAllOrganisationUnits(user).subscribe(
          (organisationUnits: any) => {
            this.organisationUnits = organisationUnits;
            this.arrayOfOrganisationUnitsArray = this.getOrganisationUnitsWithPaginations(
              organisationUnits
            );
            this.arrayOfOrganisationUnitsArrayBackup = this.arrayOfOrganisationUnitsArray;
            this.isLoading = false;
          },
          error => {
            this.isLoading = false;
            console.log(JSON.stringify(error));
          }
        );
      },
      error => {
        this.isLoading = false;
        console.log(JSON.stringify(error));
      }
    );
  }

  getItems(event: any) {
    let value = event.target.value;
    if (value && value.trim() != '') {
      const backUpOrganisationUnits = this.organisationUnits;
      const filteredOrganisationUnits = backUpOrganisationUnits.filter(
        (organisationUnit: any) => {
          return (
            organisationUnit.name.toLowerCase().indexOf(value.toLowerCase()) >
            -1
          );
        }
      );
      this.arrayOfOrganisationUnitsArray = this.getOrganisationUnitsWithPaginations(
        filteredOrganisationUnits
      );
      this.currentPage = 1;
    } else {
      if (
        this.arrayOfOrganisationUnitsArray.length !=
        this.arrayOfOrganisationUnitsArrayBackup.length
      ) {
        this.arrayOfOrganisationUnitsArray = this.arrayOfOrganisationUnitsArrayBackup;
        this.currentPage = 1;
      }
    }
  }

  selectOrganisationUnit(selectedOrganisationUnit) {
    if (
      this.filterType &&
      this.ouIdsWithAssigments.length > 0 &&
      this.ouIdsWithAssigments.indexOf(selectedOrganisationUnit.id) == -1
    ) {
      if (this.filterType == 'dataSets') {
        this.appProvider.setNormalNotification(
          'There is no entry form assigned to selected organisation unit, please select others or contact you help desk',
          8 * 1000
        );
      } else if (
        this.filterType == 'WITHOUT_REGISTRATION' ||
        this.filterType == 'WITH_REGISTRATION'
      ) {
        this.appProvider.setNormalNotification(
          'There is no program assigned to selected organisation unit, please select others or contact you help desk',
          8 * 1000
        );
      }
    } else {
      this.organisationUnitProvider.setLastSelectedOrganisationUnitUnit(
        selectedOrganisationUnit
      );
      this.viewCtrl.dismiss(selectedOrganisationUnit);
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  previousPage() {
    this.currentPage--;
  }

  nextPage() {
    if (this.currentPage < this.arrayOfOrganisationUnitsArray.length) {
      this.currentPage++;
    }
  }

  getOrganisationUnitsWithPaginations(options) {
    let pageNumber = 0;
    const pageSize = 200;
    let array = [];
    while (
      this.getSubArryByPagination(options, pageSize, pageNumber).length > 0
    ) {
      array.push(this.getSubArryByPagination(options, pageSize, pageNumber));
      pageNumber++;
    }
    return array;
  }

  getSubArryByPagination(array, pageSize, pageNumber) {
    return array.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize);
  }

  trackByFn(index, item) {
    return item.id;
  }
}
