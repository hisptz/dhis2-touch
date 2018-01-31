import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {LocalInstanceProvider} from "../../providers/local-instance/local-instance";
import {AppProvider} from "../../providers/app/app";

/**
 * Generated class for the AvailableLocalInstanceComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'available-local-instance',
  templateUrl: 'available-local-instance.html'
})
export class AvailableLocalInstanceComponent implements OnInit{

  localInstances : any;
  localInstancesBackup : any;
  isLoading :boolean;
  loadingMessage : string;
  cancelIcon : string;

  @Output() onSelectCurrentUser = new EventEmitter();
  @Output() onClose = new EventEmitter();

  constructor(private localInstanceProvider : LocalInstanceProvider,
              private appProvider : AppProvider) {}

  ngOnInit(){
    this.localInstances = [];
    this.cancelIcon = "assets/icon/cancel.png";
    this.isLoading = true;
    this.loadingMessage = "loading_available_local_instances";
    this.localInstanceProvider.getLocalInstances().subscribe((instances : any)=>{
      this.localInstances = instances;
      this.localInstancesBackup = instances;
      this.isLoading = false;
    },(error)=>{
      this.isLoading = false;
      this.appProvider.setNormalNotification("Fail to load available local instances")
    });
  }

  closeContainer(){
    this.onClose.emit({});
  }

  setCurrentUser(currentUser,currentLanguage){
    currentUser.currentLanguage = currentLanguage;
    this.onSelectCurrentUser.emit({currentUser : currentUser});
  }

  getFilteredList(ev: any) {
    let val = ev.target.value;
    this.localInstances = this.localInstancesBackup;
    if(val && val.trim() != ''){
      this.localInstances = this.localInstances.filter((localInstance:any) => {
        return (localInstance.name.toLowerCase().indexOf(val.toLowerCase()) > -1 || localInstance.currentUser.username.toLowerCase().indexOf(val.toLowerCase()) > -1 );
      })
    }
  }

}
