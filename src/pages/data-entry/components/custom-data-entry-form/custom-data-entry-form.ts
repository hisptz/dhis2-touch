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

declare var dataEntry: any;

@Component({
  selector: 'custom-data-entry-form',
  templateUrl: 'custom-data-entry-form.html'
})
export class CustomDataEntryFormComponent
  implements OnInit, AfterViewInit, OnChanges {
  entryFormStatusColors = {};
  @Input() dataEntryFormDesign;
  @Input() data;
  @Input() entryFormType: string; //aggregate event tracker
  @Input() programTrackedEntityAttributes; // metada data for attribute
  @Input() entryFormSections;
  @Input() dataUpdateStatus: { elementId: string; status: string };
  @Output() onCustomFormInputChange = new EventEmitter();

  _htmlMarkup: SafeHtml;
  hasScriptSet: boolean;

  constructor(private sanitizer: DomSanitizer, private elementRef: ElementRef) {
    this.hasScriptSet = false;
    this.entryFormStatusColors = {
      OK: '#b9ffb9',
      WAIT: '#fffe8c',
      ERROR: '#ff8a8a',
      ACTIVE: '#488aff',
      NORMAL: '#ccc'
    };
    document.body.addEventListener(
      'dataValueUpdate',
      (e: CustomEvent) => {
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
      dataEntry.updateFormFieldColor(
        this.dataUpdateStatus.elementId,
        this.entryFormStatusColors[this.dataUpdateStatus.status]
      );
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

  getScriptsContents(html) {
    const matchedScriptArray = html.match(
      /<script[^>]*>([\w|\W]*)<\/script>/im
    );
    return matchedScriptArray && matchedScriptArray.length > 0
      ? matchedScriptArray[0]
          .replace(/(<([^>]+)>)/gi, ':separator:')
          .split(':separator:')
          .filter(content => content.length > 0)
      : [];
  }

  setScriptsOnHtmlContent(scriptsContentsArray) {
    if (!this.hasScriptSet) {
      const scriptsContents = `
    var data = ${JSON.stringify(this.data)};
    var dataElements = ${JSON.stringify(
      _.flatten(
        _.map(this.entryFormSections, entrySection => entrySection.dataElements)
      )
    )};
    var entryFormColors = ${JSON.stringify(this.entryFormStatusColors)};
    
    dataEntry.onFormReady(function () {
    // listen to change events
    $('.entryfield, .entryselect, .entrytrueonly, .entryfileresource').change(function() {
    
      // find item id
      var id = $( this ).attr( 'id' ).split('-');
      var dataElementId = id[0];
      var optionComboId = id[1];
  
      // find item values
      var value = $(this).val();
      if ($( this ).attr( 'type' ) == 'checkbox' && !$( this ).is(':checked')) {
        value = '';
      }
      
      // Update item color
      dataEntry.updateFormFieldColor($( this ).attr( 'id' ), entryFormColors['WAIT'])
      
      // create custom event for saving data values
      var dataValueEvent = new CustomEvent("dataValueUpdate", {detail: {id: dataElementId + '-' + optionComboId, value: value, status: 'not-synced', domElementId: $( this ).attr( 'id' )}});
      document.body.dispatchEvent(dataValueEvent);
    }).focus(function() {
      document.getElementById($( this ).attr( 'id' )).style.borderColor = entryFormColors['ACTIVE'];
    }).focusout(function() {
      document.getElementById($( this ).attr( 'id' )).style.borderColor = entryFormColors['NORMAL'];
    })
    ${scriptsContentsArray.join('')}
    })
    `;
      let script = document.createElement('script');
      script.type = 'text/javascript';
      script.innerHTML = scriptsContents;
      this.elementRef.nativeElement.appendChild(script);
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
