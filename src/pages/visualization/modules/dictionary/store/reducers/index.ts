import { Dictionary } from '../../models/dictionary';
import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import * as fromDictionary from './dictionary.reducer';

export interface State {
  dictionary: Dictionary[];
}

export const reducers: ActionReducerMap<State> = {
  dictionary: fromDictionary.dictionaryReducer
};

export const getDictionaryState = createFeatureSelector<State>('dictionary');
