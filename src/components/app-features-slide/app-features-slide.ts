import {Component, OnInit, ViewChild} from '@angular/core';
import {Slides} from "ionic-angular";

/**
 * Generated class for the AppFeaturesSlideComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'app-features-slide',
  templateUrl: 'app-features-slide.html'
})
export class AppFeaturesSlideComponent implements OnInit{

  @ViewChild(Slides) slides: Slides;

  constructor() {
  }

  ngOnInit(){
  }

}
