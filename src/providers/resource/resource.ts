import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';

/*
  Generated class for the ResourceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ResourceProvider {

  constructor() {
  }

  getDashBoardItemsIcons() {
    return {
      USERS: "assets/dashboard/roles.png",
      REPORTS: "assets/dashboard/table.png",
      RESOURCES: "assets/dashboard/roles.png",
      APP: "assets/dashboard/roles.png",
      MESSAGES: "assets/dashboard/sms.png",
      CHART: "assets/dashboard/charts.png",
      EVENT_CHART: "assets/dashboard/charts.png",
      EVENT_REPORT: "assets/dashboard/table.png",
      MAP: "assets/dashboard/map.png",
      REPORT_TABLE: "assets/dashboard/table.png",
    }
  }

  getVisualizationIcons() {
    return {
      charts: [
        {
          type: 'line',
          icon: 'assets/dashboard/line.png',
          isDisabled: false
        },
        {
          type: 'bar',
          icon: 'assets/dashboard/bar.png',
          isDisabled: false
        },
        {
          type: "column",
          icon: 'assets/dashboard/column.png',
          isDisabled: false
        },
        {
          type: "stacked_column",
          icon: 'assets/dashboard/stacked-column.png',
          isDisabled: false
        },
        {
          type: "stacked_bar",
          icon: 'assets/dashboard/stacked-bar.png',
          isDisabled: false
        },
        {
          type: "area",
          icon: 'assets/dashboard/area.png',
          isDisabled: false
        },
        {
          type: "pie",
          icon: 'assets/dashboard/pie.png',
          isDisabled: false
        },
      ],
      visualizationType: [
        {
          type: "TABLE",
          icon: "assets/dashboard/table.png",
          isDisabled: false
        },
        {
          type: "CHART",
          icon: 'assets/dashboard/charts.png',
          isDisabled: false
        },
        {
          type: "MAP",
          icon: 'assets/dashboard/map.png',
          isDisabled: false
        },
        //{type: "dictionary", icon: "assets/dashboard/dictionary.png"}
      ]
    }
  }

  getEmptyListNotificationIcon() {
    let icon = 'assets/icon/empty-list-box.png';

    return icon;
  }

}
