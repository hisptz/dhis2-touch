import { Injectable } from '@angular/core';
import {ProgramsProvider} from "../programs/programs";
import {OrganisationUnitsProvider} from "../organisation-units/organisation-units";
import {EnrollmentsProvider} from "../enrollments/enrollments";
import {TrackedEntityAttributeValuesProvider} from "../tracked-entity-attribute-values/tracked-entity-attribute-values";
import {TrackedEntityInstancesProvider} from "../tracked-entity-instances/tracked-entity-instances";

/*
  Generated class for the TrackerCaptureProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class TrackerCaptureProvider {

  constructor(private programsProvider : ProgramsProvider,
              private enrollmentsProvider : EnrollmentsProvider,
              private trackedEntityInstancesProvider : TrackedEntityInstancesProvider,
              private trackedEntityAttributeValuesProvider : TrackedEntityAttributeValuesProvider,
              private organisationUnitsProvider : OrganisationUnitsProvider) {}


  /**
   *
   * @param programId
   * @param currentUser
   * @returns {Promise<any>}
   */
  getTrackedEntityRegistration(programId,currentUser){
    let programTrackedEntityAttributes = [];
    let programTrackedEntityAttributeIds = [];
    return new Promise( (resolve, reject)=> {
      this.programsProvider.getProgramProgramTrackedEntityAttributes(programId,currentUser).then((programTrackedEntityAttributesResponse : any)=>{
        if(programTrackedEntityAttributesResponse && programTrackedEntityAttributesResponse.length > 0){
          programTrackedEntityAttributesResponse.forEach((programTrackedEntityAttribute : any)=>{
            if(programTrackedEntityAttribute.id.split("-").length > 1){
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
          this.programsProvider.getTrackedEntityAttributes(programTrackedEntityAttributeIds,currentUser).then((trackedEntityAttributes :  any)=>{
            programTrackedEntityAttributes = this.getMergedProgramTrackedEntityAttributesWithTrackedEntityAttributes(programTrackedEntityAttributes,trackedEntityAttributes);
            resolve(programTrackedEntityAttributes);
          }).catch(error=>{reject(error)});
        }else{
          resolve(programTrackedEntityAttributes);
        }
      }).catch(error=>{
        reject(error);
      });
    });
  }

  /**
   *
   * @param incidentDate
   * @param enrollmentDate
   * @param trackedEntityAttributeValues
   * @param currentUser
   * @returns {Promise<any>}
   */
  saveTrackedEntityRegistration(incidentDate,enrollmentDate,trackedEntityAttributeValues,currentUser,syncStatus?){
    let currentProgram = this.programsProvider.lastSelectedProgram;
    let currentOrgUnit = this.organisationUnitsProvider.lastSelectedOrgUnit;
    if(!syncStatus){
      syncStatus = "not-synced"
    }
    return new Promise( (resolve, reject)=> {
      if(currentOrgUnit && currentOrgUnit.id && currentProgram && currentProgram.id){
        let trackedEntityId = currentProgram.trackedEntity.id;
        this.trackedEntityInstancesProvider.savingTrackedEntityInstances(trackedEntityId,currentOrgUnit.id,currentOrgUnit.name,currentUser,syncStatus).then((trackedEntityInstanceObject : any)=>{
          this.enrollmentsProvider .savingEnrollments(trackedEntityId,currentOrgUnit.id,currentOrgUnit.name,currentProgram.id,enrollmentDate,incidentDate,trackedEntityInstanceObject.trackedEntityInstance,currentUser,syncStatus).then((enrollmentObject : any)=>{
            this.trackedEntityAttributeValuesProvider.savingTrackedEntityAttributeValues(trackedEntityInstanceObject.trackedEntityInstance,trackedEntityAttributeValues,currentUser).then(()=>{
              resolve({trackedEntityInstance : trackedEntityInstanceObject,enrollment : enrollmentObject});
            }).catch(error=>{
              reject({message : error});
            });
          }).catch(error=>{
            reject({message : error});
          });
        }).catch(error=>{
          reject({message : error});
        });
      }else{
        reject({message : "Fail to set last selected OU and program"});
      }
    });
  }

  /**
   *
   * @param programTrackedEntityAttributes
   * @param trackedEntityAttributes
   * @returns {Array}
   */
  getMergedProgramTrackedEntityAttributesWithTrackedEntityAttributes(programTrackedEntityAttributes,trackedEntityAttributes){
    let trackedEntityAttributesObject = {};
    let mergedResults = [];
    if(trackedEntityAttributes && trackedEntityAttributes.length > 0){
      trackedEntityAttributes.forEach((object : any)=>{
        trackedEntityAttributesObject[object.programTrackedEntityAttributeId] = object.trackedEntityAttribute;
      });
    }
    programTrackedEntityAttributes.forEach((programTrackedEntityAttribute : any)=>{
      if(trackedEntityAttributesObject[programTrackedEntityAttribute.id]){
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
  loadTrackedEntityInstancesList(programId,orgUnitId,currentUser){
    return new Promise( (resolve, reject)=> {
      this.enrollmentsProvider.getSavedEnrollments(orgUnitId,programId,currentUser).then((enrollments : any)=>{
        let trackedEntityInstanceIds = [];
        enrollments.forEach((enrollment : any)=>{
          trackedEntityInstanceIds.push(enrollment.trackedEntityInstance);
        });
        this.trackedEntityInstancesProvider.getTrackedEntityInstances(trackedEntityInstanceIds,currentUser).then((trackedEntityInstances : any )=>{
          this.trackedEntityAttributeValuesProvider.getTrackedEntityAttributeValues(trackedEntityInstanceIds,currentUser).then((attributeValues : any)=>{
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
            resolve(trackedEntityInstances.reverse());
          }).catch(error=>{
            reject({message : error});
          });

        }).catch(error=>{
          reject({message : error});
        });
      }).catch(error=>{
        reject({message : error});
      });
    });
  }



}
