/*
 *
 * Copyright 2019 HISP Tanzania
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301, USA.
 *
 * @since 2019
 * @author Joseph Chingalo <profschingalo@gmail.com>
 *
 */

import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import { State, getCurrentUserColorSettings } from "../../../store";
import { AppColorObject, AppAboutContent } from "src/models";
import { SystemInformationService } from "src/app/services/system-information.service";
import { AppVersion } from "@ionic-native/app-version/ngx";
import * as _ from "lodash";
import { DEFAULT_ABOUT_CONTENT, DEFAULT_APP_LOGO } from "src/constants";

@Component({
  selector: "app-about",
  templateUrl: "./about.page.html",
  styleUrls: ["./about.page.scss"]
})
export class AboutPage implements OnInit {
  colorSettings$: Observable<AppColorObject>;
  systemInfo: {};
  systemInfoContent: {} = {};
  appName: string;
  appCurrentVersion: string;
  aboutContents: AppAboutContent[];
  appLogo: string;

  constructor(
    private store: Store<State>,
    private systemInformationService: SystemInformationService,
    private appVersion: AppVersion
  ) {
    this.colorSettings$ = this.store.select(getCurrentUserColorSettings);
    this.appVersion.getAppName().then(name => {
      this.appName = name;
    });
    this.appVersion.getVersionNumber().then(version => {
      this.appCurrentVersion = version;
    });
  }

  ngOnInit() {
    this.appLogo = DEFAULT_APP_LOGO.logo;
    this.systemInformationService
      .getCurrentUserSystemInformation()
      .then(systemInfo => {
        this.systemInfo = systemInfo;
        let keys = Object.keys(this.systemInfo);
        keys.forEach(key => {
          let newKey = _.startCase(key);
          this.systemInfoContent[newKey] = this.systemInfo[key];
        });
      });
    this.aboutContents = this.getVisiableAboutContents();
  }

  getVisiableAboutContents() {
    return _.filter(DEFAULT_ABOUT_CONTENT, (aboutContents: AppAboutContent) => {
      return aboutContents.isVisible;
    });
  }
}
