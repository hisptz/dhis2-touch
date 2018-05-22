import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import * as _ from 'lodash';
import { mergeMap, map, tap } from 'rxjs/operators';
import { from } from 'rxjs/observable/from';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { DatePipe } from '@angular/common';

import * as DictionaryActions from '../actions/dictionary.actions';
import * as fromDictionary from '../reducers';
import { HttpClientProvider } from '../../../../../../providers/http-client/http-client';

@Injectable()
export class DictionaryEffects {
  constructor(
    private actions$: Actions,
    private store: Store<fromDictionary.State>,
    private httpClient: HttpClientProvider,
    private datePipe: DatePipe
  ) {}
  @Effect({ dispatch: false })
  initializeDictionary$ = this.actions$
    .ofType<DictionaryActions.InitializeAction>(
      DictionaryActions.DictionaryActions.INITIALIZE
    )
    .withLatestFrom(this.store)
    .pipe(
      map(([action, state]: [any, fromDictionary.State]) =>
        _.filter(
          action.payload,
          identifier => !_.find(state.dictionary, ['id', identifier])
        )
      ),
      tap(identifiers => {
        /**
         * Add incoming items to the dictionary list
         */
        this.store.dispatch(new DictionaryActions.AddAction(identifiers));

        /**
         * Identify corresponding dictionary items
         */
        from(identifiers)
          .pipe(
            mergeMap(identifier =>
              this.httpClient.get(
                `/api/identifiableObjects/${identifier}.json`,
                true
              )
            )
          )
          .subscribe((metadata: any) => {
            this.store.dispatch(
              new DictionaryActions.UpdateAction({
                id: metadata.id,
                name: metadata.name,
                progress: {
                  loading: true,
                  loadingSucceeded: true,
                  loadingFailed: false
                }
              })
            );

            if (metadata.href && metadata.href.indexOf('indicator') !== -1) {
              const indicatorUrl =
                'indicators/' +
                metadata.id +
                '.json?fields=:all,displayName,id,name,numeratorDescription,' +
                'denominatorDescription,denominator,numerator,annualized,decimals,indicatorType[name],user[name],' +
                'attributeValues[value,attribute[name]],indicatorGroups[name,indicators~size],legendSet[name,symbolizer,' +
                'legends~size],dataSets[name]';
              this.getIndicatorInfo(indicatorUrl, metadata.id);
            } else if (
              metadata.href &&
              metadata.href.indexOf('dataElement') !== -1
            ) {
              const dataElementUrl =
                'dataElements/' +
                metadata.id +
                '.json?fields=:all,id,name,aggregationType,displayName,' +
                'categoryCombo[id,name,categories[id,name,categoryOptions[id,name]]],dataSets[:all,!compulsoryDataElementOperands]';
              this.getDataElementInfo(dataElementUrl, metadata.id);
            } else if (
              metadata.href &&
              metadata.href.indexOf('dataSet') !== -1
            ) {
              const dataSetUrl =
                'dataSets/' +
                metadata.id +
                '.json?fields=:all,user[:all],id,name,periodType,shortName,' +
                'categoryCombo[id,name,categories[id,name,categoryOptions[id,name]]]';
              this.getDataSetInfo(dataSetUrl, metadata.id);
            }
          });
      })
    );

  getDataSetInfo(dataSetUrl: string, dataSetId: string) {
    this.httpClient.get(`/api/${dataSetUrl}`, true).subscribe((dataSet: any) => {
      let dataSetDescription =
        '<p>' +
        dataSet.name +
        ' of the <strong>' +
        dataSet.formType +
        '</strong> Form created ' +
        'at <strong>' +
        this.datePipe.transform(dataSet.created) +
        ' by ' +
        dataSet.user.name +
        '</strong>';

      if (dataSet.categoryCombo && dataSet.categoryCombo.name !== 'default') {
        dataSetDescription +=
          '<span> With <strong>' +
          dataSet.categoryCombo.name +
          '</strong> Dimension which is divided' +
          ' into ';

        dataSet.categoryCombo.categories.forEach((category, categoryIndex) => {
          if (
            categoryIndex !== 0 &&
            categoryIndex !== dataSet.categoryCombo.categories.length - 1
          ) {
            dataSetDescription += ', ';
          }

          if (
            categoryIndex === dataSet.categoryCombo.categories.length - 1 &&
            dataSet.categoryCombo.categories.length > 1
          ) {
            dataSetDescription += ' and ';
          }

          dataSetDescription += '<strong>';

          category.categoryOptions.forEach(
            (categoryOption, categoryOptionIndex) => {
              if (
                categoryOptionIndex !== 0 &&
                categoryOptionIndex !== category.categoryOptions.length - 1
              ) {
                dataSetDescription += ', ';
              }

              if (
                categoryOptionIndex === category.categoryOptions.length - 1 &&
                category.categoryOptions.length > 1
              ) {
                dataSetDescription += ' and ';
              }

              dataSetDescription += '<span>' + categoryOption.name + '</span>';
            }
          );

          dataSetDescription += '</strong>';
        });

        dataSetDescription += '</span>';
      }

      dataSetDescription += '</p>';

      this.store.dispatch(
        new DictionaryActions.UpdateAction({
          id: dataSetId,
          description: dataSetDescription,
          progress: {
            loading: false,
            loadingSucceeded: true,
            loadingFailed: false
          }
        })
      );
    });
  }

