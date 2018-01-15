import {Injectable} from '@angular/core';
import {SqlLiteProvider} from "../sql-lite/sql-lite";

/*
  Generated class for the DataSetReportProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataSetReportProvider {

  constructor(private sqlLite : SqlLiteProvider) {
  }

  getReportValues(orgUnit,dataSetId,period,currentUser,dataDimension?){
    let orgUnitId = orgUnit.id;
    let resourceName = "dataValues";
    let query = this.getQueryForDataValuesByPeriodAndDataSet(dataSetId,period,dataDimension);
    let entryFormDataValuesFromStorage = [];
    return new Promise( (resolve, reject)=> {
      this.sqlLite.getByUsingQuery(query,resourceName,currentUser.currentDatabase).then((dataValues:any)=> {
        this.sqlLite.getAllDataFromTable("organisationUnits",currentUser.currentDatabase).then((organisationUnits:any)=> {
          let orgUnitIdsFilter = [];
          organisationUnits.forEach((organisationUnit :  any)=>{
            if(organisationUnit && organisationUnit.path.indexOf(orgUnitId) > -1){
             orgUnitIdsFilter.push(organisationUnit.id);
            }
          });
          dataValues.forEach((dataValue:any)=> {
            console.log(dataValue.ou + " : " +orgUnitIdsFilter.indexOf(dataValue.ou));
            if(dataValue && orgUnitIdsFilter.indexOf(dataValue.ou) > -1){
              entryFormDataValuesFromStorage.push({
                id: dataValue.de + "-" + dataValue.co,
                value: dataValue.value,
                de : dataValue.de,
                co : dataValue.co
              });
            }
          });
          resolve(entryFormDataValuesFromStorage)
        }, error=> {
          console.log(JSON.stringify(error));
          reject();
        });
      }, error=> {
        console.log(JSON.stringify(error));
        reject();
      });
    });
  }

  /**
   *
   * @param dataSetId
   * @param period
   * @param dataDimension
   * @returns {string}
   */
  getQueryForDataValuesByPeriodAndDataSet(dataSetId,period,dataDimension?){
    let query = "SELECT co,de,value,ou FROM dataValues WHERE dataSetId ='" + dataSetId + "'";
    query += " AND pe = '"+period+"';";
    return query;
  }

}
