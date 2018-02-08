import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'abbreviate'
})
export class AbbreviatePipe implements PipeTransform {

  transform(name: any, args?: any): any {
    const abbreviatedName: any[] = [];

    if (name) {
      let count = 0;
      for (let i = 0; i <= name.length - 1; i++) {
        if (i === 0) {
          abbreviatedName.push(name[i].toUpperCase());
        } else {
          if (name[i] === ' ') {
            count = i;
            abbreviatedName.push(name[count + 1].toUpperCase());
          }
        }
      }
    }


    return abbreviatedName.join('');
  }

}
