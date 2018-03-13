import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { INITIAL_LAYOUT_MODEL } from './model/layout-model';
import { AppTranslationProvider } from '../../providers/app-translation/app-translation';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html'
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
  translationMapper: any;

  constructor(private appTranslation: AppTranslationProvider) {
    this.icons = {
      dx: 'assets/icon/data.png',
      ou: 'assets/icon/tree.png',
      pe: 'assets/icon/period.png'
    };

    this.dimensions = {
      filterDimension: [],
      columnDimension: [],
      rowDimension: []
    };
    this.columnName = 'Column';
    this.rowName = 'Row';
  }

  ngOnInit() {
    this.translationMapper = {};
    this.appTranslation.getTransalations(this.getValuesToTranslate()).subscribe(
      (data: any) => {
        this.translationMapper = data;
      },
      error => {}
    );
    this.updateLayoutDimensions();
    if (this.visualizationType === 'CHART') {
      this.rowName = 'Categories';
      this.columnName = 'Series';
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

  getValuesToTranslate() {
    return [
      'Table / Chart Layout',
      'Filters',
      'Column',
      'Row',
      'Categories',
      'Series',
      'Update',
      'Close'
    ];
  }
}
