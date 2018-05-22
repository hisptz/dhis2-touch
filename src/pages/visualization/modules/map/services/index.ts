import { OrgUnitService } from "./org-unit.service";
import { GeoFeatureService } from "./geo-feature.service";
import { RelativePeriodService } from "./relative-period.service";
import { LayerService } from "./layer.service";
import { AnalyticsService } from "./analytics.service";
import { SystemService } from "./system.service";
import { LegendSetService } from "./legend-set.service";
import { HttpClientService } from "./http-client.service";
import { ManifestService } from "./manifest.service";
import { MapFilesService } from "./map-files.service";
import {ShapeFileService} from "./shapefile-services/shape-file.service";
import {Extent} from "./shapefile-services/extent";
import {Point} from "./shapefile-services/points";
import {Poly} from "./shapefile-services/poly";
import {Zip} from "./shapefile-services/zip";
import {GeoJson} from "./shapefile-services/geojson";
import {Writer} from "./shapefile-services/write";
import {MultiPoly} from "./shapefile-services/multipoly";

export const services: any[] = [
  OrgUnitService,
  GeoFeatureService,
  RelativePeriodService,
  LayerService,
  AnalyticsService,
  LegendSetService,
  ManifestService,
  SystemService,
  HttpClientService,
  MapFilesService,
  Extent,
  Zip,
  Point,
  GeoJson,
  Poly,
  MultiPoly,
  Writer,
  ShapeFileService
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
export * from "./map-files.service";
export * from "./shapefile-services/shape-file.service";
export * from "./shapefile-services/extent";
export * from "./shapefile-services/points";
export * from "./shapefile-services/poly";
export * from "./shapefile-services/zip";
export * from "./shapefile-services/geojson";
export * from "./shapefile-services/write";
export * from "./shapefile-services/multipoly";
