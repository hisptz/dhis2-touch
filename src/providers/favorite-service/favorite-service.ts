import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClientProvider} from "../http-client/http-client";
import {RelativePeriodServiceProvider} from "../relative-period-service/relative-period-service";
import * as _ from 'lodash';

/*
  Generated class for the FavoriteServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class FavoriteServiceProvider {

  constructor(public http: HttpClientProvider,private relativePeriodService : RelativePeriodServiceProvider) {}

  private _getFavoriteUrl(apiRootUrl: string, favoriteType: string, favoriteId: string): string {
    let url: string = apiRootUrl + favoriteType + 's/' + favoriteId + '.json?fields=';
    if (favoriteType === 'map') {
      url += 'id,user,displayName,longitude,latitude,zoom,basemap,mapViews[*,organisationUnitGroupSet[id,name,displayName,organisationUnitGroups[id,code,name,shortName,displayName,dimensionItem,symbol,organisationUnits[id,code,name,shortName]]],dataElementDimensions[dataElement[id,name,optionSet[id,options[id,name]]]],columns[dimension,filter,items[dimensionItem,dimensionItemType,displayName]],rows[dimension,filter,items[dimensionItem,dimensionItemType,displayName]],filters[dimension,filter,items[dimensionItem,dimensionItemType,displayName]],dataDimensionItems,program[id,displayName],programStage[id,displayName],legendSet[id,displayName,legends[*]],!lastUpdated,!href,!created,!publicAccess,!rewindRelativePeriods,!userOrganisationUnit,!userOrganisationUnitChildren,!userOrganisationUnitGrandChildren,!externalAccess,!access,!relativePeriods,!columnDimensions,!rowDimensions,!filterDimensions,!user,!organisationUnitGroups,!itemOrganisationUnitGroups,!userGroupAccesses,!indicators,!dataElements,!dataElementOperands,!dataElementGroups,!dataSets,!periods,!organisationUnitLevels,!organisationUnits,!sortOrder,!topLimit]';
    } else {
      url += '*,dataElementDimensions[dataElement[id,name,optionSet[id,options[id,name]]]],displayDescription,program[id,name],programStage[id,name],legendSet[*,legends[*]],interpretations[*,user[id,displayName],likedBy[id,displayName],comments[lastUpdated,text,user[id,displayName]]],columns[dimension,filter,legendSet,items[id,dimensionItem,dimensionItemType,displayName]],rows[dimension,filter,legendSet,items[id,dimensionItem,dimensionItemType,displayName]],filters[dimension,filter,legendSet,items[id,dimensionItem,dimensionItemType,displayName]],access,userGroupAccesses,publicAccess,displayDescription,user[displayName,dataViewOrganisationUnits],!href,!rewindRelativePeriods,!userOrganisationUnit,!userOrganisationUnitChildren,!userOrganisationUnitGrandChildren,!externalAccess,!relativePeriods,!columnDimensions,!rowDimensions,!filterDimensions,!organisationUnitGroups,!itemOrganisationUnitGroups,!indicators,!dataElements,!dataElementOperands,!dataElementGroups,!dataSets,!periods,!organisationUnitLevels,!organisationUnits';
    }
    return url;
  }

  getFavorite(visualizationDetails: any,currentUser): Observable<any> {
    const visualizationObjectFavorite: any = visualizationDetails.visualizationObject.details.favorite;
    const favoriteOptions = visualizationObjectFavorite.options ? visualizationObjectFavorite.options : {};
    if (!visualizationObjectFavorite.id) {
      visualizationDetails.favorite = {};
      return Observable.of(visualizationDetails);
    }
    return Observable.create(observer => {
      this.http.get(this._getFavoriteUrl(
        visualizationDetails.apiRootUrl,
        visualizationObjectFavorite.type,
        visualizationObjectFavorite.id),
        currentUser
      ).then((favorite: any) => {
        favorite = JSON.parse(favorite.data);
        const newFavorite :any = _.clone(favorite);
        newFavorite.subtitle = this.getFavoriteSubtitle(favorite.filters, visualizationDetails.visualizationObject.details.userOrganisationUnit);
        visualizationDetails.favorite = Object.assign({}, newFavorite, favoriteOptions);
        visualizationDetails.favorite = this.relativePeriodService.getISOFormatFromRelativePeriod(visualizationDetails.favorite);
        //todo to place period sanitizer
        observer.next(visualizationDetails);
        observer.complete();
      }, error => {
        visualizationDetails.error = error;
        observer.next(visualizationDetails);
        observer.complete();
      });
    });
  }

  getFavoriteSubtitle(favoriteFilters: any[], userOrgUnit: string) {
    let subtitle = '';
    if (favoriteFilters) {
      const newFavoriteFilters = _.map(favoriteFilters, filterObject => {
        return {
          dimension: filterObject.dimension,
          items: _.map(filterObject.items, (item :any) => {
            return this._getRefinedFavouriteSubtitle(item.displayName);
          })
        }
      });

      /**
       * Get data section of filter
       */
      const dxSection = _.find(newFavoriteFilters, ['dimension', 'dx']);

      if (dxSection) {
        subtitle += subtitle !== '' ? ' - ' : '';
        subtitle += dxSection.items.join(',');
      }

      /**
       * Get period section of filter
       */
      const peSection = _.find(newFavoriteFilters, ['dimension', 'pe']);

      if (peSection) {
        subtitle += subtitle !== '' ? ' - ' : '';
        subtitle += peSection.items.join(',');
      }

      /**
       * Get orgunit section of filter
       */
      const ouSection = _.find(newFavoriteFilters, ['dimension', 'ou']);

      if (ouSection) {
        subtitle += subtitle !== '' ? ' - ' : '';
        subtitle += ouSection.items.join(',');
      }
    }
    return subtitle;
  }

  _getRefinedFavouriteSubtitle(subTitleString) {
    let refinedSubtitle = "";

    if ( subTitleString.indexOf('_') >= 0 ) {

      const splitted = subTitleString.split('_');
      splitted.forEach((split)=>{
        const lowercase = split.toLowerCase();
        const capitalized = lowercase.charAt(0).toUpperCase();
        refinedSubtitle += capitalized+''+lowercase.slice(1)+" ";
      })
    }
    return refinedSubtitle;
  }

  getVisualizationFiltersFromFavorite(favoriteDetails: any) {
    const favorite: any = _.clone(favoriteDetails.favorite);
    const filters: any[] = [];
    if (favorite) {
      if (favorite.mapViews) {
        favorite.mapViews.forEach((view: any) => {
          const filterObject: any = {
            id: view.id,
            filters: []
          };

          /**
           * Get filters
           */
          filterObject.filters.push(this._getDimensionValues(view.rows));
          filterObject.filters.push(this._getDimensionValues(view.columns));
          filterObject.filters.push(this._getDimensionValues(view.filters));
          filterObject.filters = this._compileDimensionFilters(filterObject.filters);

          filters.push(filterObject)
        })

      } else {
        const filterObject: any = {
          id: favorite.id,
          filters: []
        };

        /**
         * Get filters
         */
        filterObject.filters.push(this._getDimensionValues(favorite.rows));
        filterObject.filters.push(this._getDimensionValues(favorite.columns));
        filterObject.filters.push(this._getDimensionValues(favorite.filters));
        filterObject.filters = this._compileDimensionFilters(filterObject.filters);


        /**
         * Save result to the filter array
         */
        filters.push(filterObject)
      }
    }
    favoriteDetails.filters = filters;
    return favoriteDetails;
  }

  private _getReadableDimensionValue(dimensionArray: any, readableDimensionValues: any) {
    if (dimensionArray) {
      dimensionArray.forEach((dimensionObject: any) => {
        if (dimensionObject.dimension !== 'dy') {
          if (dimensionObject.items) {
            readableDimensionValues[dimensionObject.dimension] = dimensionObject.items.map(item => {
              return {
                id: item.dimensionItem,
                name: item.displayName,
                itemType: item.dimensionItemType
              }
            });
          }
        }
      });
    }

    return readableDimensionValues;
  }

  private _getDimensionValues(dimensionArray: any) {
    const dimensionValues: any[] = [];
    const readableDimensionValues: any = {};
    if (dimensionArray) {
      dimensionArray.forEach((dimensionObject: any) => {
        if (dimensionObject.dimension !== 'dy') {
          const dimensionValue = {
            name: '',
            value: '',
            items: []
          };

          /**
           * Get dimension name
           */
          let dimensionName = dimensionObject.dimension;
          dimensionName += dimensionObject.legendSet ? '-' + dimensionObject.legendSet.id : '';
          dimensionValue.name = dimensionName;

          /**
           * Get dimension items
           */
          dimensionValue.items = dimensionObject.items;

          /**
           * Get dimension value
           */
          if (dimensionObject.items) {
            readableDimensionValues[dimensionObject.dimension] = dimensionObject.items.map(item => {
              return {
                id: item.dimensionItem,
                name: item.displayName,
                itemType: item.dimensionItemType
              }
            });

            const itemValues = dimensionObject.items.map(item => {
              return item.dimensionItem ? item.dimensionItem : ''
            }).join(';')
            dimensionValue.value = itemValues !== '' ? itemValues : dimensionObject.filter ? dimensionObject.filter : '';
          }
          dimensionValues.push(dimensionValue)
        }
      });
    }

    return dimensionValues;
  }

  private _compileDimensionFilters(filters) {
    const compiledFilters: any[] = [];
    if (filters) {
      filters.forEach((filter: any) => {
        filter.forEach(filterValue => {
          compiledFilters.push(filterValue)
        })
      })
    }
    return compiledFilters;
  }

  getVisualizationLayoutFromFavorite(favoriteDetails: any) {
    const favorite: any = favoriteDetails.favorite;
    const layouts: any[] = [];
    if (favorite) {
      if (favorite.mapViews) {
        favorite.mapViews.forEach(view => {
          const layout = {
            rows: this._getDimensionLayout(view.rows, view.dataElementDimensions),
            columns: this._getDimensionLayout(view.columns, view.dataElementDimensions),
            filters: this._getDimensionLayout(view.filters, view.dataElementDimensions)
          }
          layouts.push({id: view.id, layout: layout})
        })
      } else {
        const layout = {
          rows: this._getDimensionLayout(favorite.rows, favorite.dataElementDimensions),
          columns: this._getDimensionLayout(favorite.columns, favorite.dataElementDimensions),
          filters: this._getDimensionLayout(favorite.filters, favorite.dataElementDimensions)
        }
        layouts.push({id: favorite.id, layout: layout})
      }
      favoriteDetails.layouts = layouts;
    }
    return favoriteDetails;
  }

  private _getDimensionLayout(dimensionArray, dataElementDimensions) {
    const newDimensionLayoutArray: any[] = [];
    if (dimensionArray) {
      dimensionArray.forEach(dimensionObject => {
        if (dimensionObject.dimension !== 'dy') {
          const layoutValue = dimensionObject.dimension;
          const layoutName = this._getLayoutName(layoutValue, dataElementDimensions);
          newDimensionLayoutArray.push({name: layoutName, value: layoutValue});
        }
      })
    }
    return newDimensionLayoutArray;
  }

  private _getLayoutName(layoutValue, dataElementDimensions) {
    switch (layoutValue) {
      case 'ou': {
        return 'Organisation Unit'
      }

      case 'pe': {
        return 'Period'
      }

      case 'dx': {
        return 'Data'
      }

      default: {
        let layoutName = '';
        if (dataElementDimensions) {
          const compiledDimension = dataElementDimensions.map(dataElementDimension => {
            return dataElementDimension.dataElement
          });
          const layoutObject :any = _.find(compiledDimension, ['id', layoutValue]);
          if (layoutObject) {
            layoutName = layoutObject.name;
          }
        }
        return layoutName !== '' ? layoutName : 'Category Option';
      }
    }

  }

  getFavoriteOptions(apiRootUrl,currentUser) {
    return Observable.create(observer => {
      this.http.get(apiRootUrl + 'dataStore/idashboard/favoriteOptions',currentUser).then((favoriteOptions : any) => {
        favoriteOptions = JSON.parse(favoriteOptions.data);
        observer.next(favoriteOptions);
        observer.complete();
      }, () => {
        observer.next([]);
        observer.complete();
      })
    })
  }

  loadAdditionalOptions(visualizationDetails,currentUser) {
    const favoriteId = visualizationDetails.favorite.id;
    return Observable.create(observer => {
      if (favoriteId) {
        this.http.get(visualizationDetails.apiRootUrl + 'dataStore/favoriteOptions/' + visualizationDetails.favorite.id,currentUser)
          .then((favoriteOptions : any) => {
            favoriteOptions = JSON.parse(favoriteOptions.data);
            visualizationDetails.favorite = Object.assign({}, visualizationDetails.favorite, favoriteOptions);
            observer.next(visualizationDetails);
            observer.complete();
          }, () => {
            observer.next(visualizationDetails);
            observer.complete();
          })
      } else {
        observer.next(visualizationDetails);
        observer.complete();
      }
    });
  }

  private _updateAdditionalOptions(visualizationDetails,currentUser) {
    const favoriteOptions = visualizationDetails.favoriteOptions;
    return Observable.create(observer => {
      if (favoriteOptions) {
        this.http.get(visualizationDetails.apiRootUrl + 'dataStore/idashboard/favoriteOptions',currentUser)
          .then((favoriteOptionsResponse: any) => {
            favoriteOptionsResponse = JSON.parse(favoriteOptionsResponse.data);
            const availableFavoriteOptions = _.find(favoriteOptionsResponse, ['id', favoriteOptions.id]);

            if (availableFavoriteOptions) {
              const availableFavoriteOptionsIndex = _.findIndex(favoriteOptionsResponse, availableFavoriteOptions);
              favoriteOptionsResponse[availableFavoriteOptionsIndex] = favoriteOptions;
              this.http.put(visualizationDetails.apiRootUrl + 'dataStore/idashboard/favoriteOptions', favoriteOptionsResponse,currentUser)
                .then(() => {
                  observer.next(visualizationDetails);
                  observer.complete();
                }, () => {
                  observer.next(visualizationDetails);
                  observer.complete();
                });
            } else {
              favoriteOptionsResponse.push(favoriteOptions);
              this.http.put(visualizationDetails.apiRootUrl + 'dataStore/idashboard/favoriteOptions', favoriteOptionsResponse,currentUser)
                .then(() => {
                  observer.next(visualizationDetails);
                  observer.complete();
                }, () => {
                  observer.next(visualizationDetails);
                  observer.complete();
                })
            }
          }, () => {
            this.http.post(visualizationDetails.apiRootUrl + 'dataStore/idashboard/favoriteOptions', [favoriteOptions],currentUser)
              .then(() => {
                observer.next(visualizationDetails);
                observer.complete();
              }, () => {
                observer.next(visualizationDetails);
                observer.complete();
              })
          });
      } else {
        observer.next(visualizationDetails);
        observer.complete();
      }
    })
  }


  createOrUpdateFavorite(visualizationDetails: any,currentUser) {
    return Observable.create(observer => {
      const visualizationSettings = visualizationDetails.visualizationObject.layers.map(layer => {
        return layer.settings
      });
      const additionalOptionsArray = this._prepareAdditionalFavoriteOptions(visualizationSettings);
      /**
       * Update favorites
       */
      Observable.forkJoin(
        visualizationSettings.map(setting => {
          return Observable.of(setting)
        })
      ).subscribe(() => {
        /**
         * Update additional options
         */
        Observable.forkJoin(
          additionalOptionsArray.map(option => {
            return this._updateAdditionalOptions({
              apiRootUrl: visualizationDetails.apiRootUrl,
              favoriteOptions: option
            },currentUser)
          })
        ).subscribe(() => {
          visualizationDetails.updateSuccess = true;
          observer.next(visualizationDetails);
          observer.complete()
        }, error => {
          visualizationDetails.updateSuccess = false;
          visualizationDetails.updateError = error;
          observer.next(visualizationDetails);
          observer.complete()
        })
      }, favoriteError => {
        visualizationDetails.updateSuccess = false;
        visualizationDetails.updateError = favoriteError;
        observer.next(visualizationDetails);
        observer.complete()
      })
    })
  }

  private _prepareAdditionalFavoriteOptions(visualizationSettings) {
    const favoriteOptionArray: any[] = [];
    if (visualizationSettings) {
      visualizationSettings.forEach(visualizationSetting => {
        const favoriteOption: any = {
          id: visualizationSetting.id,
          useMultipleAxis: visualizationSetting.useMultipleAxis,
          selectedChartTypes: visualizationSetting.selectedChartTypes
        };

        favoriteOptionArray.push(favoriteOption)
      })
    }
    return favoriteOptionArray
  }

  splitFavorite(favorite: any, splitCriterias: any[]) {
    const favoriteArray: any[] = [];
    let favoriteRows: any[] = [];
    let favoriteColumns: any[] = [];
    let favoriteFilters: any[] = [];

    if (favorite) {
      favoriteRows = [favorite.rows];
      favoriteColumns = [favorite.columns];
      favoriteFilters = [favorite.filters];
      splitCriterias.forEach(criteria => {
        favoriteRows = this.splitDimensionLayout(favoriteRows, criteria);
        favoriteColumns = this.splitDimensionLayout(favoriteColumns, criteria);
        favoriteFilters = this.splitDimensionLayout(favoriteFilters, criteria);
      })
    }

    let favoriteIndex: number = 0;
    favoriteRows.forEach(row => {
      favoriteColumns.forEach(column => {
        favoriteFilters.forEach(filter => {
          const favoriteObject: any = _.clone(favorite);
          //function to rename
          favoriteObject.rows = row;
          favoriteObject.columns = column;
          favoriteObject.filters = filter;
          favoriteObject.id = favoriteObject.id + '_' + favoriteIndex;
          favoriteObject.name = this._getFavoriteName([row, column, filter]);
          favoriteObject.displayName = favoriteObject.name;
          favoriteObject.analyticsIdentifier = this._getAnalyticsIdentifier([row, column, filter], splitCriterias);
          favoriteObject.layer = 'thematic' + (favoriteIndex + 1);
          favoriteArray.push(favoriteObject);
          favoriteIndex++;
        })
      })
    });


    return favoriteArray;
  }

  private _getAnalyticsIdentifier(dimensions: any[], criterias) {
    let identifier = '';
    if (dimensions) {
      dimensions.forEach(dimensionItem => {
        criterias.forEach(criteria => {
          const dimensionArray : any = _.find(dimensionItem, ['dimension', criteria]);

          if (dimensionArray) {
            dimensionArray.items.forEach(item => {
              identifier += identifier !== '' ? '_' + item.id : item.id;
            })
          }
        });
      })
    }
    return identifier;
  }

  private _getFavoriteName(dimensions: any[]) {
    let favoriteName = '';
    if (dimensions) {
      dimensions.forEach(dimensionItem => {
        const dataArray : any = _.find(dimensionItem, ['dimension', 'dx']);

        if (dataArray) {
          dataArray.items.forEach(item => {
            favoriteName += item.displayName;
          })
        }

      })

      dimensions.forEach(dimensionItem => {
        const periodArray :any = _.find(dimensionItem, ['dimension', 'pe']);

        if (periodArray) {
          periodArray.items.forEach(item => {
            favoriteName += favoriteName !== '' ? ' - ' + item.displayName : item.displayName;
          })
        }

      })
    }

    return favoriteName;
  }

  splitDimensionLayout(layoutDetailsArray, criteria) {
    const criteriaArray: any[] = [];
    const splitedArray: any[] = [];
    if (layoutDetailsArray) {
      layoutDetailsArray.forEach(layoutDetail => {
        layoutDetail.forEach(detail => {
          if (detail.dimension === criteria) {
            const items: any[] = _.clone(detail.items);
            if (items) {
              items.forEach(item => {
                criteriaArray.push([{
                  dimension: detail.dimension,
                  items: [item]
                }]);
              });
            }
          }
        });

        criteriaArray.forEach(array => {
          array.forEach(criteriaObject => {
            const newArray: any[] = [];
            layoutDetail.forEach(nonCriteriaDetail => {
              if (nonCriteriaDetail.dimension !== criteria) {
                newArray.push(nonCriteriaDetail)
              }
            });

            const concatArray = _.concat(newArray, criteriaObject);
            splitedArray.push(concatArray)
          })

        })

      });
    }
    return splitedArray.length > 0 ? splitedArray : layoutDetailsArray;
  }

  mergeFavorite(splitedFavorite) {
    let rows: any[] = [];
    let columns: any[] = [];
    let filters: any[] = [];
    let mergedFavorite: any = {};
    if (splitedFavorite) {
      splitedFavorite.forEach((favorite: any) => {
        if (!mergedFavorite.id) {
          const favoriteId: string = favorite.id;
          const underScoreIndex: number = favoriteId.indexOf('_');
          mergedFavorite = favorite;
          if (underScoreIndex !== -1) {
            mergedFavorite.id = favoriteId.substring(0, underScoreIndex - 1);
          }
        }
        /**
         * merge rows
         */
        rows = this.mergeDimensionLayout(_.clone(favorite.rows), rows);

        /**
         * merge columns
         */
        columns = this.mergeDimensionLayout(_.clone(favorite.columns), columns);

        /**
         * merge filters
         */
        filters = this.mergeDimensionLayout(_.clone(favorite.filters), filters);
      })
    }

    mergedFavorite.rows = this.mergeToCorrepondingDimension(rows);
    mergedFavorite.columns = this.mergeToCorrepondingDimension(columns);
    mergedFavorite.filters = this.mergeToCorrepondingDimension(filters);

    return mergedFavorite;
  }

  mergeDimensionLayout(layoutArray, layoutResult) {
    /**
     * prepare arrays for checking duplicate
     * @type {Array}
     */
    let resultItems: any[] = [];
    layoutResult.forEach(result => {
      result.items.forEach(resultItem => {
        resultItems.push(resultItem);
      })
    });

    /**
     * Update array with new items
     */
    if (layoutArray) {
      layoutArray.forEach(result => {
        const layoutItems: any[] = _.clone(result.items);
        layoutItems.forEach(item => {
          const existingItem = _.find(resultItems, ['id', item.id]);
          if (!existingItem) {
            layoutResult.push(result)
          }
        });
      })
    }
    return layoutResult;
  }

  mergeToCorrepondingDimension(layoutResult) {
    let newLayoutResult: any = [];
    layoutResult.forEach(result => {
      if (newLayoutResult.length === 0) {
        newLayoutResult.push(result);
      } else {
        const currentDimensionObject = _.find(newLayoutResult, ['dimension', result.dimension]);
        const currentDimensionIndex = _.findIndex(newLayoutResult, currentDimensionObject);
        if (currentDimensionObject) {
          let newItemList: any = [];

          /**
           * Get list from current array
           */
          const arrayItems: any[] = result.items;
          if (arrayItems) {
            arrayItems.forEach(item => {
              newItemList.push(item)
            });
          }
          ;

          /**
           * Add more item list from already added list
           */
          const existingItems = newLayoutResult[currentDimensionIndex].items;
          console.log(JSON.stringify(existingItems))
          if (existingItems) {
            existingItems.forEach(item => {
              newItemList.push(item)
            });
          }
          ;

          newLayoutResult[currentDimensionIndex].items = newItemList;


        } else {
          newLayoutResult.push(result);
        }
      }
    });
    return newLayoutResult;
  }

}
