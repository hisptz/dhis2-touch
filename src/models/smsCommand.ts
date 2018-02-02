export interface SmsCommand{
  dataSetId : string;
  commandName : string;
  separator : string;
  parserType: string;
  smsCode : Array<SmsCode>;
}

export interface SmsCode{
  smsCode? :string;
  dataElements? : any;
  categoryOptionCombos? : string;
}
