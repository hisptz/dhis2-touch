import { Component,OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the Help page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-help',
  templateUrl: 'help.html'
})
export class HelpPage implements OnInit{

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ngOnInit() {

  }

}
