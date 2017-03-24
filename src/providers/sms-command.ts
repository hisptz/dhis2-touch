import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Rx';

import { SMS } from '@ionic-native/sms';
import {HttpClient} from "./http-client";
import {SqlLite} from "./sql-lite";

/*
  Generated class for the SmsCommand provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class SmsCommand {

  public resourceName :string;

  constructor(public HttpClient : HttpClient,public SqlLite : SqlLite,public sms: SMS) {
    this.resourceName = "smsCommand";
  }

  /**
   * getting sms commands from login instance
   * @param user
   * @returns {Promise<T>}
     */
  getSmsCommandFromServer(user){
    let self = this;
    return new Promise(function(resolve, reject) {
      let smsCommandUrl = "/api/25/dataStore/sms/commands";
      self.HttpClient.get(smsCommandUrl,user).subscribe(response=>{
        response = response.json();
        resolve(response);
      },error=>{
        resolve([]);
      });
    });
  }

  /**
   * get dataSet command configuration
   * @param dataSetId
   * @param currentUser
   * @returns {Promise<T>}
     */
  getSmsCommandForDataSet(dataSetId,currentUser){
    let self = this;
    let ids = [];
    ids.push(dataSetId);
    return new Promise(function(resolve, reject) {
      self.SqlLite.getDataFromTableByAttributes(self.resourceName,"id",ids,currentUser.currentDatabase).then((smsCommands : any)=>{
        if(smsCommands.length > 0){
          resolve(smsCommands[0]);
        }else{
          reject();
        }
      },error=>{
        reject();
      });
    });
  }

  /**
   * @param dataSetId
   * @param period
   * @param orgUnitId
   * @param dataElements
   * @param currentUser
     * @returns {Promise<T>}
     */
  getEntryFormDataValuesObjectFromStorage(dataSetId,period,orgUnitId,dataElements,currentUser){
    let ids = [];
    let self = this;
    let entryFormDataValuesObjectFromStorage = {};
    dataElements.forEach((dataElement : any)=>{
      dataElement.categoryCombo.categoryOptionCombos.forEach((categoryOptionCombo : any)=>{
        ids.push(dataSetId + '-' + dataElement.id + '-' + categoryOptionCombo.id + '-' + period + '-' + orgUnitId);
      });
    });
    return new Promise(function(resolve, reject) {
      self.SqlLite.getDataFromTableByAttributes("dataValues","id",ids,currentUser.currentDatabase).then((dataValues : any)=>{
        dataValues.forEach((dataValue : any)=>{
          let id = dataValue.de + "-" +dataValue.co;
          entryFormDataValuesObjectFromStorage[id] = dataValue.value;
        });
        resolve(entryFormDataValuesObjectFromStorage)
      },error=>{
        reject();
      });
    });
  }

  /**
   *
   * @param smsCommand
   * @param entryFormDataValuesObject
   * @param selectedPeriod
   * @returns {Promise<T>}
     */
  getSmsForReportingData(smsCommand,entryFormDataValuesObject,selectedPeriod){
    return new Promise(function(resolve, reject) {
      let sms = [];
      let smsLimit = 135;
      let smsForReportingData = smsCommand.commandName + " " + selectedPeriod.iso + " ";
      let firstValuesFound = false;
      smsCommand.smsCode.forEach((smsCodeObject:any)=>{
        let id = smsCodeObject.dataElement.id + "-" +smsCodeObject.categoryOptionCombos;
        if(entryFormDataValuesObject[id]){
          let value = entryFormDataValuesObject[id];
          if(!firstValuesFound){
            firstValuesFound = true;
          }else if((smsForReportingData + smsCodeObject.smsCode + smsCommand.separator + value).length > smsLimit){
            sms.push(smsForReportingData);
            firstValuesFound = false;
            smsForReportingData = smsCommand.commandName + " " + selectedPeriod.iso + " ";
          }else {
            smsForReportingData = smsForReportingData + "|";
          }
          smsForReportingData = smsForReportingData + smsCodeObject.smsCode + smsCommand.separator + value;
        }
      });
      sms.push(smsForReportingData);
      resolve(sms);
    });
  };

  /**
   *
   * @param phoneNumber
   * @param messages
   * @returns {Promise<T>}
     */
  sendSmsForReportingData(phoneNumber,messages){
    let self = this;
    return new Promise(function(resolve, reject) {
      self.sendSms(phoneNumber,messages,0).then((success)=>{
        resolve()
      },error=>{
        reject()})
    });
  }


  /**
   * sending messages recursively
   * @param phoneNumber
   * @param messages
   * @param messageIndex
   * @returns {Promise<T>}
     */
  sendSms(phoneNumber,messages,messageIndex){
    var options={
      replaceLineBreaks: false,
      android: {
        intent: ''
      }
    };
    let self = this;
    return new Promise(function(resolve, reject) {
      self.sms.send(phoneNumber,messages[messageIndex], options).then((success)=>{
        messageIndex = messageIndex + 1;
        if(messageIndex < messages.length){
          self.sendSms(phoneNumber,messages,messageIndex).then(()=>{
            resolve();
          },error=>{
            reject(error);
          });
        }else{
          resolve(success);
        }
      },(error)=>{
        reject(error);
      });
    });
  }

  /**
   * get dataElements of a given data set
   * @param dataSet
   * @returns {Array}
     */
  getEntryFormDataElements(dataSet){
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
   * saving sms commands
   * @param smsCommands
   * @param databaseName
   * @returns {Promise<T>}
     */
  savingSmsCommand(smsCommands,databaseName){
    let promises = [];
    let self = this;
    return new Promise(function(resolve, reject) {
      if(smsCommands.length == 0){
        resolve();
      }
      smsCommands.forEach((smsCommand:any)=>{
        smsCommand["id"] = smsCommand.commandName;
        promises.push(
          self.SqlLite.insertDataOnTable(self.resourceName,smsCommand,databaseName).then(()=>{
            //saving success
            console.log("smsCommand " + smsCommand["id"]);
          },(error) => {
          })
        );
      });
      Observable.forkJoin(promises).subscribe(() => {
          resolve();
        },
        (error) => {
          reject(error);
        })
    });
  }


}
