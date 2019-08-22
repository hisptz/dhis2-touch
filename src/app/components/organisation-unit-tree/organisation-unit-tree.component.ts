/*
 *
 * Copyright 2019 HISP Tanzania
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
 * @since 2019
 * @author Joseph Chingalo <profschingalo@gmail.com>
 *
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State, getCurrentUserColorSettings } from 'src/app/store';
import * as _ from 'lodash';
import { OrganisationUnit, AppColorObject } from 'src/models';
import { OrganisationUnitService } from 'src/app/services/organisation-unit.service';
import { ToasterMessagesService } from 'src/app/services/toaster-messages.service';

@Component({
  selector: 'app-organisation-unit-tree',
  templateUrl: './organisation-unit-tree.component.html',
  styleUrls: ['./organisation-unit-tree.component.scss']
})
export class OrganisationUnitTreeComponent implements OnInit {
  @Input() organisationUnit: OrganisationUnit;
  @Input() isOrganisationUnitToggled: any;
  @Input() selectedOrganisayionUnitIds: string[];

  @Output() selectOrganisationUnit = new EventEmitter();

  isLoading: boolean;
  colorSettings$: Observable<AppColorObject>;

  constructor(
    private store: Store<State>,
    private organisationUnitService: OrganisationUnitService,
    private toasterMessagesService: ToasterMessagesService
  ) {
    this.colorSettings$ = this.store.select(getCurrentUserColorSettings);
    this.isLoading = false;
  }

  ngOnInit() {
    this.isOrganisationUnitToggled = this.isOrganisationUnitToggled || {};
    if (this.organisationUnit && this.organisationUnit) {
      const { children } = this.organisationUnit;
      this.setOrganisationUnitChildren(children);
    }
  }

  async setOrganisationUnitChildren(children: OrganisationUnit[]) {
    const ids = _.map(children, (child: OrganisationUnit) => child.id);
    let organisationunits: OrganisationUnit[] = [];
    try {
      const ouChildren = await this.organisationUnitService.getOrganiisationUnitByIds(
        ids
      );
      organisationunits = _.orderBy(_.map(ouChildren, _.cloneDeep), 'name');
    } catch (error) {
      const message = `Error ${JSON.stringify(error)}`;
      console.log({ message });
      this.toasterMessagesService.showToasterMessage(message);
    } finally {
      this.organisationUnit = {
        ...this.organisationUnit,
        children: organisationunits
      };
      this.isLoading = false;
    }
  }

  onToogledOrganisationUnit() {
    const { id } = this.organisationUnit;
    if (Object.keys(this.isOrganisationUnitToggled).indexOf(id) === -1) {
      this.isOrganisationUnitToggled[id] = false;
    }
    this.isOrganisationUnitToggled[id] = !this.isOrganisationUnitToggled[id];
  }

  onSelectOrganisationUnit(organisationUnit: OrganisationUnit) {
    this.selectOrganisationUnit.emit(organisationUnit);
  }
}
