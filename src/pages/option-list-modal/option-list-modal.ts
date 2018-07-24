import { Component, OnInit } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import * as _ from 'lodash';

/**
 * Generated class for the OptionListModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-option-list-modal',
  templateUrl: 'option-list-modal.html'
})
export class OptionListModalPage implements OnInit {
  title: string;
  arrayOfOptions: Array<any>;
  arrayOfOptionsBackup: Array<any>;
  isLoading: boolean;
  currentPage: number;
  currentValue: string;

  constructor(private navParams: NavParams, private viewCtrl: ViewController) {
    this.arrayOfOptions = [];
    this.arrayOfOptionsBackup = [];
    this.title = 'Options selections';
    this.isLoading = true;
    this.currentPage = 1;
    this.currentValue = '';
  }

  ngOnInit() {
    const data = this.navParams.get('data');
    const { title } = data;
    const { currentValue } = data;
    const { options } = data;
    if (title) {
      this.title = title;
    }
    if (options) {
      this.arrayOfOptions = this.getOptionsWithPaginations(options);
      this.arrayOfOptionsBackup = this.arrayOfOptions;
    }
    if (currentValue) {
      this.currentValue = currentValue;
    }
    this.isLoading = false;
  }

  getItems(event: any) {
    let value = event.target.value;
    if (value && value.trim() != '') {
      const data = this.navParams.get('data');
      const options = data.options.filter((option: any) => {
        return option.name.toLowerCase().indexOf(value.toLowerCase()) > -1;
      });
      this.arrayOfOptions = this.getOptionsWithPaginations(options);
      this.currentPage = 1;
    } else {
      if (this.arrayOfOptions.length != this.arrayOfOptionsBackup.length) {
        this.arrayOfOptions = this.arrayOfOptionsBackup;
        this.currentPage = 1;
      }
    }
  }

  clearValue() {
    const option = { name: 'Empty code', id: 'empty-code', code: '' };
    this.selectOption(option);
  }

  selectOption(option) {
    this.viewCtrl.dismiss(option);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  previousPage() {
    this.currentPage--;
  }

  nextPage() {
    if (this.currentPage < this.arrayOfOptions.length) {
      this.currentPage++;
    }
  }

  getOptionsWithPaginations(options) {
    const pageSize = 250;
    return _.chunk(options, pageSize);
  }

  getSubArryByPagination(array, pageSize, pageNumber) {
    return array.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize);
  }

  trackByFn(index, item) {
    return item && item.id ? item.id : index;
  }
}
