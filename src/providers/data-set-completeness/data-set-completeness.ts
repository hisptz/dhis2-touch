import { Injectable } from '@angular/core';
import {HttpClientProvider} from "../http-client/http-client";

/*
  Generated class for the DataSetCompletenessProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class DataSetCompletenessProvider {

  constructor(private httpClient : HttpClientProvider) {}

  /**
   *
   * @param {string} dataSetId
   * @param {string} period
   * @param {string} orgUnitId
   * @param dataDimension
   * @param currentUser
   * @returns {Promise<any>}
   */
  completeOnDataSetRegistrations(dataSetId : string, period : string, orgUnitId :string, dataDimension, currentUser) {
    let parameter = this.getDataSetCompletenessParameter(dataSetId, period, orgUnitId, dataDimension);
    return new Promise( (resolve, reject)=> {
      this.httpClient.defaultPost('/api/25/completeDataSetRegistrations?' + parameter, {}, currentUser).then(()=> {
        resolve();
      }, error=> {
        reject(error);
      });
    });
  }


  /**
   *
   * @param {string} dataSetId
   * @param {string} period
   * @param {string} orgUnitId
   * @param dataDimension
   * @param currentUser
   * @returns {Promise<any>}
   */
  unDoCompleteOnDataSetRegistrations(dataSetId : string, period : string, orgUnitId : string, dataDimension, currentUser) {
    let parameter = this.getDataSetCompletenessParameter(dataSetId, period, orgUnitId, dataDimension);
    return new Promise( (resolve, reject) =>{
      this.httpClient.delete('/api/25/completeDataSetRegistrations?' + parameter, currentUser).then(()=> {
        resolve();
      }, error=> {
        reject(error);
      });
    });
  }

  /**
   *
   * @param {string} dataSetId
   * @param {string} period
   * @param {string} orgUnitId
   * @param dataDimension
   * @param currentUser
   * @returns {Promise<any>}
   */
  getDataSetCompletenessInfo(dataSetId : string, period : string, orgUnitId :string, dataDimension, currentUser) {
    let parameter = "dataSetId=" + dataSetId + "&periodId=" + period + "&organisationUnitId=" + orgUnitId;
    if (dataDimension.cp != "") {
      parameter += "&cc=" + dataDimension.cc + "&cp=" + dataDimension.cp;
    }
    return new Promise( (resolve, reject)=> {
      this.httpClient.get('/dhis-web-dataentry/getDataValues.action?' + parameter, currentUser).then((response : any )=> {
        response = JSON.parse(response.data);
        if(response && response.dataValues){
          delete response.dataValues;
        }
        resolve(response);
      }, error=> {
        reject();
      });
    });
  }

  /**
   *
   * @param username
   * @param currentUser
   * @returns {Promise<any>}
   */
  getUserCompletenessInformation(username,currentUser){
    return new Promise( (resolve, reject)=> {
      this.httpClient.get('/dhis-web-commons-ajax-json/getUser.action?username=' + username, currentUser).then((response : any )=> {
        response = JSON.parse(response.data);
        resolve(response);
      }, error=> {
        reject();
      });
    });

  }

  /**
   *
   * @param {string} dataSetId
   * @param {string} period
   * @param {string} orgUnitId
   * @param dataDimension
   * @returns {string}
   */
  getDataSetCompletenessParameter(dataSetId : string, period :string, orgUnitId :string, dataDimension) {
    let parameter = "ds=" + dataSetId + "&pe=" + period + "&ou=" + orgUnitId;
    if (dataDimension.cp != "") {
      parameter += "&cc=" + dataDimension.cc + "&cp=" + dataDimension.cp;
    }
    return parameter;
  }

}
