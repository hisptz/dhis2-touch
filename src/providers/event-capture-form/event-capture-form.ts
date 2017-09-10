import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the EventCaptureFormProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class EventCaptureFormProvider {

  public programStageDataElementsMapper : any;

  constructor(public http: Http) {
    this.programStageDataElementsMapper = {};
  }

  /**
   * gey event capture form metadata
   * @param programStageSections
   * @param programStageDataElements
   * @returns {Promise<T>}
   */
  getEventCaptureEntryFormMetaData(programStageSections,programStageDataElements){
    this.programStageDataElementsMapper = {};
    programStageDataElements.forEach((programStageDataElement:any)=>{
      this.programStageDataElementsMapper[programStageDataElement.id] = programStageDataElement;
    });
    let self = this;
    return new Promise(function(resolve, reject) {
      if(programStageSections.length > 0){
        resolve(self.getSectionEntryForm(programStageSections));
      }else{
        resolve(self.getDefaultEntryForm(programStageDataElements));
      }
    });

  }

  /**
   * get section form for event capture
   * @param programStageSections
   * @returns {Array}
   */
  getSectionEntryForm(programStageSections){
    let sections = [];
    programStageSections.forEach((programStageSection: any,index : any)=>{
      sections.push({
        name : programStageSection.name,
        id : index,
        programStageDataElements : this.getSectionDataElements(programStageSection.programStageDataElements)
      })
    });
    return sections;
  }

  /**
   * get program stage data element by section
   * @param programStageDataElementsIdsArray
   * @returns {Array}
   */
  getSectionDataElements(programStageDataElementsIdsArray){
    let programStageDataElements = [];
    programStageDataElementsIdsArray.forEach((programStageDataElement :any)=>{
      programStageDataElements.push(this.programStageDataElementsMapper[programStageDataElement.id]);
    });
    return programStageDataElements;
  }

  /**
   * get default form for event capture form
   * @param programStageDataElements
   * @returns {Array}
   */
  getDefaultEntryForm(programStageDataElements){
    let pager = programStageDataElements.length;
    let sectionsCounter = Math.ceil(programStageDataElements.length/pager);
    let sections = [];
    for(let index = 0; index < sectionsCounter; index ++){
      sections.push({
        name : "defaultSection",
        id : index,
        programStageDataElements :programStageDataElements.splice(0,pager)
      });
    }
    return sections;
  }


}
