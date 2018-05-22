export interface VisualizationConfig {
  id: string;
  name: string;
  // Original visualization type
  type: string;
  // current selected visualization type
  currentType: string;
  basemap?: string;
  zoom?: number;
  latitude?: string;
  longitude?: string;
}
