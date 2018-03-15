export interface CurrentUser {
  username: string;
  name?: string;
  id?: string;
  dataViewOrganisationUnits?: any;
  password: string; //encrypted string
  serverUrl: string;
  currentLanguage: string;
  isLogin?: boolean;
  authorizationKey?: string;
  hashpassword?: string;
  currentDatabase?: string;
  dhisVersion?: string;
  authorities?: Array<string>;
  progressTracker?: any;
}
