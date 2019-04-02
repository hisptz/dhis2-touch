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
import * as _ from 'lodash';
import {
  evaluateCustomFomProgramIndicators,
  evaluateCustomFomAggregateIndicators,
  evaluateDataElementTotals
} from './custom-form-indicators-helper';

function getSanitizedValue(value, type) {
  switch (type) {
    case 'TRUE_ONLY':
      return convertToBoolean(value);
    default:
      return value;
  }
}

function convertToBoolean(stringValue) {
  return stringValue === 'true' ? Boolean(true) : stringValue;
}

function getSelectInput(id, value, options) {
  const selectElement = document.createElement('select');
  selectElement.setAttribute('id', id);
  selectElement.setAttribute('class', 'entryselect');

  const defaultOption = document.createElement('option');
  defaultOption.disabled = false;
  defaultOption.selected = true;
  defaultOption.value = '';
  selectElement.appendChild(defaultOption);

  options.forEach(function(option) {
    const optionElement = document.createElement('option');
    optionElement.value = option.code;
    optionElement.appendChild(document.createTextNode(option.name));
    optionElement;
    if (option.code === value) {
      optionElement.selected = true;
    }

    selectElement.appendChild(optionElement);
  });

  return selectElement;
}

function getTextArea(id, value) {
  const textarea = document.createElement('textarea');
  textarea.setAttribute('id', id);
  textarea.setAttribute('name', 'entryform');
  textarea.setAttribute('class', 'entryfield');
  textarea.value = value;
  return textarea;
}

function getRadioInputs(id, savedValue) {
  const radioContainer = document.createElement('div');

  if (savedValue == 'true') {
    const yesInput = document.createElement('input');
    yesInput.setAttribute('type', 'radio');
    yesInput.setAttribute('id', id);
    yesInput.setAttribute('name', id);
    yesInput.setAttribute('class', 'entryfield-radio');
    yesInput.checked = true;
    yesInput.value = 'true';

    const noInput = document.createElement('input');
    noInput.setAttribute('type', 'radio');
    noInput.setAttribute('id', id);
    noInput.setAttribute('name', id);
    noInput.setAttribute('class', 'entryfield-radio');
    noInput.value = 'false';

    const noValueInput = document.createElement('input');
    noValueInput.setAttribute('type', 'radio');
    noValueInput.setAttribute('id', id);
    noValueInput.setAttribute('name', id);
    noValueInput.setAttribute('class', 'entryfield-radio');
    noValueInput.value = '';

    radioContainer.appendChild(yesInput);
    radioContainer.appendChild(document.createTextNode(' Yes'));

    radioContainer.appendChild(noInput);
    radioContainer.appendChild(document.createTextNode(' No'));

    radioContainer.appendChild(noValueInput);
    radioContainer.appendChild(document.createTextNode(' No value'));
  } else if (savedValue == 'false') {
    const yesInput = document.createElement('input');
    yesInput.setAttribute('type', 'radio');
    yesInput.setAttribute('name', id);
    yesInput.setAttribute('id', id);
    yesInput.setAttribute('class', 'entryfield-radio');
    yesInput.value = 'true';

    const noInput = document.createElement('input');
    noInput.setAttribute('type', 'radio');
    noInput.setAttribute('name', id);
    noInput.setAttribute('id', id);
    noInput.setAttribute('class', 'entryfield-radio');
    noInput.checked = true;
    noInput.value = 'false';

    const noValueInput = document.createElement('input');
    noValueInput.setAttribute('type', 'radio');
    noValueInput.setAttribute('id', id);
    noValueInput.setAttribute('name', id);
    noValueInput.setAttribute('class', 'entryfield-radio');
    noValueInput.value = '';

    radioContainer.appendChild(yesInput);
    radioContainer.appendChild(document.createTextNode(' Yes'));

    radioContainer.appendChild(noInput);
    radioContainer.appendChild(document.createTextNode(' No'));

    radioContainer.appendChild(noValueInput);
    radioContainer.appendChild(document.createTextNode(' No value'));
  } else {
    const yesInput = document.createElement('input');
    yesInput.setAttribute('type', 'radio');
    yesInput.setAttribute('id', id);
    yesInput.setAttribute('name', id);
    yesInput.setAttribute('class', 'entryfield-radio');
    yesInput.value = 'true';

    const noInput = document.createElement('input');
    noInput.setAttribute('type', 'radio');
    noInput.setAttribute('id', id);
    noInput.setAttribute('name', id);
    noInput.setAttribute('class', 'entryfield-radio');
    noInput.value = 'false';

    const noValueInput = document.createElement('input');
    noValueInput.setAttribute('type', 'radio');
    noValueInput.setAttribute('id', id);
    noValueInput.setAttribute('name', id);
    noValueInput.setAttribute('class', 'entryfield-radio');
    noValueInput.value = '';

    radioContainer.appendChild(yesInput);
    radioContainer.appendChild(document.createTextNode(' Yes'));

    radioContainer.appendChild(noInput);
    radioContainer.appendChild(document.createTextNode(' No'));

    radioContainer.appendChild(noValueInput);
    radioContainer.appendChild(document.createTextNode(' No value'));
  }

  return radioContainer;
}

