export interface Dimension {
  dimension?: string;
  filters?: string;
  items?: DimensionItem[];
}

export interface DimensionItem {
  id: string;
  name?: string;
  dimensionItemType?: string;
  dimensionItem?: string;
}
