/*
 *
 * Copyright 2015 HISP Tanzania
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
 * @since 2015
 * @author Joseph Chingalo <profschingalo@gmail.com>
 *
 */
import * as _ from "lodash";

export function applyErrorOrWarningActions(keyValuePairObject) {
  _.map(Object.keys(keyValuePairObject), key => {
    const { message } = keyValuePairObject[key];
    if (message && message.trim() !== "") {
      alert(message);
    }
  });
}

export function assignedValuesBasedOnProgramRules(
  programStageId,
  keyValuePairObject
) {
  _.map(Object.keys(keyValuePairObject), key => {
    try {
      const elementId =
        programStageId && programStageId !== ""
          ? `${programStageId}-${key}-val`
          : `${key}-val`;
      const value = keyValuePairObject[key];
      const inputElement: any = document.getElementById(`${elementId}`);
      inputElement.value = value;
      inputElement.setAttribute("readonly", "readonly");
      inputElement.setAttribute("disabled", "disabled");
    } catch (error) {
      error = JSON.stringify(error);
      console.log(`Error on assign values ${key} : ${error}`);
    }
  });
}

export function disableHiddenFiledsBasedOnProgramRules(
  programStageId: string,
  keyValuePairObject: any,
  errorOrWarningMessage: any,
  shouldLockFields: boolean,
  previousDisabledFields: string[]
) {
  const ommittedKeys = Object.keys(errorOrWarningMessage);
  if (!shouldLockFields) {
    _.each(
      document.getElementsByClassName("entryfield"),
      (inputElement: any) => {
        inputElement.removeAttribute("disabled");
        inputElement.removeAttribute("readonly");
      }
    );
    _.each(
      document.getElementsByClassName("entryselect"),
      (inputElement: any) => {
        inputElement.removeAttribute("disabled");
        inputElement.removeAttribute("readonly");
      }
    );
    _.each(
      document.getElementsByClassName("entrytrueonly"),
      (inputElement: any) => {
        inputElement.removeAttribute("disabled");
        inputElement.removeAttribute("readonly");
      }
    );
    _.each(
      document.getElementsByClassName("entryfileresource"),
      (inputElement: any) => {
        inputElement.removeAttribute("disabled");
        inputElement.removeAttribute("readonly");
      }
    );
    _.each(
      document.getElementsByClassName("entryfield-radio"),
      (inputElement: any) => {
        inputElement.removeAttribute("disabled");
        inputElement.removeAttribute("readonly");
      }
    );
  }

  _.map(Object.keys(keyValuePairObject), key => {
    if (!keyValuePairObject[key]) {
      try {
        const elementId =
          programStageId && programStageId !== ""
            ? `${programStageId}-${key}-val`
            : `${key}-val`;
        const inputElement: any = document.getElementById(`${elementId}`);
        inputElement.value = "";
        document.getElementById(
          elementId
            .split("-")
            .join(".")
            .replace(".val", ".tr")
        ).style.display = "";
      } catch (error) {}
    }
  });
  _.map(Object.keys(keyValuePairObject), key => {
    if (keyValuePairObject[key]) {
      try {
        const elementId =
          programStageId && programStageId !== ""
            ? `${programStageId}-${key}-val`
            : `${key}-val`;
        const inputElement: any = document.getElementById(`${elementId}`);
        inputElement.value = "";
        document.getElementById(
          elementId
            .split("-")
            .join(".")
            .replace(".val", ".tr")
        ).style.display = "none";
        try {
          inputElement.checked = "";
        } catch (error) {
          console.log({ error, type: "try to clear value on checkbox" });
        }
        if (_.indexOf(ommittedKeys, key) === -1) {
          inputElement.setAttribute("readonly", "readonly");
          inputElement.setAttribute("disabled", "disabled");
        }
      } catch (error) {
        error = JSON.stringify(error);
        console.log(`Error on hide element ${key} : ${error}`);
      }
    }
  });

  // restore all disabled fields from design
  _.map(previousDisabledFields, elementId => {
    try {
      const inputElement: any = document.getElementById(`${elementId}`);
      inputElement.setAttribute("readonly", "readonly");
      inputElement.setAttribute("disabled", "disabled");
    } catch (error) {}
  });
}
