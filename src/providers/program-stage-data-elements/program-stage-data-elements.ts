import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {SqlLiteProvider} from "../sql-lite/sql-lite";
import {HttpClientProvider} from "../http-client/http-client";

/*
  Generated class for the ProgramStageDataElementsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ProgramStageDataElementsProvider {

  public resource : string;

  constructor(public http: Http, private sqlLite : SqlLiteProvider,private HttpClient : HttpClientProvider) {
    this.resource = "programStageDataElements";
  }

  downloadProgramsStageDataElementsFromServer(currentUser){
    let fields= "id,displayInReports,compulsory,allowProvidedElsewhere,allowFutureDate,dataElement[id,name,formName,attributeValues[value,attribute[name]],categoryCombo[id,name,categoryOptionCombos[id,name]],displayName,description,valueType,optionSet[name,options[name,id,code]]";
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

  saveProgramsStageDataElementsFromServer(programsDataElements,currentUser){
    return new Promise((resolve, reject)=> {
      if(programsDataElements.length == 0){
        resolve();
      }else{
        this.sqlLite.insertBulkDataOnTable(this.resource,programsDataElements,currentUser.currentDatabase).then(()=>{
          resolve();
        },error=>{
          console.log(JSON.stringify(error));
          reject(error);
        });
      }
    });
  }




  getProgramStageDataElements(programStageDataElementsIdsArray,currentUser){
    //let attribute = 'id';
    //let attributeValue =[];
    //
    //
    //for(let programStageDataElement of programStageDataElementsIdsArray){
    //  attributeValue.push(programStageDataElement.id);
    //}
    return new Promise((resolve, reject) =>{
      resolve(programStageDataElementsIdsArray);
      //this.sqlLite.getDataFromTableByAttributes(this.resource,attribute,attributeValue,currentUser.currentDatabase).then(programStageDataElements=>{
      //  resolve(programStageDataElements);
      //},error=>{
      //  reject(error);
      //})
    });
  }



}
