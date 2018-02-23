import { Component, OnInit } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { AppTranslationProvider } from '../../../providers/app-translation/app-translation';

/**
 * Generated class for the DataDimensionSelectionPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-data-dimension-selection',
  templateUrl: 'data-dimension-selection.html'
})
export class DataDimensionSelectionPage implements OnInit {
  categoryOptions: any;
  currentSelection: any;
  icon: string;
  title: string = 'Data dimension selection';
  translationMapper;

  constructor(
    private navParams: NavParams,
    private viewCtrl: ViewController,
    private appTranslation: AppTranslationProvider
  ) {}

  ngOnInit() {
    this.icon = 'assets/icon/form.png';
    this.currentSelection = this.navParams.get('currentSelection');
    this.title = this.navParams.get('title');
    this.categoryOptions = this.navParams.get('categoryOptions');
    this.translationMapper = {};
    this.appTranslation.getTransalations(this.getValuesToTranslate()).subscribe(
      (data: any) => {
        this.translationMapper = data;
      },
      error => {}
    );
  }

  getFilteredList(ev: any) {
    let val = ev.target.value;
    this.categoryOptions = this.navParams.get('categoryOptions');
    if (val && val.trim() != '') {
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

  getValuesToTranslate() {
    return ['There is no option to select'];
  }
}
