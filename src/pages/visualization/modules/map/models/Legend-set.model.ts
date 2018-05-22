export interface LegendSet {
  id?: string;
  legend?: any;
  name?: string;
  layer?: string;
  opacity?: string;
  hidden: boolean;
  cluster: boolean;
  isfirstChange: boolean;
  changedBaseLayer?: boolean;
}
