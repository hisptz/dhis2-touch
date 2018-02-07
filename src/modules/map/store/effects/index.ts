import { LayersEffects } from './layers.effect';
import { VisualizationObjectEffects } from './visualizationObject.effect';
import { AnalyticsEffects } from './analytics.effect';
import { OrganizationUnitGroupSetEffects } from './orgUnitGroupSet.effect';
import { SystemInfoEffects } from './systemInfo.effect';
import { LegendSetEffects } from './legendSet.effect';

export const effects: any[] = [
  VisualizationObjectEffects,
  AnalyticsEffects,
  OrganizationUnitGroupSetEffects,
  SystemInfoEffects,
  LegendSetEffects
];

export * from './layers.effect';
export * from './visualizationObject.effect';
export * from './analytics.effect';
export * from './orgUnitGroupSet.effect';
export * from './systemInfo.effect';
export * from './legendSet.effect';
