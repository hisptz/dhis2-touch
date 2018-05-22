import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";

import { DataSet } from "../model/dataset";
import { DataelementGroup } from "../model/dataelement-group";
import { IndicatorGroup } from "../model/indicator-group";
import { CategoryCombo } from "../model/category-combo";
import { Indicator } from "../model/indicator";
import { DataElement } from "../model/data-element";
import { HttpClientService } from "../../../services/http-client.service";
import { of } from "rxjs/observable/of";
import { forkJoin } from "rxjs/observable/forkJoin";
import { map, switchMap, catchError, combineLatest } from "rxjs/operators";

export const DATAELEMENT_KEY = "data-elements";
export const DATASET_KEY = "data-sets";
export const ORGANISATION_UNIT_KEY = "organisation-units";
export const INDICATOR_KEY = "indicators";
export const CATEGORY_COMBOS_KEY = "category-options";
export const DATAELEMENT_GROUP_KEY = "data-element-groups";
export const INDICATOR_GROUP_KEY = "indicator-groups";
export const PROGRAM_KEY = "programs";
export const PROGRAM_INDICATOR_KEY = "programIndicators";

@Injectable()
export class DataFilterService {
  metaData = {
    organisationUnits: [],
    dataElements: [],
    indicators: [],
    dataElementGroups: [],
    indicatorGroups: [],
    categoryOptions: [],
    dataSets: []
  };

  private _dataItems: any[] = [];

  constructor(private http: HttpClientService) {}

  getIndicators(): Observable<Indicator[]> {
    return this.http
      .get("indicators.json?fields=id,name,dataSets[periodType]&paging=false")
      .pipe(map(res => res.indicators || []));
  }

  getDataElements(): Observable<DataElement[]> {
    return this.http
      .get(
        "dataElements.json?fields=,id,name,valueType,categoryCombo&paging=false&filter=" +
          "domainType:eq:AGGREGATE&filter=valueType:ne:TEXT&filter=valueType:ne:LONG_TEXT"
      )
      .pipe(map(res => res.dataElements || []));
  }

  getDataSets(): Observable<DataSet[]> {
    return this.http.get("dataSets.json?paging=false&fields=id,name").pipe(map(res => res.dataSets || []));
  }

  getCategoryCombos(): Observable<CategoryCombo[]> {
    return this.http
      .get("categoryCombos.json?fields=id,name,categoryOptionCombos[id,name]&paging=false")
      .pipe(map(res => res.categoryCombos || []));
  }

  getOrganisationUnits(): Observable<any[]> {
    return this.http
      .get("organisationUnits.json?fields=id,name,children,parent,path&paging=false")
      .pipe(map(res => res.organisationUnits || []));
  }

  getDataElementGroups(): Observable<DataelementGroup[]> {
    return this.http
      .get("dataElementGroups.json?paging=false&fields=id,name,dataElements[id,name,categoryCombo]")
      .pipe(map(res => res.dataElementGroups || []));
  }

  getIndicatorGroups(): Observable<IndicatorGroup[]> {
    return this.http
      .get("indicatorGroups.json?paging=false&fields=id,name,indicators[id,name]")
      .pipe(map(res => res.indicatorGroups || []));
  }

  getPrograms(): Observable<any[]> {
    return this.http
      .get("programs.json?paging=false&fields=id,name,programType,programIndicators[id,name")
      .pipe(map(res => res.programs || []));
  }

  getProgramIndicators(): Observable<any[]> {
    return this.http
      .get("programIndicators.json?paging=false&fields=id,name")
      .pipe(map(res => res.programIndicators || []));
  }

  initiateData() {
    return Observable.create(observer => {
      if (this._dataItems.length > 0) {
        observer.next(this._dataItems);
        observer.complete();
      } else {
        forkJoin(
          this.getDataFromLocalDatabase(DATAELEMENT_KEY),
          this.getDataFromLocalDatabase(INDICATOR_KEY),
          this.getDataFromLocalDatabase(INDICATOR_GROUP_KEY),
          this.getDataFromLocalDatabase(DATAELEMENT_GROUP_KEY),
          this.getDataFromLocalDatabase(DATASET_KEY),
          this.getDataFromLocalDatabase(CATEGORY_COMBOS_KEY),
          this.getDataFromLocalDatabase(PROGRAM_KEY),
          this.getDataFromLocalDatabase(PROGRAM_INDICATOR_KEY)
        ).subscribe((dataItems: any[]) => {
          this._dataItems = [...dataItems];
          observer.next(this._dataItems);
          observer.complete();
        });
      }
    });
  }

  /**
   * This function will be used to return all needed metadata either from offline or if not available the online
   * @param key
   * @returns {any}
   */
  getDataFromLocalDatabase(key: string): Observable<any> {
    return Observable.create(observer => {
      let dataStream$ = of(null);
      switch (key) {
        case DATAELEMENT_KEY:
          dataStream$ = this.getDataElements();
          break;
        case DATASET_KEY:
          dataStream$ = this.getDataSets();
          break;
        case ORGANISATION_UNIT_KEY:
          dataStream$ = this.getOrganisationUnits();
          break;
        case CATEGORY_COMBOS_KEY:
          dataStream$ = this.getCategoryCombos();
          break;
        case INDICATOR_KEY:
          dataStream$ = this.getIndicators();
          break;
        case INDICATOR_GROUP_KEY:
          dataStream$ = this.getIndicatorGroups();
          break;
        case DATAELEMENT_GROUP_KEY:
          dataStream$ = this.getDataElementGroups();
          break;
        case PROGRAM_KEY:
          dataStream$ = this.getPrograms();
          break;
        case PROGRAM_INDICATOR_KEY:
          dataStream$ = this.getProgramIndicators();
          break;
        default:
          console.error("The key passed is not recognized");
          break;
      }
      dataStream$.subscribe(
        data => {
          observer.next(data);
          observer.complete();
        },
        error => observer.error(error)
      );
    });
  }
}
