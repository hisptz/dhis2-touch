import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the DashBoardHome page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-dash-board-home',
  templateUrl: 'dash-board-home.html'
})
export class DashBoardHome {

  public options : any;

  constructor(public navCtrl: NavController) {
    this.options = {};
  }

  drawChart(){
    this.options = {
      title: { text: 'simple chart' },
      chart: { type: 'spline' },
      series: [
        {
        data: [49.9, 17.5, 10.4]
        },
        {
          data: [6.9, 11.5, 16.4]
        },
        {
          data: [42.9, 30.5, 14.8]
        },
        {
          data: [39.9, 18.5, 20.4]
        },
        {
          data: [16.9, 15.5, 1.4]
        },
        {
          data: [32.9, 3.5, 17.8]
        }
      ]
    };
  }

  ionViewDidLoad() {
  }

}
