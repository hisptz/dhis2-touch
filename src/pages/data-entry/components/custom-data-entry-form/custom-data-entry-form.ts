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
  updateFormFieldColor,
  lockingEntryFormFields
} from '../../helpers/data-entry.helper';
import {
  evaluateCustomFomProgramIndicators,
  evaluateCustomFomAggregateIndicators,
  evaluateDataElementTotals
} from '../../helpers/custom-form-indicators-helper';
import {
  assignedValuesBasedOnProgramRules,
  disableHiddenFiledsBasedOnProgramRules,
  applyErrorOrWarningActions
} from '../../helpers/program-rules-helper';

declare var dhis2;

@Component({
  selector: 'custom-data-entry-form',
  templateUrl: 'custom-data-entry-form.html'
})
export class CustomDataEntryFormComponent
  implements OnInit, AfterViewInit, OnChanges {
  entryFormStatusColors = {};
  @Input() dataSetReportAggregateValues: any;
  @Input() customFormProgramRules: any;
  @Input() isPeriodLocked: boolean;
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
  @Input() isValidationProcessRunning: boolean;
  @Output()
  onViewUserCompletenessInformation = new EventEmitter();
  @Output()
  onUpdateDataSetCompleteness = new EventEmitter();
  @Output() validatingEntryForm = new EventEmitter();

  _htmlMarkup: SafeHtml;
  hasScriptSet: boolean;
  scriptsContents: string[];
  entryFormSectionsCount: number;
  elementIds: any;

  constructor(private sanitizer: DomSanitizer, private elementRef: ElementRef) {
    this.hasScriptSet = false;
    this.entryFormSectionsCount = 1;
    this.scriptsContents = [];
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
    if (
      changes['isDataSetCompleted'] &&
      !changes['isDataSetCompleted'].firstChange
    ) {
      this.setFieldLockingStatus();
    }
    if (
      changes['customFormProgramRules'] &&
      !changes['customFormProgramRules'].firstChange
    ) {
      this.applyProgramRules();
    }
  }

  applyProgramRules() {
    try {
      const shouldLockFields = this.isDataSetCompleted || this.isPeriodLocked;
      const {
        assignedFields,
        hiddenFields,
        programStageId,
        errorOrWarningMessage
      } = this.customFormProgramRules;
      disableHiddenFiledsBasedOnProgramRules(
        programStageId,
        hiddenFields,
        errorOrWarningMessage,
        shouldLockFields
      );
      assignedValuesBasedOnProgramRules(programStageId, assignedFields);
      evaluateCustomFomProgramIndicators(this.programIndicators);
      applyErrorOrWarningActions(errorOrWarningMessage);
    } catch (error) {
      console.log(JSON.stringify({ applyProgramRules: error }));
    }
  }

  setFieldLockingStatus() {
    try {
      const shouldLockFields = this.isDataSetCompleted || this.isPeriodLocked;
      lockingEntryFormFields(shouldLockFields);
    } catch (error) {
      console.log(JSON.stringify({ setFieldLockingStatus: error }));
    }
  }

  ngOnInit() {
    try {
      this.scriptsContents = this.getScriptsContents(this.dataEntryFormDesign);
      this.dataEntryFormDesign = this.dataEntryFormDesign.replace(
        /<script[^>]*>([\w|\W]*)<\/script>/gi,
        ''
      );
      this._htmlMarkup = this.sanitizer.bypassSecurityTrustHtml(
        this.dataEntryFormDesign
      );
    } catch (e) {
      console.log('ng on init ' + JSON.stringify(e));
    }
  }

  ngAfterViewInit() {
    try {
      this.setScriptsOnHtmlContent(this.scriptsContents);
    } catch (error) {
      console.log('ng after view int ' + JSON.stringify(error));
    } finally {
      this.setFieldLockingStatus();
      this.applyProgramRules();
    }
  }

  updateDataSetCompleteness() {
    this.onUpdateDataSetCompleteness.emit();
  }

  viewUserCompletenessInformation(dataSetsCompletenessInfo) {
    this.onViewUserCompletenessInformation.emit(dataSetsCompletenessInfo);
  }

  onValidatingDateEntry() {
    this.validatingEntryForm.emit();
  }

  getScriptsContents(html) {
    const matchedScriptArray = html.match(
      /<script[^>]*>([\w|\W]*)<\/script>/im
    );
    const scripts =
      matchedScriptArray && matchedScriptArray.length > 0
        ? matchedScriptArray[0]
            .replace(/<script[^>]*>/gi, ':separator:')
            .replace(/<\/script>/gi, ':separator:')
            .split(':separator:')
            .filter(content => content.length > 0)
        : [];
    return _.filter(scripts, (scriptContent: string) => scriptContent !== '');
  }

  setScriptsOnHtmlContent(scriptsContentsArray) {
    const dataElements = this.entryFormSections
      ? _.flattenDeep(
          _.map(
            this.entryFormSections,
            entrySection => entrySection.dataElements
          )
        )
      : this.programTrackedEntityAttributes
      ? _.flattenDeep(
          _.map(
            this.programTrackedEntityAttributes,
            programTrackedEntityAttribute =>
              programTrackedEntityAttribute.trackedEntityAttribute
          )
        )
      : _.flattenDeep(
          _.map(
            this.programStageDataElements,
            programStage => programStage.dataElement
          )
        );
    if (!this.hasScriptSet) {
      onFormReady(
        this.entryFormType,
        dataElements,
        this.programIndicators,
        this.indicators,
        this.data,
        this.dataSetReportAggregateValues,
        this.entryFormStatusColors,
        scriptsContentsArray,
        function(
          entryFormType,
          entryFormStatusColors,
          programIndicators,
          indicators
        ) {
          // Listen for change event
          document.addEventListener(
            'change',
            function(event: any) {
              // If the clicked element doesn't have the right selector, bail
              try {
                if (
                  event &&
                  event.target &&
                  event.target.matches &&
                  event.target.matches(
                    '.entryfield, .entryselect, .entrytrueonly, .entryfileresource, .entryfield-radio'
                  )
                ) {
                  onDataValueChange(
                    event.target,
                    entryFormType,
                    entryFormStatusColors
                  );
                }
              } catch (error) {
                console.log({ error, type: 'Event on change' });
              }
              if (entryFormType === 'event') {
                evaluateCustomFomProgramIndicators(programIndicators);
              } else if (entryFormType === 'aggregate') {
                evaluateCustomFomAggregateIndicators(indicators);
                evaluateDataElementTotals();
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
