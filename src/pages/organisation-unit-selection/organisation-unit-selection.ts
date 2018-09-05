import { Component, OnInit } from '@angular/core';
import {
  IonicPage,
  ViewController,
  NavParams,
  ModalOptions,
  ModalController
} from 'ionic-angular';
import {
  OrganisationUnitModel,
  OrganisationUnitsProvider
} from '../../providers/organisation-units/organisation-units';
import { UserProvider } from '../../providers/user/user';
import { AppProvider } from '../../providers/app/app';
import { AppTranslationProvider } from '../../providers/app-translation/app-translation';
import { ProgramsProvider } from '../../providers/programs/programs';
import { DataSetsProvider } from '../../providers/data-sets/data-sets';
import { SettingsProvider } from '../../providers/settings/settings';

/**
 * Generated class for the OrganisationUnitSelectionPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-organisation-unit-selection',
  templateUrl: 'organisation-unit-selection.html'
})
export class OrganisationUnitSelectionPage implements OnInit {
  loadingMessage: string;
  isLoading: boolean = false;
  emptyMessage: string;
  translationMapper: any;
  currentUser: any;
  lastSelectedOrgUnit: OrganisationUnitModel;
  organisationUnits: OrganisationUnitModel[];
  hasOrgUnitChildrenOpened: any = {};
  ouIdsWithAssigments: string[];

  constructor(
    private viewCtrl: ViewController,
    private organisationUnitProvider: OrganisationUnitsProvider,
    private programProvider: ProgramsProvider,
    private dataSetsProvider: DataSetsProvider,
    private navParams: NavParams,
    private userProvider: UserProvider,
    private appProvider: AppProvider,
    private appTranslation: AppTranslationProvider,
    private modalCtrl: ModalController,
    private settingsProvider: SettingsProvider
  ) {}

  ngOnInit() {
    this.emptyMessage = '';
    this.isLoading = true;
    this.translationMapper = {};
    this.ouIdsWithAssigments = [];
    this.appTranslation.getTransalations(this.getValuesToTranslate()).subscribe(
      (data: any) => {
        this.translationMapper = data;
        this.loadingCurrentUserInformation();
      },
      error => {
        this.loadingCurrentUserInformation();
      }
    );
  }

  loadingCurrentUserInformation() {
    let key = 'Discovering current user information';
    this.loadingMessage = this.translationMapper[key]
      ? this.translationMapper[key]
      : key;
    this.userProvider.getCurrentUser().subscribe(
      user => {
        this.currentUser = user;
        this.settingsProvider.getSettingsForTheApp(user).subscribe(
          (appSettings: any) => {
            const { entryForm } = appSettings;
            const { showAlertOnFormAssignement } = entryForm;
            this.loadingProgramAndDataSetAssignments(
              user,
              showAlertOnFormAssignement
            );
            this.loadingOrganisationUnits();
          },
          error => {
            this.isLoading = false;
            console.log(JSON.stringify(error));
          }
        );
      },
      error => {
        this.isLoading = false;
        console.log(JSON.stringify(error));
      }
    );
  }

  loadingOrganisationUnits() {
    let key = 'Discovering assigned organisation units';
    this.loadingMessage = this.translationMapper[key]
      ? this.translationMapper[key]
      : key;
    this.hasOrgUnitChildrenOpened = {};
    this.organisationUnitProvider
      .getOrganisationUnits(this.currentUser)
      .subscribe(
        (organisationUnits: any) => {
          if (organisationUnits && organisationUnits.length > 0) {
            this.organisationUnits = organisationUnits;
            if (this.organisationUnitProvider.lastSelectedOrgUnit) {
              this.lastSelectedOrgUnit = this.organisationUnitProvider.lastSelectedOrgUnit;
            } else {
              this.lastSelectedOrgUnit = organisationUnits[0];
              this.organisationUnitProvider.setLastSelectedOrganisationUnitUnit(
                organisationUnits[0]
              );
            }
            this.isLoading = false;
          } else {
            this.isLoading = false;
            key =
              'Currently there is on assigned organisation unit on local storage, Please clear metadata on sync app';
            this.emptyMessage = this.translationMapper[key]
              ? this.translationMapper[key]
              : key;
            this.appProvider.setNormalNotification(key);
          }
        },
        error => {
          console.log(JSON.stringify(error));
          this.isLoading = false;
          key = 'Failed to discover organisation units';
          this.emptyMessage = this.translationMapper[key]
            ? this.translationMapper[key]
            : key;
          this.appProvider.setNormalNotification(key);
        }
      );
  }

  openSearchOrganisatioUnitModal() {
    let options: ModalOptions = {
      cssClass: 'inset-modal',
      enableBackdropDismiss: false
    };
    let data = {
      ouIdsWithAssigments: this.ouIdsWithAssigments,
      currentSelectedOrgUnitName: this.lastSelectedOrgUnit.name,
      filterType: this.navParams.get('filterType')
    };
    const modal = this.modalCtrl.create(
      'OrganisationUnitSearchPage',
      { data: data },
      options
    );
    modal.onDidDismiss((selectedOrganisationUnit: any) => {
      if (selectedOrganisationUnit && selectedOrganisationUnit.id) {
        this.organisationUnitProvider.setLastSelectedOrganisationUnitUnit(
          selectedOrganisationUnit
        );
        this.viewCtrl.dismiss(selectedOrganisationUnit);
      }
    });
    modal.present();
  }

  loadingProgramAndDataSetAssignments(user, showAlertOnFormAssignement) {
    this.ouIdsWithAssigments = [];
    if (showAlertOnFormAssignement) {
      const filterType = this.navParams.get('filterType');
      if (filterType == 'dataSets') {
        this.dataSetsProvider.getAllDataSetSources(this.currentUser).subscribe(
          (dataSetSources: any) => {
            this.userProvider.getUserData().subscribe((userData: any) => {
              dataSetSources.map((dataSetSource: any) => {
                if (
                  dataSetSource &&
                  dataSetSource.id &&
                  userData.dataSets &&
                  userData.dataSets.indexOf(dataSetSource.id) > -1
                ) {
                  dataSetSource.organisationUnitIds.map((ouId: string) => {
                    if (this.ouIdsWithAssigments.indexOf(ouId) == -1) {
                      this.ouIdsWithAssigments.push(ouId);
                    }
                  });
                }
              });
            });
          },
          error => {
            console.log(JSON.stringify(error));
          }
        );
      } else if (
        filterType == 'WITHOUT_REGISTRATION' ||
        filterType == 'WITH_REGISTRATION'
      ) {
        this.programProvider
          .getProgramOrganisationUnitsByProgramType(user, filterType)
          .subscribe(
            (programOrganisationUnits: any) => {
              this.userProvider.getUserData().subscribe((userData: any) => {
                programOrganisationUnits.map((programOrganisationUnit: any) => {
                  if (
                    programOrganisationUnit &&
                    programOrganisationUnit.id &&
                    userData.programs &&
                    userData.programs.indexOf(programOrganisationUnit.id) > -1
                  ) {
                    programOrganisationUnit.orgUnitIds.map((ouId: string) => {
                      if (this.ouIdsWithAssigments.indexOf(ouId) == -1) {
                        this.ouIdsWithAssigments.push(ouId);
                      }
                    });
                  }
                });
              });
            },
            error => {
              console.log(JSON.stringify(error));
            }
          );
      }
    }
  }

  setSelectedOrganisationUnit(selectedOrganisationUnit) {
    const filterType = this.navParams.get('filterType');
    if (
      filterType &&
      this.ouIdsWithAssigments.length > 0 &&
      this.ouIdsWithAssigments.indexOf(selectedOrganisationUnit.id) == -1
    ) {
      if (filterType == 'dataSets') {
        this.appProvider.setNormalNotification(
          'There is no entry form assigned to selected organisation unit, please select others or contact you help desk',
          8 * 1000
        );
      } else if (
        filterType == 'WITHOUT_REGISTRATION' ||
        filterType == 'WITH_REGISTRATION'
      ) {
        this.appProvider.setNormalNotification(
          'There is no program assigned to selected organisation unit, please select others or contact you help desk',
          8 * 1000
        );
      }
    } else {
      this.organisationUnitProvider.setLastSelectedOrganisationUnitUnit(
        selectedOrganisationUnit
      );
      this.viewCtrl.dismiss(selectedOrganisationUnit);
    }
  }

  dismiss() {
    this.viewCtrl.dismiss({});
  }

  trackByFn(index, item) {
    return item && item.id ? item.id : index;
  }

  getValuesToTranslate() {
    return [
      'Discovering current user information',
      'Discovering assigned organisation units',
      'Currently there is on assigned organisation unit on local storage, Please clear metadata on sync app',
      'Failed to discover organisation units'
    ];
  }
}
