export interface CurrentUser {
  username: string;
  name?: string;
  id?: string;
  dataViewOrganisationUnits?: any;
  password: string; //encrypted string
  serverUrl: string;
  currentLanguage: string;
  isLogin?: boolean;
  isPasswordEncode?: boolean;
  authorizationKey?: string;
  hashedKeyForOfflineAuthentication?: string;
  currentDatabase?: string;
  dhisVersion?: string;
  authorities?: Array<string>;
  progressTracker?: any;
  userOrgUnitIds?: Array<string>;
}
