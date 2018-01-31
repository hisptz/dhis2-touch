import { NgModule } from '@angular/core';
import {IonicModule} from "ionic-angular";
import { FilterByNamePipe } from './filter-by-name/filter-by-name';
@NgModule({
	declarations: [FilterByNamePipe],
	imports: [IonicModule],
	exports: [FilterByNamePipe]
})
export class PipesModule {}
