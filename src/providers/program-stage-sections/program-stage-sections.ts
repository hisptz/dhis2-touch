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


  downloadProgramsStageSectionsFromServer(currentUser){
    let fields= "id,name,programIndicators,sortOrder,programStageDataElements[id,displayInReports,compulsory,allowProvidedElsewhere,allowFutureDate,dataElement[id,name,formName,attributeValues[value,attribute[name]],categoryCombo[id,name,categoryOptionCombos[id,name]],displayName,description,valueType,optionSet[name,options[name,id,code]]]" ;
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

  saveProgramsStageSectionsFromServer(programsSec,currentUser){
    return new Promise((resolve, reject)=> {
      if(programsSec.length == 0){
        resolve();
      }else{
        this.sqlLite.insertBulkDataOnTable(this.resource,programsSec,currentUser.currentDatabase).then(()=>{
          resolve();
        },error=>{
          console.log(JSON.stringify(error));
          reject(error);
        });
      }
    });
  }



  getProgramStageSections(programStageSectionsIdsArray,currentUser){
    let attribute = 'id';
    let attributeValue =[];
    programStageSectionsIdsArray.forEach((programStageSection:any)=>{
      attributeValue.push(programStageSection.id);
    });
    return new Promise((resolve, reject)=> {
      this.sqlLite.getDataFromTableByAttributes(this.resource,attribute,attributeValue,currentUser.currentDatabase).then(programStageSections=>{
        resolve(programStageSections);
      },error=>{
        reject(error);
      })
    });
  }


}
