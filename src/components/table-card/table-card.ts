import { Component,Input,OnInit} from '@angular/core';
import {Visualization} from "../../model/visualization";
import * as _ from 'lodash';

/**
 * Generated class for the TableCardComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'table-card',
  templateUrl: 'table-card.html'
})
export class TableCardComponent implements OnInit{

  @Input() visualizationObject: Visualization;
  private _tableHasError: boolean;
  private _errorMessage: string;
  private _tableObjects: any[];
  private _loaded: boolean;

  sort_direction: string[] = [];
  current_sorting: boolean[] = [];

  constructor() {
    this._tableHasError = false;
    this._tableObjects = [];
    this._loaded = false;
  }

  ngOnInit() {
    this._tableHasError = this.visualizationObject.details.hasError;
    this._errorMessage = this.visualizationObject.details.errorMessage;
    this._loaded = this.visualizationObject.details.loaded;

    if (this.visualizationObject && this.visualizationObject.details && this.visualizationObject.details.loaded) {
      const newTableObjects =  _.map(this.visualizationObject.layers, (layer) => {
        return layer.tableObject
      });
      this._tableObjects  = _.filter(newTableObjects, (tableObject) => {
        return tableObject !== undefined
      });
    }
  }

  sortData(tableObject, n, isLastItem) {
    if (tableObject.columns.length == 1 && isLastItem) {
      this.current_sorting = [];
      this.current_sorting[n] = true;
      let table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
      table = document.getElementById('myPivotTable');
      switching = true;
      //  Set the sorting direction to ascending:
      dir = 'asc';
      /*Make a loop that will continue until
       no switching has been done:*/
      while (switching) {
        //  start by saying: no switching is done:
        switching = false;
        rows = table.getElementsByTagName('TR');
        /*Loop through all table rows (except the
         first, which contains table headers):*/
        for (i = 0; i < (rows.length - 1); i++) {
          // start by saying there should be no switching:
          shouldSwitch = false;
          /*Get the two elements you want to compare,
           one from current row and one from the next:*/
          x = rows[i].getElementsByTagName('TD')[n];
          y = rows[i + 1].getElementsByTagName('TD')[n];
          /*check if the two rows should switch place,
           based on the direction, asc or desc:*/
          if (dir == 'asc') {
            if (parseFloat(x.innerHTML)) {
              if (parseFloat(x.innerHTML) > parseFloat(y.innerHTML)) {
                // if so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
              }
            } else {
              if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                // if so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
              }
            }
            this.sort_direction[n] = 'asc';
          } else if (dir == 'desc') {
            if (parseFloat(x.innerHTML)) {
              if (parseFloat(x.innerHTML) < parseFloat(y.innerHTML)) {
                // if so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
              }
            } else {
              if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                // if so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
              }
            }
            this.sort_direction[n] = 'desc';
          }
        }
        if (shouldSwitch) {
          /*If a switch has been marked, make the switch
           and mark that a switch has been done:*/
          rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
          switching = true;
          // Each time a switch is done, increase this count by 1:
          switchcount++;
        } else {
          /*If no switching has been done AND the direction is 'asc',
           set the direction to 'desc' and run the while loop again.*/
          if (switchcount == 0 && dir == 'asc') {
            dir = 'desc';
            this.sort_direction[n] = 'desc';
            switching = true;
          }
        }
      }
    }

  }

  //  a function to add sub-column in table object
  addColumnSubTotal(tableObject) {
    let data = _.cloneDeep(tableObject);
    if (data.headers && data.headers.length > 1) {
      let span_distance = data.headers[0].items[0].span;
      let some_header = [];
      let some_rows = [];
      //  Processing headers
      data.headers.forEach((header) => {
        let some_items = [];
        let current_distance = header.items[0].span;
        let limit = (span_distance - current_distance) + 1;
        let check_counter = 1;
        header.items.forEach((item, index) => {
          if (item.name == 'total' || item.name == 'avg') {
            some_items.push(item)
          } else {
            if ((check_counter % limit) == 0) {
              some_items.push(item);
              some_items.push({name: 'total', span: 1})
            } else {
              some_items.push(item);
            }
            check_counter++;
          }
        });
        some_header.push({items: some_items, style: ''});
      });
      //  Processing rows
      data.rows.forEach((row) => {
        let counter = 1;
        let some_row_item = [];
        let sum = 0;
        row.items.forEach((item) => {
          if (item.hasOwnProperty('header')) {
            some_row_item.push(item)
          } else {
            let item_value = parseFloat(item.val);
            if ((counter % span_distance) == 0) {
              some_row_item.push(item);
              sum += (item_value) ? item.val : 0;
              some_row_item.push({name: 'total', val: +sum.toFixed(2), row_span: 1, subtotal_column: true})
              sum = 0;
            } else {
              sum += (item_value) ? item.val : 0;
              some_row_item.push(item);
            }
            counter++
          }
        });
        some_rows.push({items: some_row_item, headers: row.headers});
      });
      return {
        headers: some_header,
        rows: some_rows,
        columns: data.columns,
        titles: data.titles,
        title: data.title
      };
    } else {
      return data;
    }
  }

  //  This function will add a totals for all columns
  addColumnTotal(tableObject) {
    let data = _.cloneDeep(tableObject);
    let some_header = [];
    let some_rows = [];
    //  Adding title to the rows
    data.headers.forEach((header) => {
      let some_items = [];
      header.items.forEach((item) => {
        some_items.push(item);
      });
      some_items.push({name: 'total', span: 1});
      some_header.push({items: some_items, style: ''});

    });

    //  Processing rows
    data.rows.forEach((row) => {
      let some_row_item = [];
      let sum = 0;
      row.items.forEach((item) => {
        if (item.hasOwnProperty('header')) {
          some_row_item.push(item)
        } else {
          let item_value = parseFloat(item.val);
          if (item.hasOwnProperty('subtotal_column')) {
          }
          else {
            sum += (item_value) ? item.val : 0;
            some_row_item.push(item);
          }
        }
      });
      some_row_item.push({name: 'total', val: +sum.toFixed(2), row_span: 1, column_total: true, sub_total: true});
      some_rows.push({items: some_row_item, headers: row.headers});
    });

    return {
      headers: some_header,
      rows: some_rows,
      columns: data.columns,
      titles: data.titles,
      title: data.title
    };

  }

  //  This will add an average for all columns
  addColumnAverage(tableObject) {
    let data = _.cloneDeep(tableObject);
    let some_header = [];
    let some_rows = [];
    //  Adding title to the rows
    data.headers.forEach((header) => {
      let some_items = [];
      header.items.forEach((item) => {
        some_items.push(item);
      });
      some_items.push({name: 'avg', span: 1});
      some_header.push({items: some_items, style: ''});

    });

    //  Processing row
    let sum_counter = 0;
    data.rows.forEach((row) => {
      let some_row_item = [];
      let sum = 0;
      sum_counter = 0;
      row.items.forEach((item) => {
        if (item.hasOwnProperty('header')) {
          some_row_item.push(item)
        } else {
          let item_value = parseFloat(item.val);
          if (item.hasOwnProperty('subtotal_column')) {
          }
          else {
            sum_counter++;
            sum += (item_value) ? item.val : 0;
            some_row_item.push(item);
          }
        }
      });
      let avg = sum / sum_counter;
      some_row_item.push({name: 'avg', val: +avg.toFixed(2), row_span: 1, column_total: true, sub_total: true});
      some_rows.push({items: some_row_item, headers: row.headers});
    });

    return {
      headers: some_header,
      rows: some_rows,
      columns: data.columns,
      titles: data.titles,
      title: data.title
    };

  }

  //  this will add a subtotal for rows for each groups
  addRowSubtotal(tableObject) {
    let data = _.cloneDeep(tableObject);
    if (data.columns.length > 1) {
      let row_distance: any = data.rows[0].items[0].row_span;
      let some_rows = [];
      let counter = 1;
      let sum_rows = [];
      data.rows.forEach((row) => {
        let row_items = [];
        if ((counter % row_distance) == 0) {
          some_rows.push(row);
          //  adding totals to the sum array to be used in the created row
          let sum_counter = 0;
          row.items.forEach((item) => {
            if (item.hasOwnProperty('header')) {
            }
            else {
              if (sum_rows[sum_counter]) {
                sum_rows[sum_counter] += (parseFloat(item.val)) ? parseFloat(item.val) : 0;
              } else {
                sum_rows[sum_counter] = (parseFloat(item.val)) ? parseFloat(item.val) : 0;
              }
              sum_counter++;
            }

          });
          //  creating a subtotal column
          let total_counter = 0;
          data.rows[0].items.forEach((item) => {
            if (item.hasOwnProperty('header')) {
              row_items.push({name: '', val: '', row_span: 1, header: true})
            } else {
              row_items.push({name: '', val: +sum_rows[total_counter].toFixed(2), row_span: 1, row_total: true});
              total_counter++;
            }
          });
          some_rows.push({items: row_items, headers: row.headers, sub_total: true});
          sum_rows = [];
        } else {
          some_rows.push(row);
          //  populate the sum array
          let sum_counter = 0;
          row.items.forEach((item) => {
            if (item.hasOwnProperty('header')) {
            }
            else {
              if (sum_rows[sum_counter]) {
                sum_rows[sum_counter] += (parseFloat(item.val)) ? parseFloat(item.val) : 0;
              } else {
                sum_rows[sum_counter] = (parseFloat(item.val)) ? parseFloat(item.val) : 0;
              }
              sum_counter++;
            }

          });
        }
        counter++;
      });
      return {
        headers: data.headers,
        rows: some_rows,
        columns: data.columns,
        titles: data.titles,
        title: data.title
      };
    } else {
      return data;
    }

  }

  //  This will add a total for each row
  addRowTotal(tableObject) {
    let data = _.cloneDeep(tableObject);
    let row_distance: any = data.rows[0].items[0].row_span;
    let some_rows = [];
    let counter = 1;
    let sum_rows = [];
    let row_items = [];
    data.rows.forEach((row) => {
      some_rows.push(row);
      //  adding totals to the sum array to be used in the created row
      let sum_counter = 0;
      row.items.forEach((item) => {
        if (item.hasOwnProperty('header')) {
        }
        else {
          if (sum_rows[sum_counter]) {
            sum_rows[sum_counter] += (parseFloat(item.val)) ? parseFloat(item.val) : 0;
          } else {
            sum_rows[sum_counter] = (parseFloat(item.val)) ? parseFloat(item.val) : 0;
          }
          sum_counter++;
        }
      });
      counter++;
    });
    //  creating a subtotal column
    let total_counter = 0;
    data.rows[0].items.forEach((item) => {
      if (item.hasOwnProperty('header')) {
        row_items.push({name: '', val: '', row_span: 1, header: true})
      } else {
        row_items.push({
          name: '',
          val: +sum_rows[total_counter].toFixed(2),
          row_span: 1,
          row_total: true,
          sub_total: true
        });
        total_counter++;
      }
    });
    some_rows.push({items: row_items, headers: data.rows[0].headers, sub_total: true});
    return {
      headers: data.headers,
      rows: some_rows,
      columns: data.columns,
      titles: data.titles,
      title: data.title
    };

  }

  //  this will add average in rows
  addRowAverage(tableObject) {
    let data = _.cloneDeep(tableObject);
    let row_distance: any = data.rows[0].items[0].row_span;
    let some_rows = [];
    let counter = 1;
    let sum_rows = [];
    let row_items = [];
    let avg_counter = 0;
    data.rows.forEach((row) => {
      some_rows.push(row);
      //  adding totals to the sum array to be used in the created row
      let sum_counter = 0;
      row.items.forEach((item) => {
        if (item.hasOwnProperty('header')) {
        }
        else {
          if (sum_rows[sum_counter]) {
            sum_rows[sum_counter] += (parseFloat(item.val)) ? parseFloat(item.val) : 0;
          } else {
            sum_rows[sum_counter] = (parseFloat(item.val)) ? parseFloat(item.val) : 0;
          }
          sum_counter++;
        }
      });
      counter++;
    });
    //  creating a subtotal column
    let total_counter = 0;
    data.rows.forEach((item) => {
      if (item.hasOwnProperty('header')) {
      } else {
        avg_counter++
      }
    });
    data.rows[0].items.forEach((item) => {
      if (item.hasOwnProperty('header')) {
        row_items.push({name: '', val: '', row_span: 1, header: true})
      } else {
        let avg = sum_rows[total_counter] / avg_counter;
        row_items.push({name: '', val: +avg.toFixed(2), row_span: 1, row_total: true, sub_total: true});
        total_counter++;
      }
    });
    some_rows.push({items: row_items, headers: data.rows[0].headers, sub_total: true});
    return {
      headers: data.headers,
      rows: some_rows,
      columns: data.columns,
      titles: data.titles,
      title: data.title
    };
  }

  get loaded(): boolean {
    return this._loaded;
  }

  set loaded(value: boolean) {
    this._loaded = value;
  }

  get tableObjects(): any[] {
    return this._tableObjects;
  }

  set tableObjects(value: any[]) {
    this._tableObjects = value;
  }

  get tableHasError(): boolean {
    return this._tableHasError;
  }

  set tableHasError(value: boolean) {
    this._tableHasError = value;
  }

  get errorMessage(): string {
    return this._errorMessage;
  }

  set errorMessage(value: string) {
    this._errorMessage = value;
  }

  getColor(cellValue, tableObject) {
    if (isNaN(cellValue)) {
      return '';
    }


  }
}
