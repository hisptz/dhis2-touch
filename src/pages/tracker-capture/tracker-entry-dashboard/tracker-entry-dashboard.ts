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
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  IonicPage,
  Content,
  ModalController,
  ActionSheetController,
  NavController,
  NavParams
} from 'ionic-angular';
import * as _ from 'lodash';
import { Store } from '@ngrx/store';
import { State, getCurrentUserColorSettings } from '../../../store';
import { Observable } from 'rxjs';
import { TrackerCaptureProvider } from '../../../providers/tracker-capture/tracker-capture';
import { UserProvider } from '../../../providers/user/user';
import { AppProvider } from '../../../providers/app/app';
import { ProgramsProvider } from '../../../providers/programs/programs';
import { OrganisationUnitsProvider } from '../../../providers/organisation-units/organisation-units';
import { TrackedEntityAttributeValuesProvider } from '../../../providers/tracked-entity-attribute-values/tracked-entity-attribute-values';
import { EventCaptureFormProvider } from '../../../providers/event-capture-form/event-capture-form';
import { SettingsProvider } from '../../../providers/settings/settings';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { EnrollmentsProvider } from '../../../providers/enrollments/enrollments';
import { ProgramRulesProvider } from '../../../providers/program-rules/program-rules';
import { CurrentUser } from '../../../models';

@IonicPage()
@Component({
  selector: 'page-tracker-entry-dashboard',
  templateUrl: 'tracker-entry-dashboard.html'
})
export class TrackerEntryDashboardPage implements OnInit {
  currentOrganisationUnit: any;
  currentProgram: any;
  currentUser: any;
  trackedEntityInstance: any;
  enrollment: any;
  programStages: Array<any>;
  programTrackedEntityAttributes: Array<any>;
  dataObject: any = {};
  trackedEntityAttributesSavingStatusClass: any;
  trackedEntityAttributeValuesObject: any = {};
  isLoading: boolean;
  loadingMessage: string;
  icons: any = {};
  trackerRegistrationForm: string;
  formLayout: string;
  programSkipLogicMetadata: any;
  hiddenSections: any;
  hiddenProgramStages: any;
  hiddenFields: any;
  errorOrWarningMessage: any;
  colorSettings$: Observable<any>;
  @ViewChild(Content) content: Content;
  private _dataUpdateStatus$: BehaviorSubject<{
    [elementId: string]: string;
  }> = new BehaviorSubject<{ [elementId: string]: string }>({});
  dataUpdateStatus$: Observable<{ [elementId: string]: string }>;

  constructor(
    private store: Store<State>,
    private navCtrl: NavController,
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private eventCaptureFormProvider: EventCaptureFormProvider,
    private userProvider: UserProvider,
    private appProvider: AppProvider,
    private programsProvider: ProgramsProvider,
    private trackedEntityAttributeValuesProvider: TrackedEntityAttributeValuesProvider,
    private organisationUnitsProvider: OrganisationUnitsProvider,
    private trackerCaptureProvider: TrackerCaptureProvider,
    private settingProvider: SettingsProvider,
    private enrollmentsProvider: EnrollmentsProvider,
    private programRulesProvider: ProgramRulesProvider
  ) {
    this.colorSettings$ = this.store.select(getCurrentUserColorSettings);
    this.icons['addNewCase'] = 'assets/icon/add-new-case.png';
    this.icons['menu'] = 'assets/icon/menu.png';
    this.hiddenFields = {};
    this.hiddenProgramStages = {};
    this.hiddenSections = {};
    this.errorOrWarningMessage = {};
    this.dataUpdateStatus$ = this._dataUpdateStatus$.asObservable();
    this.isLoading = true;
    this.loadingMessage = '';
    this.trackerRegistrationForm = '';
  }

  goBack() {
    this.navCtrl.pop();
  }
  ngOnInit() {
    this.loadingMessage = 'Discovering current user information';
    this.userProvider.getCurrentUser().subscribe((currentUser: CurrentUser) => {
      this.currentUser = currentUser;
      this.setCurrentProgramAndOrgnisationUnit();
      this.discoveringAndSetFormLayout(currentUser);
      const { id } = this.currentProgram;
      const trackedEntityInstancesId = this.navParams.get(
        'trackedEntityInstancesId'
      );
      const isNewRegistrationForm = trackedEntityInstancesId ? false : true;
      this.discoveringTrackedEntityRegistration(
        id,
        currentUser,
        trackedEntityInstancesId,
        isNewRegistrationForm
      );
    });
  }

