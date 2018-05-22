import {Component, OnInit, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef, OnDestroy} from '@angular/core';
import {TreeComponent, TREE_ACTIONS, IActionMapping} from 'angular-tree-component';
import {OrgUnitService} from './org-unit.service';
import {MultiselectComponent} from './multiselect/multiselect.component';
import {Subscription} from 'rxjs/Subscription';
import * as _ from 'lodash';

@Component({
  selector: 'app-org-unit-filter',
  templateUrl: './org-unit-filter.component.html',
  styleUrls: ['./org-unit-filter.component.css']
})
export class OrgUnitFilterComponent implements OnInit, OnDestroy {
  // the object that will carry the output value you can send one from outside to config start values
  @Input() orgUnitModel: any = {
   selectionMode: 'orgUnit',
   selectedLevels: [],
    showUpdateButton: true,
    selectedGroups: [],
    orgUnitLevels: [],
    orgUnitGroups: [],
    selectedOrgUnits: [],
    userOrgUnits: [],
    type: 'report', // can be 'data_entry'
    selectedUserOrgUnits: []
  };
  initial_usr_orgunit = [];
  subscription: Subscription;
  // The organisation unit configuration object This will have to come from outside.
  @Input() orgUnitTreeConfig: any = {
    show_search: true,
    search_text: 'Search',
    level: null,
    loading: true,
    loading_message: 'Loading Organisation units...',
    multiple: true,
    multiple_key: 'none', // can be control or shift
    placeholder: 'Select Organisation Unit'
  };

  @Output() onOrgUnitUpdate: EventEmitter<any> = new EventEmitter<any>();
  @Output() onOrgUnitInit: EventEmitter<any> = new EventEmitter<any>();
  @Output() onOrgUnitModelUpdate: EventEmitter<any> = new EventEmitter<any>();
  @Output() onOrgUnitClose: EventEmitter<boolean> = new EventEmitter<boolean>();

  orgUnit: any = {};
  @ViewChild('orgtree')
  orgtree: TreeComponent;

  @ViewChild('period_selector')
  period_selector: MultiselectComponent;

  organisationunits: any[] = [];
  selectedOrgUnits: any[] = [];

  // this variable controls the visibility of of the tree
  showOrgTree = false;

  customTemplateStringOrgunitOptions: any;

  userOrgUnitsTypes: Array<any> = [
    {id: 'USER_ORGUNIT', name: 'User Org Unit', shown: true},
    {id: 'USER_ORGUNIT_CHILDREN', name: 'User sub-units', shown: true},
    {id: 'USER_ORGUNIT_GRANDCHILDREN', name: 'User sub-x2-units', shown: true}
  ];
  showOrgUnitSettings: boolean;

  constructor(private orgunitService: OrgUnitService,
              private changeDetector: ChangeDetectorRef) {
    if (!this.orgUnitTreeConfig.hasOwnProperty('multiple_key')) {
      this.orgUnitTreeConfig.multiple_key = 'none';
    }
    this.showOrgUnitSettings = false;
  }

  updateModelOnSelect(data) {
    if (!this.orgUnitModel.showUpdateButton) {
      this.displayOrgTree();
    }
  }

