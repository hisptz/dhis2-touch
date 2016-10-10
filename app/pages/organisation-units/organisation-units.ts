import { Component } from '@angular/core';
import { ViewController,NavParams } from 'ionic-angular';

/*
  Generated class for the OrganisationUnitsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/organisation-units/organisation-units.html',
})
export class OrganisationUnitsPage {

  private data : any;
  private loadingMessages : any;
  private loadingData :boolean = false;
  constructor(private viewCtrl: ViewController,private params : NavParams){
    this.loadingData = false;
    this.loadingMessages = [];
    this.loadingMessages.push('setting data');
    this.data = this.params.get('data');
    this.loadingMessages = [];
  }

  dismiss() {
    this.viewCtrl.dismiss({'id' : this.data[0].id,name:this.data[0].name });
  }

}
