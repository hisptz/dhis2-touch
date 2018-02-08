import { Component, OnInit, Input } from '@angular/core';
import * as fromModels from '../../models';

@Component({
  selector: 'app-list-table',
  templateUrl: './list-table.component.html'
})
export class ListTableComponent implements OnInit {
  @Input() tableConfig: fromModels.TableConfig;
  @Input() tableList: fromModels.TableList;
  constructor() {
    this.tableConfig = fromModels.DEFAULT_TABLE_CONFIG;
  }

  ngOnInit() {}

  handleClick(e, item: fromModels.TableListItem) {
    e.stopPropagation();
    if (item.href) {
      window.location.href = item.href;
    }
  }
}
