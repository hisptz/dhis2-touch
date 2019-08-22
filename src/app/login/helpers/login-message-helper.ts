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
export function getProgressMessage(process: string, processType: string) {
  let progressMessage = processType + ' ' + process;
  if (process === 'organisationUnits') {
    progressMessage =
      processType === 'dowmloading'
        ? 'Discovering assigned organisation units'
        : processType === 'start-saving'
        ? 'Saving assigned organisation units'
        : processType === 'saving'
        ? 'Assigned organisation units have been discovered'
        : process;
  } else if (process === 'dataSets') {
    progressMessage =
      processType === 'dowmloading'
        ? 'Discovering entry forms'
        : processType === 'start-saving'
        ? 'Saving entry forms'
        : processType === 'saving'
        ? 'Entry forms have been discovered'
        : process;
  } else if (process === 'sections') {
    progressMessage =
      processType === 'dowmloading'
        ? 'Discovering entry form sections'
        : processType === 'start-saving'
        ? 'Saving entry form sections'
        : processType === 'saving'
        ? 'Entry form sections have been discovered'
        : process;
  } else if (process === 'dataElements') {
    progressMessage =
      processType === 'dowmloading'
        ? 'Discovering entry form fields'
        : processType === 'start-saving'
        ? 'Saving entry form fields'
        : processType === 'saving'
        ? 'Entry form fields have been discovered'
        : process;
  } else if (process === 'categoryCombos') {
    progressMessage =
      processType === 'dowmloading'
        ? 'Discovering entry form fields categories'
        : processType === 'start-saving'
        ? 'Saving entry form fields categories'
        : processType === 'saving'
        ? 'Entry form fields categories have been discovered'
        : process;
  } else if (process === 'smsCommand') {
    progressMessage =
      processType === 'dowmloading'
        ? 'Discovering SMS commands'
        : processType === 'start-saving'
        ? 'Saving SMS commands'
        : processType === 'saving'
        ? 'SMS commands have been discovered'
        : process;
  } else if (process === 'programs') {
    progressMessage =
      processType === 'dowmloading'
        ? 'Discovering programs'
        : processType === 'start-saving'
        ? 'Saving programs'
        : processType === 'saving'
        ? 'Programs have been discovered'
        : process;
  } else if (process === 'programStageSections') {
    progressMessage =
      processType === 'dowmloading'
        ? 'Discovering program stage section'
        : processType === 'start-saving'
        ? 'Saving program stage section'
        : processType === 'saving'
        ? 'Program stage section have been discovered'
        : process;
  } else if (process === 'programRules') {
    progressMessage =
      processType === 'dowmloading'
        ? 'Discovering program rules'
        : processType === 'start-saving'
        ? 'Saving program rules'
        : processType === 'saving'
        ? 'Program Rules have been discovered'
        : process;
  } else if (process === 'programRuleActions') {
    progressMessage =
      processType === 'dowmloading'
        ? 'Discovering program rules actions'
        : processType === 'start-saving'
        ? 'Saving program rules actions'
        : processType === 'saving'
        ? 'Program rules actions have been discovered'
        : process;
  } else if (process === 'programRuleVariables') {
    progressMessage =
      processType === 'dowmloading'
        ? 'Discovering program rules variables'
        : processType === 'start-saving'
        ? 'Saving program rules variables'
        : processType === 'saving'
        ? 'Program rules variables have been discovered'
        : process;
  } else if (process === 'indicators') {
    progressMessage =
      processType === 'dowmloading'
        ? 'Discovering indicators'
        : processType === 'start-saving'
        ? 'Saving indicators'
        : processType === 'saving'
        ? 'Indicators have been discovered'
        : process;
  } else if (process === 'reports') {
    progressMessage =
      processType === 'dowmloading'
        ? 'Discovering standard reports'
        : processType === 'start-saving'
        ? 'Saving standard reports'
        : processType === 'saving'
        ? 'Reports have been discovered'
        : process;
  } else if (process === 'constants') {
    progressMessage =
      processType === 'dowmloading'
        ? 'Discovering constants'
        : processType === 'start-saving'
        ? 'Saving constants'
        : processType === 'saving'
        ? 'Constants have been discovered'
        : process;
  } else if (process === 'dataStore') {
    progressMessage =
      processType === 'dowmloading'
        ? 'Discovering data store'
        : processType === 'start-saving'
        ? 'Saving data store'
        : processType === 'saving'
        ? 'Data store has been discovered'
        : process;
  } else if (process === 'validationRules') {
    progressMessage =
      processType === 'dowmloading'
        ? 'Discovering validation rules'
        : processType === 'start-saving'
        ? 'Saving validation rules'
        : processType === 'saving'
        ? 'Validation rules has been discovered'
        : process;
  }
  return progressMessage;
}
