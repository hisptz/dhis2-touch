import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the FilterByNamePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'filterByName',
})
export class FilterByNamePipe implements PipeTransform {
  transform(list: any[], name: any): any {
    const splittedName = name ? name.split(/[\.\-_,; ]/) : [];
    return splittedName.length > 0
      ? list.filter((item: any) =>
        splittedName.some(
          (nameString: string) =>
            item.name.toLowerCase().indexOf(nameString.toLowerCase()) !== -1
        )
      )
      : list;
  }
}
