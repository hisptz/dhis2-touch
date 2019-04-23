/*
 *
 * Copyright 2015 HISP Tanzania
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
 * @since 2015
 * @author Joseph Chingalo <profschingalo@gmail.com>
 *
 */
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { Store } from '@ngrx/store';
import { State, getCurrentUserColorSettings } from '../../../store';
import { Observable } from 'rxjs';

@IonicPage()
@Component({
  selector: 'page-validation-rules-results',
  templateUrl: 'validation-rules-results.html'
})
export class ValidationRulesResultsPage implements OnInit {
  colorSettings$: Observable<any>;
  violatedValidationRules: any[];
  icons: any;

  constructor(
    private store: Store<State>,
    private navParams: NavParams,
    private viewCtrl: ViewController
  ) {
    this.violatedValidationRules = [];
    this.icons = {
      success: '',
      warning: ''
    };
    this.colorSettings$ = this.store.select(getCurrentUserColorSettings);
  }

  ngOnInit() {
    this.violatedValidationRules = this.navParams.get('violatedValidationRule');
  }

  trackByFn(index, item) {
    return item && item.id ? item.id : index;
  }

  dismiss() {
    this.viewCtrl.dismiss({});
  }
}