  ngOnInit() {
    if (this.orgUnitTreeConfig.multiple) {
      if (this.orgUnitTreeConfig.multiple_key === 'none') {
        const actionMapping: IActionMapping = {
          mouse: {
            dblClick: TREE_ACTIONS.TOGGLE_EXPANDED,
            click: (node, tree, $event) => TREE_ACTIONS.TOGGLE_ACTIVE_MULTI(node, tree, $event)
          }
        };
        this.customTemplateStringOrgunitOptions = {actionMapping};

      } else if (this.orgUnitTreeConfig.multiple_key === 'control') {
        // multselect using control key
        const actionMapping: IActionMapping = {
          mouse: {
            click: (node, tree, $event) => {
              $event.ctrlKey
                ? TREE_ACTIONS.TOGGLE_ACTIVE_MULTI(node, tree, $event)
                : TREE_ACTIONS.TOGGLE_SELECTED(node, tree, $event);
            }
          }
        };
        this.customTemplateStringOrgunitOptions = {actionMapping};
      } else if (this.orgUnitTreeConfig.multiple_key === 'shift') {
        // multselect using shift key
        const actionMapping: IActionMapping = {
          mouse: {
            click: (node, tree, $event) => {
              $event.shiftKey
                ? TREE_ACTIONS.TOGGLE_ACTIVE_MULTI(node, tree, $event)
                : TREE_ACTIONS.TOGGLE_SELECTED(node, tree, $event);
            }
          }
        };
        this.customTemplateStringOrgunitOptions = {actionMapping};
      }

    } else {
      const actionMapping: IActionMapping = {
        mouse: {
          dblClick: TREE_ACTIONS.TOGGLE_EXPANDED,
          click: (node, tree, $event) => TREE_ACTIONS.TOGGLE_SELECTED(node, tree, $event)
        }
      };
      this.customTemplateStringOrgunitOptions = {actionMapping};
    }

    /**
     * Update user orgunit with meaningfull names
     */
    this.orgUnitModel.selectedUserOrgUnits = this.orgUnitModel.selectedUserOrgUnits.map((userOrgUnit) => {
      return _.find(this.userOrgUnitsTypes, ['id', userOrgUnit.id]);
    }).filter((selectedUserOrgUnits) => selectedUserOrgUnits);


    // if (this.orgunitService.nodes === null) {
    this.subscription = this.orgunitService.getOrgunitLevelsInformation()
      .subscribe((data: any) => {
          // assign urgunit levels and groups to variables
          this.orgUnitModel.orgUnitLevels = data.organisationUnitLevels;

          /**
           * Update level with meaningful names
           */
          this.orgUnitModel.selectedLevels = this.orgUnitModel.selectedLevels.map((selectedLevel) => {
            const newSelectedLevel = _.find(this.orgUnitModel.orgUnitLevels, ['level', parseInt(selectedLevel.level, 10)]);

            return newSelectedLevel ? newSelectedLevel : {
              level: selectedLevel.level,
              name: 'Level ' + selectedLevel.level
            };
          });

          // setting organisation groups
          this.orgunitService.getOrgunitGroups().subscribe(groups => {//noinspection TypeScriptUnresolvedVariable
            this.orgUnitModel.orgUnitGroups = groups;
          });

          // identify currently logged in usser
        this.subscription = this.orgunitService.getUserInformation(this.orgUnitModel.type).subscribe((userOrgunit: any) => {
              if (userOrgunit !== null) {
                const level = this.orgunitService.getUserHighestOrgUnitlevel(userOrgunit);
                this.orgUnitModel.userOrgUnits = this.orgunitService.getUserOrgUnits(userOrgunit);
                this.orgunitService.userOrgUnits = this.orgunitService.getUserOrgUnits(userOrgunit);
                if (this.orgUnitModel.selectionMode === 'orgUnit' && this.orgUnitModel.selectedOrgUnits.length === 0) {
                  this.orgUnitModel.selectedOrgUnits = this.orgUnitModel.userOrgUnits;
                }
                const all_levels = data.pager.total;
                const orgunits = this.orgunitService.getuserOrganisationUnitsWithHighestlevel(level, userOrgunit);
                const use_level = parseInt(all_levels, 10) - (parseInt(level, 10) - 1);
                // load inital orgiunits to speed up loading speed
                this.subscription = this.orgunitService.getInitialOrgunitsForTree(orgunits).subscribe(
                  (initial_data) => {
                    this.organisationunits = initial_data;
                    this.orgUnitTreeConfig.loading = false;
                    // a hack to make sure the user orgunit is not triggered on the first time
                    this.initial_usr_orgunit = [{id: 'USER_ORGUNIT', name: 'User Org unit'}];
                    // after done loading initial organisation units now load all organisation units
                    const fields = this.orgunitService.generateUrlBasedOnLevels(use_level);
                    this.subscription = this.orgunitService.getAllOrgunitsForTree1(fields, orgunits).subscribe((items: any) => {

                        this.organisationunits = this.sortOrganisationUnitTree([
                          {
                            ...items[0],
                            isExpanded: true
                          },
                          ...items.slice(1)
                        ]);
                        this.toggleNodeExpand(items[0].id, this.orgtree);
                        const combinedOrgUnits = this.getCombinedOrgUnitList(
                          this.organisationunits, this.orgUnitModel.orgUnitLevels.length);
                        this.orgUnitModel.selectedOrgUnits = this.orgUnitModel.selectedOrgUnits.map((orgUnit) => {
                          return _.find(combinedOrgUnits, ['id', orgUnit.id]);
                        });


                        // activate organisation units
                        for (const active_orgunit of this.orgUnitModel.selectedOrgUnits) {
                          this.activateNode(active_orgunit.id, this.orgtree, active_orgunit.id === this.orgUnitModel.userOrgUnits.id);

                        }


                        // this.prepareOrganisationUnitTree(this.organisationunits, 'parent');

                        /**
                         * Detect changes manually
                         */
                        this.changeDetector.detectChanges();
                      },
                      () => {
                        this.orgUnitTreeConfig.loading = false;
                      }
                    );
                  },
                  () => {
                    this.orgUnitTreeConfig.loading = false;
                  }
                );
              }
            });
        });
  }

