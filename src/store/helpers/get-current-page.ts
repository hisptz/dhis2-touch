import * as _ from 'lodash';
import {Dashboard} from '../../models/dashboard';
export function getCurrentPage(dashboards: Dashboard[], dashboardId: string, itemsPerPage: number) {
  const currentDashboard: Dashboard = _.find(dashboards, ['id', dashboardId]);
  const dashboardIndex: number = _.findIndex(dashboards, currentDashboard) + 1;
  const dashboardCount: number = dashboards.length;
  const pageNumber: number = computePageNumber(dashboardCount, itemsPerPage);

  /**
   * Calculate range
   * @type {Array}
   */
  const ranges = [];
  let pageCount = 1;
  let j: number = itemsPerPage;
  for (let i = 1; i <= itemsPerPage * pageNumber; i += itemsPerPage) {
    ranges.push({min: i, max: j, page: pageCount});
    j += itemsPerPage;
    pageCount++;
  }

  /**
   * find current page based on current dashboard
   */
  let currentPage: number;
  for (const range of ranges) {
    if (dashboardIndex >= range.min && dashboardIndex <= range.max) {
      currentPage = range.page;
      break;
    }
  }

  return currentPage;
}

function computePageNumber(dashboardCount: number, itemsPerPage: number): number {
  return Math.ceil(dashboardCount / itemsPerPage);
}
