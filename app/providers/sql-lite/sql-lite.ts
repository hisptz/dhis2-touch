import { Injectable } from '@angular/core';
import { SQLite} from 'ionic-native';
import {Observable} from 'rxjs/Rx';

/*
  Generated class for the SqlLite provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class SqlLite {

  private dataBaseStructure: any= {
    organisationUnits: {
      columns: [
        {value: 'id', type: 'TEXT'},
        {value: 'name', type: 'TEXT'},
        {value: 'ancestors', type: 'LONGTEXT'},
        {value: 'dataSets', type: 'LONGTEXT'},
        {value: 'level', type: 'TEXT'},
        {value: 'children', type: 'LONGTEXT'}
      ],
      fields : "id,name,ancestors[id,name],dataSets[id],level,children[id,name,ancestors[id,name],dataSets[id],level,children[id,name,ancestors[id,name],dataSets[id],level,children[id,name,ancestors[id,name],dataSets[id],level,children[id,name,ancestors[id,name],dataSets[id],level,children[id,name,ancestors[id,name]]]]]]"
    },
    dataSets: {
      columns: [
        {value: 'id', type: 'TEXT'},
        {value: 'name', type: 'TEXT'},
        {value: 'timelyDays', type: 'TEXT'},
        {value: 'formType', type: 'TEXT'},
        {value: 'periodType', type: 'TEXT'},
        {value: 'openFuturePeriods', type: 'TEXT'},
        {value: 'expiryDays', type: 'TEXT'},
        {value: 'dataElements', type: 'LONGTEXT'},
        {value: 'organisationUnits', type: 'LONGTEXT'},
        {value: 'sections', type: 'LONGTEXT'},
        {value: 'indicators', type: 'LONGTEXT'},
        {value: 'categoryCombo', type: 'LONGTEXT'}
      ],
      fields : "id,name,timelyDays,formType,version,periodType,openFuturePeriods,expiryDays,dataElements[id,name,displayName,description,formName,attributeValues[value,attribute[name]],valueType,optionSet[name,options[name,id,code]],categoryCombo[id,name,categoryOptionCombos[id,name]]],organisationUnits[id,name],sections[id],indicators[id,name,indicatorType[factor],denominatorDescription,numeratorDescription,numerator,denominator],categoryCombo[id,name,categoryOptionCombos[id,name,categoryOptions[id]],categories[id,name,categoryOptions[id,name]]]"
    },
    sections: {
      columns: [
        {value: 'id', type: 'TEXT'},
        {value: 'name', type: 'TEXT'},
        {value: 'indicators', type: 'LONGTEXT'},
        {value: 'dataElements', type: 'LONGTEXT'}
      ],
      fields : "id,name,indicators[id,name,indicatorType[factor],denominatorDescription,numeratorDescription,numerator,denominator],dataElements[id,name,formName,attributeValues[value,attribute[name]],categoryCombo[id,name,categoryOptionCombos[id,name]],displayName,description,valueType,optionSet[name,options[name,id,code]]"
    },
    indicators: {
      columns: [
        {value: 'id', type: 'TEXT'},
        {value: 'name', type: 'TEXT'},
        {value: 'denominatorDescription', type: 'TEXT'},
        {value: 'numeratorDescription', type: 'TEXT'},
        {value: 'numerator', type: 'TEXT'},
        {value: 'denominator', type: 'TEXT'},
        {value: 'indicatorType', type: 'LONGTEXT'}
      ],
      fields : ""
    },
    reports: {
      columns: [
        {value: 'id', type: 'TEXT'},
        {value: 'name', type: 'TEXT'},
        {value: 'created', type: 'TEXT'},
        {value: 'type', type: 'TEXT'},
        {value: 'relativePeriods', type: 'LONGTEXT'},
        {value: 'reportParams', type: 'LONGTEXT'},
        {value: 'designContent', type: 'LONGTEXT'}
      ],
      fields : "id,name,created,type,relativePeriods,reportParams,designContent",
      filters : "type:eq:HTML&filter=name:like:mobile"
    },
    constants: {
      columns: [
        {value: 'id', type: 'TEXT'},
        {value: 'value', type: 'TEXT'}
      ],
      fields : "id,value"
    },
    dataValues : {
      columns: [
        {value: 'id', type: 'TEXT'},
        {value: 'de', type: 'TEXT'},
        {value: 'co', type: 'TEXT'},
        {value: 'pe', type: 'TEXT'},
        {value: 'ou', type: 'TEXT'},
        {value: 'cc', type: 'TEXT'},
        {value: 'cp', type: 'TEXT'},
        {value: 'value', type: 'TEXT'},
        {value: 'syncStatus', type: 'TEXT'},
        {value: 'dataSetId', type: 'TEXT'}
      ]
    },
    programs : {
      columns : [
        {value: 'id', type: 'TEXT'},
        {value: 'name', type: 'TEXT'},
        {value: 'categoryCombo',type:'LONGTEXT'},
        {value: 'organisationUnits',type:'LONGTEXT'},
        {value: 'programStages',type:'LONGTEXT'}
      ],
      fields : "id,name,categoryCombo[id,isDefault,categories[id,categoryOptions[id,name]]],organisationUnits[id],programStages[programStageDataElements[id,name,compulsory,sortOrder,dataElement[id,name,optionSetValue,valueType,optionSet[options[id,code,name]],categoryCombo[id,isDefault,categories[id,name]]]]]",
    }
  };

  constructor() {
  }

  getDataBaseStructure(){
    return this.dataBaseStructure;
  }

  generateTables(databaseName){
    let self = this;
    return new Promise(function(resolve, reject) {
      let promises = [];
      let tableNames = Object.keys(self.dataBaseStructure);
      tableNames.forEach((tableName: any) => {
        console.log('Generate table for ' + tableName);
        promises.push(self.createTable(tableName,databaseName).then(()=>{
          resolve();
          }).catch(error=>{
            reject(error);
          })
        );
      });

      Observable.forkJoin(promises).subscribe(() => {
          resolve()
        },
        error => {
          reject(error.failure);
        }
      );
    });
  }

  openDatabase(databaseName){
    return new Promise(function(resolve, reject) {
      databaseName = databaseName + '.db';
      let db = new SQLite();
      db.openDatabase({
        name: databaseName,
        location: 'default'
      }).then(() => {
        resolve();
      }, (error) => {
        reject(error.failure);
      });
    });

  }

  createTable(tableName,databaseName){
    let self = this;
    databaseName = databaseName + '.db';

    return new Promise(function(resolve, reject) {
      let query = 'CREATE TABLE IF NOT EXISTS ' + tableName + ' (';
      let columns = self.dataBaseStructure[tableName].columns;
      columns.forEach((column: any,index:any) => {
        if (column.value == "id") {
          query += column.value + " " + column.type + ' primary key';
        } else {
          query += column.value + " " + column.type;
        }
        if ((index + 1) < columns.length) {
          query += ','
        }
      });
      query += ')';

      let db = new SQLite();
      db.openDatabase({name: databaseName,location: 'default'}).then(() => {
        db.executeSql(query, []).then((success) => {
          resolve();
        }, (error) => {
          reject(error.failure);
        });
      }, (error) => {
        reject(error.failure);
      });
    });
  }

  insertDataOnTable(tableName, fieldsValues,databaseName){
    let self = this;
    databaseName = databaseName + '.db';
    let columns = self.dataBaseStructure[tableName].columns;
    let columnNames = "";
    let questionMarks = "";
    let values = [];

    columns.forEach((column: any,index:any)=>{
      let columnValue :any;
      let columnName = column.value;
      columnNames += columnName;

      if (fieldsValues[columnName]) {
        columnValue = fieldsValues[columnName];
      }

      questionMarks += "?";
      if ((index + 1) < columns.length) {
        columnNames += ',';
        questionMarks += ',';
      }
      if (column.type != "LONGTEXT") {
        if (columnValue == undefined) {
          columnValue = 0;
        }
        values.push(columnValue);
      } else {
        values.push(JSON.stringify(columnValue));
      }

    });
    let query = "INSERT OR REPLACE INTO " + tableName + " (" + columnNames + ") VALUES (" + questionMarks + ")";
    let db = new SQLite();

    return new Promise(function(resolve, reject) {
      db.openDatabase({name: databaseName,location: 'default'}).then(() => {
        db.executeSql(query, values).then((success) => {
          resolve();
        }, (error) => {
          reject(error.failure);
        });
      }, (error) => {
        reject(error.failure);
      });
    });
  }

  getDataFromTableByAttributes(tableName, attribute, attributesValuesArray,databaseName){
    let self = this;
    databaseName = databaseName + '.db';
    let columns = self.dataBaseStructure[tableName].columns;
    let query = "SELECT * FROM " + tableName + " WHERE " + attribute + " IN (";
    let inClauseValues = "";

    attributesValuesArray.forEach( (attributesValue:any, index:any)=> {
      inClauseValues += "'" + attributesValue + "'";
      if ((index + 1) < attributesValuesArray.length) {
        inClauseValues += ',';
      }
    });
    query += inClauseValues;
    query += ")";
    let db = new SQLite();

    return new Promise(function(resolve, reject) {
      db.openDatabase({name: databaseName,location: 'default'}).then(() => {
        db.executeSql(query, []).then((result) => {
          resolve(self.formatQueryReturnResult(result,columns));
        }, (error) => {
          reject(error.failure);
        });
      }, (error) => {
        reject(error.failure);
      });
    });

  }

  getAllDataFromTable(tableName,databaseName){
    let self = this;
    databaseName = databaseName + '.db';
    let columns = self.dataBaseStructure[tableName].columns;
    let query = "SELECT * FROM " + tableName + ";";
    let db = new SQLite();

    return new Promise(function(resolve, reject) {
      db.openDatabase({name: databaseName,location: 'default'}).then(() => {
        db.executeSql(query, []).then((result) => {
          resolve(self.formatQueryReturnResult(result,columns));
        },(error) => {
          reject(error.failure);
        });
      }, (error) => {
        reject(error.failure);
      });
    });

  }

  formatQueryReturnResult(result, columns){
    let len = result.rows.length;
    let data = [];

    for (var i = 0; i < len; i++) {
      let row = {};
      let currentRow = result.rows.item(i);
      columns.forEach((column) =>{
        var columnName = column.value;
        if (column.type != "LONGTEXT") {
          row[columnName] = currentRow[columnName]
        } else {
          row[columnName] = eval("(" + currentRow[columnName] + ")");
        }
      });
      data.push(row);
    }
    return data;
  }

}

