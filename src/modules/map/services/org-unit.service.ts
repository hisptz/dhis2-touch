import { Injectable } from "@angular/core";
import { catchError } from "rxjs/operators";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/throw";
import { HttpClientProvider } from "../../../providers/http-client/http-client";

@Injectable()
export class OrgUnitService {
  constructor(private httpClient: HttpClientProvider) {}

  getOrganisationUnitGroupSets(uid: string): Observable<any> {
    return this.httpClient
      .get(
        `organisationUnitGroupSets/${uid}.json?fields=organisationUnitGroups%5Bid,displayShortName~rename(name),symbol%5D&_dc=1516105315642`,
        true
      )
      .pipe(catchError((error: any) => Observable.throw(error.json())));
  }
}
