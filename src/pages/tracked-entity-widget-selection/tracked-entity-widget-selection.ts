import {Component, OnDestroy, OnInit} from '@angular/core';
import {IonicPage,NavParams, ViewController} from 'ionic-angular';

/**
 * Generated class for the TrackedEntityWidgetSelectionPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tracked-entity-widget-selection',
  templateUrl: 'tracked-entity-widget-selection.html',
})
export class TrackedEntityWidgetSelectionPage implements OnInit,OnDestroy{

  dashboardWidgets : any;
  currentWidget : any;
  icon : string;

  constructor(private navParams: NavParams,private  viewCtrl : ViewController) {
  }

  ngOnInit(){
    this.icon = "assets/tracker/list-of-items.png";
    this.dashboardWidgets = this.navParams.get('dashboardWidgets');
    this.currentWidget = this.navParams.get('currentWidget');
  }

  getFilteredList(ev: any) {
    let val = ev.target.value;
    this.dashboardWidgets = this.navParams.get('dashboardWidgets');
    if(val && val.trim() != ''){
      this.dashboardWidgets = this.dashboardWidgets.filter((dashboardWidget:any) => {
        return (dashboardWidget.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  setSelectedWidget(currentWidget){
    this.viewCtrl.dismiss(currentWidget);
  }

  dismiss(){
    this.viewCtrl.dismiss({});
  }

  ngOnDestroy(){
    this.currentWidget = null;
    this.dashboardWidgets = null;
  }

}
