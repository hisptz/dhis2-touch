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
 */
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import 'rxjs/add/operator/map';
import { DATABASE_STRUCTURE } from '../../models/database';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the SqlLiteProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class SqlLiteProvider {
  public insertBatchSize: number;

  constructor(private sqlite: SQLite) {
    this.insertBatchSize = 100;
  }

  /**
   *
   * @returns {any}
   */
  getDataBaseStructure() {
    return DATABASE_STRUCTURE;
  }

  /**
   *
   * @param databaseName
   * @returns {Observable<any>}
   */
  generateTables(databaseName): Observable<any> {
    return new Observable(observer => {
      let tableNames = Object.keys(this.getDataBaseStructure());
      let success = 0;
      let fail = 0;
      tableNames.forEach((tableName: any) => {
        this.createTable(tableName, databaseName).subscribe(
          () => {
            success++;
            if (success + fail == tableNames.length) {
              observer.next({ success: success, fail: fail });
              observer.complete();
            }
          },
          error => {
            success++;
            if (success + fail == tableNames.length) {
              observer.error({ success: success, fail: fail });
            }
          }
        );
      });
    });
  }

  /**
   *
   * @param tableName
   * @param databaseName
   * @returns {Observable<any>}
   */
  createTable(tableName, databaseName): Observable<any> {
    databaseName = databaseName + '.db';
    return new Observable(observer => {
      let query = 'CREATE TABLE IF NOT EXISTS ' + tableName + ' (';
      let columns = this.getDataBaseStructure()[tableName].columns;
      columns.forEach((column: any, index: any) => {
        if (column.value == 'id') {
          query += column.value + ' ' + column.type + ' primary key';
        } else {
          query += column.value + ' ' + column.type;
        }
        if (index + 1 < columns.length) {
          query += ',';
        }
      });
      query += ')';
      this.sqlite
        .create({ name: databaseName, location: 'default' })
        .then((db: SQLiteObject) => {
          db.executeSql(query, []).then(
            () => {
              observer.next();
              observer.complete();
            },
            error => {
              console.log('Error on create table ' + tableName);
              console.log('Error occurred ' + JSON.stringify(error));
              observer.error(error);
            }
          );
        })
        .catch(e => {
          observer.error();
          console.log(e);
        });
    });
  }

  /**
   *
   * @param tableName
   * @param bulkData
   * @param databaseName
   * @param startPoint
   * @param endPoint
   * @returns {Observable<any>}
   */
  insertBulkDataOnTable(
    tableName,
    bulkData,
    databaseName,
    startPoint?,
    endPoint?
  ): Observable<any> {
    let insertBatchSize = this.getDataBaseStructure()[tableName].batchSize;
    let start = startPoint ? parseInt(startPoint) : 0;
    let end = endPoint ? parseInt(endPoint) : insertBatchSize;
    if (end < insertBatchSize) {
      insertBatchSize = end;
    }
    let batchInsertQueryAndParameter = this.getBatchInsertQueryAndParameters(
      tableName,
      bulkData,
      start,
      end
    );
    return new Observable(observer => {
      this.insertDataUsingQueryAndParameters(
        databaseName,
        batchInsertQueryAndParameter.queries
      ).subscribe(
        () => {
          start = batchInsertQueryAndParameter.startPoint - 1;
          end = insertBatchSize + start;
          if (bulkData[batchInsertQueryAndParameter.startPoint]) {
            this.insertBulkDataOnTable(
              tableName,
              bulkData,
              databaseName,
              start,
              end
            ).subscribe(
              () => {
                observer.next();
                observer.complete();
              },
              error => {
                observer.error(error);
                //@todo resolving batch size issues
                console.log('Error on insert on table ' + tableName);
                console.log(JSON.stringify(error));
              }
            );
          } else {
            observer.next();
            observer.complete();
          }
        },
        error => {
          console.log('Error on insert on table ' + tableName);
          console.log(JSON.stringify(error));
          observer.error(error);
        }
      );
    });
  }

  /**
   *
   * @param databaseName
   * @param queries
   * @returns {Observable<any>}
   */
  insertDataUsingQueryAndParameters(databaseName, queries): Observable<any> {
    databaseName = databaseName + '.db';
    return new Observable(observer => {
      this.sqlite
        .create({ name: databaseName, location: 'default' })
        .then((db: SQLiteObject) => {
          db.sqlBatch(queries).then(
            () => {
              observer.next();
              observer.complete();
            },
            error => {
              observer.error(error);
            }
          );
        })
        .catch(e => {
          observer.error(e);
        });
    });
  }

  /**
   *
   * @param tableName
   * @param bulkData
   * @param startPoint
   * @param limit
   * @returns {{query: string, parameters: Array, startPoint: number}}
   */
  getBatchInsertQueryAndParameters(
    tableName,
    bulkData,
    startPoint: number,
    limit: number
  ) {
    let columns = this.getDataBaseStructure()[tableName].columns;
    let columnNames = '';
    let questionMarks = '(';
    columns.forEach((column: any, index: any) => {
      columnNames += column.value;
      questionMarks += '?';
      if (index + 1 < columns.length) {
        columnNames += ',';
        questionMarks += ',';
      }
    });
    questionMarks += ')';
    let queries = [];
    for (startPoint; startPoint < limit; startPoint++) {
      let query =
        'INSERT OR REPLACE INTO ' +
        tableName +
        ' (' +
        columnNames +
        ') VALUES ';
      let questionMarkParameter = [];
      if (bulkData[startPoint]) {
        let row = [];
        for (let column of columns) {
          const attribute = column.value;
          let attributeValue;
          if (bulkData[startPoint]) {
            const value = bulkData[startPoint][attribute];
            if (value !== null || value !== undefined) {
              attributeValue = value;
            }
          }
          if (column.type != 'LONGTEXT' && attributeValue === '') {
            attributeValue = 0;
          } else if (column.type == 'LONGTEXT') {
            attributeValue = JSON.stringify(attributeValue);
          }
          row.push(attributeValue);
        }
        questionMarkParameter.push(questionMarks);
        query += questionMarkParameter.join(',') + ';';
        queries.push([query, row]);
      }
    }
    return {
      queries: queries,
      startPoint: startPoint
    };
  }

  /**
   *
   * @param tableName
   * @param attribute
   * @param attributesValue
   * @param databaseName
   * @returns {Observable<any>}
   */
  deleteFromTableByAttribute(
    tableName,
    attribute,
    attributesValue,
    databaseName
  ): Observable<any> {
    databaseName = databaseName + '.db';
    let query =
      'DELETE FROM ' +
      tableName +
      ' WHERE ' +
      attribute +
      " = '" +
      attributesValue +
      "'";
    return new Observable(observer => {
      this.sqlite
        .create({ name: databaseName, location: 'default' })
        .then((db: SQLiteObject) => {
          db.executeSql(query, []).then(
            success => {
              observer.next();
              observer.complete();
            },
            error => {
              console.log(JSON.stringify(error));
              observer.error(error);
            }
          );
        })
        .catch(e => {
          observer.error(e);
        });
    });
  }

  /**
   *
   * @param tableName
   * @param databaseName
   * @returns {Observable<any>}
   */
  dropTable(tableName, databaseName): Observable<any> {
    databaseName = databaseName + '.db';
    let query = 'DROP TABLE ' + tableName;
    return new Observable(observer => {
      this.sqlite
        .create({ name: databaseName, location: 'default' })
        .then((db: SQLiteObject) => {
          db.executeSql(query, []).then(
            success => {
              observer.next(success);
              observer.complete();
            },
            error => {
              observer.error(error);
            }
          );
        })
        .catch(e => {
          observer.error();
        });
    });
  }

  /**
   *
   * @param tableName
   * @param attribute
   * @param attributesValuesArray
   * @param databaseName
   * @returns {Observable<any>}
   */
  getDataFromTableByAttributes(
    tableName,
    attribute,
    attributesValuesArray,
    databaseName
  ): Observable<any> {
    databaseName = databaseName + '.db';
    let columns = this.getDataBaseStructure()[tableName].columns;
    let query = 'SELECT * FROM ' + tableName + ' WHERE ' + attribute + ' IN (';
    let inClauseValues = '';
    attributesValuesArray.forEach((attributesValue: any, index: any) => {
      inClauseValues += "'" + attributesValue + "'";
      if (index + 1 < attributesValuesArray.length) {
        inClauseValues += ',';
      }
    });
    query += inClauseValues;
    query += ')';
    return new Observable(observer => {
      this.sqlite
        .create({ name: databaseName, location: 'default' })
        .then((db: SQLiteObject) => {
          db.executeSql(query, []).then(
            result => {
              observer.next(this.formatQueryReturnResult(result, columns));
              observer.complete();
            },
            error => {
              observer.error(error);
            }
          );
        })
        .catch(e => {
          observer.error(e);
        });
    });
  }

  /**
   *
   * @param query
   * @param tableName
   * @param databaseName
   * @returns {Observable<any>}
   */
  getByUsingQuery(query, tableName, databaseName): Observable<any> {
    databaseName = databaseName + '.db';
    let columns = this.getDataBaseStructure()[tableName].columns;
    return new Observable(observer => {
      this.sqlite
        .create({ name: databaseName, location: 'default' })
        .then((db: SQLiteObject) => {
          db.executeSql(query, []).then(
            result => {
              observer.next(this.formatQueryReturnResult(result, columns));
              observer.complete();
            },
            error => {
              console.log('error : ' + JSON.stringify(error));
              observer.error(error);
            }
          );
        })
        .catch(e => {
          observer.error(e);
        });
    });
  }

  /**
   *
   * @param tableName
   * @param databaseName
   * @returns {Observable<any>}
   */
  getAllDataFromTable(tableName, databaseName): Observable<any> {
    databaseName = databaseName + '.db';
    let columns = this.getDataBaseStructure()[tableName].columns;
    let query = 'SELECT * FROM ' + tableName + ';';
    return new Observable(observer => {
      this.sqlite
        .create({ name: databaseName, location: 'default' })
        .then((db: SQLiteObject) => {
          db.executeSql(query, []).then(
            result => {
              observer.next(this.formatQueryReturnResult(result, columns));
              observer.complete();
            },
            error => {
              observer.error(error);
            }
          );
        })
        .catch(e => {
          observer.error(e);
        });
    });
  }

  /**
   *
   * @param tableName
   * @param databaseName
   * @returns {Observable<any>}
   */
  deleteAllOnTable(tableName, databaseName): Observable<any> {
    databaseName = databaseName + '.db';
    let query = 'DELETE FROM ' + tableName;
    return new Observable(observer => {
      this.sqlite
        .create({ name: databaseName, location: 'default' })
        .then((db: SQLiteObject) => {
          db.executeSql(query, []).then(
            success => {
              observer.next();
              observer.complete();
              console.log('Success in delete table contents on ' + tableName);
            },
            error => {
              observer.error(error);
            }
          );
        })
        .catch(e => {
          observer.error(e);
        });
    });
  }

  /**
   *
   * @param result
   * @param columns
   * @returns {Array}
   */
  formatQueryReturnResult(result, columns) {
    let len = result.rows.length;
    let data = [];
    for (let i = 0; i < len; i++) {
      let row = {};
      let currentRow = result.rows.item(i);
      columns.forEach(column => {
        let columnName = column.value;
        if (column.type != 'LONGTEXT') {
          row[columnName] = currentRow[columnName];
        } else {
          row[columnName] = JSON.parse(currentRow[columnName]);
        }
      });
      data.push(row);
    }
    return data;
  }
}
