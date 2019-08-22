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
import { DataElement } from './data-element';
import { Indicator } from './indicator';
import { Section } from './section';

export interface DataSet {
  id: string;
  name: string;
  timelyDays: number;
  formType: string;
  periodType: string;
  openFuturePeriods: number;
  expiryDays: number;
  categoryCombo: any;
  dataElements?: DataElement[];
  dataSetOperands?: DataSetOperand[];
  indicators?: Indicator[];
  sections?: Section[];
}

export interface DataSetElement {
  id: string;
  dataElementIds: string;
}
export interface DataSetIndicator {
  id: string;
  indicatorIds: string;
}
export interface DataSetDesign {
  id: string;
  dataSetDesign: string;
}
export interface DataSetSource {
  id: string;
  organisationUnitIds: string;
}
export interface DataSetSection {
  id: string;
  sectionIds: string;
}
export interface DataSetOperand {
  id: string;
  dataSetId: string;
  name: string;
  dimensionItemType: string;
  dimensionItem: string;
}
