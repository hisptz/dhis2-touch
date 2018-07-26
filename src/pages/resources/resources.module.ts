import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ResourcesPage } from './resources';
import {SharedModule} from "../../components/shared.module";
import { TranslateModule} from "@ngx-translate/core";
import {NgxPaginationModule} from 'ngx-pagination';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ResourcesPage,
  ],
  imports: [
    IonicPageModule.forChild(ResourcesPage),SharedModule, NgxPaginationModule,PipesModule,
    TranslateModule.forChild({})
  ],
})
export class ResourcesPageModule {}
