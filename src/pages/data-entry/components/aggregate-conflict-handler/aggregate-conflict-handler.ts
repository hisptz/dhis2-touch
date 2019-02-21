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
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActionSheetController } from 'ionic-angular';
import * as _ from 'lodash';
import { DataValuesProvider } from '../../../../providers/data-values/data-values';
import { AppTranslationProvider } from '../../../../providers/app-translation/app-translation';
import { UserProvider } from '../../../../providers/user/user';
import { DataEntryFormProvider } from '../../../../providers/data-entry-form/data-entry-form';
import { DataSetCompletenessProvider } from '../../../../providers/data-set-completeness/data-set-completeness';
import { AppProvider } from '../../../../providers/app/app';

/**
 * Generated class for the AggregateConflictHandlerComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'aggregate-conflict-handler',
  templateUrl: 'aggregate-conflict-handler.html'
})
export class AggregateConflictHandlerComponent implements OnInit {
  @Input() orgUnitId;
  @Input() dataSetId;
  @Input() period;
  @Input() dataDimension;
  @Input() dataValuesObject;
  @Output() dataSetCompletenessInfoAction = new EventEmitter();
  @Output() mergeDataAction = new EventEmitter();
  @Output() conflictFoundAction = new EventEmitter();

  translationMapper: any;
  loadingMessage: string;
  isLoading: boolean;
  summaryObject: any;
  icons: any;

  constructor(
    private dataValuesProvider: DataValuesProvider,
    private translationProvider: AppTranslationProvider,
    private userProvider: UserProvider,
    private dataEntryFormProvider: DataEntryFormProvider,
    private dataSetCompletenessProvider: DataSetCompletenessProvider,
    private appProvider: AppProvider,
    private actionSheetCtrl: ActionSheetController
  ) {
    this.isLoading = true;
    this.loadingMessage = '';
    this.summaryObject = {
      updates: [],
      conflicts: []
    };
    this.icons = {
      accept: 'assets/icon/tick.png',
      decline: 'assets/icon/cancel.png'
    };
  }

  ngOnInit() {
    const transalationStrings = this.getValuesToTranslate();
    this.translationProvider
      .getTransalations(transalationStrings)
      .subscribe(data => {
        this.translationMapper = data;
      });
    if (this.orgUnitId && this.dataSetId && this.period && this.dataDimension) {
      let key = 'Discovering data from the server';
      this.loadingMessage = this.translationMapper[key]
        ? this.translationMapper[key]
        : key;
      this.userProvider.getCurrentUser().subscribe(
        currentUser => {
          this.dataEntryFormProvider
            .loadingDataSetInformation(this.dataSetId, currentUser)
            .subscribe(
              dataSetInformation => {
                const { dataSet } = dataSetInformation;
                if (dataSet && dataSet.id) {
                  const dataSetAttributeOptionCombo = this.dataValuesProvider.getDataValuesSetAttributeOptionCombo(
                    this.dataDimension,
                    dataSet.categoryCombo.categoryOptionCombos
                  );
                  this.dataValuesProvider
                    .getDataValueSetFromServer(
                      this.dataSetId,
                      this.period,
                      this.orgUnitId,
                      dataSetAttributeOptionCombo,
                      currentUser
                    )
                    .subscribe(
                      dataValues => {
                        key = 'Discovering entry form completeness information';
                        this.loadingMessage = this.translationMapper[key]
                          ? this.translationMapper[key]
                          : key;
                        this.dataSetCompletenessProvider
                          .getDataSetCompletenessInfo(
                            this.dataSetId,
                            this.period,
                            this.orgUnitId,
                            this.dataDimension,
                            currentUser
                          )
                          .subscribe(
                            dataSetCompletenessInfo => {
                              this.dataSetCompletenessInfoAction.emit(
                                dataSetCompletenessInfo
                              );
                              this.isLoading = false;
                              if (this.dataValuesObject) {
                                this.updateSummaryObject(
                                  dataValues,
                                  this.dataValuesObject
                                );
                              }
                            },
                            error => {
                              this.isLoading = false;
                              this.appProvider.setNormalNotification(
                                'Failed to discover entry form completeness information'
                              );
                            }
                          );
                      },
                      error => {
                        this.isLoading = false;
                      }
                    );
                } else {
                  this.isLoading = false;
                }
              },
              error => {
                this.isLoading = false;
              }
            );
        },
        error => {
          this.isLoading = false;
        }
      );
    }
  }

  updateSummaryObject(onlineDataValues, dataValuesObject) {
    _.map(onlineDataValues, dataValue => {
      if (dataValue.categoryOptionCombo && dataValue.dataElement) {
        const id = dataValue.dataElement + '-' + dataValue.categoryOptionCombo;
        const onlineDataValueObject = {
          id: id,
          value: dataValue.value,
          status: 'synced'
        };
        if (dataValuesObject[id]) {
          const offlineDataValueObject = dataValuesObject[id];
          offlineDataValueObject.value += '';
          if (offlineDataValueObject.value !== onlineDataValueObject.value) {
            this.summaryObject.conflicts.push(onlineDataValueObject);
          }
        } else {
          this.summaryObject.updates.push(onlineDataValueObject);
        }
      }
    });
    if (this.summaryObject.conflicts.length > 0) {
      this.appProvider.setTopNotification(
        'There are conflicts between offline and online data have been found, that needs your attention'
      );
      this.conflictFoundAction.emit();
    }
    if (this.summaryObject.updates.length > 0) {
      this.appProvider.setTopNotification(
        'New updates has been found form server and have been applied success on offline storage'
      );
      const key = 'updates';
      this.applyingDataToOffline(key);
      this.conflictFoundAction.emit();
    }
  }

  conflictHandlingAction(key, action) {
    if (action === 'accept') {
      const actionSheet = this.actionSheetCtrl.create({
        title: this.translationMapper[
          'You are about to replace offline data with data from the server, are you sure?'
        ],
        buttons: [
          {
            text: this.translationMapper['Yes'],
            handler: () => {
              this.applyingDataToOffline(key, action);
            }
          },
          {
            text: this.translationMapper['No'],
            handler: () => {}
          }
        ]
      });
      actionSheet.present();
    }
    if (action === 'decline') {
      const actionSheet = this.actionSheetCtrl.create({
        title: this.translationMapper[
          'You are about to discard data from server, are you sure?'
        ],
        buttons: [
          {
            text: this.translationMapper['Yes'],
            handler: () => {
              if (this.summaryObject[key]) {
                this.summaryObject[key] = [];
                this.applyingDataToOffline(key, action);
              }
            }
          },
          {
            text: this.translationMapper['No'],
            handler: () => {}
          }
        ]
      });
      actionSheet.present();
    }
  }

  applyingDataToOffline(key, action?: string) {
    if (this.summaryObject[key]) {
      this.mergeDataAction.emit({
        dataValues: this.summaryObject[key],
        action
      });
      this.summaryObject[key] = [];
    }
  }

  getValuesToTranslate() {
    return [
      'Discovering data from the server',
      'You are about to apply new updates to the from the server, are you sure?',
      'You are about to replace offline data with data from the server, are you sure?',
      'You are about to discard data from server, are you sure?',
      'Discovering entry form completeness information',
      'Yes',
      'No'
    ];
  }
}
