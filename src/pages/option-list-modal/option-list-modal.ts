import { Component, OnInit } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';

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
  shouldFilter: boolean;
  currentPage: number;

  constructor(private navParams: NavParams, private viewCtrl: ViewController) {
    this.arrayOfOptions = [];
    this.arrayOfOptionsBackup = [];
    this.title = 'Options selections';
    this.isLoading = true;
    this.currentPage = 0;
  }

  ngOnInit() {
    const title = this.navParams.get('title');
    const options = this.navParams.get('options');
    if (title) {
      this.title = title;
    }
    if (options) {
      this.arrayOfOptions = this.getOptionsWithPaginations(options);
      this.arrayOfOptionsBackup = this.arrayOfOptions;
      this.currentPage = 71;
    }
    this.isLoading = false;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  previousPage() {
    if (this.currentPage > -1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.arrayOfOptions.length) {
      this.currentPage++;
    }
  }

  getOptionsWithPaginations(options) {
    let pageNumber = 0;
    const pageSize = 200;
    let array = [];
    while (this.paginate(options, pageSize, pageNumber).length > 0) {
      array.push(this.paginate(options, pageSize, pageNumber));
      pageNumber++;
    }
    return array;
  }

  paginate(array, pageSize, pageNumber) {
    return array.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize);
  }

  trackByFn(index, item) {
    return item.id;
  }

  getItems(event: any) {
    let value = event.target.value;
    if (value && value.trim() != '') {
      this.shouldFilter = true;
    } else {
      this.shouldFilter = false;
    }
  }
}
