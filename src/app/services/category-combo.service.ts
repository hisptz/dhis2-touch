/*
 *
 * Copyright 2019 HISP Tanzania
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301, USA.
 *
 * @since 2019
 * @author Joseph Chingalo <profschingalo@gmail.com>
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { getRepository, Repository } from 'typeorm';
import { HttpClientService } from './http-client.service';
import { CurrentUser } from 'src/models';
import { CategoryComboEntity } from 'src/entites';

@Injectable({
  providedIn: 'root'
})
export class CategoryComboService {
  constructor(private httpCLientService: HttpClientService) {}

  discoveringCategoryCombosFromServer(
    currentUser: CurrentUser
  ): Observable<any> {
    const resource = 'categoryCombos';
    const fields = 'id,name,categoryOptionCombos[id,name]';
    const url = `/api/${resource}.json?paging=false&fields=${fields}`;
    return new Observable(observer => {
      this.httpCLientService
        .get(url, true, currentUser)
        .then((response: any) => {
          const { categoryCombos } = response;
          observer.next(categoryCombos);
          observer.complete();
        })
        .catch((error: any) => {
          observer.error(error);
        });
    });
  }

  savingCategoryCombosToLocalStorage(categoryCombos: any[]): Observable<any> {
    const repository = getRepository('CategoryComboEntity') as Repository<
      CategoryComboEntity
    >;
    const chunk = 500;
    return new Observable(observer => {
      repository
        .save(categoryCombos, { chunk })
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch((error: any) => {
          observer.error(error);
        });
    });
  }
}
