import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import * as _ from 'lodash';
import { Store } from '@ngrx/store';
import { State, getCurrentUserColorSettings } from '../../store';
import { Observable } from 'rxjs';

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
  loadingSize: string;
  typeOfList: string;
  icons: any;
  colorSettings$: Observable<any>;

  constructor(
    private store: Store<State>,
    private navParams: NavParams,
    private viewCtrl: ViewController
  ) {
    this.colorSettings$ = this.store.select(getCurrentUserColorSettings);
    this.fieldsToDisplay = [];
    this.displayInLIst = [];
    this.selectedItemsModel = {};
    this.icons = {
      all: 'assets/icon/check-all.png',
      none: 'assets/icon/uncheck-all.png',
      reset: 'assets/icon/not-allowed.png',
      done: 'assets/icon/circle-tick.png'
    };
    this.isLoading = true;
    this.loadingSize = 'large';
    this.typeOfList = '';
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
      const { executionDateLabel } = programStage;
      const reportDateLabel = isNaN(executionDateLabel)
        ? executionDateLabel
        : 'Report date';
      this.fieldsToDisplay.push({
        id: 'eventDate',
        name: reportDateLabel
      });
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

  trackByFn(index, item) {
    return item.id;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  updateSelection(selectedValue) {
    _.map(_.keys(this.selectedItemsModel), key => {
      this.selectedItemsModel[key] = false;
    });
    if (selectedValue === 'All') {
      this.fieldsToDisplay.map((field: any) => {
        this.selectedItemsModel[field.id] = true;
      });
    } else if (selectedValue === 'None') {
      //nothing to do as it has been rest
    } else if (selectedValue === 'Reset') {
      _.map(this.displayInLIst, key => {
        this.selectedItemsModel[key] = true;
      });
    }
  }

  saveChanges() {
    let columnsToDisplay = {};
    _.map(this.fieldsToDisplay, (field: any) => {
      if (this.selectedItemsModel[field.id]) {
        columnsToDisplay[field.id] = field.name;
      }
    });
    if (
      _.keys(columnsToDisplay).length == 0 &&
      this.fieldsToDisplay.length > 0 &&
      this.displayInLIst.length > 0
    ) {
      const id = this.displayInLIst[0];
      const field = _.find(this.fieldsToDisplay, fieldObject => {
        return fieldObject.id === id;
      });
      if (field && field.id) {
        columnsToDisplay[field.id] = field.name;
      }
    }
    this.viewCtrl.dismiss(columnsToDisplay);
  }

  ngOnDestroy() {
    this.fieldsToDisplay = null;
    this.selectedItemsModel = null;
    this.displayInLIst = null;
    this.isLoading = null;
    this.loadingSize = null;
    this.typeOfList = null;
  }
}
