import * as _ from 'lodash';
import {DashboardAction, DashboardActions} from '../actions/dashboard.actions';
import * as dashboardHelpers from '../helpers';
import {Dashboard} from '../../models/dashboard';
import {DashboardSharing} from '../../models/dashboard-sharing';
import {DashboardSearchItem, INITIAL_DASHBOARD_SEARCH_ITEM} from '../../models/dashboard-search-item';

export interface DashboardState {
  currentDashboardPage: number;
  dashboardPageNumber: number;
  dashboardPerPage: number;
  currentDashboard: string;
  loading: boolean;
  dashboardsLoaded: boolean;
  dashboards: Dashboard[];
  activeDashboards: Dashboard[];
  dashboardSharing: { [id: string]: DashboardSharing };
  showBookmarked: boolean;
  dashboardSearchItem: DashboardSearchItem;
  dashboardSearchTerm: string;
  preferPaginatedDashboards: boolean;
}

export const INITIAL_DASHBOARD_STATE: DashboardState = {
  currentDashboardPage: 0,
  dashboardPageNumber: 0,
  dashboardPerPage: 8,
  currentDashboard: undefined,
  loading: true,
  dashboardsLoaded: false,
  dashboards: [],
  dashboardSharing: null,
  showBookmarked: false,
  activeDashboards: [],
  dashboardSearchItem: INITIAL_DASHBOARD_SEARCH_ITEM,
  dashboardSearchTerm: '',
  preferPaginatedDashboards: false
};


