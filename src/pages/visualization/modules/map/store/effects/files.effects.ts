/**
 * Created by mpande on 2/21/18.
 */
import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import * as filesAction from '../actions/files.action';
import * as fromServices from '../../services';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class FilesEffects {
  constructor(
    private actions$: Actions,
    private fileService: fromServices.MapFilesService,
  ) {}

  @Effect()
  downloadCSV$ = this.actions$
    .ofType(filesAction.DOWNLOAD_CSV)
    .map((action: filesAction.DownloadCSV) =>
      this.fileService.downloadMapVisualizationAsCSV(action)
    )
    .switchMap(payload => {
      return Observable.of(new filesAction.FileDownloadSuccess(payload));
    });

  @Effect()
  downloadGML$ = this.actions$
    .ofType(filesAction.DOWNLOAD_GML)
    .map((action: filesAction.DownloadGML) =>
      this.fileService.downloadMapVisualizationAsGML(action)
    )
    .switchMap(payload => {
      return Observable.of(new filesAction.FileDownloadSuccess(payload));
    });

  @Effect()
  downloadKML$ = this.actions$
    .ofType(filesAction.DOWNLOAD_KML)
    .map((action: filesAction.DownloadKML) =>
      this.fileService.downloadMapVisualizationAsKML(action)
    )
    .switchMap(payload => {
      return Observable.of(new filesAction.FileDownloadSuccess(payload));
    });

  @Effect()
  downloadSHAPEFILE$ = this.actions$
    .ofType(filesAction.DOWNLOAD_SHAPEFILE)
    .map((action: filesAction.DownloadShapeFile) =>
      this.fileService.downloadMapVisualizationAsSHAPEFILE(action)
    )
    .switchMap(payload => {
      return Observable.of(new filesAction.FileDownloadSuccess(payload));
    });

  @Effect()
  downloadJSON$ = this.actions$
    .ofType(filesAction.DOWNLOAD_JSON)
    .map((action: filesAction.DownloadJSON) =>
      this.fileService.downloadMapVisualizationAsGeoJSON(action)
    )
    .switchMap(payload => {
      return Observable.of(new filesAction.FileDownloadSuccess(payload));
    });
}
