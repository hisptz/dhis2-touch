import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

/*
 Generated class for the HelpProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */
@Injectable()
export class HelpProvider {

  constructor() {
  }


  getHelpContents(){
    let helpContent = [{"id":"1.1","name":"Overview","tags":"overview.help","contents":"theandroidbased","subMenu":[{"id":"1.2","name":"Features of DHIS2","contents":"the","sub_Menu":[]},{"id":"1.3","name":"How to","contents":"The ","sub_Menu":[]},{"id":"1.4","name":"Installation","contents":"The","sub_Menu":[]},{"id":"1.5","name":"Menus&Navigation","contents":"the","sub_Menu":[{"id":"1.51","name":"Navigating the App menu","contents":"the"},{"id":"1.52","name":"Navigating the utility menu","contents":"the"}]}]},{"id":"2.0","name":"Data entry","tags":"Data_entry.help","contents":"the","sub_menu":[{"id":"2.1","name":"selecting data entry form","contents":"the"}]},{"id":"3.0","name":"Performing dataentry in event capture","tags":"Perfoming data entry event capture.help","contents":"the"},{"id":"4.0","name":"Dashboard","tags":"dashboard.help","contents":"the"},{"id":"5.0","name":"Setting","tags":"setting.help","contents":"the","sub_Menu":[{"id":"5.11","name":"Synchronization","contents":"the"},{"id":"5.12","name":"data entry form","contents":"the"},{"id":"5.2","name":"Sync","contents":"the","sub_menu":[{"id":"5.21","name":"Upload data via sms","contents":"the"},{"id":"5.22","name":"Downloading & Updating Metadata","contents":"the"},{"id":"5.23","name":"Clear offline data","contents":"the"}]}]},{"id":"6.0","name":"managing utilities menu","tags":"managing utilities menu.help","contents":"the","sub_Menu":[{"id":"6.1","name":"About","contents":"the"},{"id":"6.2","name":"Profile","contents":"the"},{"id":"6.3","name":"Logout","contents":"the"}]}];
    return this.getHelpContentAsObject(helpContent);
  }

  getHelpContentAsObject(helpContents){
    let object = {};
    helpContents.forEach(helpContent=>{
      object[helpContent.id] = helpContent;
    });
    return object;
  }
}
