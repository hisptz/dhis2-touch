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
import {
  Component,
  Input,
  OnInit,
  ElementRef,
  AfterViewInit,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as _ from 'lodash';
import {
  onDataValueChange,
  onFormReady,
  updateFormFieldColor
} from '../../helpers/data-entry.helper';

declare var dataEntry: any;

@Component({
  selector: 'custom-data-entry-form',
  templateUrl: 'custom-data-entry-form.html'
})
export class CustomDataEntryFormComponent
  implements OnInit, AfterViewInit, OnChanges {
  entryFormStatusColors = {};
  @Input()
  dataEntryFormDesign;
  @Input()
  type: string;
  @Input()
  data;
  @Input()
  entryFormType: string; //aggregate event tracker
  @Input()
  programTrackedEntityAttributes; // metadata for attribute
  @Input()
  entryFormSections;
  @Input()
  programStageId: string;
  @Input()
  programStageDataElements; // metadata for events rendering
  @Input() programIndicators; //program indicators for events
  @Input() indicators; //indicators for aggregates data entry
  @Input()
  dataUpdateStatus: { elementId: string; status: string };
  @Output()
  onCustomFormInputChange = new EventEmitter();

  @Input()
  dataSetsCompletenessInfo;
  @Input()
  isDataSetCompleted: boolean;
  @Input()
  isDataSetCompletenessProcessRunning: boolean;
  @Output()
  onViewUserCompletenessInformation = new EventEmitter();
  @Output()
  onUpdateDataSetCompleteness = new EventEmitter();

  _htmlMarkup: SafeHtml;
  hasScriptSet: boolean;
  entryFormSectionsCount: number;

  constructor(private sanitizer: DomSanitizer, private elementRef: ElementRef) {
    this.hasScriptSet = false;
    this.entryFormSectionsCount = 1;
    this.entryFormStatusColors = {
      OK: '#32db64',
      WAIT: '#fffe8c',
      ERROR: '#ff8a8a',
      ACTIVE: '#488aff',
      NORMAL: '#ccc'
    };
    document.body.addEventListener(
      'dataValueUpdate',
      (e: CustomEvent) => {
        e.stopPropagation();
        const dataValueObject = e.detail;
        if (dataValueObject) {
          this.onCustomFormInputChange.emit(dataValueObject);
        }
      },
      false
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['dataUpdateStatus'] &&
      !changes['dataUpdateStatus'].firstChange
    ) {
      _.each(_.keys(this.dataUpdateStatus), updateStatusKey => {
        updateFormFieldColor(
          updateStatusKey,
          this.entryFormStatusColors[this.dataUpdateStatus[updateStatusKey]]
        );
      });
    }
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
    _.each(this.getDataElements(), (dataElement) => {
      try {
        var inputElement = document.getElementById(this.programStageId + '-' + dataElement.id + '-val');
        if (inputElement != null) {
          const elementId = inputElement.getAttribute('id');
          const attributeId = inputElement.getAttribute('attributeid');
          const splitedId =
          this.entryFormType === 'aggregate' || this.entryFormType === 'event'
              ? elementId
                ? elementId.split('-')
                : []
              : attributeId
              ? attributeId.split('-')
              : [];

          const dataElementId = this.entryFormType === 'event' ? splitedId[1] : splitedId[0];
          const optionComboId =
          this.entryFormType === 'event'
              ? 'dataElement'
              : this.entryFormType === 'tracker'
              ? 'trackedEntityAttribute'
              : splitedId[1];

          // Get data element details

          const dataElementDetails = dataElement;
          // Get dataElement type
          const dataElementType = dataElementDetails
            ? dataElementDetails.valueType
            : null;
            const dataElementValue = this.getSanitizedValue(
              this.getDataValue(this.data, dataElementId + '-' + optionComboId),
              dataElementType
            );
            if (dataElementType) {
              if (dataElementDetails.optionSet) {
                try{
                  document.getElementById(this.programStageId + '-' + dataElement.id + '-val').parentNode.replaceChild(
                    this.getSelectInput(
                      elementId,
                      dataElementValue,
                      dataElementDetails.optionSet.options
                    ),document.getElementById(this.programStageId + '-' + dataElement.id + '-val')
                  );
                } catch(e) {
                  console.log('error' + JSON.stringify(e));
                }
              } 
              else {
                if (dataElementType === 'TRUE_ONLY') {
                  inputElement.setAttribute('type', 'checkbox');
                  inputElement.setAttribute('class', 'entrytrueonly');
                  inputElement.setAttribute('checked', dataElementValue);
                } else if (dataElementType === 'LONG_TEXT') {
                  document.getElementById(this.programStageId + '-' + dataElement.id + '-val').parentNode.replaceChild(this.getTextArea(elementId, dataElementValue),
                  document.getElementById(this.programStageId + '-' + dataElement.id + '-val'));
                  // inputElement.value = dataElementValue;
                } else if (dataElementType === 'DATE') {
                  inputElement.setAttribute('type', 'date');
                  inputElement.setAttribute('class', 'entryfield');
                  // inputElement.value = dataElementValue;
                } else if (dataElementType === 'BOOLEAN') {
                  document.getElementById(this.programStageId + '-' + dataElement.id + '-val').parentNode.replaceChild(
                    this.getRadioInputs(elementId, dataElementValue),
                    document.getElementById(this.programStageId + '-' + dataElement.id + '-val')
                  );
                }
              }
            }
        } else {
        }
      } catch(e) {
        console.log(JSON.stringify(e));
      }
    })
    try {
      // re-create the inputs again, in case failed in above
      const inputElements: any = document.getElementsByTagName('input');
      _.each(inputElements, (inputElement: any) => {
        if (inputElement) {
          if (inputElement && inputElement.hasAttribute('value')) {
            inputElement.setAttribute('value', '');
          }
          const elementId = inputElement.getAttribute('id');
          const attributeId = inputElement.getAttribute('attributeid');
          const splitedId =
          this.entryFormType === 'aggregate' || this.entryFormType === 'event'
              ? elementId
                ? elementId.split('-')
                : []
              : attributeId
              ? attributeId.split('-')
              : [];

          const dataElementId = this.entryFormType === 'event' ? splitedId[1] : splitedId[0];
          const optionComboId =
          this.entryFormType === 'event'
              ? 'dataElement'
              : this.entryFormType === 'tracker'
              ? 'trackedEntityAttribute'
              : splitedId[1];

          // Get data element details
          const dataElementObjects = _.keyBy(this.getDataElements(), 'id');

          const dataElementDetails = dataElementObjects[dataElementId]
          ? dataElementObjects[dataElementId]
          : {};;
          // Get dataElement type
          const dataElementType = dataElementDetails
            ? dataElementDetails.valueType
            : null;
            const dataElementValue = this.getSanitizedValue(
              this.getDataValue(this.data, dataElementId + '-' + optionComboId),
              dataElementType
            );
            if (dataElementValue) {
                if (dataElementType === 'TRUE_ONLY') {
                  inputElement.setAttribute('type', 'checkbox');
                  inputElement.setAttribute('class', 'entrytrueonly');
                  inputElement.setAttribute('checked', dataElementValue);
                } else if (dataElementType === 'LONG_TEXT') {
                  inputElement.replaceWith(this.getTextArea(elementId, dataElementValue));
                  inputElement.value = dataElementValue;
                } else if (dataElementType === 'DATE') {
                  inputElement.setAttribute('type', 'date');
                  inputElement.setAttribute('class', 'entryfield');
                  inputElement.value = dataElementValue;
                } else if (dataElementType === 'BOOLEAN') {
                  inputElement.replaceWith(
                    this.getRadioInputs(elementId, dataElementValue)
                  );
                } else if (
                  dataElementType === 'NUMBER' ||
                  dataElementType.indexOf('INTEGER') > -1
                ) {
                  inputElement.setAttribute('type', 'number');
                  inputElement.setAttribute('class', 'entryfield');
                  if (dataElementType === 'INTEGER_POSITIVE') {
                    inputElement.setAttribute('min', '1');
                  } else if (dataElementType === 'INTEGER_NEGATIVE') {
                    inputElement.setAttribute('max', '-1');
                  } else if (dataElementType === 'INTEGER_ZERO_OR_POSITIVE') {
                    inputElement.setAttribute('min', '0');
                  }
                   inputElement.value = dataElementValue;
                } else {
                  inputElement.setAttribute('class', 'entryfield');
                  inputElement.value = dataElementValue;
                }
            }
        }
      })
      var scriptsContentsArray = this.getScriptsContents(this.dataEntryFormDesign)
      onFormReady(
        this.entryFormType,
        this.getDataElements(),
        this.data,
        this.entryFormStatusColors,
        scriptsContentsArray,
        function(entryFormType, entryFormStatusColors) {
          // Listen for change event
          document.addEventListener(
            'change',
            function(event: any) {
              // If the clicked element doesn't have the right selector, bail
              if (
                event.target.matches(
                  '.entryfield, .entryselect, .entrytrueonly, .entryfileresource'
                )
              ) {
                onDataValueChange(
                  event.target,
                  entryFormType,
                  entryFormStatusColors
                );
              }
              event.preventDefault();
            },
            false
          );

          // Embed inline javascripts
          const scriptsContents = `
          try {${scriptsContentsArray.join('')}} catch(e) { console.log(e);}`;
          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.innerHTML = scriptsContents;
          document
            .getElementById(`_custom_entry_form_${entryFormType}`)
            .appendChild(script);
        }
      );
      this.setScriptsOnHtmlContent(
        this.getScriptsContents(this.dataEntryFormDesign)
      );
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  }

  updateDataSetCompleteness() {
    this.onUpdateDataSetCompleteness.emit();
  }

  viewUserCompletenessInformation(dataSetsCompletenessInfo) {
    this.onViewUserCompletenessInformation.emit(dataSetsCompletenessInfo);
  }

  getScriptsContents(html) {
    const matchedScriptArray = html.match(
      /<script[^>]*>([\w|\W]*)<\/script>/im
    );

    const scripts =
      matchedScriptArray && matchedScriptArray.length > 0
        ? matchedScriptArray[0]
            .replace(/(<([^>]+)>)/gi, ':separator:')
            .split(':separator:')
            .filter(content => content.length > 0)
        : [];

    return _.filter(scripts, (scriptContent: string) => scriptContent !== '');
  }

  
  setScriptsOnHtmlContent(scriptsContentsArray) {
    onFormReady(
      this.entryFormType,
      this.getDataElements(),
      this.data,
      this.entryFormStatusColors,
      scriptsContentsArray,
      function(entryFormType, entryFormStatusColors) {
        // Listen for change event
        document.addEventListener(
          'change',
          function(event: any) {
            // If the clicked element doesn't have the right selector, bail
            if (
              event.target.matches(
                '.entryfield, .entryselect, .entrytrueonly, .entryfileresource'
              )
            ) {
              onDataValueChange(
                event.target,
                entryFormType,
                entryFormStatusColors
              );
            }
            event.preventDefault();
          },
          false
        );

        // Embed inline javascripts
        const scriptsContents = `
        try {${scriptsContentsArray.join('')}} catch(e) { console.log(e);}`;
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.innerHTML = scriptsContents;
        document
          .getElementById(`_custom_entry_form_${entryFormType}`)
          .appendChild(script);
      }
    );
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


  getDataElements() {
    const dataElements = this.entryFormSections
      ? _.flatten(
          _.map(
            this.entryFormSections,
            entrySection => entrySection.dataElements
          )
        )
      : this.programTrackedEntityAttributes
      ? _.flatten(
          _.map(
            this.programTrackedEntityAttributes,
            programTrackedEntityAttribute =>
              programTrackedEntityAttribute.trackedEntityAttribute
          )
        )
      : _.map(
          this.programStageDataElements,
          programStage => programStage.dataElement
        );
        return dataElements;
  }

  // from helper

  getSanitizedValue(value, type) {
    switch (type) {
      case 'TRUE_ONLY':
        return this.convertToBoolean(value);
      default:
        return value;
    }
  }
  
  convertToBoolean(stringValue) {
    return stringValue === 'true'
      ? Boolean(true)
      : 'false'
      ? Boolean(false)
      : stringValue;
  }
  
  getSelectInput(id, value, options) {
    const selectElement = document.createElement('select');
    try {
      selectElement.setAttribute('id', id);
      selectElement.setAttribute('class', 'entryselect');
    
      const defaultOption = document.createElement('option');
      defaultOption.disabled = true;
      defaultOption.selected = true;
      defaultOption.value = '';
      selectElement.appendChild(defaultOption);
    
      options.forEach(function(option) {
        const optionElement = document.createElement('option');
        optionElement.value = option.code;
        optionElement.appendChild(document.createTextNode(option.name));
        optionElement;
        if (value != null && option.code === value) {
          optionElement.selected = true;
        }
    
        selectElement.appendChild(optionElement);
      });
    } catch(e) {
      console.log(JSON.stringify(e))
    }
  
    return selectElement;
  }
  
  getTextArea(id, value) {
    const textarea = document.createElement('textarea');
    textarea.setAttribute('id', id);
    textarea.setAttribute('name', 'entryform');
    textarea.setAttribute('class', 'entryfield');
    textarea.value = value;
    return textarea;
  }
  
  getRadioInputs(id, savedValue) {
    const radioContainer = document.createElement('div');
  
    if (savedValue == 'true') {
      const yesInput = document.createElement('input');
      yesInput.setAttribute('type', 'radio');
      yesInput.setAttribute('name', id);
      yesInput.setAttribute('class', 'entryfield');
      yesInput.checked = true;
      yesInput.value = 'true';
  
      const noInput = document.createElement('input');
      noInput.setAttribute('type', 'radio');
      noInput.setAttribute('name', id);
      noInput.setAttribute('class', 'entryfield');
      noInput.value = 'false';
  
      radioContainer.appendChild(yesInput);
      radioContainer.appendChild(document.createTextNode(' Yes'));
  
      radioContainer.appendChild(noInput);
      radioContainer.appendChild(document.createTextNode(' No'));
    } else if (savedValue == 'false') {
      const yesInput = document.createElement('input');
      yesInput.setAttribute('type', 'radio');
      yesInput.setAttribute('name', id);
      yesInput.setAttribute('class', 'entryfield');
      yesInput.value = 'true';
  
      const noInput = document.createElement('input');
      noInput.setAttribute('type', 'radio');
      noInput.setAttribute('name', id);
      noInput.setAttribute('class', 'entryfield');
      noInput.checked = true;
      noInput.value = 'false';
  
      radioContainer.appendChild(yesInput);
      radioContainer.appendChild(document.createTextNode(' Yes'));
  
      radioContainer.appendChild(noInput);
      radioContainer.appendChild(document.createTextNode(' No'));
    } else {
      const yesInput = document.createElement('input');
      yesInput.setAttribute('type', 'radio');
      yesInput.setAttribute('name', id);
      yesInput.setAttribute('class', 'entryfield');
      yesInput.value = 'true';
  
      const noInput = document.createElement('input');
      noInput.setAttribute('type', 'radio');
      noInput.setAttribute('name', id);
      noInput.setAttribute('class', 'entryfield');
      noInput.value = 'false';
  
      radioContainer.appendChild(yesInput);
      radioContainer.appendChild(document.createTextNode(' Yes'));
  
      radioContainer.appendChild(noInput);
      radioContainer.appendChild(document.createTextNode(' No'));
    }
  
    return radioContainer;
  }
  
  updateFormFieldColor(elementId, statusColor) {
    const element = document.getElementById(elementId);
    if (element) {
      element.style.borderColor = statusColor;
    }
  }
  
  getDataValue(data, id) {
    var dataObject = data[id];
    return dataObject ? dataObject.value : null;
  }
}
