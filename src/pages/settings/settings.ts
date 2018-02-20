import { Component, OnInit } from "@angular/core";
import { IonicPage } from "ionic-angular";
import { SettingsProvider } from "../../providers/settings/settings";
import { UserProvider } from "../../providers/user/user";
import { AppProvider } from "../../providers/app/app";
import { LocalInstanceProvider } from "../../providers/local-instance/local-instance";
import { AppTranslationProvider } from "../../providers/app-translation/app-translation";

/**
 * Generated class for the SettingsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-settings",
  templateUrl: "settings.html"
})
export class SettingsPage implements OnInit {
  isSettingContentOpen: any;
  settingContents: Array<any>;
  isLoading: boolean = false;
  settingObject: any;
  loadingMessage: string;
  currentUser: any;
  currentLanguage: string;
  translationCodes: Array<any> = [];
  localInstances: any;
  translationMapper: any;

  constructor(
    private settingsProvider: SettingsProvider,
    private appProvider: AppProvider,
    private localInstanceProvider: LocalInstanceProvider,
    private appTranslationProvider: AppTranslationProvider,
    private userProvider: UserProvider
  ) {}

  ngOnInit() {
    this.settingObject = {};
    this.translationCodes = this.appTranslationProvider.getSupportedTranslationObjects();
    this.isLoading = true;
    this.isSettingContentOpen = {};
    this.settingContents = this.settingsProvider.getSettingContentDetails();
    if (this.settingContents.length > 0) {
      this.toggleSettingContents(this.settingContents[0]);
    }
    this.translationMapper = {};
    this.appTranslationProvider
      .getTransalations(this.getValuesToTranslate())
      .subscribe(
        (data: any) => {
          this.translationMapper = data;
          this.loadingUserInformation();
        },
        error => {
          this.loadingUserInformation();
        }
      );
  }

  loadingUserInformation() {
    let key = "Discovering current user information";
    this.loadingMessage = this.translationMapper[key]
      ? this.translationMapper[key]
      : key;
    let defaultSettings = this.settingsProvider.getDefaultSettings();
    this.userProvider.getCurrentUser().subscribe(
      (currentUser: any) => {
        this.currentUser = currentUser;
        this.currentLanguage = currentUser.currentLanguage;
        key = "Discovering settings";
        this.loadingMessage = this.translationMapper[key]
          ? this.translationMapper[key]
          : key;
        this.localInstanceProvider.getLocalInstances().subscribe(
          (instances: any) => {
            this.localInstances = instances;
            this.settingsProvider
              .getSettingsForTheApp(this.currentUser)
              .subscribe(
                (appSettings: any) => {
                  this.initiateSettings(defaultSettings, appSettings);
                },
                error => {
                  console.log(error);
                  this.isLoading = false;
                  this.initiateSettings(defaultSettings, null);
                  this.appProvider.setNormalNotification(
                    "Fail to discover settings"
                  );
                }
              );
          },
          error => {
            this.isLoading = false;
            this.appProvider.setNormalNotification(
              "Fail to discover available local instances"
            );
          }
        );
      },
      error => {
        console.log(error);
        this.isLoading = false;
        this.initiateSettings(defaultSettings, null);
        this.appProvider.setNormalNotification(
          "Fail to discover current user information"
        );
      }
    );
  }

  initiateSettings(defaultSettings, appSettings) {
    if (appSettings) {
      if (appSettings.synchronization) {
        this.settingObject["synchronization"] = appSettings.synchronization;
      } else {
        this.settingObject["synchronization"] = defaultSettings.synchronization;
      }
      if (appSettings.entryForm) {
        this.settingObject["entryForm"] = appSettings.entryForm;
      } else {
        this.settingObject["entryForm"] = defaultSettings.entryForm;
      }
    } else {
      this.settingObject = defaultSettings;
    }
    let timeValue = this.settingObject.synchronization.time;
    let timeType = this.settingObject.synchronization.timeType;
    this.settingObject.synchronization.time = this.settingsProvider.getDisplaySynchronizationTime(
      timeValue,
      timeType
    );
    this.isLoading = false;
  }

  updateCurrentLanguage() {
    try {
      let loggedInInInstance = this.currentUser.serverUrl;
      if (this.currentUser.serverUrl.split("://").length > 1) {
        loggedInInInstance = this.currentUser.serverUrl.split("://")[1];
      }
      this.appTranslationProvider.setAppTranslation(this.currentLanguage);
      this.currentUser.currentLanguage = this.currentLanguage;
      this.userProvider.setCurrentUser(this.currentUser).subscribe(() => {});
      this.localInstanceProvider
        .setLocalInstanceInstances(
          this.localInstances,
          this.currentUser,
          loggedInInInstance
        )
        .subscribe(() => {});
    } catch (e) {
      this.appProvider.setNormalNotification("Fail to set translation");
      console.log(JSON.stringify(e));
    }
  }

  applySettings(settingContent) {
    this.settingsProvider
      .setSettingsForTheApp(this.currentUser, this.settingObject)
      .subscribe(
        () => {
          this.appProvider.setNormalNotification(
            "Settings have been updated successfully",
            2000
          );
          this.settingsProvider
            .getSettingsForTheApp(this.currentUser)
            .subscribe(
              (appSettings: any) => {
                this.settingObject = appSettings;
                let timeValue = this.settingObject.synchronization.time;
                let timeType = this.settingObject.synchronization.timeType;
                this.settingObject.synchronization.time = this.settingsProvider.getDisplaySynchronizationTime(
                  timeValue,
                  timeType
                );
              },
              error => {
                console.log(error);
                this.appProvider.setNormalNotification(
                  "Fail to discover settings"
                );
                this.updateLoadingStatusOfSavingSetting(settingContent, false);
              }
            );
        },
        error => {
          this.updateLoadingStatusOfSavingSetting(settingContent, false);
          this.appProvider.setNormalNotification(
            "Fail to apply changes on  settings"
          );
        }
      );
  }

  updateLoadingStatusOfSavingSetting(savingSettingContent, status) {
    this.settingContents.forEach((settingContent: any) => {
      if (settingContent.id == savingSettingContent.id) {
        settingContent.isLoading = status;
      }
    });
  }

  toggleSettingContents(content) {
    if (content && content.id) {
      if (this.isSettingContentOpen[content.id]) {
        this.isSettingContentOpen[content.id] = false;
      } else {
        Object.keys(this.isSettingContentOpen).forEach(id => {
          this.isSettingContentOpen[id] = false;
        });
        this.isSettingContentOpen[content.id] = true;
      }
    }
  }

  getValuesToTranslate() {
    return ["Discovering current user information", "Discovering settings"];
  }
}
