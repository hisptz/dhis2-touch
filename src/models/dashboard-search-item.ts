export interface DashboardSearchItem {
  loading: boolean;
  loaded: boolean;
  headers: any[];
  results: any;
  resultCount: number;
}

export const INITIAL_DASHBOARD_SEARCH_ITEM: DashboardSearchItem = {
  loading: false,
  loaded: true,
  headers: [
    {
      name: 'all',
      title: 'ALL',
      selected: true,
      itemCount: 0
    },
    {
      icon: 'assets/icons/users.png',
      name: 'users',
      title: 'Users',
      selected: false,
      itemCount: 0
    },
    {
      icon: 'assets/icons/table.png',
      name: 'tables',
      title: 'Tables',
      selected: false,
      itemCount: 0
    },
    {
      icon: 'assets/icons/map.png',
      name: 'maps',
      title: 'Maps',
      selected: false,
      itemCount: 0
    },
    {
      icon: 'assets/icons/column.png',
      name: 'charts',
      title: 'Charts',
      selected: false,
      itemCount: 0
    },
    {
      icon: 'assets/icons/report.png',
      name: 'reports',
      title: 'Reports',
      selected: false,
      itemCount: 0
    },
    {
      icon: 'assets/icons/resource.png',
      name: 'resources',
      title: 'Resources',
      selected: false,
      itemCount: 0
    },
    {
      icon: 'assets/icons/app.png',
      name: 'apps',
      title: 'Apps',
      selected: false,
      itemCount: 0
    }
  ],
  results: [],
  resultCount: 0
};
