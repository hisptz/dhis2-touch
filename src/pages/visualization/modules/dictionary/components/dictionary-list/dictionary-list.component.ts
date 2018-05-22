import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import * as _ from 'lodash';
import { DictionaryStoreService } from '../../services/dictionary-store.service';
import { Observable } from 'rxjs/Observable';
import { Dictionary } from './../../models/dictionary';
import { VisualizationLayer } from '../../../../models/visualization-layer.model';

@Component({
  selector: 'dictionary-list',
  templateUrl: './dictionary-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DictionaryListComponent implements OnInit {
  @Input() visualizationLayers: VisualizationLayer[];
  dictionaryList$: Observable<Dictionary[]>;
  activeItem: number;

  constructor(private dictionaryStoreService: DictionaryStoreService) {
    this.dictionaryList$ = Observable.of([]);
    this.activeItem = 0;
  }

  ngOnInit() {
    if (this.visualizationLayers.length > 0) {
      const metadataIdentifiers = _.uniq(_.flatten(_.map(this.visualizationLayers, layer => layer.metadataIdentifiers)))
      this.dictionaryStoreService.initializeInfo(metadataIdentifiers);
      this.dictionaryList$ = this.dictionaryStoreService.getInfo(
        metadataIdentifiers
      );
    }
  }

  setActiveItem(index, e) {
    e.stopPropagation();
    if (this.activeItem === index) {
      this.activeItem = -1;
    } else {
      this.activeItem = index;
    }
  }
}
