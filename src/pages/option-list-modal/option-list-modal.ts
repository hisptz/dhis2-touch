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
  options: Array<any>;
  isLoading: boolean;

  constructor(private navParams: NavParams, private viewCtrl: ViewController) {
    this.options = [];
    this.title = 'Options selections';
    this.isLoading = true;
  }

  ngOnInit() {
    const title = this.navParams.get('title');
    const options = this.navParams.get('options');
    if (title) {
      this.title = title;
    }
    if (options) {
      this.options = options;
    }
    this.isLoading = false;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  getItems(event: any) {}
}
