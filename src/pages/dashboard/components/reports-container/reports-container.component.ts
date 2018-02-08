import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-reports-container',
  templateUrl: './reports-container.component.html'
})
export class ReportsContainerComponent implements OnInit {
  @Input() visualizationLayers: any[];
  reportList: any[];
  constructor() {}

  ngOnInit() {
    if (this.visualizationLayers) {
      this.reportList = _.flatten(
        _.map(
          this.visualizationLayers,
          (layer: any) =>
            layer.settings
              ? _.map(layer.settings.reports, (report: any) => {
                  return {
                    id: report.id,
                    displayObject: {
                      value: report.displayName,
                      href:
                        'dhis-web-reporting/getReportParams.action?mode=report&uid=' +
                        report.id
                    }
                  };
                })
              : []
        )
      );
    }
  }
}
