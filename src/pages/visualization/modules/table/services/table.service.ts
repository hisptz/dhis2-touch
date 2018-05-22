import { Injectable } from '@angular/core';
import { TableConfiguration } from '../models/table-configuration';

@Injectable()
export class TableService {

  constructor() {
  }

  drawTable(analyticsObject, tableConfiguration: TableConfiguration) {
    const legendClasses = tableConfiguration.legendSet ? tableConfiguration.legendSet.legends : null;


    const table = {
      'headers': [],
      'columns': [],
      'rows': [],
      'titles': {
        'rows': [],
        'column': []
      },
      titlesAvailable: false,
      hasParentOu: false
    };
    if (tableConfiguration.hasOwnProperty('title')) {
      table['title'] = tableConfiguration.title;
    }
    if (tableConfiguration.hasOwnProperty('subtitle')) {
      table['subtitle'] = tableConfiguration.subtitle;
    }
    if (tableConfiguration.displayList) {
      table.headers[0] = {
        items: [],
        style: ''
      };
      tableConfiguration.columns[tableConfiguration.columns.indexOf('pe')] = 'eventdate';
      tableConfiguration.columns[tableConfiguration.columns.indexOf('ou')] = 'ouname';
      for (const item of tableConfiguration.columns) {
        table.headers[0].items.push(
          {
            name: analyticsObject.headers[this._getTitleIndex(analyticsObject.headers, item)].column,
            span: 1
          }
        );
      }
      for (const item of analyticsObject.rows) {
        const column_items = [];
        for (const col of tableConfiguration.columns) {
          const index = this._getTitleIndex(analyticsObject.headers, col);
          column_items.push({
            name: '',
            display: true,
            row_span: '1',
            // color:getColor(item[index],)
            val: item[index]
          });

        }
        table.rows.push(
          {
            headers: [],
            items: column_items
          }
        );
      }
    } else {
      // add names to titles array
      if (tableConfiguration.showDimensionLabels) {
        table.titlesAvailable = true;
        for (const item of tableConfiguration.columns) {
          table.titles.column.push(analyticsObject.headers[this._getTitleIndex(analyticsObject.headers, item)].column);
        }
        for (const item of tableConfiguration.rows) {
          table.titles.rows.push(analyticsObject.headers[this._getTitleIndex(analyticsObject.headers, item)].column);
        }
      }
      for (const columnItem of tableConfiguration.columns) {
        let dimension = this.calculateColSpan(analyticsObject, tableConfiguration.columns, columnItem);
        let currentColumnItems = this.prepareSingleCategories(analyticsObject, columnItem);
        let headerItem = [];
        for (let i = 0; i < dimension.duplication; i++) {
          for (let currentItem of currentColumnItems) {
            headerItem.push({
              'name': currentItem.name,
              'span': dimension.col_span,
              type: currentItem.type,
              id: currentItem.uid
            });
          }
        }
        let styles = '';
        if (tableConfiguration.hasOwnProperty('style')) {
          if (tableConfiguration.styles.hasOwnProperty(columnItem)) {
            styles = tableConfiguration.styles[columnItem]
          }
        }
        table.headers.push({ 'items': headerItem, 'style': styles });
      }
      for (let rowItem of tableConfiguration.rows) {
        table.columns.push(rowItem);
      }

      // Preparing table columns
      let column_length = tableConfiguration.columns.length;
      let column_items_array = [];
      for (let i = 0; i < column_length; i++) {
        let currentRowItems = this.prepareSingleCategories(analyticsObject, tableConfiguration.columns[i]);
        column_items_array.push(currentRowItems);
      }
      let table_columns_array = [];
      for (let i = 0; i < column_items_array.length; i++) {
        if (table_columns_array.length === 0) {
          for (let item of column_items_array[i]) {
            table_columns_array.push([item]);
          }
        } else {
          let temp_arr = table_columns_array.concat();
          table_columns_array = [];
          for (let item of temp_arr) {
            for (let val of column_items_array[i]) {
              if (item instanceof Array) {
                let tempArr = Array.from(item);
                table_columns_array.push(tempArr.concat([val]));
              } else {
                table_columns_array.push([item, val]);
              }
            }
          }
        }

      }

      // Preparing table rows
      let rows_length = tableConfiguration.rows.length;
      let row_items_array = [];
      for (let i = 0; i < rows_length; i++) {
        let dimension = this.calculateColSpan(analyticsObject, tableConfiguration.rows, tableConfiguration.rows[i]);
        let currentRowItems = this.prepareSingleCategories(analyticsObject, tableConfiguration.rows[i]);
        row_items_array.push({ 'items': currentRowItems, 'dimensions': dimension });
      }
      let table_rows_array = [];
      for (let i = 0; i < row_items_array.length; i++) {
        if (table_rows_array.length === 0) {
          for (let item of row_items_array[i].items) {
            item.dimensions = row_items_array[i].dimensions;
            table_rows_array.push([item]);
          }
        } else {
          let temp_arr = table_rows_array.concat();
          table_rows_array = [];
          for (let item of temp_arr) {
            for (let val of row_items_array[i].items) {
              val.dimensions = row_items_array[i].dimensions;
              if (item instanceof Array) {
                let tempArr = Array.from(item);
                table_rows_array.push(tempArr.concat([val]));
              } else {
                table_rows_array.push([item, val]);
              }
            }
          }
        }

      }

      let counter = 0;
      if (table_rows_array.length != 0) {
        for (let rowItem of table_rows_array) {
          let item = {
            'items': [],
            'headers': rowItem
          };
          for (let val of rowItem) {
            if (counter === 0 || counter % val.dimensions.col_span === 0) {
              item.items.push({
                'type': val.type,
                'name': val.uid,
                'val': val.name,
                'row_span': val.dimensions.col_span, header: true
              });
            }
          }
          for (let colItem of table_columns_array) {
            let dataItem = [];
            for (let val of rowItem) {
              dataItem.push({ 'type': val.type, 'value': val.uid });
            }
            for (let val of colItem) {
              dataItem.push({ 'type': val.type, 'value': val.uid });
            }
            item.items.push({
              'name': '',
              'val': this.getDataValue(analyticsObject, dataItem),
              'color': this.getDataValueColor(legendClasses, this.getDataValue(analyticsObject, dataItem)),
              'row_span': '1',
              'display': true
            });
          }
          if (tableConfiguration.hasOwnProperty('hideEmptyRows') && tableConfiguration.hideEmptyRows) {
            if (!this.checkZeros(tableConfiguration.rows.length, item.items)) {
              table.rows.push(item);
            }
          } else {
            table.rows.push(item);
          }

          counter++;
        }
      } else {
        let item = {
          'items': [],
          'headers': []
        };
        for (let colItem of table_columns_array) {
          let dataItem = [];
          for (let val of colItem) {
            dataItem.push({ 'type': val.type, 'value': val.uid });
          }
          item.items.push({
            'name': '',
            'val': this.getDataValue(analyticsObject, dataItem),
            'row_span': '1',
            'display': true
          });
        }
        if (tableConfiguration.hasOwnProperty('hideEmptyRows') && tableConfiguration.hideEmptyRows) {
          if (!this.checkZeros(tableConfiguration.rows.length, item.items)) {
            table.rows.push(item);
          }
        } else {
          table.rows.push(item);
        }
      }
    }

    // todo improve total options to also work for event table
    // return this._getSanitizedTableObject(table, tableConfiguration);
    return table;
  }

