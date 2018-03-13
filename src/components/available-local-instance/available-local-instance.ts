import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LocalInstanceProvider } from '../../providers/local-instance/local-instance';
import { AppProvider } from '../../providers/app/app';
import { AppTranslationProvider } from '../../providers/app-translation/app-translation';

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
export class AvailableLocalInstanceComponent implements OnInit {
  localInstances: any;
  localInstancesBackup: any;
  isLoading: boolean;
  loadingMessage: string;
  cancelIcon: string;
  translationMapper: any;

  @Output() onSelectCurrentUser = new EventEmitter();
  @Output() onClose = new EventEmitter();

  constructor(
    private localInstanceProvider: LocalInstanceProvider,
    private appProvider: AppProvider,
    private appTranslation: AppTranslationProvider
  ) {}

  ngOnInit() {
    this.localInstances = [];
    this.cancelIcon = 'assets/icon/cancel.png';
    this.isLoading = true;
    this.translationMapper = {};
    this.appTranslation.getTransalations(this.getValuesToTranslate()).subscribe(
      (data: any) => {
        this.translationMapper = data;
        this.loadingLocalInstances();
      },
      error => {
        this.loadingLocalInstances();
      }
    );
  }

  loadingLocalInstances() {
    this.loadingMessage = 'Discovering available local instances';
    this.localInstanceProvider.getLocalInstances().subscribe(
      (instances: any) => {
        this.localInstances = instances;
        this.localInstancesBackup = instances;
        this.isLoading = false;
      },
      error => {
        this.isLoading = false;
        this.appProvider.setNormalNotification(
          'Fail to load available local instances'
        );
      }
    );
  }

  closeContainer() {
    this.onClose.emit({});
  }

  setCurrentUser(currentUser, currentLanguage) {
    currentUser.currentLanguage = currentLanguage;
    this.onSelectCurrentUser.emit({ currentUser: currentUser });
  }

  getFilteredList(ev: any) {
    let val = ev.target.value;
    this.localInstances = this.localInstancesBackup;
    if (val && val.trim() != '') {
      this.localInstances = this.localInstances.filter((localInstance: any) => {
        return (
          localInstance.name.toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          localInstance.currentUser.username
            .toLowerCase()
            .indexOf(val.toLowerCase()) > -1
        );
      });
    }
  }

  getValuesToTranslate() {
    return [
      'Search',
      'There is no local instance to select',
      'Discovering available local instances'
    ];
  }
}
