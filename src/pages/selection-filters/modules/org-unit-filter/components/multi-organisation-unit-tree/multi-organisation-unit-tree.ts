import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { OrganisationUnitsProvider } from '../../../../../../providers/organisation-units/organisation-units';
import { AppTranslationProvider } from '../../../../../../providers/app-translation/app-translation';
import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

/**
 * Generated class for the MultiOrganisationUnitTreeComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'multi-organisation-unit-tree',
  templateUrl: 'multi-organisation-unit-tree.html'
})
export class MultiOrganisationUnitTreeComponent implements OnInit {
  @Input() toggledOuIds;
  @Input() organisationUnit;
  @Input() selectedOrgUnits;
  @Input() currentUser;
  @Input() hasOrgUnitChildrenOpened;

  // events
  @Output() activate = new EventEmitter();
  @Output() deactivate = new EventEmitter();

  seletectedOrganisationUnitIds: Array<string> = [];
  translationMapper: any;
  isOrganisationUnitsFetched: boolean = true;
  hasOrgUnitChildrenLoaded: boolean;

  organisationUnitChildren: any[];
  private _loadingOrganisationUnitChildren$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loadingOrganisationUnitChildren$: Observable<boolean>;
  organisationUnitChildrenLoaded: boolean;
  hasErrorOccurred: boolean;

  constructor(private organisationUnitProvider: OrganisationUnitsProvider) {
    this.organisationUnitChildren = [];
    this.organisationUnitChildrenLoaded = this.hasErrorOccurred = false;
    this.loadingOrganisationUnitChildren$ = this._loadingOrganisationUnitChildren$.asObservable();
  }

  ngOnInit() {
    if(this.organisationUnit && this.organisationUnit.isExpanded && this.organisationUnit.children.length > 0) {
      this.loadOrganisationUnitChildren()
    }
  }

  loadOrganisationUnitChildren() {
    this._loadingOrganisationUnitChildren$.next(true)
    this.organisationUnitChildrenLoaded = false;
    this.organisationUnitProvider.getOrganisationUnitsByIds(this.organisationUnit.children, this.currentUser).
      subscribe((organisationUnitChildren: any[]) => {
        this.organisationUnitChildren = _.filter(_.map(organisationUnitChildren, (orgUnit: any) => {
          const selectedOrgUnitIds = _.map(this.selectedOrgUnits, selectedOrgUnit => selectedOrgUnit.id);
          return {
            id: orgUnit.id,
            name: orgUnit.name,
            level: orgUnit.level,
            isExpanded: _.some(orgUnit.children || [], orgUnitChild => selectedOrgUnitIds.indexOf(orgUnitChild.id) !== -1),
            selected: _.some(this.selectedOrgUnits, selectedOrgUnit => selectedOrgUnit.id === orgUnit.id),
            children: _.map(orgUnit.children || [], orgUnitChild => orgUnitChild.id)
          };
        }), orgUnit => orgUnit);
        this._loadingOrganisationUnitChildren$.next(false);
        this.organisationUnitChildrenLoaded = true;
      }, error => {
        this.hasErrorOccurred = true;
        this._loadingOrganisationUnitChildren$.next(false)
      });
  }

  toggleTree() {
    this.organisationUnit.isExpanded = !this.organisationUnit.isExpanded;
    if (this.organisationUnit.isExpanded) {
      this.loadOrganisationUnitChildren();
    } else {
      this.organisationUnitChildren = []
    }
  }

  selectOrganisationUnit(organisationUnit) {
    if (organisationUnit.selected) {
      this.onDeactivateOu(organisationUnit);
    } else {
      this.onActivateOu(organisationUnit);
    }
    this.organisationUnit.selected = !this.organisationUnit.selected;
  }

  onDeactivateOu(organisationUnit) {
    this.deactivate.emit(organisationUnit);
  }

  onActivateOu(organisationUnit) {
    this.activate.emit(organisationUnit);
  }
}
