import {Component, OnInit} from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';

/**
 * Generated class for the EventHideShowColumnPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-event-hide-show-column',
  templateUrl: 'event-hide-show-column.html',
})
export class EventHideShowColumnPage implements OnInit{

  constructor(public viewCtrl: ViewController,public params : NavParams) {
  }

  ngOnInit(){

  }

}
