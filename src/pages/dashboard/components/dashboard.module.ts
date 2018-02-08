import { NgModule } from "@angular/core";
import { IonicModule } from "ionic-angular";
import { AppContainerComponent } from "./app-container/app-container.component";
import { ReportsContainerComponent } from "./reports-container/reports-container.component";
import { ResourcesContainerComponent } from "./resources-container/resources-container.component";
import { UsersContainerComponent } from "./users-container/users-container.component";
import { VisualizationTypesSectionComponent } from "./visualization-types-section/visualization-types-section.component";
import {ReportsModule} from "../../../modules/reports/reports.module";
import {ResourcesModule} from "../../../modules/resources/resources.module";
import {UsersModule} from "../../../modules/users/users.module";
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    VisualizationTypesSectionComponent,
    AppContainerComponent,
    ReportsContainerComponent,
    ResourcesContainerComponent,
    UsersContainerComponent
  ],
  imports: [IonicModule,UsersModule,
    ResourcesModule,
    ReportsModule,PipesModule],
  exports: [
    VisualizationTypesSectionComponent,
    AppContainerComponent,
    ReportsContainerComponent,
    ResourcesContainerComponent,
    UsersContainerComponent
  ]
})
export class DashboardModule {}
