import { OrgUnitService } from "./org-unit.service";
import { GeoFeatureService } from "./geo-feature.service";
import { RelativePeriodService } from "./relative-period.service";
import { LayerService } from "./layer.service";
import { AnalyticsService } from "./analytics.service";
import { SystemService } from "./system.service";
import { LegendSetService } from "./legend-set.service";
import { HttpClientService } from "./http-client.service";
import { ManifestService } from "./manifest.service";

export const services: any[] = [
  OrgUnitService,
  GeoFeatureService,
  RelativePeriodService,
  LayerService,
  AnalyticsService,
  LegendSetService,
  ManifestService,
  SystemService,
  HttpClientService
];

export * from "./org-unit.service";
export * from "./geo-feature.service";
export * from "./relative-period.service";
export * from "./layer.service";
export * from "./analytics.service";
export * from "./system.service";
export * from "./legend-set.service";
export * from "./http-client.service";
export * from "./manifest.service";
