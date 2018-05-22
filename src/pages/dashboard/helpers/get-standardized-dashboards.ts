import { Dashboard } from '../models/dashboard.model';
import * as _ from 'lodash';

export function getStandardizedDashboards(dashboards: any[]): Dashboard[] {
return _.map(dashboards || [], dashboard => {
  return {
    id: dashboard.id,
    name: dashboard.name,
    created: dashboard.created,
    lastUpdated: dashboard.lastUpdated
  }
})
}
