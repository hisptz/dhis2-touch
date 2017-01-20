import { Injectable } from '@angular/core';
import {SqlLite} from "./sql-lite/sql-lite";

/*
  Generated class for the EntryForm provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class EntryForm {

  private dataEntrySetting : any;
  constructor(private sqlLite : SqlLite) {
  //  this.Setting.getDataEntrySetting().then((dataEntrySetting : any)=>{
  //    if(dataEntrySetting && dataEntrySetting.label){
  //      this.dataEntrySetting = dataEntrySetting;
  //    }else{
  //      this.dataEntrySetting = {label : "displayName",maxDataElementOnDefaultForm : 4}
  //    }
  //  });
  }


  /**
   * get entry form meta data
   * @param dataSet
   * @param currentUser
   * @returns {Promise<T>}
     */
  getEntryFormMetadata(dataSet,currentUser){
    let self = this;
    return new Promise(function(resolve, reject) {
      if(dataSet.sections.length > 0){
        let entryFormSections = [];
        self.getEntryFormSectionsObject(dataSet.sections,currentUser).then(entryFormSectionsObject=>{
          dataSet.sections.forEach((section:any,index:any)=>{
            let sectionObject = entryFormSectionsObject[section.id];
            console.log(sectionObject.name);
            if(sectionObject.id){
              entryFormSections.push({
                name : sectionObject.name,id : index,dataElements : sectionObject.dataElements
              })
            }
          });
          resolve(entryFormSections);
        },error=>{
          reject(error);
        });
      }else{
        self.getDefaultEntryForm(dataSet).then(defaultEntryForm=>{
          resolve(defaultEntryForm);
        });
      }
    });
  }

  /**
   * get entry form using sections
   * @param sections
   * @param currentUser
   * @returns {Array}
     */
  getEntryFormSectionsObject(sections,currentUser){
    let self = this;
    let ids = [];
    let resource = "sections";
    let entryFormSectionsObject = {};
    sections.forEach((section : any)=>{
      ids.push(section.id);
    });
    return new Promise(function(resolve, reject) {
      self.sqlLite.getDataFromTableByAttributes(resource,"id",ids,currentUser.currentDatabase).then((selectedSections : any)=>{
        selectedSections.forEach((section: any)=>{
          entryFormSectionsObject[section.id] = section;
        });
        resolve(entryFormSectionsObject);
      });
    });
  }

  /**
   * get default using data set data element
   * @param dataSet
   * @returns {Promise<T>}
     */
  getDefaultEntryForm(dataSet){
    let self = this;
    return new Promise(function(resolve, reject) {
      let dataElements = self.getDataElements(dataSet);
      let defaultEntryForm = self.getDataElementSections(dataElements);
      resolve(defaultEntryForm);
    });
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

  /**
   * get divide dataElements into sections for data entry
   * @param dataElements
   * @returns {Array}
     */
  getDataElementSections(dataElements){
    let pager = 4;
    let sectionsCounter = Math.ceil(dataElements.length/pager);
    let sections = [];
    for(let index = 0; index < sectionsCounter; index ++){
      sections.push({
        name : "defaultSection",
        id : index,
        dataElements :dataElements.splice(0,pager)
      });
    }
    return sections;
  }

}
