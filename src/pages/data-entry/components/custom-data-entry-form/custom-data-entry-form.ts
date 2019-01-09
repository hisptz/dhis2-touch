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
    this.setScriptsOnHtmlContent(
      this.getScriptsContents(this.dataEntryFormDesign)
    );
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
    if (!this.hasScriptSet) {
      onFormReady(
        this.entryFormType,
        dataElements,
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
