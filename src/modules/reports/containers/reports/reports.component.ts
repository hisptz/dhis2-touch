import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html'
})
export class ReportsComponent implements OnInit {
  @Input() reportList: any[];
  tableList: any[];
  constructor() {
    this.tableList = [];
  }

  ngOnInit() {
    if (this.reportList) {
      this.tableList = [
        {
          id: 'reports_title',
          items: [
            {
              value: 'Reports',
              style: {
                'font-weight': 'bold',
                'text-align': 'center',
                'background-color': 'rgba(238, 238, 238, 0.29)'
              },
              colSpan: 2
            }
          ]
        },
        {
          id: 'reports_headers',
          items: [
            {
              value: '#',
              style: {
                'font-weight': 'bold',
                width: '5%',
                'background-color': 'rgba(238, 238, 238, 0.29)'
              }
            },
            { value: 'Name', style: { 'font-weight': 'bold' } }
          ]
        },
        ..._.map(
          this.reportList,
          (reportListItem: any, reportListItemIndex: number) => {
            const itemKeys: any[] = _.filter(
              _.keys(reportListItem),
              (key: string) => key !== 'id'
            );

            return {
              id: reportListItem.id,
              items: [
                {
                  value: reportListItemIndex + 1,
                  style: {
                    width: '5%',
                    'background-color': 'rgba(238, 238, 238, 0.29)'
                  }
                },
                ..._.map(itemKeys, (key: string) => {
                  return _.isPlainObject(reportListItem[key])
                    ? { ...reportListItem[key] }
                    : { value: reportListItem[key] };
                })
              ]
            };
          }
        )
      ];
    }
  }
}
