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
    let filledElementsCount = 0;
    const { id, expression, filter } = programIndicator;
    if (filter) {
      // console.log(JSON.stringify({ filter }));
    }
    let indicatorValue = 0;
    indicatorValue = Number(
      getProgramIndicatorValueFromExpression(expression)["value"]
    );
    // filledElements
    filledElementsCount = getProgramIndicatorValueFromExpression(expression)[
      "filledElements"
    ].length;
    dhis2["indicator" + id] = filledElementsCount;
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
  let leftSideValue = getLeftSideValue(elem, elementValues, logicalOperator);
  let rightSideValue = getRightSideValue(elem, logicalOperator);
  if (!logicalOperator) {
    if (leftSideValue == null) {
      return getFalseValue(falseValue, elementValues);
    } else {
      return trueValue;
    }
  } else {
    if (logicalOperator == "==" || logicalOperator == "===") {
      if (leftSideValue == rightSideValue) {
        return Number(trueValue);
      } else {
        return Number(getFalseValue(falseValue, elementValues));
      }
    } else if (logicalOperator == ">=" || logicalOperator == ">==") {
      if (leftSideValue >= rightSideValue && leftSideValue != null) {
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
    } else if (logicalOperator == "!=" || logicalOperator == "!==") {
      if (leftSideValue != rightSideValue) {
        return Number(trueValue);
      } else {
        return Number(getFalseValue(falseValue, elementValues));
      }
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
    return newElem.split(logicalOperator)[1].split("'")[0];
  } else {
    return null;
  }
}

function getLeftSideValue(elem, elementValues, logicalOperator) {
  if (elem.indexOf("condition") > -1) {
    if (logicalOperator) {
      elem =
        elem.split(logicalOperator)[0] +
        "'"
          .replace(/\t/g, "")
          .replace(/\n/g, "")
          .replace(/ /g, "")
          .replace(/  /g, "");
    }
    let newElem = elem.match(/\#{([^{]+[^)]+)}'/g)[0];
    newElem = newElem.replace(/[#\{\}']/g, "");
    // console.log("newElem::" + newElem);
    if (elementValues[newElem]) {
      return elementValues[newElem];
    } else {
      return null;
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
  let filledElements = [];
  let indicatorValue = "0";
  const indictorUidValue = {};
  try {
    const uids = getUidsFromExpression(expression);
    for (const uid of uids) {
      const elementId = uid.split(".").join("-");
      const element: any = document.getElementById(`${elementId}-val`);
      const value = element && element.value ? element.value : 0;
      if (element && element.value && element.value != "") {
        filledElements.push(element.value);
        indictorUidValue[uid] = value;
      }
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
    filledElements: filledElements
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
  let evaluatedValue = 0;
  const formulaPattern = /#\{.+?\}/g;
  if (expression && expression.indexOf("d2:condition") == -1) {
    const matcher = expression.match(formulaPattern);
    if (matcher) {
      matcher.map(function(match) {
        let operand = match.replace(/[#\{\}]/g, "");
        let value =
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
