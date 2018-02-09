import { NgModule } from "@angular/core";
import { IonicModule } from "ionic-angular";
import { AppContainerComponent } from "./app-container/app-container.component";
import { ReportsContainerComponent } from "./reports-container/reports-container.component";
import { ResourcesContainerComponent } from "./resources-container/resources-container.component";
import { UsersContainerComponent } from "./users-container/users-container.component";
import { VisualizationTypesSectionComponent } from "./visualization-types-section/visualization-types-section.component";
import { ReportsModule } from "../../../modules/reports/reports.module";
import { ResourcesModule } from "../../../modules/resources/resources.module";
import { UsersModule } from "../../../modules/users/users.module";
import { PipesModule } from "../../../pipes/pipes.module";
import { VisualizationFilterSectionComponent } from "./visualization-filter-section/visualization-filter-section.component";
import { VisualizationCardLoaderComponent } from "./visualization-card-loader/visualization-card-loader.component";
import { DataFilterModule } from "../../../modules/data-filter/data-filter.module";
import { OrgUnitFilterModule } from "../../../modules/org-unit-filter/org-unit-filter.module";
import { LayoutModule } from "../../../modules/layout/layout.module";
import { PeriodFilterModule } from "../../../modules/period-filter/period-filter.module";
import {CommonModule} from "@angular/common";
import {SharedModule} from "../../../components/shared.module";

@NgModule({
  declarations: [
    VisualizationTypesSectionComponent,
    AppContainerComponent,
    ReportsContainerComponent,
    ResourcesContainerComponent,
    UsersContainerComponent,
    VisualizationCardLoaderComponent,
    VisualizationFilterSectionComponent
  ],
  imports: [
    IonicModule,
    UsersModule,
    ResourcesModule,
    CommonModule,
    DataFilterModule,
    LayoutModule,
    OrgUnitFilterModule,
    PeriodFilterModule,
    SharedModule,
    ReportsModule,
    PipesModule
  ],
  exports: [
    VisualizationTypesSectionComponent,
    AppContainerComponent,
    VisualizationFilterSectionComponent,
    ReportsContainerComponent,
    VisualizationCardLoaderComponent,
    ResourcesContainerComponent,
    UsersContainerComponent
  ]
})
export class DashboardModule {}