export function dashboardReducer(state: DashboardState = INITIAL_DASHBOARD_STATE,
                                 action: DashboardAction) {
  switch (action.type) {
    case DashboardActions.LOAD_FAIL:
      return {
        ...state,
        loading: false
      };
    case DashboardActions.LOAD_SUCCESS: {
      const newDashboards: Dashboard[] = _.map(
        action.payload.dashboards,
        (dashboardObject: any) =>
          dashboardHelpers.mapStateToDashboardObject(
            dashboardObject,
            null,
            action.payload.currentUser.id
          )
      );

      const filteredDashboards = dashboardHelpers.getFilteredDashboards(newDashboards, state.showBookmarked);

      return {
        ...state,
        dashboards: [...newDashboards],
        dashboardsLoaded: true,
        loading: false,
        activeDashboards: [...filteredDashboards],
        dashboardPageNumber: Math.ceil(
          filteredDashboards.length / state.dashboardPerPage
        )
      };

    }

    case DashboardActions.LOAD_OPTIONS_SUCCESS: {
      const newDashboardsWithOptions: Dashboard[] = _.map(
        _.map(state.dashboards, (dashboardObject: Dashboard) => {
          const dashboardOption = _.find(action.payload.dashboardOptions, [
            'id',
            dashboardObject.id
          ]);

          return dashboardOption
            ? {
              ...dashboardObject,
              ...dashboardOption
            }
            : dashboardObject;
        }),
        (dashboardObject: any) =>
          dashboardHelpers.mapStateToDashboardObject(
            dashboardObject,
            null,
            action.payload.currentUser.id
          )
      );
      const filteredDashboards = dashboardHelpers.getFilteredDashboards(newDashboardsWithOptions, state.showBookmarked);

      return {
        ...state,
        dashboards: [...newDashboardsWithOptions],
        activeDashboards: [...filteredDashboards],
        currentDashboardPage: dashboardHelpers.getCurrentPage(
          filteredDashboards,
          action.payload,
          state.dashboardPerPage
        )
      };
    }
    case DashboardActions.SET_CURRENT: {
      return {
        ...state,
        currentDashboard: action.payload,
        currentDashboardPage: dashboardHelpers.getCurrentPage(
          state.activeDashboards,
          action.payload,
          state.dashboardPerPage
        )
      };
    }

    case DashboardActions.CHANGE_CURRENT_PAGE:
      return {
        ...state,
        currentDashboardPage: state.currentDashboardPage + action.payload
      };

    case DashboardActions.CREATE: {
      const newDashboardsWithToBeCreated: Dashboard[] = [
        ..._.sortBy(
          [
            ...state.dashboards,
            dashboardHelpers.mapStateToDashboardObject(
              {name: action.payload},
              'create'
            )
          ],
          ['name']
        )
      ];

      const filteredDashboards = dashboardHelpers.getFilteredDashboards(newDashboardsWithToBeCreated, state.showBookmarked);
      return {
        ...state,
        dashboards: [...newDashboardsWithToBeCreated],
        activeDashboards: [...filteredDashboards],
        currentDashboardPage: dashboardHelpers.getCurrentPage(
          filteredDashboards,
          '0',
          state.dashboardPerPage
        )
      };
    }

    case DashboardActions.CREATE_SUCCESS: {
      const createdDashboardIndex = _.findIndex(
        state.dashboards,
        _.find(state.dashboards, ['id', '0'])
      );

      const newDashboardsWithCreated =
        createdDashboardIndex !== -1
          ? [
            ...state.dashboards.slice(0, createdDashboardIndex),
            dashboardHelpers.mapStateToDashboardObject(
              action.payload,
              'created'
            ),
            ...state.dashboards.slice(createdDashboardIndex + 1)
          ]
          : state.dashboards;

      const filteredDashboards = dashboardHelpers.getFilteredDashboards(newDashboardsWithCreated, state.showBookmarked);

      return {
        ...state,
        dashboards: [...newDashboardsWithCreated],
        activeDashboards: [...filteredDashboards]
      };
    }

    case DashboardActions.RENAME: {
      const availableDashboard: Dashboard = _.find(state.dashboards, [
        'id',
        action.payload.id
      ]);
      const createdDashboardIndex = _.findIndex(
        state.dashboards,
        availableDashboard
      );

      const newDashboardsWithToBeUpdated =
        createdDashboardIndex !== -1
          ? [
            ...state.dashboards.slice(0, createdDashboardIndex),
            dashboardHelpers.mapStateToDashboardObject(
              availableDashboard,
              'update'
            ),
            ...state.dashboards.slice(createdDashboardIndex + 1)
          ]
          : state.dashboards;

      const filteredDashboards = dashboardHelpers.getFilteredDashboards(newDashboardsWithToBeUpdated, state.showBookmarked);

      return {
        ...state,
        dashboards: [...newDashboardsWithToBeUpdated],
        activeDashboards: [...filteredDashboards]
      };
    }

    case DashboardActions.RENAME_SUCCESS: {
      const renamedDashboardIndex = _.findIndex(
        state.dashboards,
        _.find(state.dashboards, ['id', action.payload.id])
      );

      const newDashboardsWithUpdated: Dashboard[] =
        renamedDashboardIndex !== -1
          ? _.sortBy(
          [
            ...state.dashboards.slice(0, renamedDashboardIndex),
            dashboardHelpers.mapStateToDashboardObject(
              action.payload,
              'updated'
            ),
            ...state.dashboards.slice(renamedDashboardIndex + 1)
          ],
          ['name']
          )
          : [...state.dashboards];

      const filteredDashboards = dashboardHelpers.getFilteredDashboards(newDashboardsWithUpdated, state.showBookmarked);
      return {
        ...state,
        dashboards: newDashboardsWithUpdated,
        activeDashboards: [...filteredDashboards],
        currentDashboardPage: dashboardHelpers.getCurrentPage(
          filteredDashboards,
          action.payload.id,
          state.dashboardPerPage
        )
      };
    }

    case DashboardActions.DELETE: {
      const dashboardToDelete = _.find(state.dashboards, [
        'id',
        action.payload
      ]);
      const dashboardToDeleteIndex = _.findIndex(
        state.dashboards,
        dashboardToDelete
      );

      const newDashboardWithToDelete = dashboardToDeleteIndex !== -1
        ? [
          ...state.dashboards.slice(0, dashboardToDeleteIndex),
          dashboardHelpers.mapStateToDashboardObject(
            dashboardToDelete,
            'delete'
          ),
          ...state.dashboards.slice(dashboardToDeleteIndex + 1)
        ]
        : [...state.dashboards];

      return {
        ...state,
        dashboards: [...newDashboardWithToDelete],
        activeDashboards: [...dashboardHelpers.getFilteredDashboards(newDashboardWithToDelete, state.showBookmarked)]
      };
    }
    case DashboardActions.COMMIT_DELETE: {
      const dashboardDeletedIndex = _.findIndex(
        state.dashboards,
        _.find(state.dashboards, ['id', action.payload])
      );

      const newDashboardWithDeletedRemoved = dashboardDeletedIndex !== -1
        ? [
          ...state.dashboards.slice(0, dashboardDeletedIndex),
          ...state.dashboards.slice(dashboardDeletedIndex + 1)
        ]
        : [...state.dashboards];
      return {
        ...state,
        dashboards: [...newDashboardWithDeletedRemoved],
        activeDashboards: [...dashboardHelpers.getFilteredDashboards(newDashboardWithDeletedRemoved, state.showBookmarked)]
      };
    }

    case DashboardActions.CHANGE_PAGE_ITEMS: {
      return {
        ...state,
        dashboardPerPage: action.payload,
        currentDashboardPage: dashboardHelpers.getCurrentPage(
          state.activeDashboards,
          state.currentDashboard,
          action.payload
        ),
        dashboardPageNumber: Math.ceil(state.activeDashboards.length / action.payload)
      };
    }

    case DashboardActions.HIDE_MENU_NOTIFICATION_ICON: {
      const correspondingDashboard: Dashboard = _.find(state.dashboards, [
        'id',
        action.payload.id
      ]);
      const correspondingDashboardIndex = _.findIndex(
        state.dashboards,
        correspondingDashboard
      );

      const newDashboardsWithHiddenNotification = [
        ...state.dashboards.slice(0, correspondingDashboardIndex),
        {
          ...correspondingDashboard,
          details: {
            ...correspondingDashboard.details,
            showIcon: false
          }
        },
        ...state.dashboards.slice(correspondingDashboardIndex + 1)
      ];

      return correspondingDashboardIndex !== -1
        ? {
          ...state,
          dashboards: [...newDashboardsWithHiddenNotification],
          activeDashboards: [
            ...dashboardHelpers.getFilteredDashboards(newDashboardsWithHiddenNotification, state.showBookmarked)]
        }
        : {
          ...state
        };
    }

    case DashboardActions.SEARCH_ITEMS: {
      return {
        ...state,
        dashboardSearchItem: {
          ...state.dashboardSearchItem,
          loading: true,
          loaded: false
        }
      };
    }

    case DashboardActions.UPDATE_SEARCH_RESULT: {
      return {
        ...state,
        dashboardSearchItem: dashboardHelpers.mapStateToDashboardSearchItems(
          state.dashboardSearchItem,
          action.payload
        )
      };
    }

    case DashboardActions.CHANGE_SEARCH_HEADER: {
      const clickedHeader = action.payload.header;

      return {
        ...state,
        dashboardSearchItem: dashboardHelpers.updateWithHeaderSelectionCriterias({
          ...state.dashboardSearchItem,
          headers: state.dashboardSearchItem.headers.map(header => {
            const newHeader: any = {...header};
            if (newHeader.name === clickedHeader.name) {
              newHeader.selected = clickedHeader.selected;
            }

            if (clickedHeader.name === 'all') {
              if (newHeader.name !== 'all' && clickedHeader.selected) {
                newHeader.selected = false;
              }
            } else {
              if (newHeader.name === 'all' && clickedHeader.selected) {
                newHeader.selected = false;
              }
            }

            if (
              !action.payload.multipleSelection &&
              clickedHeader.name !== newHeader.name
            ) {
              newHeader.selected = false;
            }

            return newHeader;
          })
        })
      };
    }

    case DashboardActions.LOAD_SHARING_DATA:
      return state;

    case DashboardActions.LOAD_SHARING_DATA_SUCCESS:
      return {
        ...state,
        dashboardSharing: {
          ...state.dashboardSharing,
          [action.payload.id]: action.payload
        }
      };

    case DashboardActions.UPDATE_SHARING_DATA: {
      const dashboardSharingToUpdate: DashboardSharing =
        state.dashboardSharing[state.currentDashboard];
      return {
        ...state,
        dashboardSharing: {
          ...state.dashboardSharing,
          [state.currentDashboard]: {
            ...dashboardSharingToUpdate,
            sharingEntity: action.payload
          }
        }
      };
    }

    case DashboardActions.DELETE_ITEM_SUCCESS: {
      const currentDashboard: Dashboard = _.find(state.dashboards, [
        'id',
        action.payload.dashboardId
      ]);
      const dashboardIndex = state.dashboards.indexOf(currentDashboard);

      const dashboardItemIndex = currentDashboard
        ? currentDashboard.dashboardItems.indexOf(
          _.find(currentDashboard.dashboardItems, [
            'id',
            action.payload.visualizationId
          ])
        )
        : -1;

      const newDashboardWithDeletedItem = dashboardIndex !== -1
        ? [
          ...state.dashboards.slice(0, dashboardIndex),
          {
            ...currentDashboard,
            dashboardItems: [
              ...currentDashboard.dashboardItems.slice(
                0,
                dashboardItemIndex
              ),
              ...currentDashboard.dashboardItems.slice(
                dashboardItemIndex + 1
              )
            ]
          },
          ...state.dashboards.slice(dashboardIndex + 1)
        ]
        : [...state.dashboards];

      return {
        ...state,
        dashboards: [...newDashboardWithDeletedItem],
        activeDashboards: [...newDashboardWithDeletedItem]
      };
    }

    case DashboardActions.BOOKMARK_DASHBOARD: {
      const bookmarkedDashboard: Dashboard = _.find(state.dashboards, [
        'id',
        action.payload.dashboardId
      ]);
      const dashboardIndex = state.dashboards.indexOf(bookmarkedDashboard);
      const newDashboardWithBookmarked = [
        ...state.dashboards.slice(0, dashboardIndex),
        {
          ...bookmarkedDashboard,
          details: {
            ...bookmarkedDashboard.details,
            bookmarked: action.payload.bookmarked
          }
        },
        ...state.dashboards.slice(dashboardIndex + 1)
      ];

      const filteredDashboards = dashboardHelpers.getFilteredDashboards(newDashboardWithBookmarked, state.showBookmarked);

      return dashboardIndex !== -1
        ? {
          ...state,
          dashboards: [...newDashboardWithBookmarked],
          activeDashboards: [...filteredDashboards],
          currentDashboardPage: dashboardHelpers.getCurrentPage(
            filteredDashboards,
            state.currentDashboard,
            state.dashboardPerPage
          )
        }
        : {...state};
    }

    case DashboardActions.TOGGLE_BOOKMARKED: {
      const showBookmarked = !state.showBookmarked;
      const filteredDashboards = dashboardHelpers.getFilteredDashboards(state.dashboards, showBookmarked);
      return {
        ...state,
        showBookmarked: showBookmarked,
        activeDashboards: [...filteredDashboards],
        currentDashboardPage: dashboardHelpers.getCurrentPage(
          filteredDashboards,
          state.currentDashboard,
          state.dashboardPerPage
        ),
        dashboardPageNumber: Math.ceil(
          filteredDashboards.length / state.dashboardPerPage
        )
      };
    }

    case DashboardActions.SET_SEARCH_TERM: {
      const filteredDashboards = dashboardHelpers.getFilteredDashboards(state.dashboards, state.showBookmarked, action.payload);
      return {
        ...state,
        dashboardSearchTerm: action.payload,
        activeDashboards: [...filteredDashboards],
        currentDashboardPage: dashboardHelpers.getCurrentPage(
          filteredDashboards,
          state.currentDashboard,
          state.dashboardPerPage
        ),
        dashboardPageNumber: Math.ceil(
          filteredDashboards.length / state.dashboardPerPage
        )
      };
    }

    default:
      return state;
  }
}
