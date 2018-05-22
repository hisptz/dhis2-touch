import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { DataFilterService } from './services/data-filter.service';
import * as _ from 'lodash';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { DATA_FILTER_OPTIONS } from './data-filter.model';
import { of } from 'rxjs/observable/of';

@Component({
  selector: 'app-data-filter',
  templateUrl: './data-filter.component.html',
  styleUrls: ['./data-filter.component.css']
})
export class DataFilterComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  availableItems: any[] = [];
  dataGroups: any[] = [];
  selectedGroup: any = {id: 'ALL', name: 'All'};

  @Output() onDataUpdate: EventEmitter<any> = new EventEmitter<any>();
  @Output() onDataFilterClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() selectedItems: any[] = [];
  @Input() functionMappings: any[] = [];
  @Input() hiddenDataElements: any[] = [];
  private _selectedItems: any[];
  selectedItems$: Observable<any>;
  querystring: string = null;
  listchanges: string = null;
  showBody = false;
  dataItems: any = {
    dataElements: [],
    indicators: [],
    dataElementGroups: [],
    indicatorGroups: [],
    categoryOptions: [],
    dataSets: [],
    programs: [],
    programIndicators: [],
    dataSetGroups: [
      {id: '', name: 'Reporting Rate'},
      {id: '.REPORTING_RATE_ON_TIME', name: 'Reporting Rate on time'},
      {id: '.ACTUAL_REPORTS', name: 'Actual Reports Submitted'},
      {id: '.ACTUAL_REPORTS_ON_TIME', name: 'Reports Submitted on time'},
      {id: '.EXPECTED_REPORTS', name: 'Expected Reports'}
    ]
  };
  loading: boolean;
  p = 1;
  k = 1;
  need_groups: boolean;

  dataFilterOptions: any[];
  showGroups: boolean;

  hideMonth = false;
  hideQuarter = false;

  constructor(private dataFilterService: DataFilterService) {
    this.dataFilterOptions = DATA_FILTER_OPTIONS;
    this.showGroups = false;
    this.need_groups = true;
    this.loading = true;
  }

  ngOnInit() {
    // TODO revamp period filter to accomodate more data dimensions criterion
    this.initiateData();
    this._selectedItems = [...this.selectedItems];
    this.selectedItems$ = of(this._selectedItems);
  }

  // trigger this to reset pagination pointer when search change
  searchChanged() {
    this.p = 1;
  }

  initiateData() {
    this.subscription = this.dataFilterService.initiateData().subscribe(items => {
      this.dataItems = Object.assign(
        {},
        {
          dataElements: items[0],
          indicators: items[1],
          dataElementGroups: items[3],
          indicatorGroups: items[2],
          categoryOptions: items[5],
          dataSets: items[4],
          programs: items[6],
          programIndicators: items[7],
          dataSetGroups: [
            {id: '', name: 'Reporting Rate'},
            {id: '.REPORTING_RATE_ON_TIME', name: 'Reporting Rate on time'},
            {id: '.ACTUAL_REPORTS', name: 'Actual Reports Submitted'},
            {id: '.ACTUAL_REPORTS_ON_TIME', name: 'Reports Submitted on time'},
            {id: '.EXPECTED_REPORTS', name: 'Expected Reports'}
          ]
        }
      );
      this.loading = false;
      this.dataGroups = this.groupList();
      this.availableItems = this.dataItemList(this._selectedItems, this.selectedGroup);

      // /**
      //  * Detect changes manually
      //  */
      // this.changeDetector.detectChanges();
    });
  }

  setSelectedGroup(group, listArea, event) {
    event.stopPropagation();
    this.listchanges = '';
    this.selectedGroup = {...group};
    this.availableItems = this.dataItemList(this._selectedItems, group);
    this.showGroups = false;
    this.p = 1;
    listArea.scrollTop = 0;
  }

  getSelectedOption(): any[] {
    const someArr = [];
    this.dataFilterOptions.forEach(val => {
      if (val.selected) {
        someArr.push(val);
      }
    });
    return _.map(someArr, 'prefix');
  }

  // get data Items data_element, indicators, dataSets
  getDataItems() {
    const dataElements = [];
    this.dataItems.dataElements.forEach(dataelement => {
      dataElements.push(...this.getDetailedDataElements(dataelement));
    });
    return {
      de: dataElements,
      in: this.dataItems.indicators,
      ds: this.dataItems.dataSets,
      pi: this.dataItems.programIndicators
    };
  }

  // this function helps you to get the detailed metadata
  getDetailedDataElements(dataElement) {
    const dataElements = [];
    const categoryCombo = this.getCategoryCombo(dataElement.categoryCombo.id);

    dataElements.push({
      dataElementId: dataElement.id,
      id: dataElement.id,
      name: dataElement.name + '',
      dataSetElements: dataElement.dataSetElements
    });

    categoryCombo.categoryOptionCombos.forEach(option => {
      if (option.name !== 'default') {
        dataElements.push({
          dataElementId: dataElement.id,
          id: dataElement.id + '.' + option.id,
          name: dataElement.name + ' ' + option.name,
          dataSetElements: dataElement.dataSetElements
        });
      }
    });

    return dataElements;
  }

  // Helper to get the data elements option
  getCategoryCombo(uid): any {
    let category = null;
    this.dataItems.categoryOptions.forEach(val => {
      if (val.id === uid) {
        category = val;
      }
    });
    return category;
  }

  // Helper function to get data groups
  getData() {
    return {
      dx: this.dataItems.dataElementGroups,
      in: this.dataItems.indicatorGroups,
      ds: this.dataItems.dataSetGroups,
      pr: this.dataItems.programs,
      fn: this.dataItems.functions
    };
  }

  // get the data list do display
  dataItemList(selectedItems, group) {
    const currentList = [];
    const selectedOptions = this.getSelectedOption();
    const data: any = this.getDataItems();

    // check if data element is in a selected group
    if (_.includes(selectedOptions, 'ALL') || _.includes(selectedOptions, 'de')) {
      if (group.id === 'ALL') {
        currentList.push(...data.de);
      } else {
        if (group.hasOwnProperty('dataElements')) {
          const newArray = _.filter(data.de, dataElement => {
            return _.includes(_.map(group.dataElements, 'id'), dataElement.dataElementId);
          });
          currentList.push(...newArray);
        }
      }
    }

    // check if data indicators are in a selected group
    if (_.includes(selectedOptions, 'ALL') || _.includes(selectedOptions, 'in')) {
      if (group.id === 'ALL') {
        currentList.push(...data.in);
      } else {
        if (group.hasOwnProperty('indicators')) {
          const newArray = _.filter(data.in, indicator => {
            return _.includes(_.map(group.indicators, 'id'), indicator['id']);
          });
          currentList.push(...newArray);
        }
      }
    }

    // check if data data sets are in a selected group
    if (_.includes(selectedOptions, 'ALL') || _.includes(selectedOptions, 'ds')) {
      if (group.id === 'ALL') {
        this.dataItems.dataSetGroups.forEach(groupObject => {
          currentList.push(
            ...data.ds.map(datacv => {
              return {id: datacv.id + groupObject.id, name: groupObject.name + ' ' + datacv.name};
            })
          );
        });
      } else if (!group.hasOwnProperty('indicators') && !group.hasOwnProperty('dataElements')) {
        currentList.push(
          ...data.ds.map(datacv => {
            return {id: datacv.id + group.id, name: group.name + ' ' + datacv.name};
          })
        );
      }
    }
    // check if program
    if (_.includes(selectedOptions, 'ALL') || _.includes(selectedOptions, 'pr')) {
      if (group.id === 'ALL') {
        currentList.push(...data.pi);
      } else {
        if (group.hasOwnProperty('programIndicators')) {
          const newArray = _.filter(data.pi, indicator => {
            return _.includes(_.map(group.programIndicators, 'id'), indicator['id']);
          });
          currentList.push(...newArray);
        }
      }
    }

    const currentListWithOutHiddenItems = _.filter(currentList, item => {
      return !_.includes(this.hiddenDataElements, item['id']);
    });

    return _.sortBy(_.filter(currentListWithOutHiddenItems, (item: any) => !_.find(selectedItems, ['id', item.id])), [
      'name'
    ]);
  }

  // Get group list to display
  groupList() {
    this.need_groups = true;
    const currentGroupList = [];
    const options = this.getSelectedOption();
    const data = this.getData();

    // currentGroupList.push(...[{id:'ALL',name:'All Tables'}]);
    if (_.includes(options, 'ALL') || _.includes(options, 'de')) {
      currentGroupList.push(...data.dx);
    }

    if (_.includes(options, 'ALL') || _.includes(options, 'in')) {
      if (options.length === 1 && _.includes(options, 'in')) {
        currentGroupList.push(...data.in);
      } else {
        currentGroupList.push(
          ...data.in.map(indicatorGroup => {
            return {
              id: indicatorGroup.id,
              name: indicatorGroup.name + ' - Computed',
              indicators: indicatorGroup.indicators
            };
          })
        );
      }
    }

    if (_.includes(options, 'ALL') || _.includes(options, 'pr')) {
      currentGroupList.push(...data.pr);
    }

    if (_.includes(options, 'ALL') || _.includes(options, 'ds')) {
      currentGroupList.push(...data.ds);
    }

    if (_.includes(options, 'ALL') || _.includes(options, 'fn')) {
      currentGroupList.push(...data.fn);
    }

    if (_.includes(options, 'ds')) {
      this.need_groups = false;
    }

    return _.sortBy(currentGroupList, ['name']);
  }

  // this will add a selected item in a list function
  addSelected(item, event) {
    event.stopPropagation();
    const itemIndex = _.findIndex(this.availableItems, item);

    this.availableItems = [...this.availableItems.slice(0, itemIndex), ...this.availableItems.slice(itemIndex + 1)];

    if (!_.find(this._selectedItems, ['id', item.id])) {
      this._selectedItems = [...this._selectedItems, item];
    }

    this.selectedItems$ = of(this._selectedItems);
  }

  // Remove selected Item
  removeSelected(item, event) {
    event.stopPropagation();
    const itemIndex = _.findIndex(this._selectedItems, item);

    this._selectedItems = [...this._selectedItems.slice(0, itemIndex), ...this._selectedItems.slice(itemIndex + 1)];

    if (!_.find(this.availableItems, ['id', item.id])) {
      this.availableItems = [...this.availableItems, item];
    }

    this.selectedItems$ = of(this._selectedItems);
  }

  getAutogrowingTables(selections) {
    const autogrowings = [];
    selections.forEach(value => {
      if (value.hasOwnProperty('programType')) {
        autogrowings.push(value);
      }
    });
    return autogrowings;
  }

  getFunctions(selections) {
    const mappings = [];
    selections.forEach(value => {
      const dataElementId = value.id.split('.');
      this.functionMappings.forEach(mappedItem => {
        const mappedId = mappedItem.split('_');
        if (dataElementId[0] === mappedId[0]) {
          mappings.push({id: value.id, func: mappedId[1]});
        }
      });
    });
    return mappings;
  }

  // selecting all items
  selectAllItems(event) {
    event.stopPropagation();

    this.availableItems.forEach(item => {
      if (!_.find(this._selectedItems, ['id', item.id])) {
        this._selectedItems = [...this._selectedItems, item];
      }
    });

    this.availableItems = [];

    this.selectedItems$ = of(this._selectedItems);
  }

  // selecting all items
  deselectAllItems(e) {
    e.stopPropagation();
    this._selectedItems.forEach(item => {
      if (!_.find(this.availableItems, ['id', item.id])) {
        this.availableItems = [...this.availableItems, item];
      }
    });

    this._selectedItems = [];

    this.selectedItems$ = of(this._selectedItems);
  }

  // Check if item is in selected list
  inSelected(item, list) {
    let checker = false;
    for (const per of list) {
      if (per.id === item.id) {
        checker = true;
      }
    }
    return checker;
  }

  // action that will fire when the sorting of selected data is done
  transferDataSuccess(data, current) {
    if (data.dragData.id === current.id) {
      console.log('Droping in the same area');
    } else {
      const number = this.getDataPosition(data.dragData.id) > this.getDataPosition(current.id) ? 0 : 1;
      this.deleteData(data.dragData);
      this.insertData(data.dragData, current, number);
    }
  }

  emit(e) {
    e.stopPropagation();
    this.onDataUpdate.emit({
      itemList: this._selectedItems,
      need_functions: this.getFunctions(this._selectedItems),
      auto_growing: this.getAutogrowingTables(this._selectedItems),
      selectedData: {name: 'dx', value: this.getDataForAnalytics(this._selectedItems)},
      hideQuarter: this.hideQuarter,
      hideMonth: this.hideMonth
    });
  }

  // helper method to find the index of dragged item
  getDataPosition(dataId) {
    let dataIndex = null;
    this._selectedItems.forEach((data, index) => {
      if (data.id === dataId) {
        dataIndex = index;
      }
    });
    return dataIndex;
  }

  // help method to delete the selected Data in list before inserting it in another position
  deleteData(dataToDelete) {
    this._selectedItems.forEach((data, dataIndex) => {
      if (dataToDelete.id === data.id) {
        this._selectedItems.splice(dataIndex, 1);
      }
    });

    this.selectedItems$ = of(this._selectedItems);
  }

  // Helper method to insert Data in new position after drag drop event
  insertData(Data_to_insert, current_Data, num: number) {
    this._selectedItems.forEach((Data, Data_index) => {
      if (current_Data.id === Data.id && !this.checkDataAvailabilty(Data_to_insert, this._selectedItems)) {
        this._selectedItems.splice(Data_index + num, 0, Data_to_insert);
      }
    });

    this.selectedItems$ = of(this._selectedItems);
  }

  // check if orgunit already exist in the orgunit display list
  checkDataAvailabilty(Data, array): boolean {
    let checker = false;
    for (const per of array) {
      if (per.id === Data.id) {
        checker = true;
      }
    }
    return checker;
  }

  getDataForAnalytics(selectedData) {
    let dataForAnalytics = '';
    let counter = 0;
    selectedData.forEach(dataValue => {
      const dataElementId = dataValue.id.split('.');
      if (dataValue.hasOwnProperty('programType')) {
      } else {
        let mapped = false;
        this.functionMappings.forEach(mappedItem => {
          const mappedId = mappedItem.split('_');
          if (dataElementId[0] === mappedId[0]) {
            mapped = true;
          }
        });
        if (mapped) {
        } else {
          dataForAnalytics += counter === 0 ? dataValue.id : ';' + dataValue.id;
          counter++;
        }
      }
    });
    return dataForAnalytics;
  }

  close(e) {
    e.stopPropagation();
    this.onDataFilterClose.emit(true);
  }

  toggleDataFilterOption(toggledOption, event) {
    event.stopPropagation();
    const multipleSelection = event.ctrlKey ? true : false;

    this.dataFilterOptions = this.dataFilterOptions.map(option => {
      const newOption: any = {...option};

      if (toggledOption.prefix === 'ALL') {
        if (newOption.prefix !== 'ALL') {
          newOption.selected = false;
        } else {
          newOption.selected = !toggledOption.selected;
        }
      } else {
        if (newOption.prefix === toggledOption.prefix) {
          newOption.selected = !newOption.selected;
        }

        if (toggledOption.prefix === 'ALL') {
          if (newOption.prefix !== 'ALL' && toggledOption.selected) {
            newOption.selected = false;
          }
        } else {
          if (newOption.prefix === 'ALL') {
            newOption.selected = false;
          }
        }

        if (!multipleSelection && toggledOption.prefix !== newOption.prefix) {
          newOption.selected = false;
        }
      }

      return newOption;
    });

    this.selectedGroup = {id: 'ALL', name: 'All'};
    this.dataGroups = this.groupList();

    this.availableItems = this.dataItemList(this._selectedItems, this.selectedGroup);
    this.p = 1;
    this.listchanges = '';
  }

  toggleDataFilterGroupList(e) {
    e.stopPropagation();
    this.showGroups = !this.showGroups;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
