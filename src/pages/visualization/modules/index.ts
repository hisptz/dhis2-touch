import { ChartModule } from './chart/chart.module';
import { TableModule } from './table/table.module';
import { DictionaryModule } from './dictionary/dictionary.module';
import { ResourcesModule } from './resources/resources.module';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { FeedbackMessageModule } from './feedback-message/feedback-message.module';
import { WidgetModule } from './widget/widget.module';
import { MapModule } from './map/map.module';

export const modules: any[] = [
  ChartModule, TableModule, DictionaryModule, ResourcesModule, UsersModule, ReportsModule, FeedbackMessageModule, WidgetModule, MapModule
];
