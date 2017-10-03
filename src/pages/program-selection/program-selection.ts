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
  public currentProgram : any;
  icons:any = {};

  constructor(public viewCtrl: ViewController,public params : NavParams, public programProvider: ProgramsProvider) {}

  ngOnInit() {
    this.setModalData();
  }

  setModalData(){
    this.icons.program = "assets/event-capture/program.png";
    this.programsList = this.params.get('programsList');
    this.currentProgram = this.params.get('currentProgram');
  }

  getFilteredList(ev: any) {
    let searchValue = ev.target.value;
    this.programsList = this.params.get('programsList');
    if(searchValue && searchValue.trim() != ''){
      this.programsList = this.programsList.filter((program:any) => {
        return (program.name.toLowerCase().indexOf(searchValue.toLowerCase()) > -1);
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
