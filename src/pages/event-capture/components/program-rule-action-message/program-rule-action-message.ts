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
  @Input() message: string;
  @Input() isOnComplete: boolean;
  @Input() messageType: string;

  icon: string;

  constructor() {}

  ngOnInit() {}
}
