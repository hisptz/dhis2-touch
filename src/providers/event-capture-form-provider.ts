import { Injectable } from '@angular/core';

/*
  Generated class for the EventCaptureFormProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class EventCaptureFormProvider {

  public programStageDataElementsMapper : any;
  constructor() {
    this.programStageDataElementsMapper = {};
  }

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

  getSectionEntryForm(programStageSections){
    let sections = [];
    let self = this;

    programStageSections.forEach((programStageSection: any,index : any)=>{
      sections.push({
        name : programStageSection.name,
        id : index,
        programStageDataElements : self.getSectionDataElements(programStageSection.programStageDataElements)
      })
    });
    return sections;
  }

  getSectionDataElements(programStageDataElementsIdsArray){
    let programStageDataElements = [];
    programStageDataElementsIdsArray.forEach((programStageDataElement :any)=>{
      programStageDataElements.push(this.programStageDataElementsMapper[programStageDataElement.id]);
    });
    return programStageDataElements;
  }

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
