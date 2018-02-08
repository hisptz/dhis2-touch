import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { catchError } from "rxjs/operators";
import "rxjs/add/observable/throw";
import { HttpClientProvider } from "../../../providers/http-client/http-client";

@Injectable()
export class LegendSetService {
  constructor(private httpClient: HttpClientProvider) {}

  getMapLegendSet(legendId: string) {
    const fields = [
      "id",
      "displayName~rename(name)",
      "legends[*,!created",
      "!lastUpdated",
      "!displayName",
      "!externalAccess",
      "!access",
      "!userGroupAccesses"
    ];
    const url = `/legendSets/${legendId}.json?fields=${fields.join(",")}`;

    return this.httpClient
      .get(url, true)
      .pipe(catchError((error: any) => Observable.throw(error.json())));
  }
}
