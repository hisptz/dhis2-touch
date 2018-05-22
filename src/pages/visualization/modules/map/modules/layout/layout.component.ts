import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {INITIAL_LAYOUT_MODEL} from './model/layout-model';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  @Input() layoutModel = INITIAL_LAYOUT_MODEL;
  @Input() visualizationType: string;
  @Output() onLayoutUpdate = new EventEmitter();
  @Output() onLayoutClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  filters: any;
  columns: any;
  rows: any;
  icons: any;
  dimensions: any;
  columnName: string;
  rowName: string;

  constructor() {
    this.icons = {
      dx: 'assets/icons/data.png',
      ou: 'assets/icons/tree.png',
      pe: 'assets/icons/period.png'
    };

    this.dimensions = {
      filterDimension: [],
      columnDimension: [],
      rowDimension: []
    };
    this.columnName = 'Column dimensions';
    this.rowName = 'Row dimensions';
  }

  ngOnInit() {
    this.updateLayoutDimensions();
    if (this.visualizationType === 'CHART') {
      this.rowName = 'Categories dimensions';
      this.columnName = 'Series dimensions';
    }
  }

  updateLayoutDimensions() {
    this.filters = [...this.layoutModel.filters];
    this.columns = [...this.layoutModel.columns];
    this.rows = [...this.layoutModel.rows];
  }

  updateLayout() {
    this.onLayoutUpdate.emit({
      filters: this.filters,
      columns: this.columns,
      rows: this.rows
    });
  }

  close() {
    this.onLayoutClose.emit(true);
  }
}
