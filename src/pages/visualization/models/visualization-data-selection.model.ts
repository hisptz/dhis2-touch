export interface VisualizationDataSelection {
  dimension: string;
  name: string;
  layout?: string;
  filter?: string;
  optionSet?: any;
  legendSet?: string;
  items: Array<{
    id: string;
    name: string;
    type: string;
  }>
}
