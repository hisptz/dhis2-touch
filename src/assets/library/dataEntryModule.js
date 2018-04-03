function getTextArea(id, value) {
  return '<textarea id="' + id + '" name="entryform" class="entryfield">' + (value ? value: "") + '</textarea>';
}

function getRadioInputs(id, savedValue) {
  var inputs;
  if (savedValue == 'true') {
    inputs = '<input id="' + id + '" type="radio" name="' + id + '" value="true" class="entryfield" checked> Yes ' +
      '<input id="' + id + '" type="radio" name="' + id + '" value="false" class="entryfield"> No';
  } else if (savedValue == 'false') {
    inputs = '<input id="' + id + '" type="radio" name="' + id + '" value="true" class="entryfield"> Yes ' +
      '<input id="' + id + '" type="radio" name="' + id + '" value="false" class="entryfield" checked> No';
  } else {
    inputs = '<input id="' + id + '" type="radio" name="' + id + '" value="true" class="entryfield"> Yes ' +
      '<input id="' + id + '" type="radio"  name="' + id + '" value="false" class="entryfield"> No';
  }

  return inputs
}

function getDataValue(data, id) {
  var dataObject = data[id];
  return dataObject ? dataObject.value : null;
}

function getDataElementDetails(dataElements, dataElementId) {
  var dataElementDetails;
  dataElements.forEach(function(dataElement) {
    if (dataElement.id === dataElementId) {
      dataElementDetails = dataElement
    }
  });
  return dataElementDetails
}

function getSanitizedValue(value, type) {
  switch(type) {
    case 'TRUE_ONLY':
      return convertToBoolean(value)
    default:
      return value;
  }
}

function convertToBoolean(stringValue) {
  return stringValue == 'true' ? Boolean(true) : 'false' ? Boolean(false) : stringValue;
}

var dataEntry = {
  onFormReady: function ( formReady ) {
    $( "input" ).each( function () {
      var id = $( this ).attr( 'id' ).split( '-' );
      var dataElementId = id[ 0 ];
      var optionComboId = id[ 1 ];

      var dataElementDetails = getDataElementDetails( dataElements, dataElementId );

      // get dataElement type
      var type = dataElementDetails ? dataElementDetails.valueType : null;

      var value = getSanitizedValue( getDataValue( data, dataElementId + '-' + optionComboId ), type );

      $( this ).attr( 'class', 'entryfield' );

      // update input with corresponding type
      if ( type === 'TRUE_ONLY' ) {
        $( this ).attr( 'type', 'checkbox' );
        $( this ).attr( 'checked', value );
      } else if ( type === 'LONG_TEXT' ) {
        $( this ).replaceWith( getTextArea( $( this ).attr( 'id' ), value ) );
        $( this ).val( value );
      } else if ( type === 'DATE' ) {
        $( this ).attr( 'type', 'date' );
        $( this ).val( value );
      } else if ( type === 'BOOLEAN' ) {
        $( this ).replaceWith( getRadioInputs( $( this ).attr( 'id' ), value ) );
      } else if ( type === 'NUMBER' ) {
        $( this ).attr( 'type', 'number' );
        $( this ).val( value );
      } else {
        $( this ).val( value );
        alert( type );
      }
    } );
    formReady();
  }
};
