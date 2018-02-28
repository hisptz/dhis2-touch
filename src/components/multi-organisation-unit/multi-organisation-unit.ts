import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserProvider } from '../../providers/user/user';
import { AppProvider } from '../../providers/app/app';
import { OrganisationUnitsProvider } from '../../providers/organisation-units/organisation-units';

/**
 * Generated class for the MultiOrganisationUnitComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'multi-organisation-unit',
  templateUrl: 'multi-organisation-unit.html'
})
export class MultiOrganisationUnitComponent implements OnInit {
  @Input() selectedOrgUnits;
  @Output() activate = new EventEmitter();
  @Output() deactivate = new EventEmitter();
  hasOrgUnitChildrenOpened: any;
  toggledOuIds: Array<string>;
  isLoading: boolean;
  loadingMessage: string;
  emptyMessage: string;
  currentUser: any;
  translationMapper: any;
  organisationUnits: any;

  constructor(
    private userProvider: UserProvider,
    private appProvider: AppProvider,
    private organisationUnitProvider: OrganisationUnitsProvider
  ) {}

  ngOnInit() {
    this.hasOrgUnitChildrenOpened = {};
    this.translationMapper = {};
    this.organisationUnits = [];
    this.toggledOuIds = [];
    this.isLoading = true;
    this.userProvider.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      this.loadingOrganisationUnits();
    });
  }

  loadingOrganisationUnits() {
    let key = 'Discovering assigned organisation units';
    this.loadingMessage = this.translationMapper[key]
      ? this.translationMapper[key]
      : key;
    this.hasOrgUnitChildrenOpened = {};
    this.organisationUnitProvider
      .getOrganisationUnits(this.currentUser)
      .subscribe(
        (organisationUnits: any) => {
          if (organisationUnits && organisationUnits.length > 0) {
            this.organisationUnits = organisationUnits;
            this.isLoading = false;
          } else {
            this.isLoading = false;
            key =
              'Currently there is on assigned organisation unit on local storage, Please metadata on sync app';
            this.emptyMessage = this.translationMapper[key]
              ? this.translationMapper[key]
              : key;
            this.appProvider.setNormalNotification(key);
          }
        },
        error => {
          console.log(JSON.stringify(error));
          this.isLoading = false;
          key = 'Fail to discover organisation units';
          this.emptyMessage = this.translationMapper[key]
            ? this.translationMapper[key]
            : key;
          this.appProvider.setNormalNotification(key);
        }
      );
  }

  //node.data
}
