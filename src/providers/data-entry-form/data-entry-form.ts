import { Injectable } from '@angular/core';
import {DataSetsProvider} from "../data-sets/data-sets";
import {DataElementsProvider} from "../data-elements/data-elements";
import {IndicatorsProvider} from "../indicators/indicators";
import {SectionsProvider} from "../sections/sections";
/*
  Generated class for the DataEntryFormProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class DataEntryFormProvider {

  constructor(private dataSetProvider : DataSetsProvider,
              private indicatorProvider : IndicatorsProvider,
              private sectionProvider : SectionsProvider,
              private dataElementProvider : DataElementsProvider) {
  }

  /**
   *
   * @param dataSetId
   * @param currentUser
   * @returns {Promise<any>}
   */
  loadingDataSetInformation(dataSetId,currentUser){
    return new Promise((resolve, reject)=> {
      this.dataSetProvider.getDataSetById(dataSetId,currentUser).then((dataSet : any)=>{
        this.dataSetProvider.getDataSetSectionsIds(dataSetId,currentUser).then(sectionIds =>{
          this.dataSetProvider.getDataSetIndicatorIds(dataSetId,currentUser).then(indicatorIds =>{
            resolve({
              dataSet : dataSet,sectionIds : sectionIds,indicatorIds : indicatorIds
            });
          },error=>{reject(error)});
        },error=>{ reject(error)});
      },error=>{reject(error)});
    });
  }

  getEntryForm(dataSetId,sectionIds){
    return new Promise((resolve, reject)=> {
      resolve();
    });
  }

}
