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

const _ = require('lodash');
import { DEFAULT_APP_METADATA } from 'src/constants';

export function getAppMetadata() {
  const programMetadata = DEFAULT_APP_METADATA.programs;
  const dataSetMetadata = DEFAULT_APP_METADATA.dataSets;
  const omittedKey = [];
  if (
    (programMetadata && programMetadata.defaultIds.length > 0) ||
    (dataSetMetadata && dataSetMetadata.defaultIds.length > 0)
  ) {
    if (programMetadata && programMetadata.defaultIds.length === 0) {
      omittedKey.push('programs');
    }
    if (dataSetMetadata && dataSetMetadata.defaultIds.length === 0) {
      omittedKey.push('dataSets');
    }
  }
  const appMetadata = _.filter(
    Object.keys(_.omit(DEFAULT_APP_METADATA, omittedKey)),
    (key: string) => {
      const metadata = DEFAULT_APP_METADATA[key];
      return metadata && metadata.isOnLogin;
    }
  );
  return appMetadata;
}