export function updateFormFieldColor(elementId, statusColor) {
  const element = document.getElementById(elementId);
  if (element) {
    element.style.borderColor = statusColor;
  }
}

function getDataValue(data, id) {
  var dataObject = data[id];
  return dataObject ? dataObject.value : '';
}

export function onFormReady(
  formType,
  dataElements,
  programIndicators,
  indicators,
  dataValues,
  dataSetReportAggregateValues,
  entryFormStatusColors,
  scriptsContentsArray,
  formReady
) {
  // Find input items and set required properties to them
  const dataElementObjects = _.keyBy(dataElements, 'id');
  const inputElements: any = document.getElementsByTagName('INPUT');
  const elementsWithOptionSet = {};
  const elementsWithTextArea = {};
  const elementsWithRadioInput = {};
  if (dataSetReportAggregateValues) {
    const elementIdObjects = Object.keys(dataSetReportAggregateValues).map(
      key => {
        return {
          id: key,
          elementId: `${key}-val`
        };
      }
    );
    for (const elementIdObject of elementIdObjects) {
      try {
        const { id, elementId } = elementIdObject;
        const { value, optionCodeName } = dataSetReportAggregateValues[id];
        const inputElement: any = document.getElementById(elementId);
        const inputElementParent = inputElement.parentNode;
        var labelElement = document.createElement('label');
        var optionCodeNameElement = document.createElement('span');
        optionCodeNameElement.setAttribute(
          'style',
          'font-weight: bold;font-style: italic;'
        );
        labelElement.appendChild(document.createTextNode(value));
        optionCodeNameElement.appendChild(
          document.createTextNode(optionCodeName)
        );
        labelElement.appendChild(optionCodeNameElement);
        inputElementParent.insertBefore(labelElement, inputElement.nextSibling);
        inputElement.setAttribute('style', 'display:none');
      } catch (error) {
        console.log(JSON.stringify({ type: ' input', error }));
      }
    }
  } else {
    _.each(inputElements, (inputElement: any) => {
      if (inputElement) {
        //empty value set on design inputs
        if (inputElement && inputElement.hasAttribute('value')) {
          inputElement.setAttribute('value', '');
        }
        // Get attribute from the element
        let elementId = inputElement.getAttribute('id')
          ? inputElement.getAttribute('id')
          : inputElement.getAttribute('attributeid');
        // Get splitted ID to get data element and category combo ids
        const splitedId =
          formType === 'aggregate' || formType === 'event'
            ? elementId
              ? elementId.split('-')
              : []
            : [];

        const dataElementId =
          formType === 'event' ? splitedId[1] : splitedId[0];

        const optionComboId =
          formType === 'event'
            ? 'dataElement'
            : formType === 'tracker'
            ? 'trackedEntityAttribute'
            : splitedId[1];

        // // Get data element details

        const dataElementDetails = dataElementObjects[dataElementId]
          ? dataElementObjects[dataElementId]
          : {};

        // // Get dataElement type
        const dataElementType = dataElementDetails
          ? dataElementDetails.valueType
          : null;

        // // Get element value
        const dataElementValue = getSanitizedValue(
          getDataValue(dataValues, dataElementId + '-' + optionComboId),
          dataElementType
        );
        // // Update DOM based on data element type
        if (dataElementType) {
          if (dataElementDetails.optionSet) {
            const selectInput = getSelectInput(
              elementId,
              dataElementValue,
              dataElementDetails.optionSet.options
            );
            elementsWithOptionSet[elementId] = selectInput;
          } else {
            if (dataElementType === 'TRUE_ONLY') {
              inputElement.setAttribute('type', 'checkbox');
              inputElement.setAttribute('class', 'entrytrueonly');
              inputElement.checked = dataElementValue;
            } else if (dataElementType === 'LONG_TEXT') {
              elementsWithTextArea[elementId] = getTextArea(
                elementId,
                dataElementValue
              );
            } else if (dataElementType === 'DATE') {
              inputElement.setAttribute('type', 'date');
              inputElement.setAttribute('class', 'entryfield');
              inputElement.value = dataElementValue;
            } else if (dataElementType === 'BOOLEAN') {
              elementsWithRadioInput[elementId] = getRadioInputs(
                elementId,
                dataElementValue
              );
            } else if (
              dataElementType === 'PERCENTAGE' ||
              dataElementType === 'NUMBER' ||
              dataElementType.indexOf('INTEGER') > -1
            ) {
              inputElement.setAttribute('type', 'number');
              inputElement.setAttribute('class', 'entryfield');
              if (dataElementType === 'INTEGER_POSITIVE') {
                inputElement.setAttribute('min', 1);
              } else if (dataElementType === 'INTEGER_NEGATIVE') {
                inputElement.setAttribute('max', -1);
              } else if (dataElementType === 'INTEGER_ZERO_OR_POSITIVE') {
                inputElement.setAttribute('min', 0);
              } else if (dataElementType === 'PERCENTAGE') {
                inputElement.setAttribute('min', 0);
                inputElement.setAttribute('max', 100);
              }
              inputElement.value = dataElementValue;
            } else {
              inputElement.setAttribute('class', 'entryfield');
              inputElement.value = dataElementValue;
            }
          }
        } else {
          // TODO Find ways to deal with input that
          if (
            (inputElement &&
              inputElement.hasAttribute('name') &&
              inputElement.getAttribute('name') === 'indicator') ||
            inputElement.getAttribute('name') === 'total'
          ) {
            inputElement.setAttribute('value', '0');
            inputElement.setAttribute('class', 'entryfield-total');
            inputElement.setAttribute('readonly', 'readonly');
            inputElement.setAttribute('disabled', 'disabled');
          }
        }
      }
    });

    // update option sets
    for (let elementId of Object.keys(elementsWithOptionSet)) {
      try {
        const inputElement: any = document.getElementById(elementId);
        const selectInput = elementsWithOptionSet[elementId];
        inputElement.replaceWith(selectInput);
      } catch (error) {
        console.log(JSON.stringify({ type: 'Select input', error }));
      }
    }

    // update option sets
    for (let elementId of Object.keys(elementsWithRadioInput)) {
      try {
        const inputElement: any = document.getElementById(elementId);
        const redioInput = elementsWithRadioInput[elementId];
        inputElement.replaceWith(redioInput);
      } catch (error) {
        console.log(JSON.stringify({ type: 'Radio input', error }));
      }
    }

    // update text area
    for (let elementId of Object.keys(elementsWithTextArea)) {
      try {
        const inputElement: any = document.getElementById(elementId);
        const textAreaInput = elementsWithTextArea[elementId];
        inputElement.replaceWith(textAreaInput, inputElement);
        inputElement.parentNode.removeChild(inputElement);
      } catch (error) {
        console.log(JSON.stringify({ type: 'Text area input', error }));
      }
    }
    if (formType === 'event') {
      evaluateCustomFomProgramIndicators(programIndicators);
    } else if (formType === 'aggregate') {
      evaluateCustomFomAggregateIndicators(indicators);
      evaluateDataElementTotals();
    }
  }

  formReady(
    formType,
    entryFormStatusColors,
    programIndicators,
    indicators,
    scriptsContentsArray
  );
}

