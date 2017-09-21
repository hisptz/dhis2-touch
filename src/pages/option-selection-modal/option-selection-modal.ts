import {Component, OnInit} from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';

/**
 * Generated class for the OptionSelectionModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-option-selection-modal',
  templateUrl: 'option-selection-modal.html',
})

export class OptionSelectionModalPage implements OnInit{
  constructor(public viewCtrl: ViewController, public navParams: NavParams) {
  }

  ngOnInit(){

  }

  dismiss(){
    this.viewCtrl.dismiss({});
  }

}
