import { DisplaySettings } from './display-settings.model';
import { LayerOptions } from './layer-options.model';
import { DataSelections } from './data-selections.model';
import { LegendProperties } from './legend-properties.model';

export interface Layer {
  id: string;
  type: string;
  hidden: boolean;
  opacity: number;
  name: string;
  overlay: boolean;
  visible: boolean;
  displayName: string;
  analyticsData?: any;
  orgUnitGroupSet?: any;
  legendSet?: any;
  pane?: string;
  areaRadius?: string;
  displaySettings: DisplaySettings;
  legendProperties: LegendProperties;
  layerOptions: LayerOptions;
  dataSelections: DataSelections;
}
