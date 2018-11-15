import * as _ from 'lodash';

function getSanitizedValue(value, type) {
  switch (type) {
    case 'TRUE_ONLY':
      return convertToBoolean(value);
    default:
      return value;
  }
}

function convertToBoolean(stringValue) {
  return stringValue === 'true'
    ? Boolean(true)
    : 'false'
    ? Boolean(false)
    : stringValue;
}

function getSelectInput(id, value, options) {
  let select =
    '<select id="' +
    id +
    '" class="entryselect"><option value="" disabled selected>Select option</option>';

  options.forEach(function(option) {
    if (option.code === value) {
      select +=
        '<option value="' +
        option.code +
        '" selected>' +
        option.name +
        '</option>';
    } else {
      select +=
        '<option value="' + option.code + '">' + option.name + '</option>';
    }
  });
  select += '</select>';
  return select;
}

function getTextArea(id, value) {
  return (
    '<textarea id="' +
    id +
    '" name="entryform" class="entryfield">' +
    (value ? value : '') +
    '</textarea>'
  );
}

function getRadioInputs(id, savedValue) {
  var inputs;
  if (savedValue == 'true') {
    inputs =
      '<input id="' +
      id +
      '" type="radio" name="' +
      id +
      '" value="true" class="entryfield" checked> Yes ' +
      '<input id="' +
      id +
      '" type="radio" name="' +
      id +
      '" value="false" class="entryfield"> No';
  } else if (savedValue == 'false') {
    inputs =
      '<input id="' +
      id +
      '" type="radio" name="' +
      id +
      '" value="true" class="entryfield"> Yes ' +
      '<input id="' +
      id +
      '" type="radio" name="' +
      id +
      '" value="false" class="entryfield" checked> No';
  } else {
    inputs =
      '<input id="' +
      id +
      '" type="radio" name="' +
      id +
      '" value="true" class="entryfield"> Yes ' +
      '<input id="' +
      id +
      '" type="radio"  name="' +
      id +
      '" value="false" class="entryfield"> No';
  }

  return inputs;
}

export function updateFormFieldColor(elementId, statusColor) {
  const element = document.getElementById(elementId);
  if (element) {
    element.style.borderColor = statusColor;
  }
}

function getDataValue(data, id) {
  var dataObject = data[id];
  return dataObject ? dataObject.value : null;
}

export function onFormReady(
  formType,
  dataElements,
  dataValues,
  entryFormStatusColors,
  scriptsContentsArray,
  formReady
) {
  // Find input items and set required properties to them
  const inputElements = document.getElementsByTagName('INPUT');
  _.each(inputElements, (inputElement: any) => {
    // Get attribute from the element
    const elementId = inputElement.getAttribute('id');
    const attributeId = inputElement.getAttribute('attributeid');

    // Get splitted ID to get data element and category combo ids
    const splitedId =
      formType === 'aggregate' || formType === 'event'
        ? elementId
          ? elementId.split('-')
          : []
        : attributeId
        ? attributeId.split('-')
        : [];

    const dataElementId = formType === 'event' ? splitedId[1] : splitedId[0];
    const optionComboId =
      formType === 'event'
        ? 'dataElement'
        : formType === 'tracker'
        ? 'trackedEntityAttribute'
        : splitedId[1];

    // Get data element details

    const dataElementDetails = _.find(dataElements, ['id', dataElementId]);
    // Get dataElement type
    const dataElementType = dataElementDetails
      ? dataElementDetails.valueType
      : null;

    // Get element value
    const dataElementValue = getSanitizedValue(
      getDataValue(dataValues, dataElementId + '-' + optionComboId),
      dataElementType
    );

    // Update DOM based on data element type
    if (dataElementType) {
      if (dataElementDetails.optionSet) {
        inputElement.replaceWith(
          getSelectInput(
            elementId,
            dataElementValue,
            dataElementDetails.optionSet.options
          )
        );
      } else {
        if (dataElementType === 'TRUE_ONLY') {
          inputElement.setAttribute('type', 'checkbox');
          inputElement.setAttribute('class', 'entrytrueonly');
          inputElement.setAttribute('value', true);
          inputElement.setAttribute('checked', dataElementValue);
        } else if (dataElementType === 'LONG_TEXT') {
          inputElement.replaceWith(getTextArea(elementId, dataElementValue));
          inputElement.value = dataElementValue;
        } else if (dataElementType === 'DATE') {
          inputElement.setAttribute('type', 'date');
          inputElement.setAttribute('class', 'entryfield');
          inputElement.value = dataElementValue;
        } else if (dataElementType === 'BOOLEAN') {
          inputElement.replaceWith(getRadioInputs(elementId, dataElementValue));
          inputElement.setAttribute('class', 'entryfield');
        } else if (
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
          }
          inputElement.value = dataElementValue;
        } else {
          inputElement.setAttribute('class', 'entryfield');
          inputElement.value = dataElementValue;
        }
      }
    } else {
      // TODO Find ways to deal with input that
    }
  });

  formReady(formType, entryFormStatusColors, scriptsContentsArray);
}

export function onDataValueChange(
  element: any,
  entryFormType: string,
  entryFormColors: any
) {
  // Get attribute from the element
  const elementId = element.getAttribute('id');

  // Get splitted ID to get data element and category combo ids
  const splitedId = elementId ? elementId.split('-') : [];

  const dataElementId = entryFormType === 'event' ? splitedId[1] : splitedId[0];
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
