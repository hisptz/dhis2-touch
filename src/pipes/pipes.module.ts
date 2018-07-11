import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { FilterByNamePipe } from './filter-by-name/filter-by-name';
import { SafePipe } from './safe/safe';
import { SearchReportListPipe } from './search-report-list/search-report-list';
@NgModule({
	declarations: [FilterByNamePipe,
    SafePipe,
    SearchReportListPipe],
	imports: [IonicModule],
	exports: [FilterByNamePipe,
    SafePipe,
    SearchReportListPipe]
})
export class PipesModule {}
