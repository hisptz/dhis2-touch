export interface AnalyticsObject {
  headers: Array<AnalyticsHeader>;
  metaData: AnalyticsMetadata;
  rows: any[];
}

export interface AnalyticsHeader {
  name: string;
  column: string;
  valueType: string;
  type: string;
  hidden: boolean;
  meta: string;
}

export interface AnalyticsMetadata {
  names: any;
  dimensions: any;
}

// export function isAnalyticsHeader(header: any): header is AnalyticsHeader {
//   return false
// }
