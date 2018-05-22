import {
  Component, EventEmitter, Input, OnDestroy, Output,
} from '@angular/core';
import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-org-unit-filter',
  templateUrl: './org-unit-filter.component.html'
})
export class OrgUnitFilterComponent implements OnDestroy {

  @Input() selectedOrgUnits: any[];
  @Input() orgUnitTreeHeight: string;

  private _readableSelectedOrgUnits$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  readableSelectedOrgUnits$: Observable<string>;
  @Output() orgUnitUpdate: EventEmitter<any> = new EventEmitter<any>();
  @Output() orgUnitClose: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
    this.orgUnitTreeHeight = '270px';
    this.readableSelectedOrgUnits$ = this._readableSelectedOrgUnits$.asObservable();
  }

  ngOnDestroy() {
    this.orgUnitClose.emit({
      dimension: 'ou',
      items: this.selectedOrgUnits
    });
  }

  onActiveOrgUnit(orgUnit) {
    this.selectedOrgUnits = [...this.getUpdatedSelectedOrgUnits(this.selectedOrgUnits, orgUnit, 'activate')];
  }

  onDeactivateOrgUnit(orgUnit) {
    this.selectedOrgUnits = [...this.getUpdatedSelectedOrgUnits(this.selectedOrgUnits, orgUnit, 'deactivate')];
  }

  getUpdatedSelectedOrgUnits(selectedOrgUnits, orgUnit, action) {
    const correspondingOrgUnit = _.find(selectedOrgUnits, ['id', orgUnit.id]);
    const correspondingOrgUnitIndex = selectedOrgUnits.indexOf(correspondingOrgUnit);

    return correspondingOrgUnit ?
      action === 'activate' ? [
        ...this.selectedOrgUnits.slice(0, correspondingOrgUnitIndex), orgUnit,
        ...this.selectedOrgUnits.slice(correspondingOrgUnitIndex + 1)
      ] : [
        ...this.selectedOrgUnits.slice(0, correspondingOrgUnitIndex),
        ...this.selectedOrgUnits.slice(correspondingOrgUnitIndex + 1)
      ] : action === 'activate' ? [...selectedOrgUnits, orgUnit] : selectedOrgUnits;
  }

  onUpdate(e) {
    e.stopPropagation();
    this.orgUnitUpdate.emit({
      dimension: 'ou',
      items: this.selectedOrgUnits
    });
  }

  onClose(e) {
    e.stopPropagation();
    this.orgUnitClose.emit({
      dimension: 'ou',
      items: this.selectedOrgUnits
    });
  }
}
