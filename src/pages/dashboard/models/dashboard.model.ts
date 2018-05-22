export interface Dashboard {
  id: string;
  name: string;
  created: string;
  lastUpdated: string;
  description?: string;
  visualizationObjects: Array<string>;
}
