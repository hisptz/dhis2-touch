import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import * as _ from 'lodash';

/**
 * Generated class for the HideAndShowColumnsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-hide-and-show-columns',
  templateUrl: 'hide-and-show-columns.html'
})
export class HideAndShowColumnsPage implements OnInit, OnDestroy {
  selectedItemsModel: any;
  fieldsToDisplay: any;
  displayInLIst: any;
  isLoading: boolean;

  constructor(private navParams: NavParams, private viewCtrl: ViewController) {
    this.fieldsToDisplay = [];
    this.displayInLIst = [];
    this.selectedItemsModel = {};
    this.isLoading = true;
  }

  ngOnInit() {
    const data = this.navParams.get('data');
    const { columnsToDisplay } = data;
    const { programStage } = data;
    const { programTrackedEntityAttributes } = data;
    const { dataEntrySettings } = data;
    //select all preselected items
    if (columnsToDisplay) {
      _.keys(columnsToDisplay).map(key => {
        this.selectedItemsModel[key] = true;
      });
    }
    //for events capture table list header
    if (programStage && programStage.programStageDataElements) {
      this.displayInLIst = _.concat(this.displayInLIst, 'eventDate');
      _.map(
        programStage.programStageDataElements,
        (programStageDataElement: any) => {
          if (
            programStageDataElement.dataElement &&
            programStageDataElement.dataElement.id
          ) {
            if (programStageDataElement.displayInReports) {
              this.displayInLIst = _.concat(
                this.displayInLIst,
                programStageDataElement.dataElement.id
              );
            }
            let fieldLabel = programStageDataElement.dataElement.displayName;
            if (
              dataEntrySettings &&
              dataEntrySettings.label &&
              programStageDataElement.dataElement[dataEntrySettings.label]
            ) {
              if (
                isNaN(
                  programStageDataElement.dataElement[dataEntrySettings.label]
                )
              ) {
                fieldLabel =
                  programStageDataElement.dataElement[dataEntrySettings.label];
              }
            }
            this.fieldsToDisplay = _.concat(this.fieldsToDisplay, {
              id: programStageDataElement.dataElement.id,
              name: fieldLabel
            });
          }
        }
      );
    }
    //for tracker capture listing headers
    if (programTrackedEntityAttributes) {
      _.map(
        programTrackedEntityAttributes,
        (programTrackedEntityAttribute: any) => {
          if (programTrackedEntityAttribute.trackedEntityAttribute) {
            const attribute =
              programTrackedEntityAttribute.trackedEntityAttribute;
            let fieldLabel = attribute.name;
            if (
              dataEntrySettings &&
              dataEntrySettings.label &&
              attribute[dataEntrySettings.label] &&
              isNaN(attribute[dataEntrySettings.label])
            ) {
              fieldLabel = attribute[dataEntrySettings.label];
            }
            this.fieldsToDisplay.push({
              id: attribute.id,
              name: fieldLabel
            });
            if (programTrackedEntityAttribute.displayInList) {
              this.displayInLIst = _.concat(this.displayInLIst, attribute.id);
            }
          }
        }
      );
      if (this.displayInLIst.length === 0 && this.fieldsToDisplay.length > 0) {
        this.displayInLIst = _.concat(
          this.displayInLIst,
          this.fieldsToDisplay[0].id
        );
      }
    }

    this.isLoading = false;
  }

  ngOnDestroy() {
    this.fieldsToDisplay = null;
    this.selectedItemsModel = null;
    this.displayInLIst = null;
    this.isLoading = false;
  }

  trackByFn(index, item) {
    return item.id;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
