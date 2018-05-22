import { Injectable } from '@angular/core';
import { VisualizationDataSelection } from '../models/visualization-data-selection.model';
import { getAnalyticsUrl } from '../helpers';
import { of } from 'rxjs/observable/of';
import { HttpClientProvider } from '../../../providers/http-client/http-client';

@Injectable()
export class AnalyticsService {
  constructor(private http: HttpClientProvider) {
  }

  getAnalytics(dataSelections: VisualizationDataSelection[], layerType: string, config?: any) {
    const analyticsUrl = (layerType === 'thematic' || layerType === 'event') ?
                         getAnalyticsUrl(dataSelections, layerType, config) :
                         '';
    return analyticsUrl !== '' ? this.http.get(`/api/${analyticsUrl}`, true) : of(null);

  }
}
