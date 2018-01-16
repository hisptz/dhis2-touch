import {Component, OnInit} from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ImportSummariesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-import-summaries',
  templateUrl: 'import-summaries.html',
})
export class ImportSummariesPage implements OnInit{

  importSummaries : any;
  keys : any;

  constructor(public viewCtrl: ViewController, public navParams: NavParams) {
  }

  ngOnInit(){
    this.importSummaries = this.navParams.get("importSummaries");
    this.keys = this.navParams.get('keys');
  }

  dismiss(){
    this.viewCtrl.dismiss({});
  }

}
