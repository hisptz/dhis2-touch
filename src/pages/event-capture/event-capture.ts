import { Component,OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the EventCapturePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-event-capture',
  templateUrl: 'event-capture.html',
})
export class EventCapturePage implements OnInit{

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ngOnInit(){

  }

}
