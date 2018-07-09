import { Component, OnInit, Input } from '@angular/core';

/**
 * Generated class for the ProfileInfoComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'profile-info',
  templateUrl: 'profile-info.html'
})
export class ProfileInfoComponent implements OnInit {
  @Input() data;
  @Input() currentUser;

  constructor() {}

  ngOnInit() {}
}
