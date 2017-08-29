import {Component, OnInit} from '@angular/core';
import {IonicPage, NavParams, ViewController} from 'ionic-angular';

/**
 * Generated class for the DataDimensionSelectionPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-data-dimension-selection',
  templateUrl: 'data-dimension-selection.html',
})
export class DataDimensionSelectionPage  implements OnInit{

  category : any;
  currentSelection : any;
  icon : string;
  title : string = "Data Dimension selection";

  constructor(private navParams: NavParams,private  viewCtrl : ViewController) {
  }

  ngOnInit(){
    this.icon = 'assets/data-entry/form.png';
    this.currentSelection = this.navParams.get("currentSelection");
    this.category = this.navParams.get("category");
    if(this.category.name){
      this.title = this.category.name + "'s selection";
    }
  }

  getFilteredList(ev: any) {
    let val = ev.target.value;
    this.category = this.navParams.get('category');
    if(val && val.trim() != ''){
      this.category.categoryOptions = this.category.categoryOptions.filter((categoryOption:any) => {
        return (categoryOption.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  setSelectedCategoryOption(categoryOption){
    this.viewCtrl.dismiss(categoryOption);
  }

  dismiss(){
    this.viewCtrl.dismiss({});
  }

}
