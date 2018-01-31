import {Component, Input, OnInit} from '@angular/core';
import {TableConfigurationService} from '../../services/table-configuration.service';
import {TableConfiguration} from '../../models/table-configuration';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html'
})
export class TableListComponent implements OnInit {

  @Input() visualizationLayers: any[];
  @Input() visualizationType: string;
  tableLayers: Array<{tableConfiguration: TableConfiguration; analyticsObject: any}> = [];
  constructor(private tableConfig: TableConfigurationService) { }

  ngOnInit() {
    if (this.visualizationLayers.length > 0) {
      this.tableLayers = this.visualizationLayers.map((layer: any) => {
        return {
          tableConfiguration: this.tableConfig.getTableConfiguration(
            layer.settings,
            layer.layout,
            this.visualizationType
          ),
          analyticsObject: layer.analytics
        };
      });
    }
  }

}
