export interface ChartConfiguration {
  renderId: string;
  type: string;
  title: string;
  subtitle: string;
  xAxisType: any[];
  yAxisType: string;
  showData: boolean;
  hideTitle: boolean;
  hideSubtitle: boolean;
  hideEmptyRows: boolean;
  hideLegend: boolean;
  showLabels: boolean;
  multiAxisTypes: any[];
  cumulativeValues: boolean;
  sortOrder: number;
  percentStackedValues: boolean;
  targetLineLabel: string;
  targetLineValue: number;
  baseLineValue: number;
  baseLineLabel: string;
  legendAlign: string;
  reverseLegend: boolean;
  rangeAxisMaxValue: number,
  rangeAxisMinValue: number,
  axes: any[];
}
