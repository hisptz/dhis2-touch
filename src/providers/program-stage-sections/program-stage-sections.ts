import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {SqlLiteProvider} from "../sql-lite/sql-lite";
import {HttpClientProvider} from "../http-client/http-client";

/*
  Generated class for the ProgramStageSectionsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ProgramStageSectionsProvider {

  public resource : string;

  constructor(public http: Http, private sqlLite : SqlLiteProvider, private HttpClient : HttpClientProvider) {
    this.resource = "programStageSections";
  }

  /**
   *
   * @param currentUser
   * @returns {Promise<any>}
   */
  downloadProgramsStageSectionsFromServer(currentUser){
    let fields= "id,name,sortOrder,programStage[id],attributeValues[value,attribute[name]],translations[*],programStageDataElements[dataElement[id]],dataElements[id]";
    let url = "/api/25/"+this.resource+".json?paging=false&fields=" + fields;
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
   * @param programsStageSections
   * @param currentUser
   * @returns {Promise<any>}
   */
  saveProgramsStageSectionsFromServer(programsStageSections,currentUser){
    return new Promise((resolve, reject)=> {
      if(programsStageSections.length == 0){
        resolve();
      }else{
        programsStageSections = this.getPreparedProgramStageSectionForSaving(programsStageSections);
        this.sqlLite.insertBulkDataOnTable(this.resource,programsStageSections,currentUser.currentDatabase).then(()=>{
          resolve();
        },error=>{
          reject(error);
        });
      }
    });
  }

  /**
   *
   * @param programsStageSections
   * @returns {any}
   */
  getPreparedProgramStageSectionForSaving(programsStageSections){
    programsStageSections.forEach((programsStageSection : any)=>{
      if(programsStageSection.programStage && programsStageSection.programStage.id){
        programsStageSection["programStageId"] = programsStageSection.programStage.id;
      }
      if(!programsStageSection.dataElements){
        programsStageSection["dataElements"] = [];
        if(programsStageSection.programStageDataElements){
          programsStageSection.programStageDataElements.forEach((programStageDataElement : any)=>{
            if(programStageDataElement.dataElement && programStageDataElement.dataElement.id){
              programsStageSection.dataElements.push({id : programStageDataElement.dataElement.id});
            }
          });
        }
      }
    });
    return programsStageSections;
  }


}
