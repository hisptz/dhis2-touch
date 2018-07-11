import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ManifestService } from './manifest.service';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError, mergeMap } from 'rxjs/operators';

@Injectable()
export class HttpClientService {
  private _rootUrl: string;
  private _apiRootUrl: string;

  constructor(private httpClient: HttpClient, private manifestService: ManifestService) {}

  get(url: string, useRootUrl: boolean = false): Observable<any> {
    const rootUrlPromise = useRootUrl ? this._getRootUrl() : this._getApiRootUrl();

    return rootUrlPromise.pipe(
      mergeMap(rootUrl => this.httpClient.get(rootUrl + url).pipe(catchError(this._handleError)))
    );
  }

  post(url: string, data: any, useRootUrl: boolean = false) {
    const rootUrlPromise = useRootUrl ? this._getRootUrl() : this._getApiRootUrl();

    return rootUrlPromise.pipe(
      mergeMap(rootUrl =>
        this.httpClient.post(rootUrl + url, data).pipe(catchError(this._handleError))
      )
    );
  }

  put(url: string, data: any, useRootUrl: boolean = false) {
    const rootUrlPromise = useRootUrl ? this._getRootUrl() : this._getApiRootUrl();

    return rootUrlPromise.pipe(
      mergeMap(rootUrl =>
        this.httpClient.put(rootUrl + url, data).pipe(catchError(this._handleError))
      )
    );
  }

  delete(url: string, useRootUrl: boolean = false) {
    const rootUrlPromise = useRootUrl ? this._getRootUrl() : this._getApiRootUrl();

    return rootUrlPromise.pipe(
      mergeMap(rootUrl => this.httpClient.delete(rootUrl + url).pipe(catchError(this._handleError)))
    );
  }

  // Private methods

  private _handleError(err: HttpErrorResponse) {
    let error = null;
    if (err.error instanceof Error) {
      // A client-side or network error occurred. Handle it accordingly.
      error = {
        message: err.error,
        status: err.status,
        statusText: err.statusText
      };
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      error = {
        message: err.error instanceof Object ? err.error.message : err.error,
        status: err.status,
        statusText: err.statusText
      };
    }
    return new ErrorObservable(error);
  }

  /**
   * Get root url
   * @returns {Observable<string>}
   * @private
   */
  private _getRootUrl(): Observable<string> {
    return new Observable(observer => {
      if (this._apiRootUrl) {
        observer.next(this._apiRootUrl);
        observer.complete();
      } else {
        this.manifestService.getRootUrl().subscribe((rootUrl: string) => {
          this._rootUrl = rootUrl;
          observer.next(rootUrl);
          observer.complete();
        });
      }
    });
  }

  private _getApiRootUrl() {
    return new Observable(observer => {
      if (this._apiRootUrl) {
        observer.next(this._apiRootUrl);
        observer.complete();
      } else {
        this._getRootUrl().subscribe((rootUrl: string) => {
          this._apiRootUrl = rootUrl + 'api/';
          observer.next(this._apiRootUrl);
          observer.complete();
        });
      }
    });
  }
}
