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
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppItem } from 'src/models';

@Component({
  selector: 'app-apps-item-container',
  templateUrl: './apps-item-container.component.html',
  styleUrls: ['./apps-item-container.component.scss']
})
export class AppsItemContainerComponent implements OnInit {
  @Input()
  authorizedApps: AppItem[];

  @Output()
  selectedApp = new EventEmitter();

  animationEffect: any;

  constructor() {
    this.animationEffect = {};
  }

  ngOnInit() {}

  selectView(app: AppItem) {
    console.log('here');
    this.applyAnimation(app.id);
    setTimeout(() => {
      this.selectedApp.emit(app);
    }, 20);
  }

  applyAnimation(key: any) {
    this.animationEffect[key] = 'animated bounceIn';
    setTimeout(() => {
      this.animationEffect[key] = '';
    }, 50);
  }

  trackByFn(index: any, item: AppItem) {
    return item && item.id ? item.id : index;
  }
}
