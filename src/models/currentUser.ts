
export interface CurrentUser {
  username : string;
  id? : string;
  dataViewOrganisationUnits? : any;
  password : string; //encrypted string
  serverUrl :  string;
  currentLanguage : string;
  isLogin? : boolean;
  authorizationKey? : string;
  currentDatabase? : string;
  dhisVersion? : string;
  authorities?: Array<string>;
  progressTracker? : any;
}
