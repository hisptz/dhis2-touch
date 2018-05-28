import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the SearchReportListPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'searchReportListPipe',
})
export class SearchReportListPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(reportList: any[], search: string): any[] {
    if(!reportList) return [];
    if(!search) return reportList;
    search = search.toLowerCase();
    return reportList.filter( it => {
      return it.name.toLowerCase().includes(search); // only filter country name
    });
  }
}
