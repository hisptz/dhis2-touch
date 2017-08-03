import { Component ,Input} from '@angular/core';
/*
  Generated class for the ProgressBar page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-progress-bar',
  templateUrl: 'progress-bar.html'
})
export class ProgressBarPage {

  @Input('progress') progress;
  constructor() {
  }
}
