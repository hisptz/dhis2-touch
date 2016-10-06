var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var ionic_native_1 = require('ionic-native');
var Rx_1 = require('rxjs/Rx');
/*
  Generated class for the SqlLite provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
var SqlLite = (function () {
    function SqlLite() {
        this.dataBaseStructure = {
            organisationUnits: {
                columns: [
                    { value: 'id', type: 'TEXT' },
                    { value: 'name', type: 'TEXT' },
                    { value: 'ancestors', type: 'LONGTEXT' },
                    { value: 'dataSets', type: 'LONGTEXT' },
                    { value: 'level', type: 'TEXT' },
                    { value: 'children', type: 'LONGTEXT' }
                ],
                fields: "id,name,ancestors[id,name],dataSets[id],level,children[id,name,ancestors[id,name],dataSets[id],level,children[id,name,ancestors[id,name],dataSets[id],level,children[id,name,ancestors[id,name],dataSets[id],level,children[id,name,ancestors[id,name],dataSets[id],level,children[id,name,ancestors[id,name]]]]]]"
            },
            dataSets: {
                columns: [
                    { value: 'id', type: 'TEXT' },
                    { value: 'name', type: 'TEXT' },
                    { value: 'timelyDays', type: 'TEXT' },
                    { value: 'formType', type: 'TEXT' },
                    { value: 'periodType', type: 'TEXT' },
                    { value: 'openFuturePeriods', type: 'TEXT' },
                    { value: 'expiryDays', type: 'TEXT' },
                    { value: 'dataElements', type: 'LONGTEXT' },
                    { value: 'organisationUnits', type: 'LONGTEXT' },
                    { value: 'sections', type: 'LONGTEXT' },
                    { value: 'indicators', type: 'LONGTEXT' },
                    { value: 'categoryCombo', type: 'LONGTEXT' }
                ],
                fields: "id,name,timelyDays,formType,version,periodType,openFuturePeriods,expiryDays,dataElements[id,name,displayName,description,formName,attributeValues[value,attribute[name]],valueType,optionSet[name,options[name,id,code]],categoryCombo[id,name,categoryOptionCombos[id,name]]],organisationUnits[id,name],sections[id],indicators[id,name,indicatorType[factor],denominatorDescription,numeratorDescription,numerator,denominator],categoryCombo[id,name,categoryOptionCombos[id,name,categoryOptions[id]],categories[id,name,categoryOptions[id,name]]]"
            },
            sections: {
                columns: [
                    { value: 'id', type: 'TEXT' },
                    { value: 'name', type: 'TEXT' },
                    { value: 'indicators', type: 'LONGTEXT' },
                    { value: 'dataElements', type: 'LONGTEXT' }
                ],
                fields: "id,name,indicators[id,name,indicatorType[factor],denominatorDescription,numeratorDescription,numerator,denominator],dataElements[id,name,formName,attributeValues[value,attribute[name]],categoryCombo[id,name,categoryOptionCombos[id,name]],displayName,description,valueType,optionSet[name,options[name,id,code]]"
            },
            indicators: {
                columns: [
                    { value: 'id', type: 'TEXT' },
                    { value: 'name', type: 'TEXT' },
                    { value: 'denominatorDescription', type: 'TEXT' },
                    { value: 'numeratorDescription', type: 'TEXT' },
                    { value: 'numerator', type: 'TEXT' },
                    { value: 'denominator', type: 'TEXT' },
                    { value: 'indicatorType', type: 'LONGTEXT' }
                ],
                fields: ""
            },
            reports: {
                columns: [
                    { value: 'id', type: 'TEXT' },
                    { value: 'name', type: 'TEXT' },
                    { value: 'created', type: 'TEXT' },
                    { value: 'type', type: 'TEXT' },
                    { value: 'relativePeriods', type: 'LONGTEXT' },
                    { value: 'reportParams', type: 'LONGTEXT' },
                    { value: 'designContent', type: 'LONGTEXT' }
                ],
                fields: "id,name,created,type,relativePeriods,reportParams,designContent",
                filters: "type:eq:HTML&filter=name:like:mobile"
            },
            constants: {
                columns: [
                    { value: 'id', type: 'TEXT' },
                    { value: 'value', type: 'TEXT' }
                ],
                fields: "id,value"
            },
            dataValues: {
                columns: [
                    { value: 'id', type: 'TEXT' },
                    { value: 'de', type: 'TEXT' },
                    { value: 'co', type: 'TEXT' },
                    { value: 'pe', type: 'TEXT' },
                    { value: 'ou', type: 'TEXT' },
                    { value: 'cc', type: 'TEXT' },
                    { value: 'cp', type: 'TEXT' },
                    { value: 'value', type: 'TEXT' },
                    { value: 'syncStatus', type: 'TEXT' },
                    { value: 'dataSetId', type: 'TEXT' }
                ]
            },
            programs: {
                columns: [
                    { value: 'id', type: 'TEXT' },
                    { value: 'name', type: 'TEXT' },
                    { value: 'categoryCombo', type: 'LONGTEXT' },
                    { value: 'organisationUnits', type: 'LONGTEXT' },
                    { value: 'programStages', type: 'LONGTEXT' }
                ],
                fields: "id,name,categoryCombo[id,isDefault,categories[id,categoryOptions[id,name]]],organisationUnits[id],programStages[programStageDataElements[id,name,compulsory,sortOrder,dataElement[id,name,optionSetValue,valueType,optionSet[options[id,code,name]],categoryCombo[id,isDefault,categories[id,name]]]]]",
            }
        };
    }
    SqlLite.prototype.getDataBaseStructure = function () {
        return this.dataBaseStructure;
    };
    SqlLite.prototype.generateTables = function (databaseName) {
        var self = this;
        return new Promise(function (resolve, reject) {
            var promises = [];
            var tableNames = Object.keys(self.dataBaseStructure);
            tableNames.forEach(function (tableName) {
                console.log('Generate table for ' + tableName);
                promises.push(self.createTable(tableName, databaseName).then(function () {
                    resolve();
                }).catch(function (error) {
                    reject(error);
                }));
            });
            Rx_1.Observable.forkJoin(promises).subscribe(function () {
                resolve();
            }, function (error) {
                reject(error.failure);
            });
        });
    };
    SqlLite.prototype.openDatabase = function (databaseName) {
        return new Promise(function (resolve, reject) {
            databaseName = databaseName + '.db';
            var db = new ionic_native_1.SQLite();
            db.openDatabase({
                name: databaseName,
                location: 'default'
            }).then(function () {
                resolve();
            }, function (error) {
                reject(error.failure);
            });
        });
    };
    SqlLite.prototype.createTable = function (tableName, databaseName) {
        var self = this;
        databaseName = databaseName + '.db';
        return new Promise(function (resolve, reject) {
            var query = 'CREATE TABLE IF NOT EXISTS ' + tableName + ' (';
            var columns = self.dataBaseStructure[tableName].columns;
            columns.forEach(function (column, index) {
                if (column.value == "id") {
                    query += column.value + " " + column.type + ' primary key';
                }
                else {
                    query += column.value + " " + column.type;
                }
                if ((index + 1) < columns.length) {
                    query += ',';
                }
            });
            query += ')';
            var db = new ionic_native_1.SQLite();
            db.openDatabase({ name: databaseName, location: 'default' }).then(function () {
                db.executeSql(query, []).then(function (success) {
                    resolve();
                }, function (error) {
                    reject(error.failure);
                });
            }, function (error) {
                reject(error.failure);
            });
        });
    };
    SqlLite.prototype.insertDataOnTable = function (tableName, fieldsValues, databaseName) {
        var self = this;
        databaseName = databaseName + '.db';
        var columns = self.dataBaseStructure[tableName].columns;
        var columnNames = "";
        var questionMarks = "";
        var values = [];
        columns.forEach(function (column, index) {
            var columnValue;
            var columnName = column.value;
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
            }
            else {
                values.push(JSON.stringify(columnValue));
            }
        });
        var query = "INSERT OR REPLACE INTO " + tableName + " (" + columnNames + ") VALUES (" + questionMarks + ")";
        var db = new ionic_native_1.SQLite();
        return new Promise(function (resolve, reject) {
            db.openDatabase({ name: databaseName, location: 'default' }).then(function () {
                db.executeSql(query, values).then(function (success) {
                    resolve();
                }, function (error) {
                    reject(error.failure);
                });
            }, function (error) {
                reject(error.failure);
            });
        });
    };
    SqlLite.prototype.getDataFromTableByAttributes = function (tableName, attribute, attributesValuesArray, databaseName) {
        var self = this;
        databaseName = databaseName + '.db';
        var columns = self.dataBaseStructure[tableName].columns;
        var query = "SELECT * FROM " + tableName + " WHERE " + attribute + " IN (";
        var inClauseValues = "";
        attributesValuesArray.forEach(function (attributesValue, index) {
            inClauseValues += "'" + attributesValue + "'";
            if ((index + 1) < attributesValuesArray.length) {
                inClauseValues += ',';
            }
        });
        query += inClauseValues;
        query += ")";
        var db = new ionic_native_1.SQLite();
        return new Promise(function (resolve, reject) {
            db.openDatabase({ name: databaseName, location: 'default' }).then(function () {
                db.executeSql(query, []).then(function (result) {
                    resolve(self.formatQueryReturnResult(result, columns));
                }, function (error) {
                    reject(error.failure);
                });
            }, function (error) {
                reject(error.failure);
            });
        });
    };
    SqlLite.prototype.getAllDataFromTable = function (tableName, databaseName) {
        var self = this;
        databaseName = databaseName + '.db';
        var columns = self.dataBaseStructure[tableName].columns;
        var query = "SELECT * FROM " + tableName + ";";
        var db = new ionic_native_1.SQLite();
        return new Promise(function (resolve, reject) {
            db.openDatabase({ name: databaseName, location: 'default' }).then(function () {
                db.executeSql(query, []).then(function (result) {
                    resolve(self.formatQueryReturnResult(result, columns));
                }, function (error) {
                    reject(error.failure);
                });
            }, function (error) {
                reject(error.failure);
            });
        });
    };
    SqlLite.prototype.formatQueryReturnResult = function (result, columns) {
        var len = result.rows.length;
        var data = [];
        for (var i = 0; i < len; i++) {
            var row = {};
            var currentRow = result.rows.item(i);
            columns.forEach(function (column) {
                var columnName = column.value;
                if (column.type != "LONGTEXT") {
                    row[columnName] = currentRow[columnName];
                }
                else {
                    row[columnName] = eval("(" + currentRow[columnName] + ")");
                }
            });
            data.push(row);
        }
        return data;
    };
    SqlLite = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], SqlLite);
    return SqlLite;
})();
exports.SqlLite = SqlLite;
