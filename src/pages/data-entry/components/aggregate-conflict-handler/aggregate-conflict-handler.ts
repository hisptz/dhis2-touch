import { Component, Input, OnInit } from '@angular/core';
import { DataValuesProvider } from '../../../../providers/data-values/data-values';
import { AppTranslationProvider } from '../../../../providers/app-translation/app-translation';
import { UserProvider } from '../../../../providers/user/user';
import { DataEntryFormProvider } from '../../../../providers/data-entry-form/data-entry-form';

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

  translationMapper: any;
  loadingMessage: string;
  isLoading: boolean;

  constructor(
    private dataValuesProvider: DataValuesProvider,
    private translationProvider: AppTranslationProvider,
    private userProvider: UserProvider,
    private dataEntryFormProvider: DataEntryFormProvider
  ) {
    this.isLoading = true;
    this.loadingMessage = '';
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
                        console.log('dataValues : ' + dataValues.length);
                        this.isLoading = false;
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

  getValuesToTranslate() {
    return ['Discovering data from the server'];
  }
}
