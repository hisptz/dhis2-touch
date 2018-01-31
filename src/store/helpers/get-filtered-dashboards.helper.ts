import * as _ from 'lodash';
import {Dashboard} from '../../models/dashboard';
export function getFilteredDashboards(dashboards: Dashboard[], showBookmarked: boolean, searchTerm: string = '') {
  const bookmarkedDashboards = showBookmarked ?
    _.filter(dashboards, (bookmarkedDashboard: Dashboard) => bookmarkedDashboard.details.bookmarked) : dashboards;
  return filterDashboardByName(bookmarkedDashboards, searchTerm);
}

function filterDashboardByName(dashboards: Dashboard[], searchTerm: string) {
  const splitedSearchTerm = searchTerm ? searchTerm.split(/[\.\-_]/) : [];
  return splitedSearchTerm.length > 0
    ? dashboards.filter((item: any) =>
      splitedSearchTerm.some(
        (nameString: string) =>
          item.name.toLowerCase().indexOf(nameString.toLowerCase()) !== -1
      )
    )
    : dashboards;
}
