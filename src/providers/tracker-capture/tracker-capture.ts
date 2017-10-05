import { Injectable } from '@angular/core';
import {ProgramsProvider} from "../programs/programs";

/*
  Generated class for the TrackerCaptureProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class TrackerCaptureProvider {

  constructor(private programsProvider : ProgramsProvider) {}


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



}
