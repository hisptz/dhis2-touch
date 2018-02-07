import { Component, OnInit } from "@angular/core";
import { PeriodSelectionProvider } from "../../providers/period-selection/period-selection";
import { ModalController } from "ionic-angular";
import { OrganisationUnitsProvider } from "../../providers/organisation-units/organisation-units";
import { UserProvider } from "../../providers/user/user";
import { AppProvider } from "../../providers/app/app";
import { DataSetsProvider } from "../../providers/data-sets/data-sets";
import { SmsCommandProvider } from "../../providers/sms-command/sms-command";
import { SmsCommand } from "../../models/smsCommand";

/**
 * Generated class for the UploadDataViaSmsComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: "upload-data-via-sms",
  templateUrl: "upload-data-via-sms.html"
})
export class UploadDataViaSmsComponent implements OnInit {
  selectedOrgUnit: any;
  selectedDataSet: any;
  selectedPeriod: any;
  currentUser: any;

  isLoading: boolean;
  loadingMessage: string;
  isFormReady: boolean;
  isDataSetDimensionApplicable: boolean;
  isDataSetDimensionApplicableCategories: string;
  organisationUnitLabel: string;
  dataSetLabel: string;
  periodLabel: string;
  dataSetIdsByUserRoles: Array<any>;
  dataSets: Array<any>;
  dataSetCategoryCombo: any;
  selectedDataDimension: Array<any>;
  currentPeriodOffset: number;
  icons: any = {};
  sendDataViaSmsObject: any = {
    orgUnit: {},
    dataSet: {},
    period: {},
    dataDimension: {},
    mobileNumber: "",
    isLoading: false,
    loadingMessage: ""
  };

  constructor(
    private modalCtrl: ModalController,
    private userProvider: UserProvider,
    private appProvider: AppProvider,
    private smsCommand: SmsCommandProvider,
    private dataSetProvider: DataSetsProvider,
    private periodSelection: PeriodSelectionProvider,
    private organisationUnitsProvider: OrganisationUnitsProvider
  ) {}

  ngOnInit() {
    this.icons.orgUnit = "assets/icon/orgUnit.png";
    this.icons.dataSet = "assets/icon/form.png";
    this.icons.period = "assets/icon/period.png";
    this.icons.goToDataEntryForm = "assets/icon/enterDataPen.png";
    this.loadingMessage = "loading_user_information";
    this.isLoading = true;
    this.currentPeriodOffset = 0;
    this.isDataSetDimensionApplicable = false;

    this.userProvider.getCurrentUser().subscribe(
      (currentUser: any) => {
        this.currentUser = currentUser;
        this.userProvider.getUserData().subscribe((userData: any) => {
          this.dataSetIdsByUserRoles = [];
          userData.userRoles.forEach((userRole: any) => {
            if (userRole.dataSets) {
              userRole.dataSets.forEach((dataSet: any) => {
                this.dataSetIdsByUserRoles.push(dataSet.id);
              });
            }
          });

          this.organisationUnitsProvider
            .getLastSelectedOrganisationUnitUnit(currentUser)
            .subscribe(lastSelectedOrgUnit => {
              this.selectedOrgUnit = lastSelectedOrgUnit;
              this.updateDataEntryFormSelections();
              this.loadingEntryForm();
            });
          this.updateDataEntryFormSelections();
        });
      },
      error => {
        this.isLoading = false;
        this.loadingMessage = "";
        this.appProvider.setNormalNotification("Fail to load user information");
      }
    );
  }

  updateDataEntryFormSelections() {
    if (this.organisationUnitsProvider.lastSelectedOrgUnit) {
      this.selectedOrgUnit = this.organisationUnitsProvider.lastSelectedOrgUnit;
      this.organisationUnitLabel = this.selectedOrgUnit.name;
    } else {
      this.organisationUnitLabel = "Touch to select organisation Unit";
    }
    if (this.selectedDataSet && this.selectedDataSet.name) {
      this.dataSetLabel = this.selectedDataSet.name;
    } else {
      this.dataSetLabel = "Touch to select entry form";
    }

    if (this.selectedPeriod && this.selectedPeriod.name) {
      this.periodLabel = this.selectedPeriod.name;
    } else {
      this.periodLabel = "Touch to select period";
    }
    this.isFormReady = this.isAllFormParameterSelected();
    this.isLoading = false;
    this.loadingMessage = "";
  }

  openOrganisationUnitTree() {
    let modal = this.modalCtrl.create("OrganisationUnitSelectionPage", {});
    modal.onDidDismiss((selectedOrgUnit: any) => {
      if (selectedOrgUnit && selectedOrgUnit.id) {
        this.selectedOrgUnit = selectedOrgUnit;
        this.updateDataEntryFormSelections();
        this.loadingEntryForm();
      }
    });
    modal.present();
  }

  loadingEntryForm() {
    this.dataSetProvider
      .getAssignedDataSets(
        this.selectedOrgUnit.id,
        this.dataSetIdsByUserRoles,
        this.currentUser
      )
      .subscribe(
        (dataSets: any) => {
          this.dataSets = dataSets;
          this.selectedDataSet = this.dataSetProvider.lastSelectedDataSet;
          this.currentPeriodOffset = 0;
          this.updateDataEntryFormSelections();
          this.loadPeriodSelection();
          if (this.selectedDataSet && this.selectedDataSet.categoryCombo) {
            this.updateDataSetCategoryCombo(this.selectedDataSet.categoryCombo);
          }
        },
        error => {
          this.appProvider.setNormalNotification("Fail to reload entry form");
        }
      );
  }

  openEntryFormList() {
    if (this.dataSets && this.dataSets.length > 0) {
      let modal = this.modalCtrl.create("DataSetSelectionPage", {
        dataSetsList: this.dataSets,
        currentDataSet: this.selectedDataSet.name
      });
      modal.onDidDismiss((selectedDataSet: any) => {
        if (
          selectedDataSet &&
          selectedDataSet.id &&
          selectedDataSet.id != this.selectedDataSet.id
        ) {
          this.selectedDataSet = selectedDataSet;
          this.dataSetProvider.setLastSelectedDataSet(selectedDataSet);
          this.currentPeriodOffset = 0;
          this.updateDataEntryFormSelections();
          this.loadPeriodSelection();
          if (this.selectedDataSet && this.selectedDataSet.categoryCombo) {
            this.updateDataSetCategoryCombo(this.selectedDataSet.categoryCombo);
          }
        }
      });
      modal.present();
    } else {
      this.appProvider.setNormalNotification(
        "There are no entry form to select on " + this.selectedOrgUnit.name
      );
    }
  }

  loadPeriodSelection() {
    if (this.selectedDataSet && this.selectedDataSet.id) {
      let periodType = this.selectedDataSet.periodType;
      let openFuturePeriods = parseInt(this.selectedDataSet.openFuturePeriods);
      let periods = this.periodSelection.getPeriods(
        periodType,
        openFuturePeriods,
        this.currentPeriodOffset
      );
      if (periods && periods.length > 0) {
        this.selectedPeriod = periods[0];
      } else {
        this.selectedPeriod = {};
      }
    }
    this.updateDataEntryFormSelections();
  }

  openPeriodList() {
    if (this.selectedDataSet && this.selectedDataSet.id) {
      let modal = this.modalCtrl.create("PeriodSelectionPage", {
        periodType: this.selectedDataSet.periodType,
        currentPeriodOffset: this.currentPeriodOffset,
        openFuturePeriods: this.selectedDataSet.openFuturePeriods,
        currentPeriod: this.selectedPeriod
      });
      modal.onDidDismiss((data: any) => {
        if (data && data.selectedPeriod) {
          this.selectedPeriod = data.selectedPeriod;
          this.currentPeriodOffset = data.currentPeriodOffset;
          this.updateDataEntryFormSelections();
        }
      });
      modal.present();
    } else {
      this.appProvider.setNormalNotification("Please select entry form first");
    }
  }

  openDataDimensionSelection(category) {
    if (
      category.categoryOptions &&
      category.categoryOptions &&
      category.categoryOptions.length > 0
    ) {
      let currentIndex = this.dataSetCategoryCombo.categories.indexOf(category);
      let modal = this.modalCtrl.create("DataDimensionSelectionPage", {
        categoryOptions: category.categoryOptions,
        title: category.name + "'s selection",
        currentSelection: this.selectedDataDimension[currentIndex]
          ? this.selectedDataDimension[currentIndex]
          : {}
      });
      modal.onDidDismiss((selectedDataDimension: any) => {
        if (selectedDataDimension && selectedDataDimension.id) {
          this.selectedDataDimension[currentIndex] = selectedDataDimension;
          this.updateDataEntryFormSelections();
        }
      });
      modal.present();
    } else {
      let message =
        "There is no option for " +
        category.name +
        " that associated with " +
        this.selectedOrgUnit.name;
      this.appProvider.setNormalNotification(message);
    }
  }

  updateDataSetCategoryCombo(categoryCombo) {
    let dataSetCategoryCombo = {};
    if (categoryCombo.name != "default") {
      dataSetCategoryCombo["id"] = categoryCombo.id;
      dataSetCategoryCombo["name"] = categoryCombo.name;
      let categories = this.dataSetProvider.getDataSetCategoryComboCategories(
        this.selectedOrgUnit.id,
        this.selectedDataSet.categoryCombo.categories
      );
      dataSetCategoryCombo["categories"] = categories;
      this.isDataSetDimensionApplicable = true;
      this.isDataSetDimensionApplicableCategories = "Options for";
      categories.forEach((category: any) => {
        if (category.categoryOptions && category.categoryOptions.length == 0) {
          this.isDataSetDimensionApplicableCategories =
            this.isDataSetDimensionApplicableCategories +
            " " +
            category.name.toLowerCase();
          this.isDataSetDimensionApplicable = false;
        }
      });
      this.isDataSetDimensionApplicableCategories +=
        " are not applicable on " + this.selectedOrgUnit.name;
    }
    this.selectedDataDimension = [];
    this.dataSetCategoryCombo = dataSetCategoryCombo;
    this.updateDataEntryFormSelections();
  }

  getDataDimensions() {
    let cc = this.selectedDataSet.categoryCombo.id;
    let cp = "";
    this.selectedDataDimension.forEach((dimension: any, index: any) => {
      if (index == 0) {
        cp += dimension.id;
      } else {
        cp += ";" + dimension.id;
      }
    });
    return { cc: cc, cp: cp };
  }

  isAllFormParameterSelected() {
    let isFormReady = true;
    if (
      this.selectedPeriod &&
      this.selectedPeriod.name &&
      this.selectedDataSet &&
      this.selectedDataSet.categoryCombo.name != "default"
    ) {
      if (
        this.selectedDataDimension &&
        this.selectedDataDimension.length > 0 &&
        this.selectedDataDimension.length ==
          this.dataSetCategoryCombo.categories.length
      ) {
        let count = 0;
        this.selectedDataDimension.forEach((dimension: any) => {
          count++;
        });
        if (count != this.selectedDataDimension.length) {
          isFormReady = false;
        }
      } else {
        isFormReady = false;
      }
    } else if (this.periodLabel == "Touch to select period") {
      isFormReady = false;
    }
    return isFormReady;
  }

  sendDataViaSms() {
    this.sendDataViaSmsObject.orgUnit = {
      id: this.selectedOrgUnit.id,
      name: this.selectedOrgUnit.name
    };
    this.sendDataViaSmsObject.dataSet = {
      id: this.selectedDataSet.id,
      name: this.selectedDataSet.name
    };
    this.sendDataViaSmsObject.period = {
      iso: this.selectedPeriod.iso,
      name: this.selectedPeriod.name
    };
    if (this.isAllFormParameterSelected()) {
      this.sendDataViaSmsObject.dataDimension = this.getDataDimensions();
    }
    this.sendDataViaSmsObject.isLoading = true;
    this.sendDataViaSmsObject.loadingMessage = "Loading Sms Configuration";
    this.smsCommand
      .getSmsCommandForDataSet(this.selectedDataSet.id, this.currentUser)
      .subscribe(
        (smsCommandConfiguration: SmsCommand) => {
          this.sendDataViaSmsObject.loadingMessage =
            "Preparing entry form fields";
          this.dataSetProvider
            .getAllDataSetElementsMapper(this.currentUser)
            .subscribe(
              (dataSetElementMapper: any) => {
                if (dataSetElementMapper[this.selectedDataSet.id]) {
                  let dataElements =
                    dataSetElementMapper[this.selectedDataSet.id];
                  this.sendDataViaSmsObject.loadingMessage = "Preparing data";
                  this.smsCommand
                    .getEntryFormDataValuesObjectFromStorage(
                      this.selectedDataSet.id,
                      this.selectedPeriod.iso,
                      this.selectedOrgUnit.id,
                      dataElements,
                      this.currentUser,
                      this.sendDataViaSmsObject.dataDimension
                    )
                    .subscribe(
                      (entryFormDataValuesObject: any) => {
                        if (Object.keys(entryFormDataValuesObject).length > 0) {
                          console.log(
                            JSON.stringify(entryFormDataValuesObject)
                          );
                        } else {
                          this.sendDataViaSmsObject.isLoading = false;
                          this.appProvider.setNormalNotification(
                            "There is no data to be sent via SMS for " +
                              this.selectedDataSet.name
                          );
                        }
                      },
                      error => {
                        this.sendDataViaSmsObject.isLoading = false;
                        console.log(JSON.stringify(error));
                        this.appProvider.setNormalNotification(
                          "Fail to load data values"
                        );
                      }
                    );
                } else {
                  this.sendDataViaSmsObject.isLoading = false;
                  this.appProvider.setNormalNotification(
                    this.selectedDataSet.name + " has no field set"
                  );
                }
              },
              error => {
                console.log(JSON.stringify(error));
                this.sendDataViaSmsObject.isLoading = false;
              }
            );
        },
        error => {
          console.log(JSON.stringify(error));
          this.sendDataViaSmsObject.isLoading = false;
          this.appProvider.setNormalNotification(
            "Fail to load sms configurations for " + this.selectedDataSet.name
          );
        }
      );
  }
}
