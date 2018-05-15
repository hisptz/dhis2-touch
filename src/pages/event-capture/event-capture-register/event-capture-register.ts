import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../../providers/user/user';
import { AppProvider } from '../../../providers/app/app';
import { ProgramsProvider } from '../../../providers/programs/programs';
import { OrganisationUnitsProvider } from '../../../providers/organisation-units/organisation-units';
import { EventCaptureFormProvider } from '../../../providers/event-capture-form/event-capture-form';
import { AppTranslationProvider } from '../../../providers/app-translation/app-translation';

/**
 * Generated class for the EventCaptureRegisterPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-event-capture-register',
  templateUrl: 'event-capture-register.html'
})
export class EventCaptureRegisterPage implements OnDestroy, OnInit {
  currentOrgUnit: any;
  currentProgram: any;
  programStage: any;
  currentUser: any;
  dataDimension: any;
  isLoading: boolean;
  loadingMessage: string;
  translationMapper: any;
  currentEvent: any;
  emptyEvent: any;

  constructor(
    private navCtr: NavController,
    private userProvider: UserProvider,
    private params: NavParams,
    private programsProvider: ProgramsProvider,
    private eventCaptureFormProvider: EventCaptureFormProvider,
    private organisationUnitProvider: OrganisationUnitsProvider,
    private appProvider: AppProvider,
    private appTranslation: AppTranslationProvider
  ) {}

  ngOnInit() {
    this.translationMapper = {};
    this.currentProgram = this.programsProvider.lastSelectedProgram;
    this.currentOrgUnit = this.organisationUnitProvider.lastSelectedOrgUnit;
    this.isLoading = true;
    this.dataDimension = this.params.get('dataDimension');
    this.appTranslation.getTransalations(this.getValuesToTranslate()).subscribe(
      (data: any) => {
        this.translationMapper = data;
        this.loadingCurrentUserInformation();
      },
      error => {
        this.loadingCurrentUserInformation();
      }
    );
  }

  loadingCurrentUserInformation() {
    let key = 'Discovering current user information';
    this.loadingMessage = this.translationMapper[key]
      ? this.translationMapper[key]
      : key;
    this.userProvider.getCurrentUser().subscribe(
      (user: any) => {
        this.currentUser = user;
        this.loadProgramStages(this.currentProgram.id);
      },
      error => {
        console.log(JSON.stringify(error));
        this.isLoading = false;
        this.appProvider.setNormalNotification(
          'Failed to discover current user information'
        );
      }
    );
  }

  goBack() {
    this.navCtr.pop();
  }

  setEmptyEventObject() {
    this.emptyEvent = this.eventCaptureFormProvider.getEmptyEvent(
      this.currentProgram,
      this.currentOrgUnit,
      this.programStage.id,
      this.dataDimension.attributeCos,
      this.dataDimension.attributeCc,
      'event-capture'
    );
  }

  loadProgramStages(programId) {
    let key = 'Discovering program stages';
    this.loadingMessage = this.translationMapper[key]
      ? this.translationMapper[key]
      : key;
    this.eventCaptureFormProvider
      .getProgramStages(programId, this.currentUser)
      .subscribe(
        (programStages: any) => {
          if (programStages && programStages.length > 0) {
            this.programStage = programStages[0];
            this.setEmptyEventObject();
          }
          let eventId = this.params.get('eventId');
          if (eventId) {
            key = 'Discovering data from local storage';
            this.loadingMessage = this.translationMapper[key]
              ? this.translationMapper[key]
              : key;
            this.eventCaptureFormProvider
              .getEventsByAttribute('id', [eventId], this.currentUser)
              .subscribe(
                (events: any) => {
                  if (events && events.length > 0) {
                    this.currentEvent = events[0];
                  }
                  this.isLoading = false;
                },
                error => {
                  this.isLoading = false;
                  console.log('On loading event with id' + eventId);
                  console.log(JSON.stringify(error));
                }
              );
          } else {
            this.currentEvent = this.eventCaptureFormProvider.getEmptyEvent(
              this.currentProgram,
              this.currentOrgUnit,
              this.programStage.id,
              this.dataDimension.attributeCos,
              this.dataDimension.attributeCc,
              'event-capture'
            );
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

  onEventDeleted() {
    this.navCtr.pop();
  }

  ngOnDestroy() {
    this.currentProgram = null;
    this.currentProgram = null;
  }

  getValuesToTranslate() {
    return [
      'Discovering current user information',
      'Discovering program stages',
      'Discovering data from local storage'
    ];
  }
}
