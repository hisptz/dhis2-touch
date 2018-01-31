export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  group?: string;
  details: any;
  dashboardItems: any[];
}
