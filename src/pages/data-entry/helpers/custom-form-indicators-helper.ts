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
import * as _ from "lodash";
declare const dhis2;
export function evaluateCustomFomProgramIndicators(programIndicators: any[]) {
  for (let programIndicator of programIndicators) {
    const { id, expression, filter } = programIndicator;
    if (filter) {
      // console.log(JSON.stringify({ filter }));
    }
    let indicatorValue = 0;
    indicatorValue = Number(
      getProgramIndicatorValueFromExpression(expression)["value"]
    );
    const checkIfAtLeastValueIsFilled = getProgramIndicatorValueFromExpression(
      expression
    )["checkIfAtLeastValueIsFilled"];
    let backGroundColor = "#FFF";
    const nameSpace = "msdqi-checklists";
    const key = "indicatorConfigurations";
    const dataStoreReferenceId = `${nameSpace}_${key}`;
    const tableName = "dataStore";
    dhis2.sqlLiteProvider
      .getFromTableByAttributes(tableName, "id", [dataStoreReferenceId])
      .then(data => {
        const element: any = document.getElementById(`indicator${id}`);
        if (data && data.length > 0 && checkIfAtLeastValueIsFilled.length > 0) {
          if (indicatorValue < 50) {
            backGroundColor = data[0]["data"]["colorMapping"]["lower"];
          } else if (indicatorValue >= 50 && indicatorValue < 75) {
            backGroundColor = data[0]["data"]["colorMapping"]["middle"];
          } else {
            backGroundColor = data[0]["data"]["colorMapping"]["upper"];
          }
          if (element) {
            element.setAttribute(
              "style",
              "background-color:" + backGroundColor
            );
          }
        } else {
          if (element) {
            element.removeAttribute("style");
            element.setAttribute(
              "style",
              "background-color:" + backGroundColor
            );
          }
        }
      })
      .catch(error => {
        // error
        console.log("error::" + JSON.stringify(error));
      });
    const element: any = document.getElementById(`indicator${id}`);
    if (element) {
      element.value = `${indicatorValue}`;
    }
  }
  if (
    dhis2 &&
    dhis2.customFomProgramIndicators &&
    dhis2.customFomProgramIndicators.updateColorLableForApp
  ) {
    dhis2.customFomProgramIndicators.updateColorLableForApp();
  }
}

export function evaluateCustomFomAggregateIndicators(indicators: any[]) {
  indicators.map((indicator: any) => {
    const { numerator, denominator, indicatorType, id } = indicator;
    const factor =
      indicatorType && indicatorType.factor ? indicatorType.factor : 1;
    const expresion = `(${numerator}/${denominator}) * ${factor}`;
    let value: any = 0;
    const generatedExpresion = generateExpresion(expresion);
    try {
      value = eval(generatedExpresion);
      if (isNaN(value)) {
        value = "-";
      } else {
        value = value.toFixed(1);
      }
      const element: any = document.getElementById(`indicator${id}`);
      if (element) {
        element.setAttribute("readonly", "readonly");
        element.setAttribute("disabled", "disabled");
        element.value = value;
      }
    } catch (e) {
      console.log("Fail to evaluate : " + generatedExpresion);
    }
  });
}

export function evaluateDataElementTotals() {
  try {
    _.each(
      document.querySelectorAll('[name="total"]'),
      (dataElementTotal: any) => {
        const dataElementid = dataElementTotal.getAttribute("dataelementid");
        const value = getDataElementTotalValue(dataElementid);
        dataElementTotal.value = value;
      }
    );
  } catch (error) {}
}

