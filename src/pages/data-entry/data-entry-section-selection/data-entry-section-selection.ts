import { Component, OnInit } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { AppTranslationProvider } from '../../../providers/app-translation/app-translation';

/**
 * Generated class for the DataEntrySectionSelectionPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-data-entry-section-selection',
  templateUrl: 'data-entry-section-selection.html'
})
export class DataEntrySectionSelectionPage implements OnInit {
  pager: any;
  sections: Array<any>;
  currentSection: any;
  icon: string;
  translationMapper: any;

  constructor(
    private navParams: NavParams,
    private viewCtrl: ViewController,
    private appTranslation: AppTranslationProvider
  ) {}

  ngOnInit() {
    this.icon = 'assets/icon/list.png';
    this.pager = this.navParams.get('pager');
    this.sections = this.navParams.get('sections');
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
    this.sections = this.navParams.get('sections');
    if (val && val.trim() != '') {
      this.sections = this.sections.filter((section: any) => {
        return section.name.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
    }
  }

  setSelectedSection(section) {
    this.pager.page = this.navParams.get('sections').indexOf(section) + 1;
    this.viewCtrl.dismiss(this.pager);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  getValuesToTranslate() {
    return ['There is nothing to select'];
  }
}
