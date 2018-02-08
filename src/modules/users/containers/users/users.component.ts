import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {
  @Input() userList: any[];
  tableList: any[];
  constructor() {
    this.tableList = [];
  }

  ngOnInit() {
    if (this.userList) {
      this.tableList = [
        {
          id: 'user_title',
          items: [
            {
              value: 'Users',
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
          id: 'user_headers',
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
          this.userList,
          (userListItem: any, userListItemIndex: number) => {
            const itemKeys: any[] = _.filter(
              _.keys(userListItem),
              (key: string) => key !== 'id'
            );

            return {
              id: userListItem.id,
              items: [
                {
                  value: userListItemIndex + 1,
                  style: {
                    width: '5%',
                    'background-color': 'rgba(238, 238, 238, 0.29)'
                  }
                },
                ..._.map(itemKeys, (key: string) => {
                  return {
                    value: userListItem[key]
                  };
                })
              ]
            };
          }
        )
      ];
    }
  }
}
