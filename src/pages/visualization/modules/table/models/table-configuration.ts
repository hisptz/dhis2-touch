export interface TableConfiguration {
  title: string;
  subtitle: string;
  showColumnTotal: boolean;
  showColumnSubtotal: boolean;
  showRowTotal: boolean;
  showRowSubtotal: boolean;
  showDimensionLabels: boolean;
  hideEmptyRows: boolean;
  showHierarchy: boolean;
  rows: any[];
  columns: any[];
  displayList: boolean;
  legendSet: any;
  styles: any;
}
