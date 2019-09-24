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

const _ = require('lodash');

export async function getCategoryComboCategories(
  selectedOrgUnitId: string,
  categories: any[]
) {
  return _.flattenDeep(
    _.map(categories, (category: any) => {
      const { id, name, categoryOptions } = category;
      const filteredCategoryOptions = _.filter(
        categoryOptions,
        (categoryOption: any) => {
          return isOrganisationUnitAllowed(selectedOrgUnitId, categoryOption);
        }
      );
      return { id, name, categoryOptions: filteredCategoryOptions };
    })
  );
}

export function isSelectedPeriodLockedForDataEntry(
  expiryDays: any,
  endDate: string
) {
  let isLocked = false;
  if (expiryDays && endDate && parseInt(expiryDays, 10) > 0) {
    const currentDate = new Date(new Date().toISOString().split('T')[0]);
    const allowedDateForDataEntry = new Date(endDate);
    allowedDateForDataEntry.setDate(
      allowedDateForDataEntry.getDate() + expiryDays
    );
    if (currentDate > allowedDateForDataEntry) {
      isLocked = true;
    }
  }
  return isLocked;
}
export function isOrganisationUnitAllowed(
  selectedOrgUnitId: string,
  categoryOption: any
) {
  let isAllowed = true;
  if (
    categoryOption &&
    categoryOption.organisationUnits &&
    categoryOption.organisationUnits.length > 0
  ) {
    const matchedOus = _.filter(categoryOption.organisationUnits, {
      id: selectedOrgUnitId
    });
    isAllowed = matchedOus && matchedOus.length > 0;
  }
  return isAllowed;
}
