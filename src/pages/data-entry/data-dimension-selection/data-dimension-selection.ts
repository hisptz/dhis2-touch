import { Component, OnInit } from "@angular/core";
import { IonicPage, NavParams, ViewController } from "ionic-angular";

/**
 * Generated class for the DataDimensionSelectionPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-data-dimension-selection",
  templateUrl: "data-dimension-selection.html"
})
export class DataDimensionSelectionPage implements OnInit {
  categoryOptions: any;
  currentSelection: any;
  icon: string;
  title: string = "data dimension selection";

  constructor(private navParams: NavParams, private viewCtrl: ViewController) {}

  ngOnInit() {
    this.icon = "assets/icon/form.png";
    this.currentSelection = this.navParams.get("currentSelection");
    this.title = this.navParams.get("title");
    this.categoryOptions = this.navParams.get("categoryOptions");
  }

  getFilteredList(ev: any) {
    let val = ev.target.value;
    this.categoryOptions = this.navParams.get("categoryOptions");
    if (val && val.trim() != "") {
      this.categoryOptions = this.categoryOptions.filter(
        (categoryOption: any) => {
          return (
            categoryOption.name.toLowerCase().indexOf(val.toLowerCase()) > -1
          );
        }
      );
    }
  }

  setSelectedCategoryOption(categoryOption) {
    this.viewCtrl.dismiss(categoryOption);
  }

  dismiss() {
    this.viewCtrl.dismiss({});
  }
}