  getDataElementInfo(dataElementUrl: string, dataElementId: string) {
    this.httpClient.get(`/api/${dataElementUrl}`, true).subscribe((dataElement: any) => {
      let dataElementDescription =
        '<p>This ' +
        dataElement.name +
        ' of this method of data aggregation <strong>' +
        dataElement.aggregationType +
        '</strong> created at <strong>' +
        this.datePipe.transform(dataElement.created) +
        '</strong> is only taking <strong>' +
        dataElement.domainType +
        '</strong> data. As the culture of helping user ' +
        'not entering unrecognized data, therefore its only taking <strong>' +
        dataElement.valueType +
        '</strong> values ' +
        'from the user input</p>';

      if (dataElement.categoryCombo.name !== 'default') {
        dataElementDescription +=
          '<p><strong>' +
          dataElement.name +
          '</strong> consists of <strong>' +
          dataElement.categoryCombo.name +
          '</strong> category combinations of ';

        dataElement.categoryCombo.categories.forEach((category, index) => {
          if (
            index !== 0 &&
            index !== dataElement.categoryCombo.categories.length - 1
          ) {
            dataElementDescription += ', ';
          }

          if (
            index === dataElement.categoryCombo.categories.length - 1 &&
            dataElement.categoryCombo.categories.length > 1
          ) {
            dataElementDescription += ' and ';
          }

          dataElementDescription += '<strong>(';
          category.categoryOptions.forEach(
            (categoryOption, categoryOptionIndex) => {
              if (
                categoryOptionIndex !== 0 &&
                categoryOptionIndex !== category.categoryOptions.length - 1
              ) {
                dataElementDescription += ', ';
              }

              if (
                categoryOptionIndex === category.categoryOptions.length - 1 &&
                category.categoryOptions.length > 1
              ) {
                dataElementDescription += ' and ';
              }

              dataElementDescription +=
                '<span>' + categoryOption.name + '</span>';
            }
          );

          dataElementDescription +=
            ')</strong> of the <strong>' + category.name + '</strong> category';
        });

        dataElementDescription += '</strong></p>';

        // TODO deal with different version of dhis
        if (dataElement.dataSets && dataElement.dataSets.length > 0) {
          dataElementDescription += '<h5>' + dataElement.name + ' Sources</h5>';

          dataElementDescription +=
            '<p>More than <strong>' +
            dataElement.dataSets.length +
            '</strong> dataset ie ';

          dataElement.dataSets.forEach((dataSet: any, dataSetIndex: number) => {
            if (
              dataSetIndex !== 0 &&
              dataSetIndex !== dataElement.dataSets.length - 1
            ) {
              dataElementDescription += ', ';
            }

            if (
              dataSetIndex === dataElement.dataSets.length - 1 &&
              dataElement.dataSets.length > 1
            ) {
              dataElementDescription += ' and ';
            }
            dataElementDescription += '<strong>' + dataSet.name + '</strong>';
          });

          dataElementDescription +=
            ' use this ' + dataElement.name + ' data element';

          if (
            dataElement.dataElementGroups &&
            dataElement.dataElementGroups.length > 0
          ) {
            dataElementDescription += ' and it belongs to ';

            dataElement.dataElementGroups.forEach(
              (dataElementGroup, dataElementGroupIndex) => {
                if (
                  dataElementGroupIndex !== 0 &&
                  dataElementGroupIndex !==
                    dataElement.dataElementGroups.length - 1
                ) {
                  dataElementDescription += ', ';
                }

                if (
                  dataElementGroupIndex ===
                    dataElement.dataElementGroups.length - 1 &&
                  dataElement.dataElementGroups.length > 1
                ) {
                  dataElementDescription += ' and ';
                }
                dataElementDescription +=
                  '<strong>' + dataElementGroup.name + ' Group</strong>';
              }
            );
          }

          dataElementDescription += '</p>';
        }

        this.store.dispatch(
          new DictionaryActions.UpdateAction({
            id: dataElementId,
            description: dataElementDescription,
            progress: {
              loading: false,
              loadingSucceeded: true,
              loadingFailed: false
            }
          })
        );
      }
    });
  }

