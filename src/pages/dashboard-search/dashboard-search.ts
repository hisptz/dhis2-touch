import { Component ,OnInit} from '@angular/core';
import { ViewController,NavParams } from 'ionic-angular';
import {DashboardService} from "../../providers/dashboard-service";

/*
  Generated class for the DashboardSearch page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-dashboard-search',
  templateUrl: 'dashboard-search.html'
})
export class DashboardSearchPage implements OnInit{

  public currentDashboardName : string;
  public dashboards :any = [];
  public dashboardsCopy :any = [];

  constructor(public navParams: NavParams,
              public DashboardService : DashboardService,
              public viewCtrl: ViewController) {}
  ngOnInit() {
    let currentUser = this.navParams.get("currentUser");
    this.currentDashboardName = this.navParams.get("currentDashboardName");
    this.DashboardService.allDashboards(currentUser).then((dashboards: any)=>{
      this.dashboards = dashboards;
      this.dashboardsCopy = dashboards;
    });
  }

  getFilteredList(event: any) {
    let searchValue = event.target.value;
    this.dashboards = this.dashboardsCopy;
    if(searchValue && searchValue.trim() != ''){
      this.dashboards = this.dashboards.filter((dashboard:any) => {
        return (dashboard.name.toLowerCase().indexOf(searchValue.toLowerCase()) > -1);
      })
    }
  }

  setCurrentDashboard(selectedDashboard){
    this.viewCtrl.dismiss(selectedDashboard);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