function generateExpresion(expression: string) {
  const formulaPattern = /#\{.+?\}/g;
  const separator = ".";
  if (expression) {
    const matcher = expression.match(formulaPattern);
    if (matcher) {
      matcher.map(match => {
        const operand = match.replace(/[#\{\}]/g, "");
        const isTotal = operand.indexOf(separator) == -1;
        let value = 0;
        if (isTotal) {
          value = getDataElementTotalValue(operand);
        } else {
          const elementId = `${operand.split(".").join("-")}-val`;
          const element: any = document.getElementById(elementId);
          value = element && element.value ? element.value : 0;
        }
        expression = expression.replace(match, `${value}`);
      });
    }
  }
  return expression;
}

function getDataElementTotalValue(dataElementId) {
  const selector = `[id^="${dataElementId}-"]`;
  let value = 0;
  _.each(document.querySelectorAll(selector), (element: any) => {
    const elementValue = element.value;
    if (elementValue && elementValue !== "" && !isNaN(elementValue)) {
      value += parseFloat(elementValue);
    }
  });
  return value;
}

function createAndExecuteIfStatement(elem, elementValues) {
  const trueValue = elem.split(",")[1];
  let falseValue = elem.split(",")[2].split(")")[0];
  const logicalOperator = getLogicalOperator(elem);
  const leftSideValue = getLeftSideValue(elem, elementValues, logicalOperator);
  const rightSideValue = getRightSideValue(elem, logicalOperator);
  if (logicalOperator == "==" || logicalOperator == "===") {
    if (leftSideValue == rightSideValue) {
      return Number(trueValue);
    } else {
      return Number(getFalseValue(falseValue, elementValues));
    }
  } else if (logicalOperator == ">=" || logicalOperator == ">==") {
    if (leftSideValue >= rightSideValue) {
      return Number(trueValue);
    } else {
      return Number(getFalseValue(falseValue, elementValues));
    }
  } else if (logicalOperator == "<=" || logicalOperator == "<==") {
    if (leftSideValue <= rightSideValue) {
      return Number(trueValue);
    } else {
      return Number(getFalseValue(falseValue, elementValues));
    }
  }
}

function getLogicalOperator(elem) {
  return elem.match(/\s*==|\s*>=|\s*<=|\s*<|\s*>|\s*!=|\s*!==/g);
}

function getFalseValue(falseValue, elementValues) {
  if (falseValue.length < 11) {
    return falseValue;
  } else {
    if (elementValues[falseValue.split("{")[1].split("}")[0]]) {
      return elementValues[falseValue.split("{")[1].split("}")[0]];
    } else {
      return 0;
    }
  }
}

function getRightSideValue(elem, logicalOperator) {
  // remove spaces
  const newElem = elem
    .replace(/\t/g, "")
    .replace(/\n/g, "")
    .replace(/ /g, "")
    .replace(/  /g, "");

  if (newElem.indexOf(logicalOperator) > -1 && newElem.indexOf("'") > -1) {
    return Number(newElem.split(logicalOperator)[1].split("'")[0]);
  } else {
    return 0;
  }
}

function getLeftSideValue(elem, elementValues, logicalOperator) {
  if (elem.indexOf("condition") > -1) {
    const newElem = elem
      .split("d2:condition('#{")
      .join("")
      .replace(/\t/g, "")
      .replace(/\n/g, "")
      .replace(/ /g, "")
      .replace(/  /g, "")
      .split("}" + logicalOperator)[0];

    if (elementValues[newElem]) {
      return elementValues[newElem];
    } else {
      return 0;
    }
  } else {
    return 0;
  }
}

function splitExp(expression) {
  return expression
    .replace(/\+/g, "SPC-")
    .replace(/\//g, "SPC-")
    .replace(/\*/g, "SPC-");
}

function getProgramIndicatorValueFromExpression(expression: string) {
  // alert("expression: " + expression);
  let checkIfAtLeastValueIsFilled = [];
  let indicatorValue = "0";
  try {
    const indictorUidValue = {};
    const uids = getUidsFromExpression(expression);
    for (const uid of uids) {
      const elementId = uid.split(".").join("-");
      const element: any = document.getElementById(`${elementId}-val`);
      const value = element && element.value ? element.value : "0";
      if (element && element.value) {
        checkIfAtLeastValueIsFilled.push(element.value);
      }
      indictorUidValue[uid] = value;
    }
    indicatorValue = getEvaluatedIndicatorValueFromExpression(
      expression,
      indictorUidValue
    );
  } catch (error) {
    console.log({ error, type: "evaluation of program indicators" });
  }
  return {
    value: indicatorValue,
    checkIfAtLeastValueIsFilled: checkIfAtLeastValueIsFilled
  };
}

function getUidsFromExpression(expression: string) {
  let uids = [];
  const matchRegrex = /(\{.*?\})/gi;
  expression.match(matchRegrex).forEach(function(value) {
    uids = uids.concat(
      value
        .replace("{", ":separator:")
        .replace("}", ":separator:")
        .split(":separator:")
        .filter(content => content.length > 0)
    );
  });
  return uids;
}
function getEvaluatedIndicatorValueFromExpression(
  expression: string,
  indicatorIdToValueObject: any
) {
  let ogExpression = expression;
  let evaluatedValue = 0;
  const formulaPattern = /#\{.+?\}/g;
  if (expression && expression.indexOf("d2:") == -1) {
    const matcher = expression.match(formulaPattern);
    if (matcher) {
      matcher.map(function(match) {
        var operand = match.replace(/[#\{\}]/g, "");
        const value =
          indicatorIdToValueObject && indicatorIdToValueObject[operand]
            ? indicatorIdToValueObject[operand]
            : 0;
        expression = expression.replace(match, value);
      });
    }
  } else {
    // d2 function support level 1
    // TODO: Add support for all D2 function in DHIS and improve the regex string operations
    expression = expression.replace(/[ \t\r\n]/g, "");
    _.map(splitExp(expression).split("SPC-"), elem => {
      // create if statement
      let logicExecutedValue = 0;
      if (elem.length < 10) {
      } else if (elem.indexOf("d2:condition") > -1) {
        logicExecutedValue = createAndExecuteIfStatement(
          elem,
          indicatorIdToValueObject
        );
        if (isNaN(logicExecutedValue)) {
          logicExecutedValue = 0;
        }
        const newElem = elem.match(/d2:condition\(('[^)]+)\)/g);
        expression = expression.replace(newElem, logicExecutedValue.toString());
      } else {
        const operand = elem.replace(/[(#\{\})]/g, "");
        if (indicatorIdToValueObject[operand]) {
          logicExecutedValue = indicatorIdToValueObject[operand];
        }
        const newElem = elem.match(/#\{.+?\}/g);
        expression = expression.replace(newElem, logicExecutedValue.toString());
      }
    });
  }
  try {
    if (!isNaN(eval(expression))) {
      evaluatedValue = eval(expression);
    }
  } catch (e) {}
  return evaluatedValue.toFixed(1);
}
