import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClientProvider} from "../http-client/http-client";

/*
  Generated class for the DashboardNotificationServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class DashboardNotificationServiceProvider {

  constructor(public http: HttpClientProvider) {}

  load(rootUrl,currentUser): Observable<any> {
    return Observable.create(observer => {
      this.http.get(rootUrl + 'me/dashboard.json',currentUser)
        .then((notification : any) => {
          notification = JSON.parse(notification.data);
          observer.next(notification);
          observer.complete();
        }, () => {
          observer.next({
            unreadMessageConversation: 0,
            unreadInterpretations: 0
          });
          observer.complete();
        })
    })
  }

}