  /**
   * finding the position of the item in rows- used when fetching data
   * @param analyticsObjectHeaders : Array
   * @param name : String ['ou','dx','co','pe',....]
   * @returns {number}
   * @private
   */
  private _getTitleIndex(analyticsObjectHeaders, name: string) {
    let index = 0;
    let counter = 0;
    for (const header of analyticsObjectHeaders) {
      if (header.name === name) {
        index = counter;
      }
      counter++;
    }
    return index;
  }

  private calculateColSpan(analyticsObject, array, item) {
    let indexOfItem = array.indexOf(item);
    let array_length = array.length;
    let last_index = array_length - 1;
    let dimensions = { 'col_span': 1, 'duplication': 1 };
    for (let i = last_index; i > indexOfItem; i--) {
      let arr = this.prepareSingleCategories(analyticsObject, array[i]);
      dimensions.col_span = dimensions.col_span * arr.length;
    }
    for (let i = 0; i < indexOfItem; i++) {
      let arr = this.prepareSingleCategories(analyticsObject, array[i]);
      dimensions.duplication = dimensions.duplication * arr.length;
    }
    return dimensions;

  }

  /**
   * return the meaningful array of single selection only
   * @param analyticsObject
   * @param xAxis
   * @param xAxisItems
   * @returns {{xAxisItems: Array, yAxisItems: Array}}
   */
  prepareSingleCategories(initialAnalytics, itemIdentifier, preDefinedItems = []) {
    const analyticsObject = this._sanitizeIncomingAnalytics(initialAnalytics);
    let structure = [];
    if (preDefinedItems.length === 0) {
      for (let val of this.getMetadataArray(analyticsObject, itemIdentifier)) {
        structure.push({ 'name': analyticsObject.metaData.names[val], 'uid': val, 'type': itemIdentifier });
      }
    }
    if (preDefinedItems.length !== 0) {
      for (let val of preDefinedItems) {
        structure.push({ 'name': analyticsObject.metaData.names[val], 'uid': val, 'type': itemIdentifier });
      }
    }
    return structure;
  }

