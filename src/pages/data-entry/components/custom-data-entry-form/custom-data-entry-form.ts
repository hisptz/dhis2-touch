import { Component, Input, OnInit, ElementRef, HostListener, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as _ from 'lodash';

/**
 * Generated class for the CustomDataEntryFormComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'custom-data-entry-form',
  templateUrl: 'custom-data-entry-form.html'
})
export class CustomDataEntryFormComponent implements OnInit, AfterViewInit {
  @Input() dataEntryFormDesign;
  @Input() data;
  @Input() entryFormSections;
  @Output() onCustomFormInputChange = new EventEmitter();

  _htmlMarkup: SafeHtml;
  hasScriptSet: boolean;

  constructor(private sanitizer: DomSanitizer, private elementRef: ElementRef) {
    this.hasScriptSet = false;

    document.body.addEventListener('dataValueUpdate', (e) => {
      const dataValueObject = e.detail;

      if (dataValueObject) {
        this.onCustomFormInputChange.emit(dataValueObject);
      }

    }, false);
  }

  ngOnInit() {
    try {
      this._htmlMarkup = this.sanitizer.bypassSecurityTrustHtml(
        this.dataEntryFormDesign
      );
    } catch (e) {
      console.log(JSON.stringify(e));
    }
  }

  ngAfterViewInit() {
    this.setScriptsOnHtmlContent(this.getScriptsContents(this.dataEntryFormDesign));
  }

  getScriptsContents(html) {
    let scriptsWithClosingScript = [];
    if (html.match(/<script[^>]*>([\w|\W]*)<\/script>/im)) {
      if (
        html.match(/<script[^>]*>([\w|\W]*)<\/script>/im)[0].split('<script>')
          .length > 0
      ) {
        html
          .match(/<script[^>]*>([\w|\W]*)<\/script>/im)[0]
          .split('<script>')
          .forEach((scriptFunctionWithCLosingScriptTag: any) => {
            if (scriptFunctionWithCLosingScriptTag != '') {
              scriptsWithClosingScript.push(
                scriptFunctionWithCLosingScriptTag.split('</script>')[0]
              );
            }
          });
      }
    }
    return scriptsWithClosingScript;
  }

  getDefaultScriptContents() {
    const script = `
    var data = ${JSON.stringify(this.data)};
    var dataElements = ${JSON.stringify(_.flatten(_.map(this.entryFormSections, entrySection => entrySection.dataElements)))}
    
    onFormReady(function () {
    $('.entryfield').change(function() {
      var id = $( this ).attr( 'id' ).split('-');
      var dataElementId = id[0];
      var optionComboId = id[1];
     
      var dataValueEvent = new CustomEvent("dataValueUpdate", {detail: {id: dataElementId + '-' + optionComboId, value: $(this).val(), status: 'not-synced'}});
      document.body.dispatchEvent(dataValueEvent);
    })
    })
    
    function onFormReady(formReady) {
      $("input").each(function() {
      var id = $( this ).attr( 'id' ).split('-');
      var dataElementId = id[0];
      var optionComboId = id[1];
      
      var dataElementDetails = getDataElementDetails(dataElements, dataElementId);
      
      // get dataElement type
      var type = dataElementDetails ? dataElementDetails.valueType : null;
      
      var value = getSanitizedValue(getDataValue(data, dataElementId + '-' + optionComboId), type);
      
      $(this).attr('class', 'entryfield');

      // update input with corresponding type
      if (type === 'TRUE_ONLY') {
          $(this).attr('type', 'checkbox');
          $(this).attr('checked', value);
       } else if (type === 'LONG_TEXT') {
          $(this).replaceWith(getTextArea(id, value));
          $(this).val(value);
       } else if (type === 'DATE') {
          $(this).attr('type', 'date');
          $(this).val(value);
       } else if (type === 'BOOLEAN') {
          $(this).replaceWith(getRadioInputs(id, value));
       } else if (type === 'NUMBER') {
          $(this).attr('type', 'number');
          $(this).val(value)
       } else {
          $(this).val(value)
          alert(type)
       }
    });
      formReady();
    }

    function getTextArea(id, value) {
        return '<textarea id="' + id + '" name="entryform" class="entryfield">' + value + '</textarea>';
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
        })
        
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
    `;
    return script;
  }

  setScriptsOnHtmlContent(scriptsContentsArray) {
    scriptsContentsArray = [this.getDefaultScriptContents(), ...scriptsContentsArray]
    if (!this.hasScriptSet) {
      scriptsContentsArray.forEach(scriptsContents => {
        if (scriptsContents.indexOf('<script') > -1) {
          try {
            let srcUrl = this.getScriptUrl(scriptsContents);
            let script = document.createElement('script');
            this.elementRef.nativeElement.appendChild(script);
          } catch (e) {
            console.log('error : ' + JSON.stringify(e));
            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.innerHTML = scriptsContents;
            this.elementRef.nativeElement.appendChild(script);
          }
        } else {
          let script = document.createElement('script');
          script.type = 'text/javascript';
          script.innerHTML = scriptsContents;
          this.elementRef.nativeElement.appendChild(script);
        }
      });
      this.hasScriptSet = true;
    }
  }

  getScriptUrl(scriptsContents) {
    let url = '';
    if (scriptsContents && scriptsContents.split('<script').length > 0) {
      scriptsContents.split('<script').forEach((scriptsContent: any) => {
        if (scriptsContent != '') {
          url = scriptsContent.split('src=')[1].split('>')[0];
        }
      });
    }
    return url;
  }
}
