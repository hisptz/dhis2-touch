import { Action } from '@ngrx/store';
import { LegendProperties } from '../../models/legend-properties.model';

export const ADD_LEGEND_PROPERTIES = '[Map] Add legend properties';
export const UPDATE_LEGEND_PROPERTIES = '[Map] Update legend properties';
export const LOAD_LEGEND_PROPERTIES = '[Map] Load legend properties';
export const LOAD_LEGEND_PROPERTIES_FAIL = '[Map] Load legend properties Fail';
export const LOAD_LEGEND_PROPERTIES_SUCCESS =
  '[Map] Load legend properties Success';

export class LoadLegendProperties implements Action {
  readonly type = LOAD_LEGEND_PROPERTIES;
}

export class LoadLegendPropertiesFail implements Action {
  readonly type = LOAD_LEGEND_PROPERTIES_FAIL;
  constructor(public payload: any) {}
}

export class LoadLegendPropertiesSuccess implements Action {
  readonly type = LOAD_LEGEND_PROPERTIES_SUCCESS;
  constructor(public payload: any) {}
}

export class AddLegendProperties implements Action {
  readonly type = ADD_LEGEND_PROPERTIES;
  constructor(public payload: LegendProperties) {}
}

export class UpdateLegendProperties implements Action {
  readonly type = UPDATE_LEGEND_PROPERTIES;
  constructor(public payload: LegendProperties) {}
}

// action type
export type LegendPropertiesActions =
  | AddLegendProperties
  | UpdateLegendProperties
  | LoadLegendProperties
  | LoadLegendPropertiesSuccess
  | LoadLegendPropertiesFail;
