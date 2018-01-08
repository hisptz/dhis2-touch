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
      USERS: "assets/icon/roles.png",
      REPORTS: "assets/icon/table.png",
      RESOURCES: "assets/icon/roles.png",
      APP: "assets/icon/roles.png",
      MESSAGES: "assets/icon/sms.png",
      CHART: "assets/icon/charts.png",
      EVENT_CHART: "assets/icon/charts.png",
      EVENT_REPORT: "assets/icon/table.png",
      MAP: "assets/icon/map.png",
      REPORT_TABLE: "assets/icon/table.png",
    }
  }

  getVisualizationIcons() {
    return {
      charts: [
        {
          type: 'line',
          icon: 'assets/icon/line.png',
          isDisabled: false
        },
        {
          type: 'bar',
          icon: 'assets/icon/bar.png',
          isDisabled: false
        },
        {
          type: "column",
          icon: 'assets/icon/column.png',
          isDisabled: false
        },
        {
          type: "stacked_column",
          icon: 'assets/icon/stacked-column.png',
          isDisabled: false
        },
        {
          type: "stacked_bar",
          icon: 'assets/icon/stacked-bar.png',
          isDisabled: false
        },
        {
          type: "area",
          icon: 'assets/icon/area.png',
          isDisabled: false
        },
        {
          type: "pie",
          icon: 'assets/icon/pie.png',
          isDisabled: false
        },
      ],
      visualizationType: [
        {
          type: "TABLE",
          icon: "assets/icon/table.png",
          isDisabled: false
        },
        {
          type: "CHART",
          icon: 'assets/icon/charts.png',
          isDisabled: false
        },
        {
          type: "MAP",
          icon: 'assets/icon/map.png',
          isDisabled: false
        },
        //{type: "dictionary", icon: "assets/icon/dictionary.png"}
      ]
    }
  }

  getEmptyListNotificationIcon() {
    let icon = 'assets/icon/empty-list-box.png';
    return icon;
  }

}
