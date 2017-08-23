import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Visualization} from "../../model/visualization";

/**
 * Generated class for the AppComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'app',
  templateUrl: 'app.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  @Input() visualizationObject: Visualization;
  @Input() currentUser;
  private _appUrl: string;
  private _appHeight: string;
  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit() {

    if(this.currentUser && this.currentUser.serverUrl){
      this._appUrl = this.currentUser.serverUrl + '/api/apps/' + this.visualizationObject.details.appKey + '/index.html?dashboardItemId=' + this.visualizationObject.id + '&output=embed';
    }


    this._appHeight = this.visualizationObject.details.itemHeight;

    setTimeout(() => {
      this.cd.detach()
    },0)
  }


  get appHeight(): string {
    return this._appHeight;
  }

  set appHeight(value: string) {
    this._appHeight = value;
  }

  get appUrl(): string {
    return this._appUrl;
  }

  set appUrl(value: string) {
    this._appUrl = value;
  }
}