  setCurrentProgramAndOrgnisationUnit() {
    this.currentOrganisationUnit = this.organisationUnitsProvider.getLastSelectedOrganisationUnit();
    this.currentProgram = this.programsProvider.getLastSelectedProgram();
    const { incidentDateLabel, enrollmentDateLabel } = this.currentProgram;
    if (
      incidentDateLabel &&
      !isNaN(incidentDateLabel) &&
      incidentDateLabel.trim() !== ''
    ) {
      this.currentProgram.incidentDateLabel = 'Incident date';
    }
    if (
      enrollmentDateLabel &&
      !isNaN(enrollmentDateLabel) &&
      enrollmentDateLabel !== ''
    ) {
      this.currentProgram.enrollmentDateLabel = 'Enrollment date';
    }
  }

  discoveringAndSetFormLayout(user: CurrentUser) {
    this.settingProvider.getSettingsForTheApp(user).subscribe(settings => {
      if (settings && settings.entryForm && settings.entryForm.formLayout) {
        this.formLayout = settings.entryForm.formLayout;
      }
    });
  }

  discoveringTrackedEntityRegistration(
    programId: string,
    currentUser: CurrentUser,
    trackedEntityInstancesId: string,
    isNewRegistrationForm?: boolean
  ) {
    this.isLoading = true;
    this.loadingMessage = 'Discovering registration fields';
    this.trackerCaptureProvider
      .getTrackedEntityRegistration(programId, currentUser)
      .subscribe(
        (programTrackedEntityAttributes: any) => {
          this.programTrackedEntityAttributes = programTrackedEntityAttributes;
          this.trackerCaptureProvider
            .getTrackedEntityRegistrationDesignForm(programId, currentUser)
            .subscribe(
              form => {
                this.trackerRegistrationForm = form;
                this.discoveringProgramStages(
                  programId,
                  currentUser,
                  trackedEntityInstancesId,
                  isNewRegistrationForm
                );
              },
              error => {
                this.isLoading = false;
                console.log(JSON.stringify(error));
                this.appProvider.setNormalNotification(
                  'Failed to discover registration entry form'
                );
              }
            );
        },
        error => {
          this.isLoading = false;
          console.log(JSON.stringify(error));
          this.appProvider.setNormalNotification(
            'Failed to discover registration fields'
          );
        }
      );
  }

  discoveringProgramStages(
    programId: string,
    currentUser: CurrentUser,
    trackedEntityInstancesId: string,
    isNewRegistrationForm: boolean
  ) {
    this.loadingMessage = 'Discovering program stages';
    this.eventCaptureFormProvider
      .getProgramStages(programId, currentUser)
      .subscribe(
        (programStages: any) => {
          this.programStages = programStages;
          this.discoveringProgramSkipLogicMetadata(programId, currentUser);
          if (!isNewRegistrationForm) {
            this.discoveringTrackedEntityInstanceData(trackedEntityInstancesId);
          } else {
            this.isLoading = false;
          }
        },
        error => {
          console.log(JSON.stringify(error));
          this.isLoading = false;
          this.appProvider.setNormalNotification(
            'Failed to discover program stages'
          );
        }
      );
  }

  discoveringTrackedEntityInstanceData(trackedEntityInstanceId: string) {
    this.loadingMessage = 'Discovering tracked entity';
    this.trackerCaptureProvider
      .getTrackedEntityInstance(trackedEntityInstanceId, this.currentUser)
      .subscribe(
        (response: any) => {
          this.trackedEntityInstance = response;
          if (response && response.attributes) {
            response.attributes.map((attributeObject: any) => {
              const id = `${attributeObject.attribute}-trackedEntityAttribute`;
              this.dataObject[id] = { id: id, value: attributeObject.value };
              this.trackedEntityAttributeValuesObject[
                attributeObject.attribute
              ] = attributeObject.value;
            });
          }
          this.isLoading = false;
        },
        error => {
          console.log(JSON.stringify(error));
          this.isLoading = false;
          this.appProvider.setNormalNotification(
            'Failed to discover tracked entity'
          );
        }
      );
  }

  discoveringProgramSkipLogicMetadata(
    programId: string,
    currentUser: CurrentUser
  ) {
    this.eventCaptureFormProvider
      .getProgramSkipLogicMetadata(programId, currentUser)
      .subscribe(
        metadata => {
          this.programSkipLogicMetadata = metadata;
          setTimeout(() => {
            this.evaluatingProgramRules();
          }, 50);
        },
        error => {
          console.log(
            'Error on getting program skip logic metadata ' +
              JSON.stringify(error)
          );
        }
      );
  }

  evaluatingProgramRules() {
    this.programRulesProvider
      .getProgramRulesEvaluations(
        this.programSkipLogicMetadata,
        this.dataObject
      )
      .subscribe(
        res => {
          const { data } = res;
          if (data) {
            const { hiddenSections } = data;
            const { hiddenFields } = data;
            const { hiddenProgramStages } = data;
            const { errorOrWarningMessage } = data;
            const { assignedFields } = data;
          }
        },
        error => {
          console.log(
            'Error evaluate program rules : ' + JSON.stringify(error)
          );
        }
      );
  }
}
