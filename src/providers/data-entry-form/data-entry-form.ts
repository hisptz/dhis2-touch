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

  /**
   *
   * @param indicatorIds
   * @param currentUser
   * @returns {Promise<any>}
   */
  getEntryFormIndicators(indicatorIds,currentUser){
    return this.indicatorProvider.getIndicatorsByIds(indicatorIds,currentUser);
  }

  /**
   *
   * @param sectionIds
   * @param dataSetId
   * @param currentUser
   * @returns {Promise<any>}
   */
  getEntryForm(sectionIds,dataSetId,appSettings,currentUser){
    return new Promise((resolve, reject)=> {
      if(sectionIds && sectionIds.length > 0){
        this.getSectionEntryForm(sectionIds,currentUser).then(( entryForm : any)=>{
          resolve(entryForm);
        },error=>{reject(error)});
      }else{
        this.getDefaultEntryForm(dataSetId,appSettings,currentUser).then(( entryForm : any)=>{
          resolve(entryForm);
        },error=>{reject(error)});
      }
    });
  }

  /**
   *
   * @param sectionIds
   * @param currentUser
   * @returns {Promise<any>}
   */
  getSectionEntryForm(sectionIds,currentUser){
    return new Promise((resolve, reject)=> {
      this.sectionProvider.getSectionByIds(sectionIds,currentUser).then((sections : any)=>{
        let count = 0;
        sections.forEach((section : any)=>{
          this.dataElementProvider.getDataElementsByIdsForDataEntry(section.dataElementIds,currentUser).then((dataElements:any)=>{
            section["dataElements"] = dataElements;
            count ++;
            if(count == sections.length){
              sections = this.getSortedSections(sections);
              resolve(sections);
            }
          },error=>{reject(error)});
        });
      },error=>{reject(error)});
    });
  }

  getSortedSections(sections){
    sections = sections.sort((a,b)=>{
      return parseInt(a.sortOrder) - parseInt(b.sortOrder);
    });
    return sections;
  }

  /**
   *
   * @param dataSetId
   * @param currentUser
   * @returns {Promise<any>}
   */
  getDefaultEntryForm(dataSetId,appSettings,currentUser){
    return new Promise((resolve, reject)=> {
      this.dataSetProvider.getDataSetDataElements(dataSetId,currentUser).then((dataSetDatElements: any)=>{
        this.dataElementProvider.getDataElementsByIdsForDataEntry(dataSetDatElements,currentUser).then((dataElements:any)=>{
          let maxDataElements = (appSettings && appSettings.entryForm && appSettings.entryForm.maxDataElementOnDefaultForm) ? appSettings.entryForm.maxDataElementOnDefaultForm : 10;
          resolve(this.getDataElementSections(dataElements,maxDataElements));
        },error=>{reject(error)});
      },error=>{reject(error)});
    });
  }

  /**
   *
   * @param dataElements
   * @param maxDataElements
   * @returns {Array}
   */
  getDataElementSections(dataElements,maxDataElements){
    let sectionsCounter = Math.ceil(dataElements.length/maxDataElements);
    let sections = [];
    for(let index = 0; index < sectionsCounter; index ++){
      sections.push({
        name : "Page " + (index + 1) + " of " + sectionsCounter,
        id : index,
        dataElements :dataElements.splice(0,maxDataElements)
      });
    }
    return sections;
  }

  /**
   * get dataElements based on data set
   * @param dataSet
   * @returns {Array}
   */
  getDataElements(dataSet){
    let dataElements = [];
    if(dataSet.dataElements && dataSet.dataElements.length > 0){
      dataElements = dataSet.dataElements;
    }else if(dataSet.dataSetElements && dataSet.dataSetElements.length > 0){
      dataSet.dataSetElements.forEach((dataSetElement :any)=>{
        dataElements.push(dataSetElement.dataElement);
      });
    }
    return dataElements;
  }

}
