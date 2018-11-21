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

dhis2['sqlLiteProvider'] = {}

dhis2.sqlLiteProvider = {
  getAllFromTable
}



function getAllFromTable(tableName) {
  const currentDatabase = dhis2.currentDatabase;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(({
        tableName,
        currentDatabase
      }))
    }, 1000)
  })
}

function insertOrReplaceOnTable(tableName, bulkData) {
  const currentDatabase = dhis2.currentDatabase;
  return new Promise((resolve, reject) => {})
}

function getFromTableByAttributes(tableName, attribute, attributesValuesArray) {
  const currentDatabase = dhis2.currentDatabase;
  return new Promise((resolve, reject) => {})
}

function geFromTableByQuery(query, tableName) {
  const currentDatabase = dhis2.currentDatabase;
  return new Promise((resolve, reject) => {})
}

function deleteAllFromTable(tableName) {
  const currentDatabase = dhis2.currentDatabase;
  return new Promise((resolve, reject) => {})
}

function deleteFromTableByAttributes(tableName, attribute, attributesValuesArray) {
  const currentDatabase = dhis2.currentDatabase;
  return new Promise((resolve, reject) => {})
}

function formatQueryReturnResult(results, tableName) {
  const dataBaseStructure = dhis2.dataBaseStructure;
  const columns = (dataBaseStructure[tableName]) ? dataBaseStructure[tableName].columns : [];
  const numberORecords = results.rows.length;
  const formattedResults = [];
  for (var recordIndex = 0; recordIndex < numberORecords; recordIndex++) {
    const record = {};
    const currentRow = results.rows.item(recordIndex);
    for (var columnIndex = 0; columnIndex < columns.length; columnIndex++) {
      const column = columns[columnIndex];
      const columnName = column.value;
      if (column.type != "LONGTEXT") {
        record[columnName] = currentRow[columnName]
      } else {
        record[columnName] = eval("(" + currentRow[columnName] + ")");
      }
    }
    formattedResults.push(record);
  }
  return formattedResults;
}
