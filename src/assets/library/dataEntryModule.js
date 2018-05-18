function getTextArea(id, value) {
  return "<textarea id=\"" + id + "\" name=\"entryform\" class=\"entryfield\">" + (value ? value : "") + "</textarea>";
}

function getRadioInputs(id, savedValue) {
  var inputs;
  if (savedValue == "true") {
    inputs = "<input id=\"" + id + "\" type=\"radio\" name=\"" + id + "\" value=\"true\" class=\"entryfield\" checked> Yes " +
      "<input id=\"" + id + "\" type=\"radio\" name=\"" + id + "\" value=\"false\" class=\"entryfield\"> No";
  } else if (savedValue == "false") {
    inputs = "<input id=\"" + id + "\" type=\"radio\" name=\"" + id + "\" value=\"true\" class=\"entryfield\"> Yes " +
      "<input id=\"" + id + "\" type=\"radio\" name=\"" + id + "\" value=\"false\" class=\"entryfield\" checked> No";
  } else {
    inputs = "<input id=\"" + id + "\" type=\"radio\" name=\"" + id + "\" value=\"true\" class=\"entryfield\"> Yes " +
      "<input id=\"" + id + "\" type=\"radio\"  name=\"" + id + "\" value=\"false\" class=\"entryfield\"> No";
  }

  return inputs;
}

function getSelectInput(id, value, options) {
  var select = "<select id=\"" + id + "\" class=\"entryselect\"><option value=\"\" disabled selected>Select option</option>";

  options.forEach(function (option) {
    if (option.code === value) {
      select += "<option value=\"" + option.code + "\" selected>" + option.name + "</option>";
    } else {
      select += "<option value=\"" + option.code + "\">" + option.name + "</option>";
    }
  });
  select += "</select>";
  return select;
}

function getDataValue(data, id) {
  var dataObject = data[id];
  return dataObject ? dataObject.value : null;
}

function getDataElementDetails(dataElements, dataElementId) {
  var dataElementDetails;
  dataElements.forEach(function (dataElement) {
    if (dataElement.id === dataElementId) {
      dataElementDetails = dataElement;
    }
  });
  return dataElementDetails;
}

function getSanitizedValue(value, type) {
  switch (type) {
    case "TRUE_ONLY":
      return convertToBoolean(value);
    default:
      return value;
  }
}

function convertToBoolean(stringValue) {
  return stringValue == "true" ? Boolean(true) : "false" ? Boolean(false) : stringValue;
}

var dataEntry = {
  onFormReady: function (formType, dataElements, data, formReady) {
    $("input").each(function () {
      var elementId = $(this).attr("id");
      var attributeId = $(this).attr("attributeid");
      var id = formType === "aggregate" || formType === "event" ? elementId ? elementId.split("-") : [] :
        attributeId ? attributeId.split("-") : [];
      var dataElementId = formType === "event" ? id[1] : id[0];
      var optionComboId = formType === "event" ? "dataElement" :
        formType === "tracker" ? "trackedEntityAttribute" : id[1];

      // create new id if not available
      if (!$(this).attr("id")) {
        $(this).attr("id", dataElementId + "-" + optionComboId + "-val");
      }

      var dataElementDetails = getDataElementDetails(dataElements, dataElementId);

      // get dataElement type
      var type = dataElementDetails ? dataElementDetails.valueType : null;
      var value = getSanitizedValue(getDataValue(data, dataElementId + "-" + optionComboId, type));

      // update input with corresponding type

      if (type) {
        if (dataElementDetails.optionSet) {
          $(this).replaceWith(getSelectInput($(this).attr("id"), value, dataElementDetails.optionSet.options));
        } else {
          if (type === "TRUE_ONLY") {
            $(this).attr("type", "checkbox");
            $(this).attr("class", "entrytrueonly");
            $(this).attr("value", true);
            $(this).attr("checked", value);
          } else if (type === "LONG_TEXT") {
            $(this).replaceWith(getTextArea($(this).attr("id"), value));
            $(this).val(value);
          } else if (type === "DATE") {
            $(this).attr("type", "date");
            $(this).attr("class", "entryfield");
            $(this).val(value);
          } else if (type === "BOOLEAN") {
            $(this).replaceWith(getRadioInputs($(this).attr("id"), value));
            $(this).attr("class", "entryfield");
          } else if (type === "NUMBER" || type.indexOf("INTEGER") > -1) {
            $(this).attr("type", "number");
            $(this).attr("class", "entryfield");
            if (type === "INTEGER_POSITIVE") {
              $(this).attr("min", 1);
            } else if (type === "INTEGER_NEGATIVE") {
              $(this).attr("max", -1);
            } else if (type === "INTEGER_ZERO_OR_POSITIVE") {
              $(this).attr("min", 0);
            }
            $(this).val(value);
          } else {
            $(this).attr("class", "entryfield");
            $(this).val(value);
          }
        }
      }

    });
    formReady();
  },

  updateFormFieldColor: function (elementId, statusColor) {
    document.getElementById(elementId).style.backgroundColor = statusColor;
  }
};
