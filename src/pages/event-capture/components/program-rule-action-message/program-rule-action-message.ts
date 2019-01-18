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
