import { Injectable } from '@angular/core';
import { CurrentUser, AppColor, AppColorObject } from 'src/models';

@Injectable({
  providedIn: 'root'
})
export class AppColorService {
  constructor() {}

  getUserSettingColorAttribute(user: CurrentUser): AppColor {
    const defaultColor: AppColor = {
      main: 'light-blue-main',
      secondary: 'light-blue-secondary'
    };
    const { colorSettings } = user;
    return colorSettings && colorSettings.colorAttributes
      ? colorSettings.colorAttributes
      : defaultColor;
  }

  getUserSettingColorValue(user: CurrentUser): AppColor {
    const defaultColor: AppColor = { main: '#1D5288', secondary: '#488AFF' };
    const { colorSettings } = user;
    return colorSettings && colorSettings.colorCode
      ? colorSettings.colorCode
      : defaultColor;
  }

  getCurrentUserColorObject(
    currentStyle?: string,
    keyStyle?: string
  ): AppColorObject {
    const userStyle = keyStyle
      ? keyStyle.split('/')[0]
      : currentStyle
      ? currentStyle.split('/')[0]
      : '';
    const colorAttributes =
      userStyle === 'green'
        ? { main: 'green-main', secondary: 'green-secondary' }
        : userStyle === 'light_blue'
        ? { main: 'light-blue-main', secondary: 'light-blue-secondary' }
        : userStyle === 'india'
        ? { main: 'india-main', secondary: 'india-secondary' }
        : userStyle === 'myanmar'
        ? { main: 'myanmar-main', secondary: 'myanmar-secondary' }
        : userStyle === 'vietnam'
        ? { main: 'vietnam-main', secondary: 'vietnam-secondary' }
        : { main: 'light-blue-main', secondary: 'light-blue-secondary' };
    const colorCode =
      userStyle === 'green'
        ? { main: '#2E7D32', secondary: '#00E676' }
        : userStyle === 'light_blue'
        ? { main: '#1D5288', secondary: '#488AFF' }
        : userStyle === 'india'
        ? { main: '#EF6C00', secondary: '#FF9100' }
        : userStyle === 'myanmar'
        ? { main: '#F9A825', secondary: '#FFEA00' }
        : userStyle === 'vietnam'
        ? { main: '#D84315', secondary: '#FF3D00' }
        : { main: '#1D5288', secondary: '#488AFF' };
    return { colorAttributes, colorCode };
  }
}
