import {Component, OnInit} from '@angular/core';
import {IonicPage, NavParams, ViewController} from 'ionic-angular';
import {ProgramsProvider} from "../../providers/programs/programs";

/**
 * Generated class for the DataDimensionSelectionPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-program-options-selection',
  templateUrl: 'program-options-selection.html',
})
export class ProgramOptionsSelectionPage  implements OnInit{

  categoryOptions : any;
  currentSelection : any;
  icon : string;
  title : string = "Data Dimension selection";


  constructor(private navParams: NavParams,private  viewCtrl : ViewController, private programsProvider: ProgramsProvider) {
  }

  ngOnInit(){
    this.icon = 'assets/event-capture/programs.png';
    this.currentSelection = this.navParams.get("currentSelection");
    this.title = this.navParams.get("title");
    this.categoryOptions = this.navParams.get("categoryOptions");
  }

  getFilteredList(ev: any) {
    let val = ev.target.value;
    this.categoryOptions = this.navParams.get('categoryOptions');
    if(val && val.trim() != ''){
      this.categoryOptions = this.categoryOptions.filter((categoryOption:any) => {
        return (categoryOption.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  setSelectedCategoryOption(categoryOption){
    this.programsProvider.setLastSelectedProgramCategoryOption(categoryOption);
    this.viewCtrl.dismiss(categoryOption);
  }

  dismiss(){
    this.viewCtrl.dismiss({});
  }

}
