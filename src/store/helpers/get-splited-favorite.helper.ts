import * as _ from 'lodash';
export function getSplitedFavorite(favorite: any, splitCriterias: any[]) {
  const favoriteArray: any[] = [];
  let favoriteRows: any[] = [];
  let favoriteColumns: any[] = [];
  let favoriteFilters: any[] = [];

  if (favorite) {
    favoriteRows = [favorite.rows];
    favoriteColumns = [favorite.columns];
    favoriteFilters = [favorite.filters];
    splitCriterias.forEach(criteria => {
      favoriteRows = splitDimensionLayout(favoriteRows, criteria);
      favoriteColumns = splitDimensionLayout(favoriteColumns, criteria);
      favoriteFilters = splitDimensionLayout(favoriteFilters, criteria);
    });
  }

  let favoriteIndex = 0;
  favoriteRows.forEach(row => {
    favoriteColumns.forEach(column => {
      favoriteFilters.forEach(filter => {
        const favoriteObject: any = _.clone(favorite);
        // function to rename
        favoriteObject.rows = row;
        favoriteObject.columns = column;
        favoriteObject.filters = filter;
        favoriteObject.id = favoriteObject.id + '_' + favoriteIndex;
        favoriteObject.name = getFavoriteName([row, column, filter]);
        favoriteObject.displayName = favoriteObject.name;
        favoriteObject.analyticsIdentifier = getAnalyticsIdentifier([row, column, filter], splitCriterias);
        favoriteObject.layer = 'thematic' + (favoriteIndex + 1);
        favoriteArray.push(favoriteObject);
        favoriteIndex++;
      });
    });
  });


  return favoriteArray;
}

function splitDimensionLayout(layoutDetailsArray, criteria) {
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
              newArray.push(nonCriteriaDetail);
            }
          });

          const concatArray = _.concat(newArray, criteriaObject);
          splitedArray.push(concatArray);
        });

      });

    });
  }
  return splitedArray.length > 0 ? splitedArray : layoutDetailsArray;
}

function getFavoriteName(dimensions: any[]) {
  let favoriteName = '';
  if (dimensions) {
    dimensions.forEach(dimensionItem => {
      const dataArray = _.find(dimensionItem, ['dimension', 'dx']);

      if (dataArray) {
        dataArray.items.forEach(item => {
          favoriteName += item.displayName;
        });
      }

    });

    dimensions.forEach(dimensionItem => {
      const periodArray = _.find(dimensionItem, ['dimension', 'pe']);

      if (periodArray) {
        periodArray.items.forEach(item => {
          favoriteName += favoriteName !== '' ? ' - ' + item.displayName : item.displayName;
        });
      }

    });
  }

  return favoriteName;
}

function getAnalyticsIdentifier(dimensions: any[], criterias) {
  let identifier = '';
  if (dimensions) {
    dimensions.forEach(dimensionItem => {
      criterias.forEach(criteria => {
        const dimensionArray = _.find(dimensionItem, ['dimension', criteria]);

        if (dimensionArray) {
          dimensionArray.items.forEach(item => {
            identifier += identifier !== '' ? '_' + item.id : item.id;
          });
        }
      });
    });
  }
  return identifier;
}
