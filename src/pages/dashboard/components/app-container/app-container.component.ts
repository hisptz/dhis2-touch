import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-app-container",
  templateUrl: "./app-container.component.html"
})
export class AppContainerComponent implements OnInit {
  @Input() appUrl: string;
  @Input() height: string;
  @Input() currentUser: any;
  constructor() {}

  ngOnInit() {
    this.appUrl = this.currentUser.serverUrl + this.appUrl;
  }
}
