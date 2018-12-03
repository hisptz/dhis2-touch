import { Component, OnInit, Input } from '@angular/core';

/**
 * Generated class for the ProgramRuleActionMessageComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'program-rule-action-message',
  templateUrl: 'program-rule-action-message.html'
})
export class ProgramRuleActionMessageComponent implements OnInit {
  @Input() programRuleActionMessage: any;
  @Input() isEventCompleted: boolean;

  icon: string;
  message: string;
  messageType: string;
  isOnComplete: boolean;

  constructor() {}

  ngOnInit() {
    if (this.programRuleActionMessage) {
      const { message } = this.programRuleActionMessage;
      const { isOnComplete } = this.programRuleActionMessage;
      const { messageType } = this.programRuleActionMessage;
    }
  }
}
