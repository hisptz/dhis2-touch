import { Component } from "@angular/core";

/**
 * Generated class for the MultiOrganisationUnitComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: "multi-organisation-unit",
  templateUrl: "multi-organisation-unit.html"
})
export class MultiOrganisationUnitComponent {
  text: string;

  constructor() {
    console.log("Hello MultiOrganisationUnitComponent Component");
    this.text = "Hello World";
  }
}