export function onDataValueChange(
  element: any,
  entryFormType: string,
  entryFormColors: any
) {
  if (element) {
    // Get attribute from the element
    const elementId = element.getAttribute('id');

    // Get splitted ID to get data element and category combo ids
    const splitedId = elementId ? elementId.split('-') : [];

    const dataElementId =
      entryFormType === 'event' ? splitedId[1] : splitedId[0];
    const optionComboId =
      entryFormType === 'event'
        ? 'dataElement'
        : entryFormType === 'tracker'
        ? 'trackedEntityAttribute'
        : splitedId[1];

    // find element value
    const elementValue = element.value;

    // Update item color
    updateFormFieldColor(elementId, entryFormColors['WAIT']);

    // create custom event for saving data values
    const dataValueEvent = new CustomEvent('dataValueUpdate', {
      detail: {
        id: `${dataElementId}-${optionComboId}`,
        value: elementValue,
        status: 'not-synced',
        domElementId: elementId
      }
    });
    document.body.dispatchEvent(dataValueEvent);
  }
}

export function lockingEntryFormFields(shouldLockFields) {
  _.each(document.getElementsByClassName('entryfield'), (inputElement: any) => {
    if (shouldLockFields) {
      inputElement.setAttribute('readonly', 'readonly');
      inputElement.setAttribute('disabled', 'disabled');
    } else {
      inputElement.removeAttribute('disabled');
      inputElement.removeAttribute('readonly');
    }
  });
  _.each(
    document.getElementsByClassName('entryselect'),
    (inputElement: any) => {
      if (shouldLockFields) {
        inputElement.setAttribute('readonly', 'readonly');
        inputElement.setAttribute('disabled', 'disabled');
      } else {
        inputElement.removeAttribute('disabled');
        inputElement.removeAttribute('readonly');
      }
    }
  );
  _.each(
    document.getElementsByClassName('entrytrueonly'),
    (inputElement: any) => {
      if (shouldLockFields) {
        inputElement.setAttribute('readonly', 'readonly');
        inputElement.setAttribute('disabled', 'disabled');
      } else {
        inputElement.removeAttribute('disabled');
        inputElement.removeAttribute('readonly');
      }
    }
  );
  _.each(
    document.getElementsByClassName('entryfileresource'),
    (inputElement: any) => {
      if (shouldLockFields) {
        inputElement.setAttribute('readonly', 'readonly');
        inputElement.setAttribute('disabled', 'disabled');
      } else {
        inputElement.removeAttribute('disabled');
        inputElement.removeAttribute('readonly');
      }
    }
  );
  _.each(
    document.getElementsByClassName('entryfield-radio'),
    (inputElement: any) => {
      if (shouldLockFields) {
        inputElement.setAttribute('readonly', 'readonly');
        inputElement.setAttribute('disabled', 'disabled');
      } else {
        inputElement.removeAttribute('disabled');
        inputElement.removeAttribute('readonly');
      }
    }
  );
}
