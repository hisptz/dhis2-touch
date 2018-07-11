import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

interface Manifest {
  name: string;
  version: string;
  description: string;
  launch_path: string;
  icons: {
    16: string;
    48: string;
    128: string;
  };
  developer: {
    name: string;
    url: string;
  };
  default_locale: string;
  activities: {
    dhis: {
      href: string;
    };
  };
}

@Injectable()
export class ManifestService {
  private _manifestObject: Manifest;

  constructor(private httpClient: HttpClient) {
    this._manifestObject = null;
  }

  /**
   * Get root Url of the system
   * @returns {Observable<string>}
   */
  getRootUrl(): Observable<string> {
    return new Observable(observer => {
      this._getAppManifest().subscribe((manifestObject: Manifest) => {
        if (manifestObject) {
          const rootUrl = manifestObject.activities
            ? manifestObject.activities.dhis
              ? manifestObject.activities.dhis.href || '../../../'
              : '../../../'
            : '../../../';
          observer.next(rootUrl);
          observer.complete();
        } else {
          observer.next('../../../');
          observer.complete();
        }
      });
    });
  }

  /**
   * Get manifest file content
   * @returns {Observable<Manifest>}
   * @private
   */
  private _getAppManifest(): Observable<Manifest> {
    return new Observable(observer => {
      if (this._manifestObject) {
        observer.next(this._manifestObject);
        observer.complete();
      } else {
        this.httpClient.get<Manifest>('manifest.webapp').subscribe(
          manifestObject => {
            this._manifestObject = { ...manifestObject };
            observer.next(manifestObject);
            observer.complete();
          },
          error => {
            console.log(error);
            observer.next(null);
            observer.complete();
          }
        );
      }
    });
  }
}
