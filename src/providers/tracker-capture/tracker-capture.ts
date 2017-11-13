import {Injectable} from '@angular/core';
import {ProgramsProvider} from "../programs/programs";
import {OrganisationUnitsProvider} from "../organisation-units/organisation-units";
import {EnrollmentsProvider} from "../enrollments/enrollments";
import {TrackedEntityAttributeValuesProvider} from "../tracked-entity-attribute-values/tracked-entity-attribute-values";
import {TrackedEntityInstancesProvider} from "../tracked-entity-instances/tracked-entity-instances";
import {SqlLiteProvider} from "../sql-lite/sql-lite";
import {HttpClientProvider} from "../http-client/http-client";

/*
  Generated class for the TrackerCaptureProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class TrackerCaptureProvider {

  constructor(private programsProvider: ProgramsProvider,
              private enrollmentsProvider: EnrollmentsProvider,
              private sqlLite: SqlLiteProvider,
              private trackedEntityInstancesProvider: TrackedEntityInstancesProvider,
              private trackedEntityAttributeValuesProvider: TrackedEntityAttributeValuesProvider,
              private httpClientProvider : HttpClientProvider,
              private organisationUnitsProvider: OrganisationUnitsProvider) {
  }


  /**
   *
   * @param trackedEntityInstancesId
   * @param currentUser
   * @returns {Promise<any>}
   */
  getTrackedEntityInstance(trackedEntityInstancesId, currentUser) {
    return new Promise((resolve,reject)=>{
      this.trackedEntityInstancesProvider.getTrackedEntityInstancesByAttribute('trackedEntityInstance',[trackedEntityInstancesId],currentUser).then((trackedEntityInstances : any )=>{
        this.trackedEntityAttributeValuesProvider.getTrackedEntityAttributeValues([trackedEntityInstancesId],currentUser).then((attributeValues : any)=>{
          let attributeValuesObject = {};
          if(attributeValues && attributeValues.length > 0){
            attributeValues.forEach((attributeValue : any)=>{
              delete attributeValue.id;
              if(!attributeValuesObject[attributeValue.trackedEntityInstance]){
                attributeValuesObject[attributeValue.trackedEntityInstance] = [];
              }
              attributeValuesObject[attributeValue.trackedEntityInstance].push(attributeValue);
            });
            trackedEntityInstances.forEach((trackedEntityInstanceObject : any)=>{
              if(attributeValuesObject[trackedEntityInstanceObject.trackedEntityInstance]){
                trackedEntityInstanceObject["attributes"] = attributeValuesObject[trackedEntityInstanceObject.trackedEntityInstance];
              }else{
                trackedEntityInstanceObject["attributes"] = [];
              }
            });
            resolve(trackedEntityInstances[0])
          }
        }).catch(error=>{
          reject({message : error});
        });
      }).catch(error=>{
        reject({message : error});
      });
    });
  }

  /**
   *
   * @param status
   * @param currentUser
   * @returns {Promise<any>}
   */
  getTrackedEntityInstanceByStatus(status,currentUser){
    return new Promise((resolve,reject)=>{
      this.trackedEntityInstancesProvider.getTrackedEntityInstancesByAttribute('syncStatus',[status],currentUser).then((trackedEntityInstances : any )=>{
        if(trackedEntityInstances && trackedEntityInstances.length > 0){
          let trackedEntityInstancesIds = [];
          trackedEntityInstances.forEach((trackedEntityInstance : any)=>{
            trackedEntityInstancesIds.push(trackedEntityInstance.id);
          });
          this.trackedEntityAttributeValuesProvider.getTrackedEntityAttributeValues(trackedEntityInstancesIds,currentUser).then((attributeValues : any)=>{
            let attributeValuesObject = {};
            if(attributeValues && attributeValues.length > 0){
              attributeValues.forEach((attributeValue : any)=>{
                delete attributeValue.id;
                if(!attributeValuesObject[attributeValue.trackedEntityInstance]){
                  attributeValuesObject[attributeValue.trackedEntityInstance] = [];
                }
                attributeValuesObject[attributeValue.trackedEntityInstance].push(attributeValue);
              });
              trackedEntityInstances.forEach((trackedEntityInstanceObject : any)=>{
                if(attributeValuesObject[trackedEntityInstanceObject.trackedEntityInstance]){
                  trackedEntityInstanceObject["attributes"] = attributeValuesObject[trackedEntityInstanceObject.trackedEntityInstance];
                }else{
                  trackedEntityInstanceObject["attributes"] = [];
                }
              });
            }
            resolve(trackedEntityInstances)
          }).catch(error=>{
            reject({message : error});
          });
        }else{
          resolve([]);
        }
      }).catch(error=>{
        reject({message : error});
      });
    });
  }

  /**
   *
   * @param programId
   * @param currentUser
   * @returns {Promise<any>}
   */
  getTrackedEntityRegistration(programId, currentUser) {
    let programTrackedEntityAttributes = [];
    let programTrackedEntityAttributeIds = [];
    return new Promise((resolve, reject) => {
      this.programsProvider.getProgramProgramTrackedEntityAttributes(programId, currentUser).then((programTrackedEntityAttributesResponse: any) => {
        if (programTrackedEntityAttributesResponse && programTrackedEntityAttributesResponse.length > 0) {
          programTrackedEntityAttributesResponse.forEach((programTrackedEntityAttribute: any) => {
            if (programTrackedEntityAttribute.id.split("-").length > 1) {
              programTrackedEntityAttribute.id = programTrackedEntityAttribute.id.split("-")[1];
              programTrackedEntityAttributeIds.push(programTrackedEntityAttribute.id);
              delete programTrackedEntityAttribute.programId;
              programTrackedEntityAttribute.mandatory = JSON.parse(programTrackedEntityAttribute.mandatory);
              programTrackedEntityAttribute.displayInList = JSON.parse(programTrackedEntityAttribute.displayInList);
              programTrackedEntityAttribute.externalAccess = JSON.parse(programTrackedEntityAttribute.externalAccess);
              programTrackedEntityAttributes.push(programTrackedEntityAttribute);
            }
          });
          programTrackedEntityAttributes.sort((a, b) => {
            if (a.sortOrder > b.sortOrder) {
              return 1;
            }
            if (a.sortOrder < b.sortOrder) {
              return -1;
            }
            return 0;
          });
          this.programsProvider.getTrackedEntityAttributes(programTrackedEntityAttributeIds, currentUser).then((trackedEntityAttributes: any) => {
            programTrackedEntityAttributes = this.getMergedProgramTrackedEntityAttributesWithTrackedEntityAttributes(programTrackedEntityAttributes, trackedEntityAttributes);
            resolve(programTrackedEntityAttributes);
          }).catch(error => {
            reject(error)
          });
        } else {
          resolve(programTrackedEntityAttributes);
        }
      }).catch(error => {
        reject(error);
      });
    });
  }

  /**
   *
   * @param trackedEntityInstances
   * @param copiedTrackedEntityInstances
   * @param currentUser
   * @returns {Promise<any>}
   */
  uploadTrackedEntityInstancesToServer(trackedEntityInstances,copiedTrackedEntityInstances,currentUser){
    return new Promise((resolve,reject)=>{
      let url = "/api/25/trackedEntityInstances";
      let trackedEntityInstanceIds = [];
      let success = 0, fail = 0;
      let errorMessages = [];
      trackedEntityInstances.forEach((trackedEntityInstance  : any,index)=>{
        delete trackedEntityInstance.id;
        delete trackedEntityInstance.orgUnitName;
        delete trackedEntityInstance.syncStatus;
        delete trackedEntityInstance.deleted;
        trackedEntityInstance.attributes.forEach((attribute : any)=>{
          delete attribute.trackedEntityInstance;
          delete attribute.id;
        });
        this.httpClientProvider.defaultPost(url,trackedEntityInstance,currentUser).then((response : any)=>{
          trackedEntityInstanceIds.push(copiedTrackedEntityInstances[parseInt(index)].trackedEntityInstance);
          success ++;
          if(success + fail == copiedTrackedEntityInstances.length){
            this.trackedEntityInstancesProvider.getTrackedEntityInstancesByAttribute('trackedEntityInstance',trackedEntityInstanceIds,currentUser).then((trackedEntityInstances : any)=>{
              this.trackedEntityInstancesProvider.updateSavedTrackedEntityInstancesByStatus(trackedEntityInstances,currentUser,'synced').then(()=>{
                resolve({trackedEntityInstanceIds : trackedEntityInstanceIds,importSummaries : {success : success,fail : fail,errorMessages: errorMessages}});
              }).catch(error=>{
                reject({message : error});
              });
            }).catch(error=>{
              reject({message : error});
            })
          }
        }).catch((error=>{
          fail ++;
          if(error && error.response && error.response.importSummaries && error.response.importSummaries.length > 0 && error.response.importSummaries[0].description){
            let message = error.response.importSummaries[0].description;
            if(errorMessages.indexOf(message) == -1){
              errorMessages.push(message);
            }
          }else if(error && error.httpStatusCode == 500){
            let message = error.message;
            if(errorMessages.indexOf(message) == -1){
              errorMessages.push(message);
            }
          }
          if(success + fail == copiedTrackedEntityInstances.length){
            this.trackedEntityInstancesProvider.getTrackedEntityInstancesByAttribute('trackedEntityInstance',trackedEntityInstanceIds,currentUser).then((trackedEntityInstances : any)=>{
              this.trackedEntityInstancesProvider.updateSavedTrackedEntityInstancesByStatus(trackedEntityInstances,currentUser,'synced').then(()=>{
                resolve({trackedEntityInstanceIds : trackedEntityInstanceIds,importSummaries : {success : success,fail : fail,errorMessages: errorMessages}});
              }).catch(error=>{
                reject({message : error});
              });
            }).catch(error=>{
              reject({message : error});
            })
          }
        }));
      });
    })
  }

  /**
   *
   * @param enrollments
   * @param currentUser
   * @returns {Promise<any>}
   */
  uploadEnrollments(enrollments,currentUser){
    return new Promise((resolve,reject)=>{
      let success = 0, fail = 0;
      let url = "/api/25/enrollments";
      let enrollmentIds = [];
      let errorMessages = [];
      enrollments.forEach((enrollment : any)=>{
        enrollmentIds.push(enrollment.id);
        delete enrollment.syncStatus;
        delete enrollment.id;
        delete enrollment.events;
        this.httpClientProvider.defaultPost(url,enrollment,currentUser).then(()=>{
          success ++;
          if(success + fail == enrollments.length ){
            this.enrollmentsProvider.getSavedEnrollmentsByAttribute('id',enrollmentIds,currentUser).then((enrollments : any)=>{
              this.enrollmentsProvider.updateEnrollmentsByStatus(enrollments,currentUser,'synced').then(()=>{
                resolve({success : success,fail : fail ,errorMessages : errorMessages});
              }).catch(error=>{
                reject(error);
              });
            }).catch(error=>{
              reject(error);
            });
          }
        }).catch(error=>{
          fail ++;
          if(error && error.response && error.response.importSummaries && error.response.importSummaries.length > 0 && error.response.importSummaries[0].description){
            let message = error.response.importSummaries[0].description;
            if(errorMessages.indexOf(message) == -1){
              errorMessages.push(message);
            }
          }else if(error && error.httpStatusCode == 500){
            let message = error.message;
            if(errorMessages.indexOf(message) == -1){
              errorMessages.push(message);
            }
          }
          if(success + fail == enrollments.length ){
            this.enrollmentsProvider.getSavedEnrollmentsByAttribute('id',enrollmentIds,currentUser).then((enrollments : any)=>{
              this.enrollmentsProvider.updateEnrollmentsByStatus(enrollments,currentUser,'synced').then(()=>{
                resolve({success : success,fail : fail ,errorMessages : errorMessages});
              }).catch(error=>{
                reject(error);
              });
            }).catch(error=>{
              reject(error);
            });
          }
        });
      })
    });
  }

  /**
   *
   * @param incidentDate
   * @param enrollmentDate
   * @param currentUser
   * @param trackedEntityInstance
   * @param syncStatus
   * @returns {Promise<any>}
   */
  saveTrackedEntityRegistration(incidentDate, enrollmentDate, currentUser, trackedEntityInstance, syncStatus?) {
    return new Promise((resolve, reject) => {
      let currentProgram = this.programsProvider.lastSelectedProgram;
      let currentOrgUnit = this.organisationUnitsProvider.lastSelectedOrgUnit;
      if (!syncStatus) {
        syncStatus = "not-synced";
      }
      if (currentOrgUnit && currentOrgUnit.id && currentProgram && currentProgram.id && currentProgram.trackedEntity) {
        let trackedEntityId = currentProgram.trackedEntity.id;
        let payLoads = [];
        payLoads.push({
          resource: "trackedEntityInstances",
          payLoad: this.trackedEntityInstancesProvider.getTrackedEntityInstancesPayLoad(trackedEntityId, currentOrgUnit.id, currentOrgUnit.name, syncStatus, trackedEntityInstance)
        });
        payLoads.push({
          resource: "enrollments",
          payLoad: this.enrollmentsProvider.getEnrollmentsPayLoad(trackedEntityId, currentOrgUnit.id, currentOrgUnit.name, currentProgram.id, enrollmentDate, incidentDate, trackedEntityInstance, syncStatus)
        });
        let counter = 0;
        payLoads.forEach((payLoadObject: any) => {
          this.sqlLite.insertBulkDataOnTable(payLoadObject.resource, payLoadObject.payLoad, currentUser.currentDatabase).then(() => {
            counter++;
            if (counter == payLoads.length) {
              resolve()
            }
          }).catch(error => {
            reject({message: error});
          });
        });
      } else {
        reject({message: "Fail to set OU and program"})
      }
    });
  }


  /**
   *
   * @param attributeToDisplay
   * @param trackedEntityInstances
   * @returns {Promise<any>}
   */
  getTableFormatResult(attributeToDisplay, trackedEntityInstances) {
    let table = {headers: [], rows: []};
    Object.keys(attributeToDisplay).forEach(key => {
      table.headers.push(attributeToDisplay[key]);
    });
    let mapperArray = this.getAttributesMapperForDisplay(trackedEntityInstances).mapper;
    let trackedEntityInstancesIds = this.getAttributesMapperForDisplay(trackedEntityInstances).trackedEntityInstancesIds;
    mapperArray.forEach((attributeMapper: any) => {
      let row = [];
      Object.keys(attributeToDisplay).forEach(key => {
        if (attributeMapper[key]) {
          row.push(attributeMapper[key]);
        } else {
          row.push("");
        }
      });
      table.rows.push(row);
    });
    return new Promise((resolve, reject) => {
      resolve({table: table, trackedEntityInstancesIds: trackedEntityInstancesIds});
    });
  }

  /**
   *
   * @param trackedEntityInstances
   * @returns {{mapper: Array; trackedEntityInstancesIds: Array}}
   */
  getAttributesMapperForDisplay(trackedEntityInstances) {
    let mapper = [];
    let trackedEntityInstancesIds = [];
    trackedEntityInstances.forEach((trackedEntityInstance: any) => {
      let attributeMapper = {};
      if (trackedEntityInstance.attributes) {
        trackedEntityInstance.attributes.forEach((attributeObject: any) => {
          attributeMapper[attributeObject.attribute] = attributeObject.value;
        });
      }
      mapper.push(attributeMapper);
      trackedEntityInstancesIds.push(trackedEntityInstance.id);
    });
    return {mapper: mapper, trackedEntityInstancesIds: trackedEntityInstancesIds};
  }

  /**
   *
   * @param programTrackedEntityAttributes
   * @param trackedEntityAttributes
   * @returns {Array}
   */
  getMergedProgramTrackedEntityAttributesWithTrackedEntityAttributes(programTrackedEntityAttributes, trackedEntityAttributes) {
    let trackedEntityAttributesObject = {};
    let mergedResults = [];
    if (trackedEntityAttributes && trackedEntityAttributes.length > 0) {
      trackedEntityAttributes.forEach((object: any) => {
        trackedEntityAttributesObject[object.programTrackedEntityAttributeId] = object.trackedEntityAttribute;
      });
    }
    programTrackedEntityAttributes.forEach((programTrackedEntityAttribute: any) => {
      if (trackedEntityAttributesObject[programTrackedEntityAttribute.id]) {
        programTrackedEntityAttribute["trackedEntityAttribute"] = trackedEntityAttributesObject[programTrackedEntityAttribute.id];
        mergedResults.push(programTrackedEntityAttribute);
      }
    });
    return mergedResults;
  }

  /**
   *
   * @param programId
   * @param orgUnitId
   * @param currentUser
   * @returns {Promise<any>}
   */
  loadTrackedEntityInstancesList(programId, orgUnitId, currentUser) {
    return new Promise((resolve, reject) => {
      this.enrollmentsProvider.getSavedEnrollments(orgUnitId, programId, currentUser).then((enrollments: any) => {
        let trackedEntityInstanceIds = [];
        enrollments.forEach((enrollment: any) => {
          trackedEntityInstanceIds.push(enrollment.trackedEntityInstance);
        });
        this.trackedEntityInstancesProvider.getTrackedEntityInstancesByAttribute('trackedEntityInstance',trackedEntityInstanceIds, currentUser).then((trackedEntityInstances: any) => {
          this.trackedEntityAttributeValuesProvider.getTrackedEntityAttributeValues(trackedEntityInstanceIds, currentUser).then((attributeValues: any) => {
            let attributeValuesObject = {};
            if (attributeValues && attributeValues.length > 0) {
              attributeValues.forEach((attributeValue: any) => {
                delete attributeValue.id;
                if (!attributeValuesObject[attributeValue.trackedEntityInstance]) {
                  attributeValuesObject[attributeValue.trackedEntityInstance] = [];
                }
                attributeValuesObject[attributeValue.trackedEntityInstance].push(attributeValue);
              });
              trackedEntityInstances.forEach((trackedEntityInstanceObject: any) => {
                if (attributeValuesObject[trackedEntityInstanceObject.trackedEntityInstance]) {
                  trackedEntityInstanceObject["attributes"] = attributeValuesObject[trackedEntityInstanceObject.trackedEntityInstance];
                } else {
                  trackedEntityInstanceObject["attributes"] = [];
                }
              });
            }
            resolve(trackedEntityInstances.reverse());
          }).catch(error => {
            reject({message: error});
          });

        }).catch(error => {
          reject({message: error});
        });
      }).catch(error => {
        reject({message: error});
      });
    });
  }

  /**
   *
   * @param trackedEntityInstanceId
   * @param currentUser
   * @returns {Promise<any>}
   */
  deleteTrackedEntityInstance(trackedEntityInstanceId,currentUser){
    return new Promise((resolve,reject)=>{
      this.sqlLite.deleteFromTableByAttribute('trackedEntityInstances','trackedEntityInstance',trackedEntityInstanceId,currentUser.currentDatabase).then(()=>{
        this.sqlLite.deleteFromTableByAttribute('trackedEntityAttributeValues','trackedEntityInstance',trackedEntityInstanceId,currentUser.currentDatabase).then(()=>{
          this.sqlLite.deleteFromTableByAttribute('enrollments','trackedEntityInstance',trackedEntityInstanceId,currentUser.currentDatabase).then(()=>{
            this.sqlLite.deleteFromTableByAttribute('events','trackedEntityInstance',trackedEntityInstanceId,currentUser.currentDatabase).then(()=>{
              resolve();
            }).catch(error=>{
              reject(error);
            });
          }).catch(error=>{
            reject(error);
          });
        }).catch(error=>{
          reject(error);
        });
      }).catch(error=>{
        reject(error);
      });
    });
  }

}
