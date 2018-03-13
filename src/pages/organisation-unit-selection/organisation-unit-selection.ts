import { Component, OnInit } from "@angular/core";
import { IonicPage, ViewController } from "ionic-angular";
import {
  OrganisationUnitModel,
  OrganisationUnitsProvider
} from "../../providers/organisation-units/organisation-units";
import { UserProvider } from "../../providers/user/user";
import { AppProvider } from "../../providers/app/app";
import { AppTranslationProvider } from "../../providers/app-translation/app-translation";

/**
 * Generated class for the OrganisationUnitSelectionPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-organisation-unit-selection",
  templateUrl: "organisation-unit-selection.html"
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

  constructor(
    private viewCtrl: ViewController,
    private organisationUnitProvider: OrganisationUnitsProvider,
    private userProvider: UserProvider,
    private appProvider: AppProvider,
    private appTranslation: AppTranslationProvider
  ) {}

  ngOnInit() {
    this.emptyMessage = "";
    this.isLoading = true;
    this.translationMapper = {};
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
    let key = "Discovering current user information";
    this.loadingMessage = this.translationMapper[key]
      ? this.translationMapper[key]
      : key;
    this.userProvider.getCurrentUser().subscribe(
      user => {
        this.currentUser = user;
        this.loadingOrganisationUnits();
      },
      error => {
        console.log(JSON.stringify(error));
      }
    );
  }

  loadingOrganisationUnits() {
    let key = "Discovering assigned organisation units";
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
              "Currently there is on assigned organisation unit on local storage, Please metadata on sync app";
            this.emptyMessage = this.translationMapper[key]
              ? this.translationMapper[key]
              : key;
            this.appProvider.setNormalNotification(key);
          }
        },
        error => {
          console.log(JSON.stringify(error));
          this.isLoading = false;
          key = "Fail to discover organisation units";
          this.emptyMessage = this.translationMapper[key]
            ? this.translationMapper[key]
            : key;
          this.appProvider.setNormalNotification(key);
        }
      );
  }

  setSelectedOrganisationUnit(selectedOrganisationUnit) {
    this.organisationUnitProvider.setLastSelectedOrganisationUnitUnit(
      selectedOrganisationUnit
    );
    this.viewCtrl.dismiss(selectedOrganisationUnit);
  }

  dismiss() {
    this.viewCtrl.dismiss({});
  }

  getValuesToTranslate() {
    return [
      "Discovering current user information",
      "Discovering assigned organisation units",
      "Currently there is on assigned organisation unit on local storage, Please metadata on sync app",
      "Fail to discover organisation units"
    ];
  }
}
