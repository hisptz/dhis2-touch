export interface VisualizationSelectionDimension {
  dimension: string;
  filter?: string;
  layout?: string;
  items: Array<{
    id: string;
    name: string;
    type: string;
  }>
}
