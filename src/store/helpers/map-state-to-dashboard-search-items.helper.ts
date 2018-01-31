import * as _ from 'lodash';
import {DashboardSearchItem} from '../../models/dashboard-search-item';
export function mapStateToDashboardSearchItems(dashboardSearchItems, searchResults) {
  const newSearchResults: any[] = [];
  if (searchResults !== null) {
    const searchResultKeys = _.keys(searchResults);
    searchResultKeys.forEach(searchResultKey => {
      if (_.isObject(searchResults[searchResultKey])) {
        const resultItems = searchResults[searchResultKey];
        resultItems.forEach(item => {
          switch (searchResultKey) {
            case 'reportTables':
              newSearchResults.push({
                ...item,
                displayType: 'tables',
                icon: 'assets/icons/table.png',
                type: searchResultKey
              });
              break;
            case 'eventReports':
              newSearchResults.push({
                ...item,
                displayType: 'tables',
                icon: 'assets/icons/table.png',
                type: searchResultKey
              });
              break;
            case 'eventCharts':
              newSearchResults.push({
                ...item,
                displayType: 'charts',
                icon: 'assets/icons/bar.png',
                type: searchResultKey
              });
              break;
            default:
              newSearchResults.push({
                ...item,
                displayType: searchResultKey,
                type: searchResultKey,
                icon: searchResultKey === 'charts' ? 'assets/icons/bar.png' :
                  'assets/icons/' + searchResultKey.slice(0, -1) + '.png'
              });
              break;
          }
        });
      }
    });
  }

  return updateWithHeaderSelectionCriterias({
    ...dashboardSearchItems,
    results: newSearchResults,
    loaded: true,
    loading: false
  });
}

export function updateWithHeaderSelectionCriterias(dashboardSearchItems: DashboardSearchItem) {
  const newDashboardSearchResults = _.clone(dashboardSearchItems.results);

  dashboardSearchItems.results = newDashboardSearchResults.map(result => {
    const newResult = _.clone(result);
    const correspondingHeader = _.find(dashboardSearchItems.headers, ['name', newResult.displayType]);
    const allHeader = _.find(dashboardSearchItems.headers, ['name', 'all']);
    /**
     * Set selection options
     */
    if (correspondingHeader) {
      newResult.selected = allHeader.selected ? true : correspondingHeader.selected;
    }

    return newResult;
  });

  const newDashboardSearchHeaders = _.clone(dashboardSearchItems.headers);

  dashboardSearchItems.headers = newDashboardSearchHeaders.map(header => {
    const newHeader = _.clone(header);

    if (newHeader.name === 'all') {
      newHeader.itemCount = dashboardSearchItems.results.length;
    } else {
      newHeader.itemCount = _.filter(dashboardSearchItems.results, (result) => result.displayType === newHeader.name).length;
    }
    return newHeader;
  });

  const selectedHeaderCountArray = dashboardSearchItems.headers.filter((header) => header.selected)
    .map((filteredHeader) => filteredHeader.itemCount);
  dashboardSearchItems.resultCount = selectedHeaderCountArray.length > 0 ?
    selectedHeaderCountArray.reduce((sum: number, count: number) => sum + count) : 0;

  return dashboardSearchItems;
}
