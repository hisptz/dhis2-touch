import {Injectable} from '@angular/core';
import {SqlLiteProvider} from "../sql-lite/sql-lite";
import {HttpClientProvider} from "../http-client/http-client";
import {Observable} from "rxjs/Observable";

/*
  Generated class for the SectionsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class SectionsProvider {

  resource: string;

  constructor(private SqlLite: SqlLiteProvider, private HttpClient: HttpClientProvider) {
    this.resource = "sections";
  }

  /**
   *
   * @param currentUser
   * @returns {Observable<any>}
   */
  downloadSectionsFromServer(currentUser): Observable<any> {
    let url = "/api/25/" + this.resource + ".json?paging=false&fields=id,name,sortOrder,indicators[id],dataElements[id]";
    return new Observable(observer => {
      this.HttpClient.get(url, true, currentUser).subscribe((response: any) => {
        observer.next(response);
        observer.complete();
      }, error => {
        observer.error(error);
      });
    });
  }

  /**
   *
   * @param sectionIds
   * @param currentUser
   * @returns {Observable<any>}
   */
  getSectionByIds(sectionIds, currentUser): Observable<any> {
    let attributeKey = "id";
    return new Observable(observer => {
      this.SqlLite.getDataFromTableByAttributes(this.resource, attributeKey, sectionIds, currentUser.currentDatabase).subscribe((sections: any) => {
        let count = 0;
        sections.forEach((section: any) => {
          this.getSectionDataElements(section.id, currentUser).subscribe((sectionDataElements: any) => {
            section["dataElementIds"] = sectionDataElements;
            count++;
            if (count == sections.length) {
              observer.next(sections);
              observer.complete();
            }
          }, error => {
            observer.error(error);
          });
        });
      }, error => {
        observer.error(error)
      })
    });
  }

  /**
   *
   * @param sectionId
   * @param currentUser
   * @returns {Observable<any>}
   */
  getSectionDataElements(sectionId, currentUser): Observable<any> {
    let attributeKey = "sectionId";
    let attributeArray = [sectionId];
    let sectionDataElements = [];
    let resource = "sectionDataElements";
    return new Observable(observer => {
      this.SqlLite.getDataFromTableByAttributes(resource, attributeKey, attributeArray, currentUser.currentDatabase).subscribe((sectionDataElementsResponse: any) => {
        if (sectionDataElementsResponse && sectionDataElementsResponse.length > 0) {
          sectionDataElementsResponse.forEach((sectionDataElement: any) => {
            sectionDataElements.push({id: sectionDataElement.dataElementId, sortOrder: sectionDataElement.sortOrder});
          });
        }
        observer.next(sectionDataElements);
        observer.complete();
      }, error => {
        observer.error(error)
      })
    });
  }

  /**
   *
   * @param sections
   * @param currentUser
   * @returns {Observable<any>}
   */
  saveSectionsFromServer(sections, currentUser): Observable<any> {
    return new Observable(observer => {
      if (sections.length == 0) {
        observer.next();
        observer.complete();
      } else {
        this.SqlLite.insertBulkDataOnTable(this.resource, sections, currentUser.currentDatabase).subscribe(() => {
          this.saveSectionDataElements(sections, currentUser).subscribe(() => {
            observer.next();
            observer.complete();
          }, error => {
            observer.error(error);
          });
        }, error => {
          observer.error(error);
        });
      }
    });
  }

  /**
   *
   * @param sections
   * @param currentUser
   * @returns {Observable<any>}
   */
  saveSectionDataElements(sections, currentUser): Observable<any> {
    let sectionDataElements = [];
    let resource = "sectionDataElements";
    sections.forEach((section: any) => {
      if (section.dataElements && section.dataElements.length > 0) {
        let count = 0;
        section.dataElements.forEach((dataElement: any) => {
          sectionDataElements.push({
            id: section.id + "-" + dataElement.id,
            sectionId: section.id,
            dataElementId: dataElement.id,
            sortOrder: count
          });
          count++;
        });
      }
    });
    return new Observable(observer => {
      if (sectionDataElements.length == 0) {
        observer.next();
        observer.complete();
      } else {
        this.SqlLite.insertBulkDataOnTable(resource, sectionDataElements, currentUser.currentDatabase).subscribe(() => {
          this.saveSectionIndicators(sections, currentUser).subscribe(() => {
            observer.next();
            observer.complete();
          }, error => {
            observer.error(error);
          });
        }, error => {
          observer.error(error);
        });
      }
    });
  }

  /**
   *
   * @param sections
   * @param currentUser
   * @returns {Observable<any>}
   */
  saveSectionIndicators(sections, currentUser): Observable<any> {
    let sectionIndicators = [];
    let resource = "sectionIndicators";
    sections.forEach((section: any) => {
      if (section.indicators && section.indicators.length > 0) {
        section.indicators.forEach((indicator: any) => {
          sectionIndicators.push({
            id: section.id + "-" + indicator.id,
            sectionId: section.id,
            indicatorId: indicator.id
          });
        });
      }
    });
    return new Observable(observer => {
      if (sectionIndicators.length == 0) {
        observer.next();
        observer.complete();
      } else {
        this.SqlLite.insertBulkDataOnTable(resource, sectionIndicators, currentUser.currentDatabase).subscribe(() => {
          observer.next();
          observer.complete();
        }, error => {
          observer.error(error);
        });
      }
    });
  }

}
