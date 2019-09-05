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
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { AppSettingContent, AppSetting, Translation } from 'src/models';
import { DEFAULT_SETTINGS } from 'src/constants';

@Component({
  selector: 'app-setting-container',
  templateUrl: './setting-container.component.html',
  styleUrls: ['./setting-container.component.scss']
})
export class SettingContainerComponent implements OnInit {
  @Input() settingContents: AppSettingContent[];
  @Input() currentAppSetting: AppSetting;
  @Input() currentLanguage: string;
  @Input() supportedTranslations: Translation[];

  @Output() changesOnAppSettings = new EventEmitter();
  @Output() changeCurrentLanguage = new EventEmitter();
  constructor() {}

  ngOnInit() {
    this.currentAppSetting = this.currentAppSetting || DEFAULT_SETTINGS;
    if (this.settingContents && this.settingContents.length > 0) {
      const settingContent = this.settingContents[0];
      this.toggleContent(settingContent);
    }
  }

  toggleContent(settingContent: AppSettingContent) {
    const { id, isOpened } = settingContent;
    const settingContents = _.map(this.settingContents, _.cloneDeep);
    this.settingContents = _.map(
      settingContents,
      (settingContentObj: AppSettingContent) => {
        return {
          ...settingContentObj,
          isOpened: id === settingContentObj.id ? !isOpened : false
        };
      }
    );
  }

  onChangeCurrentLanguage(data: any) {
    const { currentLanguage } = data;
    this.changeCurrentLanguage.emit(currentLanguage);
  }

  onChangesOnAppSettings(response: any) {
    this.changesOnAppSettings.emit(response);
  }

  trackByFn(index: any, item: AppSettingContent) {
    return item && item.id ? item.id : index;
  }
}
