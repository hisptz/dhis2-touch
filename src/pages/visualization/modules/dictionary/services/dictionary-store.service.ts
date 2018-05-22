import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { createSelector, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as fromDictionary from '../store/reducers';
import * as DictionaryActions from '../store/actions/dictionary.actions';
import { Dictionary } from '../models/dictionary';

@Injectable()
export class DictionaryStoreService {
  constructor(private store: Store<fromDictionary.State>) {}

  getInfo(metadataIdentifiers: Array<string>): Observable<Dictionary[]> {
    return this.store.select(
      createSelector(
        fromDictionary.getDictionaryState,
        (dictionaryState: fromDictionary.State) =>
          metadataIdentifiers
            .map(metadataIdentifier =>
              _.find(dictionaryState.dictionary, ['id', metadataIdentifier])
            )
            .filter(dictionaryObject => dictionaryObject)
      )
    );
  }

  initializeInfo(metadataIdentifiers: Array<string>) {
    this.store.dispatch(
      new DictionaryActions.InitializeAction(metadataIdentifiers)
    );
  }
}