  getCombinedOrgUnitList(orgUnitList, levelCount) {
    let combinedList = [];
    for (let level = 1; level <= levelCount; level++) {
      if (level === 1) {
        combinedList = [...orgUnitList];
      }

      if (level > 1) {
        combinedList.filter((list) => list.level === level - 1).forEach((orgUnit) => {
          if (orgUnit.children) {
            combinedList = [...combinedList, ...orgUnit.children];
          }
        });

      }
    }

    return combinedList;
  }

  ngOnDestroy() {

    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  clearAll() {
    for (const active_orgunit of this.orgUnitModel.selectedOrgUnits) {
      this.deActivateNode(active_orgunit.id, this.orgtree, null);
    }
  }

  setType(type: string, e) {
    console.log(type)
    e.stopPropagation();
    this.orgUnitModel.selectionMode = type;
    if (type !== 'orgUnit') {
      this.orgUnitModel.selectedUserOrgUnits = [];
    }
    if (type !== 'Level') {
      this.orgUnitModel.selectedLevels = [];
    }
    if (type !== 'Group') {
      this.orgUnitModel.selectedGroups = [];
    }
  }

  // display Orgunit Tree
  displayOrgTree() {
    // this.showOrgTree = !this.showOrgTree;
  }

  activateNode(nodeId: any, nodes, first) {
    setTimeout(() => {
      const node = nodes.treeModel.getNodeById(nodeId);
      if (node) {
        node.setIsActive(true, true);
      }
      if (first && node) {
        node.toggleExpanded();
      }
    }, 0);
  }

  toggleNodeExpand(nodeId: any, nodes) {
    setTimeout(() => {
      const node = nodes.treeModel.getNodeById(nodeId);
      if (node) {
        node.toggleExpanded();
      }
    }, 0);
  }

  // a method to activate the model
  deActivateNode(nodeId: any, nodes, event) {
    setTimeout(() => {
      const node = nodes.treeModel.getNodeById(nodeId);
      if (node) {
        node.setIsActive(false, true);
      }
    }, 0);
    if (event !== null) {
      event.stopPropagation();
    }
  }

  // check if orgunit already exist in the orgunit display list
  checkOrgunitAvailabilty(orgunit, array): boolean {
    let checker = false;
    array.forEach((value) => {
      if (value.id === orgunit.id) {
        checker = true;
      }
    });
    return checker;
  }

  // action to be called when a tree item is deselected(Remove item in array of selected items
  deactivateOrg($event) {
    if (this.orgUnitModel.selectionMode === 'Usr_orgUnit') {
      this.orgUnitModel.selectionMode = 'orgUnit';
    }

    this.orgUnitModel.selectedOrgUnits.forEach((item, index) => {
      if ($event.node.data.id === item.id) {
        this.orgUnitModel.selectedOrgUnits.splice(index, 1);
      }
    });
  }

  // add item to array of selected items when item is selected
  activateOrg($event) {
    if (this.orgUnitModel.selectionMode === 'Usr_orgUnit') {
      this.orgUnitModel.selectionMode = 'orgUnit';
    }

    this.selectedOrgUnits = [$event.node.data];
    if (!this.checkOrgunitAvailabilty($event.node.data, this.orgUnitModel.selectedOrgUnits)) {
      this.orgUnitModel.selectedOrgUnits.push($event.node.data);
    }

    this.orgUnit = $event.node.data;
  }

  emit(e) {
    e.stopPropagation();
    const mapper = {};
    this.orgUnitModel.selectedOrgUnits.forEach(function (orgUnit) {
      if (!mapper[orgUnit.level]) {
        mapper[orgUnit.level] = [];
      }
      mapper[orgUnit.level].push(orgUnit);
    });
    const arrayed_org_units = [];
    Object.keys(mapper).forEach(function (orgUnits) {
      arrayed_org_units.push(mapper[orgUnits]);
    });
    this.onOrgUnitUpdate.emit({
      starting_name: this.getProperPreOrgunitName(),
      arrayed_org_units: arrayed_org_units,
      items: this.getSelectedOrgUnitItems(this.orgUnitModel),
      name: 'ou',
      value: this.getOrgUnitsForAnalytics(this.orgUnitModel, false)
    });
    this.onOrgUnitModelUpdate.emit(this.orgUnitModel);
  }

  getSelectedOrgUnitItems(orgUnitModel: any) {
    return [
      ...orgUnitModel.selectedOrgUnits,
      ...orgUnitModel.selectedLevels.map((levelObject) => {
      return {id: 'LEVEL-' + levelObject.level, name: levelObject.name};
    }),
      ...orgUnitModel.selectedGroups.map((levelObject) => {
        return {id: 'OU_GROUP-' + levelObject.id, name: levelObject.name};
      })
    ];
  }

  // set selected groups
  setSelectedGroups(selectedGroups) {
    this.orgUnitModel.selectedGroups = selectedGroups;
    this.onOrgUnitModelUpdate.emit(this.orgUnitModel);
  }

  // set selected groups
  setSelectedUserOrg(selectedUserOrgUnits) {
    this.orgUnitModel.selectedUserOrgUnits = selectedUserOrgUnits;
  }

  // set selected groups
  setSelectedLevels(selectedLevels) {
    this.orgUnitModel.selectedLevels = selectedLevels;
  }

  sortOrganisationUnitTree(organisationUnits: any[]) {
    return _.map(_.sortBy(organisationUnits, 'name'), (orgUnit) => {
      return orgUnit.children ? {
        ...orgUnit,
        children: this.sortOrganisationUnitTree(orgUnit.children)
      } : orgUnit;
    });
  }

  // prepare a proper name for updating the organisation unit display area.
  getProperPreOrgunitName(): string {
    let name = '';
    if (this.orgUnitModel.selectionMode === 'Group') {
      name = (this.orgUnitModel.selectedGroups.length === 0) ?
        '' : this.orgUnitModel.selectedGroups.map((group) => group.name).join(', ') + ' in';
    } else if (this.orgUnitModel.selectedUserOrgUnits.length !== 0) {
      name = (this.orgUnitModel.selectedUserOrgUnits.length === 0) ?
        '' : this.orgUnitModel.selectedUserOrgUnits.map((level) => level.name).join(', ');
    } else if (this.orgUnitModel.selectionMode === 'Level') {
      name = (this.orgUnitModel.selectedLevels.length === 0) ?
        '' : this.orgUnitModel.selectedLevels.map((level) => level.name).join(', ') + ' in';
    } else {
      name = '';
    }
    return name;
  }

  // a function to prepare a list of organisation units for analytics
  getOrgUnitsForAnalytics(orgUnitModel: any, with_children: boolean): string {
    const orgUnits = [];
    let organisation_unit_analytics_string = '';
    // if the selected orgunit is user org unit
    if (orgUnitModel.selectedUserOrgUnits.length !== 0) {
      orgUnitModel.selectedUserOrgUnits.forEach((orgunit) => {
        organisation_unit_analytics_string += orgunit.id + ';';
      });

      // }
    } else {
      // if there is only one organisation unit selected
      if (orgUnitModel.selectedOrgUnits.length === 1) {
        const detailed_orgunit = this.orgtree.treeModel.getNodeById(orgUnitModel.selectedOrgUnits[0].id);
        orgUnits.push(detailed_orgunit.id);
        if (detailed_orgunit.hasOwnProperty('children') && with_children) {
          for (const orgunit of detailed_orgunit.children) {
            orgUnits.push(orgunit.id);
          }
        }

      } else {
        // If there is more than one organisation unit selected
        orgUnitModel.selectedOrgUnits.forEach((orgunit) => {
          orgUnits.push(orgunit.id);
        });
      }
      if (orgUnitModel.selectionMode === 'orgUnit') {

      }
      if (orgUnitModel.selectionMode === 'Level') {
        orgUnitModel.selectedLevels.forEach((level) => {
          organisation_unit_analytics_string += 'LEVEL-' + level.level + ';';
        });
      }
      if (orgUnitModel.selectionMode === 'Group') {
        orgUnitModel.selectedGroups.forEach((group) => {
          organisation_unit_analytics_string += 'OU_GROUP-' + group.id + ';';
        });
      }
    }
    return organisation_unit_analytics_string + orgUnits.join(';');
  }

  close(e) {
    e.stopPropagation();
    this.changeDetector.detach();
    this.onOrgUnitClose.emit(true);
  }

  toggleOrgUnitSettings(e) {
    e.stopPropagation();
    this.showOrgUnitSettings = !this.showOrgUnitSettings;
  }
}
