import { Component, OnInit } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';
import { CurrentUser } from '../../models/currentUser';
import { UserProvider } from '../../providers/user/user';
import { OrganisationUnitsProvider } from '../../providers/organisation-units/organisation-units';

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
  currentValue: string;
  ouIdsWithAssigments: any;

  constructor(
    private viewCtrl: ViewController,
    private userProvider: UserProvider,
    private organisationUnitProvider: OrganisationUnitsProvider,
    private navParams: NavParams
  ) {
    this.arrayOfOrganisationUnitsArray = [];
    this.arrayOfOrganisationUnitsArrayBackup = [];
    this.title = 'Organisation Unit search';
    this.isLoading = true;
    this.currentPage = 1;
    this.currentValue = '';
    this.ouIdsWithAssigments = [];
  }

  ngOnInit() {
    const data = this.navParams.get('data');
    const { ouIdsWithAssigments } = data;
    if (ouIdsWithAssigments) {
      this.ouIdsWithAssigments = ouIdsWithAssigments;
    }
    this.userProvider.getCurrentUser().subscribe(
      (user: CurrentUser) => {
        console.info(JSON.stringify(user));
        this.isLoading = false;
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
      const options = this.arrayOfOrganisationUnitsArrayBackup.filter(
        (option: any) => {
          return option.name.toLowerCase().indexOf(value.toLowerCase()) > -1;
        }
      );
      this.arrayOfOrganisationUnitsArray = this.getOptionsWithPaginations(
        options
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

  selectOption(option) {
    this.viewCtrl.dismiss(option);
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

  getOptionsWithPaginations(options) {
    let pageNumber = 0;
    const pageSize = 250;
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
