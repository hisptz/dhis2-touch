import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

/**
 * Generated class for the AppsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-apps',
  templateUrl: 'apps.html'
})
export class AppsPage implements OnInit {
  animationEffect: any;

  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.animationEffect = {
      data_entry: '',
      event_capture: '',
      reports: '',
      dashboard: '',
      tracker_capture: '',
      sync: '',
      settings: ''
    };
  }

  open() {
    const modal = this.modalCtrl.create('OptionListModalPage', {options : this.getOptions()}, {
      cssClass: 'inset-modal'
    });
    modal.onDidDismiss((result : any)=>{
      if(result){
        console.log(JSON.stringify(result))
      }
    })
    modal.present();
  }

  goToView(key) {
    this.applyAnimation(key);
    setTimeout(() => {
      if (key == 'data_entry') {
        this.setView('DataEntryPage');
      } else if (key == 'event_capture') {
        this.setView('EventCapturePage');
      } else if (key == 'reports') {
        this.setView('ReportsPage');
      } else if (key == 'dashboard') {
        this.setView('DashboardPage');
      } else if (key == 'tracker_capture') {
        this.setView('TrackerCapturePage');
      } else if (key == 'sync') {
        this.setView('SyncPage');
      } else if (key == 'settings') {
        this.setView('SettingsPage');
      }
    }, 60);
  }

  setView(viewName) {
    this.navCtrl.push(viewName).then(() => {});
  }

  applyAnimation(key: any) {
    this.animationEffect[key] = 'animated bounceIn';
    setTimeout(() => {
      this.animationEffect[key] = '';
    }, 100);
  }

  getOptions(){
    return [{"code":"None","name":"None","id":"FvELRchwEUh"},{"code":"Penicillin","name":"Penicillin","id":"kfHfAdZM7Rb"},{"code":"Other medicine - please specify","name":"Other medicine - please specify","id":"PNSFVo0NsBh"},{"code":"Other severe allergy - please specify","name":"Other severe allergy - please specify","id":"QWmvlWyapCP"}]
  }

}
