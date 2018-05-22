import { Action } from '@ngrx/store';

export const TOGGLE_OPEN_VISUALIZATION_LEGEND = '[Map UI] Toggle visualization open';
export const TOGGLE_PIN_VISUALIZATION_LEGEND = '[Map UI] Toggle pin visualization Legend';
export const TOGGLE_VISUALIZATION_FILTER_SECTION = '[Map UI] Toggle filter section';
export const CLOSE_PIN_VISUALIZATION_LEGEND = '[Map UI] Close pinned legend';
export const CLOSE_VISUALIZATION_FILTER_SECTION = '[Map UI] Close filter section legend';
export const INITIALIZE_VISUALIZATION_LEGEND = '[Map UI] Initialize the visualization legend';
export const TOGGLE_DATA_TABLE = '[Map UI] Toggle Datatable visability';
export const FULLSCREEN_OPEN_VISUALIZATION_LEGEND = '[Map UI] Open visualization open fullScreen';

export class ToggleOpenVisualizationLegend implements Action {
  readonly type = TOGGLE_OPEN_VISUALIZATION_LEGEND;
  constructor(public payload: string) {}
}

export class FullScreenOpenVisualizationLegend implements Action {
  readonly type = FULLSCREEN_OPEN_VISUALIZATION_LEGEND;
  constructor(public payload: string) {}
}

export class TogglePinVisualizationLegend implements Action {
  readonly type = TOGGLE_PIN_VISUALIZATION_LEGEND;
  constructor(public payload: string) {}
}

export class ToggleVisualizationLegendFilterSection implements Action {
  readonly type = TOGGLE_VISUALIZATION_FILTER_SECTION;
  constructor(public payload: string) {}
}

export class CloseVisualizationLegend implements Action {
  readonly type = CLOSE_PIN_VISUALIZATION_LEGEND;
  constructor(public payload: string) {}
}

export class CloseVisualizationLegendFilterSection implements Action {
  readonly type = CLOSE_VISUALIZATION_FILTER_SECTION;
  constructor(public payload: string) {}
}

export class InitiealizeVisualizationLegend implements Action {
  readonly type = INITIALIZE_VISUALIZATION_LEGEND;
  constructor(public payload: string) {}
}

export class ToggleDataTable implements Action {
  readonly type = TOGGLE_DATA_TABLE;
  // TODO: add Legend Set data casting;
  constructor(public payload: any) {}
}

// action types
export type VisualizationLegendAction =
  | ToggleOpenVisualizationLegend
  | TogglePinVisualizationLegend
  | CloseVisualizationLegend
  | ToggleVisualizationLegendFilterSection
  | CloseVisualizationLegendFilterSection
  | InitiealizeVisualizationLegend
  | ToggleDataTable
  | FullScreenOpenVisualizationLegend;
