import { Component, Input, OnInit, ElementRef, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as _ from 'lodash';


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
    document.body.addEventListener('dataValueUpdate', (e: CustomEvent) => {
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
    
    dataEntry.onFormReady(function () {
    $('.entryfield').change(function() {
      var id = $( this ).attr( 'id' ).split('-');
      var dataElementId = id[0];
      var optionComboId = id[1];
     
      var dataValueEvent = new CustomEvent("dataValueUpdate", {detail: {id: dataElementId + '-' + optionComboId, value: $(this).val(), status: 'not-synced'}});
      document.body.dispatchEvent(dataValueEvent);
    })
    })
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
