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
  getDataValues,
  getDataSetMetadata,
  getDataSetById,
  getDataSetElementsByDataSetId,
  getDataSetSectionsByDataSetId,
  getSectionsByIds,
  getDataElementsByIds
}

function getDataSetMetadata(dataSetId) {
  return new Promise(function (resolve, reject) {
    dhis2.aggregateMetadataProvider.getDataSetById(dataSetId).then(function (response) {
      resolve(response)
    }).catch(function (error) {
      reject(error)
    })
  })
}


async function getDataSetById(dataSetId) {
  const resource = "dataSets";
  const attribute = "id";
  var dataSetObject = {}
  try {
    const dataSets = await dhis2.sqlLiteProvider.getFromTableByAttributes(resource, attribute, [dataSetId]);
    if (dataSets.length > 0) {
      const dataSet = dataSets[0];
      dataSetObject = dataSet;
      const dataElementIds = await dhis2.aggregateMetadataProvider.getDataSetElementsByDataSetId(dataSetId);
      const sectionIds = await dhis2.aggregateMetadataProvider.getDataSetSectionsByDataSetId(dataSetId);
      const dataElements = await dhis2.aggregateMetadataProvider.getDataElementsByIds(dataElementIds);
      const dataElementsObject = arrayToObject(dataElements, 'id');
      console.log(JSON.stringify({
        dataElementsObject
      }))
      const sections = await dhis2.aggregateMetadataProvider.getSectionsByIds(sectionIds);

      dataSetObject = {
        ...dataSetObject,
        dataElementIds,
        sections
      }
    }
    return dataSetObject
  } catch (error) {}
}

async function getDataSetElementsByDataSetId(dataSetId) {
  const resource = "dataSetElements";
  const attribute = "id";
  const dataSetElements = await dhis2.sqlLiteProvider.getFromTableByAttributes(resource, attribute, [dataSetId]);
  const {
    dataElementIds
  } = dataSetElements.length > 0 ? dataSetElements[0] : {}
  return dataElementIds || []
}

async function getDataSetSectionsByDataSetId(dataSetId) {
  const resource = "dataSetSections";
  const attribute = "id";
  const dataSetSections = await dhis2.sqlLiteProvider.getFromTableByAttributes(resource, attribute, [dataSetId]);
  const {
    sectionIds
  } = dataSetSections.length > 0 ? dataSetSections[0] : {};
  return sectionIds || []
}

async function getDataElementsByIds(dataElementIds) {
  const resource = "dataElements";
  const attribute = "id";
}

async function getSectionsByIds(sectionIds) {
  const resource = "sections";
  const attribute = "id";
  var sections = await dhis2.sqlLiteProvider.getFromTableByAttributes(resource, attribute, sectionIds);
  const sectionDataElements = await dhis2.sqlLiteProvider.getFromTableByAttributes("sectionDataElements", attribute, sectionIds);
  const sectionDataElementObject = arrayToObject(sectionDataElements, 'id');
  return sections.map(function (section) {
    const sectionDataElement = section && section.id && sectionDataElementObject[section.id] ? sectionDataElementObject[section.id] : {};
    section = {
      ...section,
      dataElementIds: sectionDataElement.dataElementIds || []
    }
    return section;
  }).sort(function (a, b) {
    return parseInt(a.sortOrder) - parseInt(b.sortOrder);
  });
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

function arrayToObject(array, keyField) {
  return array.reduce((obj, item) => {
    obj[item[keyField]] = item
    return obj
  }, {});
}
