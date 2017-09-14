import { Component,OnInit } from '@angular/core';
import {ViewController, NavParams, IonicPage} from 'ionic-angular';
import {ProgramsProvider} from "../../providers/programs/programs";

/*
 Generated class for the ProgramSelection page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-program-selection',
  templateUrl: 'program-selection.html'
})
export class ProgramSelection implements OnInit{

  public programsList : any;
  public currentSelectedProgram : string;

  constructor(public viewCtrl: ViewController,public params : NavParams, public programProvider: ProgramsProvider) {}

  ngOnInit() {
    this.setModalData();
  }

  setModalData(){
    this.currentSelectedProgram = "";
    this.programsList = this.params.get('data');
    let selectedProgram = this.params.get('selectedProgram');
    if(selectedProgram && selectedProgram.name){
      this.currentSelectedProgram = selectedProgram.name;
    }
  }

  getFilteredList(ev: any) {
    let val = ev.target.value;
    this.programsList = this.params.get('data');
    if(val && val.trim() != ''){
      this.programsList = this.programsList.filter((program:any) => {
        return (program.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  setSelectedProgram(selectedProgram){
    this.programProvider.setLastSelectedProgram(selectedProgram);
    this.viewCtrl.dismiss(selectedProgram);
  }

  dismiss() {
    var parameter = {};
    this.viewCtrl.dismiss(parameter);
  }

}
