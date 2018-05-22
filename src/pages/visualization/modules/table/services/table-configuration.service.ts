import { Injectable } from '@angular/core';
import {TableConfiguration} from '../models/table-configuration';

@Injectable()
export class TableConfigurationService {

  constructor() { }

  getTableConfiguration(favoriteObject: any, visualizationLayout: any, type: string): TableConfiguration {
    return {
      title: favoriteObject.hasOwnProperty('displayName') ? favoriteObject.displayName :
        favoriteObject.hasOwnProperty('name') ? favoriteObject.name : '',
      subtitle: favoriteObject.hasOwnProperty('subtitle') ? favoriteObject.subtitle : '',
      showColumnTotal: favoriteObject.hasOwnProperty('colTotal') ? favoriteObject.colTotal : true,
      showColumnSubtotal: favoriteObject.hasOwnProperty('colSubtotal') ? favoriteObject.colSubtotal : true,
      showRowTotal: favoriteObject.hasOwnProperty('rowTotal') ? favoriteObject.rowTotal : true,
      showRowSubtotal: favoriteObject.hasOwnProperty('rowSubtotal') ? favoriteObject.rowSubtotal : true,
      showDimensionLabels: favoriteObject.hasOwnProperty('showDimensionLabels') ? favoriteObject.showDimensionLabels : true,
      hideEmptyRows: favoriteObject.hasOwnProperty('hideEmptyRows') ? favoriteObject.hideEmptyRows : true,
      showHierarchy: favoriteObject.hasOwnProperty('showHierarchy') ? favoriteObject.showHierarchy : true,
      displayList: this._checkForEventDataType(favoriteObject, type),
      rows: visualizationLayout.rows ? visualizationLayout.rows : ['pe'],
      columns: visualizationLayout.columns ? visualizationLayout.columns : ['dx'],
      legendSet: favoriteObject.legendSet || null,
      styles: null
    };
  }

  private _checkForEventDataType(favoriteObject, favoriteType): boolean {
    let displayList = false;
    if (favoriteType === 'EVENT_REPORT') {
      if (favoriteObject.hasOwnProperty('dataType') && favoriteObject.dataType === 'EVENTS') {
        displayList = true;
      }
    }
    return displayList;
  }

}
