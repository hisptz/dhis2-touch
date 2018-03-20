import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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
export class CustomDataEntryFormComponent implements OnInit {
  @Input() dataEntryFormDesign;
  _htmlMarkup: SafeHtml;
  hasScriptSet: boolean;

  constructor(private sanitizer: DomSanitizer, private elementRef: ElementRef) {
    this.hasScriptSet = false;
  }

  ngOnInit() {
    try {
      let scriptsContents = this.getScriptsContents(this.dataEntryFormDesign);
      this.setScriptsOnHtmlContent(scriptsContents);
      this._htmlMarkup = this.sanitizer.bypassSecurityTrustHtml(
        this.dataEntryFormDesign
      );
    } catch (e) {
      console.log(JSON.stringify(e));
    }
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

  setScriptsOnHtmlContent(scriptsContentsArray) {
    if (!this.hasScriptSet) {
      scriptsContentsArray.forEach(scriptsContents => {
        if (scriptsContents.indexOf('<script') > -1) {
          try {
            let srcUrl = this.getScriptUrl(scriptsContents);
            let script = document.createElement('script');
            script.src = srcUrl;
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
