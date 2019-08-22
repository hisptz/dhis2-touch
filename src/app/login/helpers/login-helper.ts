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
import { CurrentUser } from 'src/models';
import { DEFAULT_APP_METADATA } from 'src/constants';

export function getFormattedBaseUrl(url: string) {
  const urlToBeFormatted =
    url.split('/')[0] === 'https:' || url.split('/')[0] === 'http:'
      ? url
      : `http://${url}`;
  const baseUrlString = urlToBeFormatted.split('/');
  const urlArray = _.filter(baseUrlString, item => item && item.trim() !== '');
  if (urlArray.length > 0) {
    urlArray[0] = `${urlArray[0]}/`;
  }
  return getUrlWithLowercaseDomain(urlArray.join('/'));
}

export function getUrlWithLowercaseDomain(formattedBaseUrl: string) {
  const baseUrlArray = formattedBaseUrl.split('://');
  if (baseUrlArray.length > 0) {
    const domainName = baseUrlArray[1].split('/')[0];
    const lowerCaseDomain = baseUrlArray[1].split('/')[0].toLowerCase();
    formattedBaseUrl = formattedBaseUrl.replace(domainName, lowerCaseDomain);
  }
  return formattedBaseUrl;
}

export function getDataBaseName(user: CurrentUser) {
  const { serverUrl, username } = user;
  const databaseName: string = serverUrl
    .replace('://', '_')
    .replace(/[/\s]/g, '_')
    .replace(/[.\s]/g, '_')
    .replace(/[:\s]/g, '_');
  return `${databaseName}_${username}`;
}

export function getEmptyProcessTracker(
  processes: string[],
  isOnLogin: boolean
) {
  const progressTracker = {};
  progressTracker['communication'] = {
    expectedProcesses: isOnLogin ? 5 : 4,
    totalPassedProcesses: 0,
    passedProcesses: [],
    message: ''
  };
  const dataBaseStructure = DEFAULT_APP_METADATA;
  processes.map((process: string) => {
    const metadataObject = dataBaseStructure[process] || {};
    const { resourceType } = metadataObject;
    if (resourceType && resourceType !== '') {
      if (!progressTracker[resourceType]) {
        progressTracker[resourceType] = {
          expectedProcesses: 0,
          totalPassedProcesses: 0,
          passedProcesses: [],
          message: ''
        };
      }
      progressTracker[resourceType].expectedProcesses += 3;
    }
  });
  return progressTracker;
}

export function getCompletedTrackedProcess(progressTracker) {
  let completedTrackedProcess = [];
  Object.keys(progressTracker).map((resourceType: string) => {
    progressTracker[resourceType].passedProcesses.map((passedProcess: any) => {
      const type =
        passedProcess.split('-').length > 1
          ? passedProcess.split('-')[1]
          : passedProcess;
      if (type === 'saving') {
        passedProcess = passedProcess.split('-')[0];
        if (passedProcess) {
          completedTrackedProcess = _.concat(
            completedTrackedProcess,
            passedProcess
          );
        }
      }
    });
  });
  return completedTrackedProcess;
}

export function getPercetage(numerator, denominator) {
  const percentage =
    numerator && denominator ? Math.round((numerator / denominator) * 100) : 0;
  return percentage;
}
