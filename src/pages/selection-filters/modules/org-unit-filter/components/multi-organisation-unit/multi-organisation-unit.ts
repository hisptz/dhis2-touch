import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { UserProvider } from '../../../../../../providers/user/user';
import { OrganisationUnitsProvider } from '../../../../../../providers/organisation-units/organisation-units';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

/**
 * Generated class for the Multi OrganisationUnitComponent component.
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
  @Output() activateOrganisationUnit = new EventEmitter();
  @Output() deactivateOrganisationUnit = new EventEmitter();
  hasOrgUnitChildrenOpened: any;
  toggledOuIds: Array<string>;
  hasError: boolean;
  loadingMessage: string;
  emptyMessage: string;
  errorMessage: string;
  currentUser: any;
  translationMapper: any;
  private _isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  isLoading$: Observable<boolean>;
  organisationUnits: any[];

  constructor(private userProvider: UserProvider,
    private organisationUnitProvider: OrganisationUnitsProvider) {
    this.loadingMessage = 'Discovering assigned organisation units';
    this.emptyMessage = 'Currently there is on assigned organisation unit on local storage, Please metadata on sync app';
    this.hasOrgUnitChildrenOpened = {};
    this.organisationUnits = [];
    this.toggledOuIds = [];
    this.isLoading$ = this._isLoading$.asObservable();
  }

  ngOnInit() {
    this.userProvider.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      this.loadingOrganisationUnits();
    });
  }

  loadingOrganisationUnits() {
    this.hasOrgUnitChildrenOpened = {};
    this.organisationUnitProvider.getOrganisationUnits(this.currentUser).subscribe(
      (organisationUnits: any) => {
        this.organisationUnits = _.filter(_.map(organisationUnits, (orgUnit: any) => {
          return {
            id: orgUnit.id,
            name: orgUnit.name,
            level: orgUnit.level,
            isExpanded: true,
            selected: _.some(this.selectedOrgUnits, selectedOrgUnit => selectedOrgUnit.id === orgUnit.id),
            children: _.map(orgUnit.children || [], orgUnitChild => orgUnitChild.id)
          }
        }), orgUnit => orgUnit);
        this._isLoading$.next(false);
      },error => {
        this.errorMessage = error;
        this.hasError = true;
        this._isLoading$.next(false);
      }
    );
  }

  onDeactivateOu(organisationUnit) {
    this.deactivateOrganisationUnit.emit({
      id: organisationUnit.id,
      name: organisationUnit.name,
      level: organisationUnit.level
    });
  }

  onActivateOu(organisationUnit) {
    this.activateOrganisationUnit.emit({
      id: organisationUnit.id,
      name: organisationUnit.name,
      level: organisationUnit.level
    });
  }
}
