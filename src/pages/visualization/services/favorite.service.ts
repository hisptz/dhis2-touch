import { Injectable } from '@angular/core';
import { getFavoriteUrl } from '../helpers';
import { of } from 'rxjs/observable/of';
import { HttpClientProvider } from '../../../providers/http-client/http-client';

@Injectable()
export class FavoriteService {
  constructor(private http: HttpClientProvider) {
  }

  getFavorite(favorite: {id: string, type: string}) {
    const favoriteUrl = getFavoriteUrl(favorite);
    return favoriteUrl !== '' ? this.http.get(`/api/${favoriteUrl}`, true) : of(null);
  }
}
