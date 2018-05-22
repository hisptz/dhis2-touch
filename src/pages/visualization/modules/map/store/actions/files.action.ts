/**
 * Created by mpande on 2/21/18.
 */
import {Action} from '@ngrx/store';

export const DOWNLOAD_CSV = '[Map Downloads] Download CSV';
export const DOWNLOAD_GML = '[Map Downloads] Download GML';
export const DOWNLOAD_SHAPEFILE = '[Map Downloads] Download SHAPE FILE';
export const DOWNLOAD_KML = '[Map Downloads] Download KML';
export const DOWNLOAD_JSON = '[Map Downloads] Download JSON';

export const FILE_DOWNLOAD_FAIL = '[Map Downloads] File download fail';
export const FILE_DOWNLOAD_SUCCESS = '[Map Downloads] File download success';


export class DownloadCSV implements Action {
  readonly type = DOWNLOAD_CSV;
  constructor(public payload: any) {
  }
}

export class DownloadGML implements Action {
  readonly type = DOWNLOAD_GML;
  constructor(public payload: any) {
  }
}

export class DownloadShapeFile implements Action {
  readonly type = DOWNLOAD_SHAPEFILE;
  constructor(public payload: any) {
  }
}

export class DownloadKML implements Action {
  readonly type = DOWNLOAD_KML;
  constructor(public payload: any) {
  }
}

export class DownloadJSON implements Action {
  readonly type = DOWNLOAD_JSON;
  constructor(public payload: any) {
  }
}

export class FileDownloadFail implements Action {
  readonly type = FILE_DOWNLOAD_FAIL;
  constructor(public payload: any) {
  }
}

export class FileDownloadSuccess implements Action {
  readonly type = FILE_DOWNLOAD_SUCCESS;
  constructor(public payload: any) {
  }
}
