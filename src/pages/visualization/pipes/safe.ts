import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

@Pipe({
  name: "safe"
})
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(content: string, type: string) {
    switch (type) {
      case 'url':
        return this.sanitizer.bypassSecurityTrustResourceUrl(content);
      case 'html':
        return this.sanitizer.bypassSecurityTrustHtml(content);
      default: return content
    }
  }
}
