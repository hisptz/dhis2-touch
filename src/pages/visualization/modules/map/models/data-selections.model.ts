import { Dimension } from './dimension.model';

export interface DataSelections {
  config?: any;
  parentLevel?: number;
  completedOnly?: boolean;
  translations?: any[];
  interpretations?: any[];
  attributeValues?: any[];
  program?: {
    id: string;
    name?: string;
    displayName?: string;
  };
  programStage?: {
    id: string;
    name?: string;
    displayName?: string;
  };
  legendSet?: any;
  columns: Dimension[];
  filters: Dimension[];
  rows: Dimension[];
  endDate?: string;
  startDate?: string;
  aggregationType: string;
  organisationUnitGroupSet?: {
    id: string;
  };
}
