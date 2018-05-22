import * as dictionary from '../actions/dictionary.actions';
import * as _ from 'lodash';
import { Dictionary } from '../../models/dictionary';

export function dictionaryReducer(
  state: Dictionary[] = [],
  action: dictionary.DictionaryAction
) {
  switch (action.type) {
    case dictionary.DictionaryActions.ADD:
      return [
        ...state,
        ..._.map(action.payload, id => {
            return {
              id,
              name: undefined,
              description: undefined,
              progress: {
                loading: true,
                loadingSucceeded: false,
                loadingFailed: false
              }
            };
          })
          .filter(
            dictionaryObject => !_.find(state, ['id', dictionaryObject.id])
          )
      ];

    case dictionary.DictionaryActions.UPDATE:
      const correspondingDictionary: Dictionary = _.find(state, [
        'id',
        action.payload.id
      ]);
      const dictionaryIndex = _.findIndex(state, correspondingDictionary);

      return dictionaryIndex !== -1
        ? [
            ...state.slice(0, dictionaryIndex),
            {
              ...correspondingDictionary,
              ...action.payload,
              progress: { ...action.payload.progress }
            },
            ...state.slice(dictionaryIndex + 1)
          ]
        : [...state];
    default:
      return state;
  }
}
