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

import { AppAboutContent } from "src/models/app-about";

export const DEFAULT_ABOUT_CONTENT: AppAboutContent[] = [
  {
    id: "aggregatedStatus",
    name: "Aggregated status",
    icon: "assets/icon/app-setting.png",
    isVisible: true,
    isOpened: false
  },
  {
    id: "eventStatus",
    name: "Event status",
    icon: "assets/icon/event-status.png",
    isVisible: true,
    isOpened: false
  },
  {
    id: "eventTrackerStatus",
    name: "Event for tracker status",
    icon: "assets/icon/event-capture.png",
    isVisible: true,
    isOpened: false
  },
  {
    id: "enrollments",
    name: "Enrollments",
    icon: "assets/icon/app-setting.png",
    isVisible: true,
    isOpened: false
  },
  {
    id: "systemInfo",
    name: "System information",
    icon: "assets/icon/system-info.png",
    isVisible: true,
    isOpened: false
  }
];

export const DEFAULT_APP_LOGO = {
  logo: "assets/img/logo.png"
};
