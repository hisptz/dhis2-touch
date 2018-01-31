import {mergeRelatedItems} from './map-state-to-dashboard-object.helper';
import * as _ from 'lodash';
import {Dashboard} from '../../models/dashboard';

export function getCheckedAddedItem(currentDashboard, dashboardItems): Dashboard {
  let newDashboardItem: any = dashboardItems.length > 1 ?
    mergeRelatedItems(dashboardItems)[0] : dashboardItems[0];

  let isNew = false;

  if (newDashboardItem) {
    if (currentDashboard) {
      const availableDashboardItem = _.find(currentDashboard.dashboardItems, ['id', newDashboardItem.id]);

      /**
       * Update for list like items .ie. users , reports ,etc
       */
      if (availableDashboardItem) {

        if (availableDashboardItem.type[availableDashboardItem.type.length - 1] === 'S') {

          /**
           * Update the item in its corresponding dashboard
           * @type {[any , {} , any]}
           */

          newDashboardItem =  {
            ...mergeRelatedItems([newDashboardItem, availableDashboardItem])[0]
          };
        }
      } else {

        if (newDashboardItem.type === 'APP') {
          if (!_.find(currentDashboard.dashboardItems, ['appKey', newDashboardItem.appKey])) {
            isNew = true;
          }
        } else {
          isNew = true;
        }
      }
    }
  }

  return {
    ...newDashboardItem,
    isNew: isNew
  };
}