  _sanitizeIncomingAnalytics(analyticsObject: any) {
    // for (let header of analyticsObject.headers) {
    //   if (header.hasOwnProperty('optionSet')) {
    //     if (analyticsObject.metaData[header.name].length == 0) {
    //       analyticsObject.metaData[header.name] = this._getRowItems(this._getTitleIndex(analyticsObject.headers, header.name), analyticsObject.rows);
    //       for (let item of analyticsObject.metaData[header.name]) {
    //         analyticsObject.metaData.names[item] = item;
    //       }
    //
    //     } else {
    //       for (let item of analyticsObject.metaData[header.name]) {
    //         analyticsObject.metaData.names[item] = item;
    //       }
    //     }
    //   }
    // }

    return analyticsObject;
  }

  /**
   * Get an array of specified metadata
   * @param analyticsObject : Result from analytics call
   * @param metadataType : String ['ou','dx','co','pe',....]
   * @returns {Array}
   */
  getMetadataArray(analyticsObject, metadataType: string) {
    let metadataArray = [];
    if (metadataType === 'dx') {
      metadataArray = analyticsObject.metaData.dx;
    } else if (metadataType === 'ou') {
      metadataArray = analyticsObject.metaData.ou;
    } else if (metadataType === 'co') {
      metadataArray = analyticsObject.metaData.co;
    } else if (metadataType === 'pe') {
      metadataArray = analyticsObject.metaData.pe;
    } else {
      metadataArray = analyticsObject.metaData[metadataType];
    }
    return metadataArray;
  }

  /**
   * try to find data from the rows of analytics object
   * @param analyticsObject : Result from analytics call
   * @param dataItems : Array of data to check each array item is an object [{'type':'ou','value':'bN5q5k5DgLA'},{'type': 'dx', 'value': 'eLo4RXcQIi5'}....]
   * @returns {number}
   */
  getDataValue(analyticsObject, dataItems = []) {
    let num = null;
    for (let value of analyticsObject.rows) {
      let counter = 0;
      for (let item of dataItems) {
        if (value[this._getTitleIndex(analyticsObject.headers, item.type)] === item.value) {
          counter++;
        }
      }
      if (counter === dataItems.length) {
        if (isNaN(value[this._getTitleIndex(analyticsObject.headers, 'value')])) {
          num = value[this._getTitleIndex(analyticsObject.headers, 'value')];
        } else {
          num += parseFloat(value[this._getTitleIndex(analyticsObject.headers, 'value')]);
        }
      }
    }
    return num;
  }

  /**
   * try to find data from the rows of analytics object
   * @param legendClass : Result from analytics call
   * @param datavalue :
    * @returns {string}
   */
  getDataValueColor(legendClasses, value) {
    let color = '';
    if (!isNaN(value) && legendClasses) {
      legendClasses.forEach(legendClass => {

        if (legendClass.startValue <= value && legendClass.endValue > value) {
          color = legendClass.color;
        }

        // if (legendClass.startValue < value && legendClass.endValue >= value) {
        //   console.log(legendClass.color);
        // }
      })
    }
    return color;
  }

  checkZeros(stating_length, array): boolean {
    let checker = true;
    for (let i = stating_length; i < array.length; i++) {
      if (array[i].name == '' && array[i].val != null) {
        checker = false
      }
    }
    return checker;
  }

}