  getIndicatorInfo(indicatorUrl: string, indicatorId: string) {
    this.httpClient.get(`/api/${indicatorUrl}`, true).subscribe((indicator: any) => {
      let indicatorDescription =
        '<p><strong>' +
        indicator.name +
        '</strong> is a <strong>' +
        indicator.indicatorType.name +
        ' </strong> indicator';

      if (indicator.numeratorDescription) {
        indicatorDescription +=
          '<span> with the numerator described as <strong>' +
          indicator.numeratorDescription +
          '</strong></span>';
      }

      if (indicator.denominatorDescription) {
        indicatorDescription +=
          '<span> and denominator described as <strong>' +
          indicator.denominatorDescription +
          '</strong></span>';
      }

      indicatorDescription += '</p>';

      if (indicator.annualized) {
        indicatorDescription +=
          '<p><span>It’s figure is annualized to support analysis in less than year period ' +
          '(monthly,quarterly,semi-annually)</span></p>';
      }

      this.store.dispatch(
        new DictionaryActions.UpdateAction({
          id: indicatorId,
          description: indicatorDescription,
          progress: {
            loading: true,
            loadingSucceeded: true,
            loadingFailed: false
          }
        })
      );

      /**
       * Get numerator expression
       */
      Observable.forkJoin(
        this.httpClient.get(
          '/api/expressions/description?expression=' +
            encodeURIComponent(indicator.numerator),
          true
        ),
        this.httpClient.get(
          '/api/dataSets.json?fields=periodType,id,name,timelyDays,formType,created,expiryDays&' +
            'filter=dataSetElements.dataElement.id:in:[' +
            this.getAvailableDataElements(indicator.numerator) +
            ']&paging=false',
          true
        )
      ).subscribe((numeratorResults: any[]) => {
        if (numeratorResults[0]) {
          indicatorDescription +=
            '<p>Numerator is calculated from <strong>' +
            numeratorResults[0].description +
            '</strong>';
        }

        if (numeratorResults[1] && numeratorResults[1].dataSets) {
          const dataSets: any[] = numeratorResults[1].dataSets;

          if (dataSets.length > 0) {
            indicatorDescription += ' originating from ';
          }

          dataSets.forEach((dataset: any, index: number) => {
            if (index !== 0 && index !== dataSets.length - 1) {
              indicatorDescription += ', ';
            }

            if (index === dataSets.length - 1 && dataSets.length > 1) {
              indicatorDescription += ' and ';
            }

            indicatorDescription +=
              '<span><strong>' +
              dataset.name +
              ',</strong> that is collected <strong>' +
              dataset.periodType +
              '</strong> with deadline for submission after <strong>' +
              dataset.timelyDays +
              ' days </strong></span>';
          });
        }

        indicatorDescription += `</p>`;

        this.store.dispatch(
          new DictionaryActions.UpdateAction({
            id: indicatorId,
            description: indicatorDescription,
            progress: {
              loading: true,
              loadingSucceeded: true,
              loadingFailed: false
            }
          })
        );

        /**
         * Get denominator expression
         */
        Observable.forkJoin(
          this.httpClient.get(
            '/api/expressions/description?expression=' +
              encodeURIComponent(indicator.denominator), true
          ),
          this.httpClient.get(
            '/api/dataSets.json?fields=periodType,id,name,timelyDays,formType,created,expiryDays&' +
              'filter=dataSetElements.dataElement.id:in:[' +
              this.getAvailableDataElements(indicator.denominator) +
              ']&paging=false', true
          )
        ).subscribe((denominatorResults: any[]) => {
          if (denominatorResults[0]) {
            indicatorDescription +=
              '<p>Denominator is calculated from <strong>' +
              denominatorResults[0].description +
              '</strong>';
          }

          if (denominatorResults[1] && denominatorResults[1].dataSets) {
            const dataSets: any[] = denominatorResults[1].dataSets;

            if (dataSets.length > 0) {
              indicatorDescription += ' originating from ';
            }

            dataSets.forEach((dataset: any, index: number) => {
              if (index !== 0 && index !== dataSets.length - 1) {
                indicatorDescription += ', ';
              }

              if (index === dataSets.length - 1 && dataSets.length > 1) {
                indicatorDescription += ' and ';
              }

              indicatorDescription +=
                '<span><strong>' +
                dataset.name +
                ',</strong> that is collected <strong>' +
                dataset.periodType +
                '</strong> with deadline for submission after <strong>' +
                dataset.timelyDays +
                ' days </strong></span>';
            });
          }

          indicatorDescription += `</p>`;

          /**
           * Indicator group
           */

          if (
            indicator.indicatorGroups &&
            indicator.indicatorGroups.length > 0
          ) {
            indicatorDescription += '<div><p>It belongs to ';

            indicator.indicatorGroups.forEach((indicatorGroup, index) => {
              if (
                index !== 0 &&
                index !== indicator.indicatorGroups.length - 1
              ) {
                indicatorDescription += ', ';
              }

              if (
                index === indicator.indicatorGroups.length - 1 &&
                indicator.indicatorGroups.length > 1
              ) {
                indicatorDescription += ' and ';
              }

              indicatorDescription +=
                '<span><strong>' +
                indicatorGroup.name +
                '</strong> with <strong>' +
                indicatorGroup.indicators +
                '</strong> other related indicators</span>';
            });

            indicatorDescription += '</p></div>';
          }

          /**
           * Attribute values
           */
          if (
            indicator.attributeValues &&
            indicator.attributeValues.length > 0
          ) {
            indicatorDescription +=
              '<div><p>Other related details associated with this indicators includes: ';

            indicator.attributeValues.forEach(attr => {
              indicatorDescription +=
                '<span><strong>' +
                attr.attribute.name +
                ': ' +
                attr.value +
                '</strong></span>';
            });

            indicatorDescription += '</p></div>';
          }

          /**
           * Legend set
           */
          if (indicator.legendSet) {
            indicatorDescription +=
              '<div><p> It makes use of: <strong>' +
              indicator.legendSet.name +
              '</strong> legend' +
              ' set for analysis with <strong>' +
              indicator.legendSet.legends +
              ' Classes </strong>using <strong>' +
              indicator.legendSet.symbolizer +
              ' for analysis</strong></p></div>';
          }

          /**
           * User info
           */
          if (indicator.user) {
            indicatorDescription +=
              '<div><p>This indicator was <strong> first created </strong> in the system on <strong>' +
              this.datePipe.transform(indicator.created) +
              '</strong> by <strong>' +
              indicator.user.name +
              '</strong></p></div>';
          }

          this.store.dispatch(
            new DictionaryActions.UpdateAction({
              id: indicatorId,
              description: indicatorDescription,
              progress: {
                loading: false,
                loadingSucceeded: true,
                loadingFailed: false
              }
            })
          );
        });
      });
    });
  }

  getAvailableDataElements(data) {
    let dataElementUids = [];
    const separators = [' ', '\\+', '-', '\\(', '\\)', '\\*', '/', ':', '\\?'];
    const numeratorDataElements = data.split(
      new RegExp(separators.join('|'), 'g')
    );
    numeratorDataElements.forEach(dataElement => {
      dataElementUids = this.dataElementWithCategoryOptionCheck(dataElement);
    });
    return dataElementUids.join();
  }

  dataElementWithCategoryOptionCheck(dataElement: any) {
    const uid = [];
    if (dataElement.indexOf('.') >= 1) {
      uid.push(
        dataElement
          .replace(/#/g, '')
          .replace(/{/g, '')
          .replace(/}/g, '')
          .split('.')[0]
      );
    } else {
      uid.push(
        dataElement
          .replace(/#/g, '')
          .replace(/{/g, '')
          .replace(/}/g, '')
      );
    }

    return uid;
  }
}
