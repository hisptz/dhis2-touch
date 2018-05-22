import { Injectable } from '@angular/core';
import { Dashboard } from '../models/dashboard.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { HttpClientProvider } from '../../../providers/http-client/http-client';

@Injectable()
export class DashboardService {
  dashboardUrlFields: string;

  constructor(private http: HttpClientProvider) {
    this.dashboardUrlFields = '?fields=id,name,publicAccess,access,externalAccess,created,lastUpdated,' +
      'user[id,name],dashboardItems[id,type,created,lastUpdated,shape,appKey,chart[id,displayName],' +
      'map[id,displayName],reportTable[id,displayName],eventReport[id,displayName],eventChart[id,displayName]]&paging=false';
  }

  loadAll(): Observable<Dashboard[]> {
    return this.http.get(`dashboards.json${this.dashboardUrlFields}`, true).
      pipe(map((dashboardResponse: any) => dashboardResponse.dashboards || []));
  }

  load(id: string) {
  }

  create(dashboard: Partial<Dashboard>) {
  }

  update(dashboard: Partial<Dashboard>) {
  }

  delete(id: string) {
  }
}
