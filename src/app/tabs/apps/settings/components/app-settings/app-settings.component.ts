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
import { ModalController } from '@ionic/angular';
import { Translation } from 'src/models';
import { TranslationSelectionPage } from 'src/app/modals/translation-selection/translation-selection.page';

@Component({
  selector: 'app-app-settings',
  templateUrl: './app-settings.component.html',
  styleUrls: ['./app-settings.component.scss']
})
export class AppSettingsComponent implements OnInit {
  @Input() currentLanguage: string;
  @Input() supportedTranslations: Translation[];

  @Output() changeCurrentLanguage = new EventEmitter();

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  async openTranslationCodeSelection() {
    const modal = await this.modalController.create({
      component: TranslationSelectionPage,
      componentProps: {
        currentLanguage: this.currentLanguage,
        translationCodes: this.supportedTranslations
      },
      cssClass: 'inset-modal'
    });
    modal.present();
    const response = await modal.onDidDismiss();
    if (response && response.data) {
      const currrentTransalation: Translation = response.data;
      const { code } = currrentTransalation;
      this.changeCurrentLanguage.emit({ currentLanguage: code });
    }
  }
}
