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
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-login-spinner',
  templateUrl: './login-spinner.component.html',
  styleUrls: ['./login-spinner.component.scss']
})
export class LoginSpinnerComponent implements OnInit {
  @Input()
  keyFlag: string;
  @Input()
  serverUrl: string;
  @Input()
  applicationTitle: string;
  @Input()
  keyApplicationIntro: string;
  @Input()
  keyApplicationFooter: string;
  @Input()
  keyApplicationNotification: string;

  icon: any = {
    appLogo: '',
    dhisLogo: ''
  };

  constructor() {
    this.icon.appLogo = 'assets/img/logo.png';
    this.icon.dhisLogo = 'assets/img/dhis_logo.png';
  }

  ngOnInit() {}
}
