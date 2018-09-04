import { NgModule } from '@angular/core';
import {IonicModule} from "ionic-angular";
import { FilterByNamePipe } from './filter-by-name/filter-by-name';
import { SafePipe } from './safe/safe';
@NgModule({
	declarations: [FilterByNamePipe,
    SafePipe],
	imports: [IonicModule],
	exports: [FilterByNamePipe,
    SafePipe]
})
export class PipesModule {}
