import { Component } from '@angular/core';
import { ViewController,NavParams } from 'ionic-angular';

/*
 Generated class for the ProgramSelection page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-program-selection',
  templateUrl: 'program-selection.html'
})
export class ProgramSelection {

  public programsList : any;

  constructor(public viewCtrl: ViewController,public params : NavParams) {
    this.setModalData();
  }

  ionViewDidLoad() {
    //console.log('Hello ProgramSelection Page');
  }

  setModalData(){
    this.programsList = this.params.get('data');
  }

  setSelectedProgram(selectedProgram){
    this.viewCtrl.dismiss(selectedProgram);
  }

  dismiss() {
    var parameter = {};
    this.viewCtrl.dismiss(parameter);
  }

}
