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
import { ViewController, NavParams, IonicPage } from 'ionic-angular';
import { ProgramsProvider } from '../../providers/programs/programs';
import { AppTranslationProvider } from '../../providers/app-translation/app-translation';
import { Store } from '@ngrx/store';
import { State, getCurrentUserColorSettings } from '../../store';
import { Observable } from 'rxjs';

/*
 Generated class for the ProgramSelection page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-program-selection',
  templateUrl: 'program-selection.html'
})
export class ProgramSelection implements OnInit {
  programsList: any;
  currentProgram: any;
  icons: any = {};
  translationMapper: any;
  colorSettings$: Observable<any>;

  constructor(
    private store: Store<State>,
    private viewCtrl: ViewController,
    private params: NavParams,
    private programProvider: ProgramsProvider,
    private appTranslation: AppTranslationProvider
  ) {
    this.colorSettings$ = this.store.select(getCurrentUserColorSettings);
    this.translationMapper = {};
  }

  ngOnInit() {
    this.appTranslation.getTransalations(this.getValuesToTranslate()).subscribe(
      (data: any) => {
        this.translationMapper = data;
        this.setModalData();
      },
      error => {
        this.setModalData();
      }
    );
    this.setModalData();
  }

  setModalData() {
    this.icons.program = 'assets/icon/program.png';
    this.programsList = this.params.get('programsList');
    this.currentProgram = this.params.get('currentProgram');
  }

  getFilteredList(ev: any) {
    let searchValue = ev.target.value;
    this.programsList = this.params.get('programsList');
    if (searchValue && searchValue.trim() != '') {
      this.programsList = this.programsList.filter((program: any) => {
        return (
          program.name.toLowerCase().indexOf(searchValue.toLowerCase()) > -1
        );
      });
    }
  }

  setSelectedProgram(selectedProgram) {
    this.programProvider.setLastSelectedProgram(selectedProgram);
    this.viewCtrl.dismiss(selectedProgram);
  }

  dismiss() {
    var parameter = {};
    this.viewCtrl.dismiss(parameter);
  }

  trackByFn(index, item) {
    return item && item.id ? item.id : index;
  }

  getValuesToTranslate() {
    return ['There is no program to select'];
  }
}
