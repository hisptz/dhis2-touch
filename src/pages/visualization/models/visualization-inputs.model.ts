import { VisualizationLayer } from './visualization-layer.model';

export interface VisualizationInputs {
  id: string,
  type: string,
  visualizationLayers: VisualizationLayer[]
}
