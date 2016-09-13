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
            person: {
                columns: [
                    { value: 'firstName', type: 'TEXT' },
                    { value: 'middleName', type: 'TEXT' },
                    { value: 'lastName', type: 'TEXT' },
                    { value: 'Bio', type: 'LONGTEXT' }
                ],
                fields: "fields",
                filter: "filters"
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
                promises.push(self.createTable(tableName, databaseName).then(function () {
                    resolve();
                }).catch(function (err) {
                    reject();
                }));
            });
            Rx_1.Observable.forkJoin(promises).subscribe(function () {
                resolve();
            }, function (err) {
                reject();
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
            }, function (err) {
                reject();
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
                }, function (err) {
                    reject();
                });
            }, function (err) {
                reject();
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
                }, function (err) {
                    reject();
                });
            }, function (err) {
                reject();
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
                }, function (err) {
                    reject();
                });
            }, function (err) {
                reject();
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
                }, function (err) {
                    reject();
                });
            }, function (err) {
                reject();
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
