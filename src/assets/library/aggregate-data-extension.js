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
var dhis2 = dhis2 || {}

dhis2['aggregateMetadataProvider'] = {
  getDataElementsByIds,
  getDataValues
}

function getDataElementsByIds(dataElementIds) {
  const tableName = "dataElements";
  const attribute = "id";
  return new Promise((resolve, reject) => {
    dhis2.sqlLiteProvider.getFromTableByAttributes(tableName, attribute, dataElementIds).then((dataElements) => {
      resolve(dataElements);
    }).catch(error => {
      reject(error);
    });
  })
}

function getDataValues(dataSetId, orgunitId, period) {
  const tableName = "dataValues";
  const query = `SELECT * FROM ${tableName} WHERE pe = '${period}' AND ou = '${orgunitId}' AND dataSetId = '${dataSetId}'`;
  return new Promise((resolve, reject) => {
    dhis2.sqlLiteProvider.geFromTableByQuery(query, tableName).then((dataValues) => {
      resolve(dataValues);
    }).catch(error => {
      reject(error);
    });
  })
}
