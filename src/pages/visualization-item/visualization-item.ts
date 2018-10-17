import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Store } from '@ngrx/store';
import { VisualizationState } from '../visualization/store/reducers/index';
import { ToggleFullScreenAction } from '../visualization/store/actions/visualization-ui-configuration.actions';

/**
 * Generated class for the VisualizationItemPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-visualization-item',
  templateUrl: './visualization-item.html',
})
export class VisualizationItemPage {

  id: string;
  uiConfigId: string;
  constructor(public navCtrl: NavController, public navParams: NavParams, private store: Store<VisualizationState>) {
    this.id = navParams.get('id');
    this.uiConfigId = navParams.get('uiConfigId');
  }

  ionViewDidLoad() {

  }

  ionViewWillLeave() {

  }

  onFullScreenLeave(e) {
    this.navCtrl.pop()
  }

}
