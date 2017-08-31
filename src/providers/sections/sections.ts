import { Injectable } from '@angular/core';
import {SqlLiteProvider} from "../sql-lite/sql-lite";
import {HttpClientProvider} from "../http-client/http-client";

/*
  Generated class for the SectionsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class SectionsProvider {

  resource : string;
  constructor(private SqlLite : SqlLiteProvider,private HttpClient : HttpClientProvider) {
    this.resource = "sections";
  }


  downloadSectionsFromServer(currentUser){
    let url = "/api/25/"+this.resource+".json?paging=false&fields=id,name,sortOrder,indicators[id],dataElements[id]";
    return new Promise((resolve, reject)=> {
      this.HttpClient.get(url,currentUser).then((response : any)=>{
        response = JSON.parse(response.data);
        resolve(response);
      },error=>{
        reject(error);
      });
    });
  }

  /**
   *
   * @param sectionIds
   * @param currentUser
   * @returns {Promise<any>}
   */
  getSectionByIds(sectionIds,currentUser){
    let attributeKey = "id";
    return new Promise((resolve, reject)=> {
      this.SqlLite.getDataFromTableByAttributes(this.resource,attributeKey,sectionIds,currentUser.currentDatabase).then(( sections: any)=>{
        let count = 0;
        sections.forEach((section : any)=>{
          this.getSectionDataElements(section.id,currentUser).then((sectionDataElements : any)=>{
            section["dataElementIds"] = sectionDataElements;
            count ++;
            if(count == sections.length){
              resolve(sections);
            }
          },error=>{
            reject(error);
          });
        });
      },error=>{reject(error)})
    });
  }

  /**
   *
   * @param sectionId
   * @param currentUser
   * @returns {Promise<any>}
   */
  getSectionDataElements(sectionId,currentUser){
    let attributeKey = "sectionId";
    let attributeArray = [sectionId];
    let sectionDataElements = [];
    let resource = "sectionDataElements";
    return new Promise((resolve, reject)=> {
      this.SqlLite.getDataFromTableByAttributes(resource,attributeKey,attributeArray,currentUser.currentDatabase).then((sectionDataElementsResponse : any)=>{
        if(sectionDataElementsResponse && sectionDataElementsResponse.length > 0){
          sectionDataElementsResponse.forEach((sectionDataElement : any)=>{
            sectionDataElements.push({id : sectionDataElement.dataElementId,sortOrder : sectionDataElement.sortOrder});
          });
        }
        resolve(sectionDataElements);
      },error=>{reject(error)})
    });
  }

  /**
   *
   * @param sections
   * @param currentUser
   * @returns {Promise<any>}
   */
  saveSectionsFromServer(sections,currentUser){
    return new Promise((resolve, reject)=> {
      if(sections.length == 0){
        resolve();
      }else{
        this.SqlLite.insertBulkDataOnTable(this.resource,sections,currentUser.currentDatabase).then(()=>{
          this.saveSectionDataElements(sections,currentUser).then(()=>{
            resolve();
          },error=>{
            reject(error);
          });
        },error=>{
          console.log(JSON.stringify(error));
          reject(error);
        });
      }
    });
  }

  /**
   *
   * @param sections
   * @param currentUser
   * @returns {Promise<any>}
   */
  saveSectionDataElements(sections,currentUser){
    let sectionDataElements = [];
    let resource = "sectionDataElements";
    sections.forEach((section : any)=>{
      if(section.dataElements && section.dataElements.length > 0){
        let count = 0;
        section.dataElements.forEach((dataElement : any)=>{
          sectionDataElements.push({
            id : section.id + "-" + dataElement.id,
            sectionId : section.id,
            dataElementId : dataElement.id,
            sortOrder : count
          });
          count ++;
        });
      }
    });
    return new Promise((resolve, reject)=> {
      if(sectionDataElements.length == 0){
        resolve();
      }else{
        this.SqlLite.insertBulkDataOnTable(resource,sectionDataElements,currentUser.currentDatabase).then(()=>{
          this.saveSectionIndicators(sections,currentUser).then(()=>{
            resolve();
          },error=>{
            reject(error);
          });
        },error=>{
          reject(error);
        });
      }
    });
  }

  /**
   *
   * @param sections
   * @param currentUser
   * @returns {Promise<any>}
   */
  saveSectionIndicators(sections,currentUser){
    let sectionIndicators = [];
    let resource = "sectionIndicators";
    sections.forEach((section : any)=>{
      if(section.indicators && section.indicators.length > 0){
        section.indicators.forEach((indicator : any)=>{
          sectionIndicators.push({
            id : section.id + "-" + indicator.id,
            sectionId : section.id,
            indicatorId : indicator.id
          });
        });
      }
    });
    return new Promise((resolve, reject)=> {
      if(sectionIndicators.length == 0){
        resolve();
      }else{
        this.SqlLite.insertBulkDataOnTable(resource,sectionIndicators,currentUser.currentDatabase).then(()=>{
          resolve();
        },error=>{
          reject(error);
        });
      }
    });
  }

}
