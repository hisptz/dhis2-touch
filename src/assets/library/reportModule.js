/**
 * Created by chingalo on 8/3/16.
 */
var dhis2 = {
  database: null,
  validation: {
    isNumber: function (value) {
      var regex = /^(-?0|-?[1-9]\d*)(\.\d+)?(E\d+)?$/;
      return regex.test(value);
    }
  },
  sqlLiteServices: {
    getDataFromTableById: function (tableName, id) {
      var defer = $.Deferred();
      var attribute = "id";
      if(dhis2.database.indexOf(".db") == -1){
        dhis2.database = dhis2.database + ".db";
      }
      var db = window.sqlitePlugin.openDatabase({name: dhis2.database,location: 'default'});
      db.transaction(function (tx) {
        var query = "SELECT * FROM " + tableName + " WHERE " + attribute + " = ?";
        tx.executeSql(query, [id], function (tx, results) {
          var data = dhis2.formatQueryReturnResult(results,tableName).length > 0 ? dhis2.formatQueryReturnResult(results,tableName)[0] : {};
          defer.resolve(data);
        }, function (error) {
          defer.reject(error);
        });
      });
      return defer.promise();
    },
    getDataFromTableByIds: function (tableName, ids) {
      var defer = $.Deferred();
      var attribute = "id";
      if(dhis2.database.indexOf(".db") == -1){
        dhis2.database = dhis2.database + ".db";
      }
      var db = window.sqlitePlugin.openDatabase({name: dhis2.database,location: 'default'});
      var questionMarks = "?";
      for (var i = 1; i < ids.length; i++) {
        questionMarks += ",?";
      }
      db.transaction(function (tx) {
        var query = "SELECT * FROM " + tableName + " WHERE " + attribute + " IN (" + questionMarks + ")";
        tx.executeSql(query, ids, function (tx, results) {
          var len = results.rows.length;
          var data = [];
          var formattedResults = dhis2.formatQueryReturnResult(results,tableName);
          console.log("found len : " + len);
          for (var i = 0; i < len; i++) {
            var json = formattedResults[i];
            var index = ids.indexOf(json.id);
            ids.splice(index, 1);
            data.push(json);
          }
          defer.resolve(data, ids);
        }, function (error) {
          defer.reject(error);
        });
      });
      return defer.promise();
    },
    searchDataFromTableByIds: function (tableName, ids) {
      var defer = $.Deferred();
      if(dhis2.database.indexOf(".db") == -1){
        dhis2.database = dhis2.database + ".db";
      }
      var db = window.sqlitePlugin.openDatabase({name: dhis2.database,location: 'default'});
      var questionMarks = "id LIKE '%" + ids[0] + "%'";
      for (var i = 1; i < ids.length; i++) {
        questionMarks += " OR id LIKE '%" + ids[i] + "%'";
      }
      db.transaction(function (tx) {
        var query = "SELECT * FROM " + tableName + " WHERE " + questionMarks;
        tx.executeSql(query, [], function (tx, results) {
          defer.resolve(dhis2.formatQueryReturnResult(results,tableName));
        }, function (error) {
          defer.reject(error);
        });
      });
      return defer.promise();
    },
    getAllDataFromTable: function (tableName) {
      var defer = $.Deferred();
      if(dhis2.database.indexOf(".db") == -1){
        dhis2.database = dhis2.database + ".db";
      }
      var db = window.sqlitePlugin.openDatabase({name: dhis2.database,location: 'default'});
      db.transaction(function (tx) {
        var query = "SELECT * FROM " + tableName + ";";
        tx.executeSql(query, [], function (tx, results) {
          defer.resolve(dhis2.formatQueryReturnResult(results,tableName));
        }, function (error) {
          defer.reject(error);
        });
      });
      return defer.promise();
    }
  },
  report: {},
  de : {},
  formatQueryReturnResult : function(results,tableName){
    var dataBaseStructure = dhis2.dataBaseStructure;
    var columns = (dataBaseStructure[tableName])? dataBaseStructure[tableName].columns : [];
    //@todo make sure we make reusable functions
    var len = results.rows.length;
    var data = [];
    for (var i = 0; i < len; i++) {
      var row = {};
      var currentRow = results.rows.item(i);
      for (var j = 0; j < columns.length; j++) {
        var column = columns[j];
        var columnName = column.value;
        if (column.type != "LONGTEXT") {
          row[columnName] = currentRow[columnName]
        } else {
          row[columnName] = eval("(" + currentRow[columnName] + ")");
        }
      }
      data.push(row);
    }
    return data;

  }
};
dhis2.de = {
  getDataElementTotalValue: function (de, dataSet, match) {
    var defer = $.Deferred();
    var sum = new Number();
    var dataValuesStore = $.indexedDB("hisptz").objectStore("dataValues");
    var promise = dataValuesStore.each(function (item) {
      //Fetch datavalues
      if (item.id.indexOf(de) != -1 && item.id.endsWith(dhis2.report.period + "-" + dhis2.report.organisationUnit.id)) {
        var val = item.value.dataValue.value;
        if (val && dhis2.validation.isNumber(val)) {
          sum += new Number(item.value.dataValue.value);
        }
      }
    });
    promise.done(function (result, event) {
      defer.resolve(sum, match);
    });
    promise.fail(function (error, event) {
      defer.reject(error);
    });
    return defer.promise();
  },
  getDataElementValue: function (de, coc, dataSet, match) {
    var defer = $.Deferred();

    var dataValuesId = dataSet + "-" + de + "-" + coc + "-" + dhis2.report.period + "-" + dhis2.report.organisationUnit.id;
    dhis2.sqlLiteServices.getDataFromTableById('dataValues', dataValuesId)
      .done(function (item) {
        if (item) {
          var val = item.value;
          if(isNaN(new Number(item.value))){
            console.log("NAN2:" +JSON.stringify(item));
          }
          if (val && dhis2.validation.isNumber(val)) {
            defer.resolve(new Number(item.value), match);
          } else {
            defer.resolve(new Number(0), match);
          }
        } else {
          defer.resolve(new Number(0), match);
        }
      });
    return defer.promise();
  },
  getConstantValue: function (constantId, match,indicator) {
    var defer = $.Deferred();
    dhis2.sqlLiteServices.getDataFromTableById('constants', constantId)
      .done(function (constant) {
        var testConstants = ["yIO2TSCXdO0","E4VL9sMDC4S"];
        if(testConstants.indexOf(constantId) > -1){
        }
        if (constant) {
          var val = constant.value;
          if (val && dhis2.validation.isNumber(val)) {
            defer.resolve(new Number(constant.value), match);
          } else {
            defer.resolve(new Number(constant.value), match, "Zeror");
          }
        } else {
          defer.resolve(new Number(1), match, "Zeror");
        }
      });
    return defer.promise();
  },
  generateExpression: function (expression, dataSet,indicator) {
    var defer = $.Deferred();
    var deferreds = [];
    var initialExpression = expression;
    var matcher = expression.match(dhis2.de.cst.formulaPattern);
    var cMatcher = expression.match(dhis2.de.cst.constantPattern);
    for (k in matcher) {
      var match = matcher[k];
      // Remove brackets from expression to simplify extraction of identifiers
      var operand = match.replace(/[#\{\}]/g, '');
      var isTotal = !!( operand.indexOf(dhis2.de.cst.separator) == -1 );
      if (isTotal) {
        //alert('is total');
        deferreds.push(dhis2.de.getDataElementTotalValue(operand, dataSet, match).done(function (sum, matchRef) {
          expression = expression.replace(matchRef, sum);

        }));
      }
      else {
        var de = operand.substring(0, operand.indexOf(dhis2.de.cst.separator));
        var coc = operand.substring(operand.indexOf(dhis2.de.cst.separator) + 1, operand.length);
        deferreds.push(dhis2.de.getDataElementValue(de, coc, dataSet, match).done(function (sum, matchRef) {
          if (sum) {
            expression = expression.replace(matchRef, sum);
          } else {
            expression = expression.replace(matchRef, 0);
          }
        }));
      }
      // TODO signed numbers
    }
    for (k in cMatcher) {
      var match = cMatcher[k];
      // Remove brackets from expression to simplify extraction of identifiers
      var operand = /C{(.*)}/.exec(match);
      deferreds.push(dhis2.de.getConstantValue(operand[1], match,indicator).done(function (sum, matchRef, num) {
        if (sum) {
          expression = expression.replace(matchRef, sum);
        }else{
          expression = expression.replace(matchRef, 0);
        }
      }));
    }
    $.when.apply($, deferreds).then(function () {



      if (expression) {
        defer.resolve(eval('(' + expression + ')'));
      } else {
        //defer.resolve(undefined);
        defer.resolve(0);
      }

    });
    return defer.promise();
  },
  //Get indicators from indexdb by id
  getIndicators: function (indicatorIds) {
    var defer = $.Deferred();
    //sample testing on sqlLite services
    dhis2.sqlLiteServices.getDataFromTableByIds('indicators', indicatorIds).done(function (data, ids) {
      defer.resolve(data, ids);
    });
    return defer.promise();
  },
  getIndicatorDataValues: function (indicatorIds, dataSet) {
    var defer = $.Deferred();
    var promises = [];
    var data = {
      metaData: {
        names: {}
      },
      rows: []
    };
    dhis2.de.getIndicators(indicatorIds).done(function (indicators, dataElements) {
      $.each(indicators, function (indicatorIndex, indicator) {
        data.metaData.names[indicator.id] = indicator.name;
        promises.push(dhis2.de.evaluateDataIndicator(indicator, dataSet).then(function (value) {
          if (value) {
            data.rows.push([indicator.id, dhis2.report.period, value + ""]);
          }else{
            //data.rows.push([indicator.id, dhis2.report.period, "0.0"]);
          }
        }));
      });
      $.when.apply($, promises).then(function () {
        if (dataElements.length > 0) {
          var ids = [];
          $.each(dataElements, function (dataElementIndex, dataElement) {
            ids.push(dataSet + "-" + dataElement + "-%-" + dhis2.report.period + "-" + dhis2.report.organisationUnit.id);
          });
          dhis2.de.sqlLiteServices.searchDataFromTableByIds("dataValues", dataElements).done(function (items) {
            if(items.length > 0){
              $.each(items, function (dataElementIndex, dataElement) {
                data.rows.push([dataElement.de, dhis2.report.period, dataElement.value + ""]);
              });
            }
            if(data.rows.length == 0){
              var message = "This report has no data. To view the report with data, open data entry form related to this report to download existing data or to enter new data";
              dhis2.progressMessageStick(message);
            }
            defer.resolve(data);
          });
        } else {
          defer.resolve(data);
        }
      });
    });
    return defer.promise();
  },
  evaluateDataIndicator: function (indicator, dataSet) {
    var defer = $.Deferred();
    var promises = [];
    var numerator = 0;
    var denominator = 1;
    promises.push(dhis2.de.generateExpression(indicator.numerator, dataSet,indicator).then(function (numeratorResult) {
      if(numeratorResult){
        numerator = numeratorResult;
      }else{
        numerator = undefined;
      }

    }));
    promises.push(dhis2.de.generateExpression(indicator.denominator, dataSet,indicator).then(function (denominatorResult) {
      if(denominatorResult){
        denominator = denominatorResult;
      }else{
        denominator = undefined;
      }
    }));
    $.when.apply($, promises).then(function () {
      if(numerator != undefined && denominator != undefined){
        var returnValue = (parseFloat(numerator) / parseFloat(denominator)) * parseFloat(indicator.indicatorType.factor);
        defer.resolve(returnValue.toFixed(1));
      }else{
        defer.resolve(undefined);
      }

    });
    return defer.promise();
  },
  cst: {
    formulaPattern: /#\{.+?\}/g,
    constantPattern: /C\{.+?\}/g,
    separator: "."
  }
};
var reportParams = {
  ou: "",
  pe: ""
};
