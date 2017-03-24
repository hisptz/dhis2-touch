import { Component,OnInit,Input } from '@angular/core';
import {MetadataDictionaryService} from "../../providers/metadata-dictionary-service";

/*
  Generated class for the MetadataDictionary page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-metadata-dictionary',
  templateUrl: 'metadata-dictionary.html',
})
export class MetadataDictionary implements OnInit{

  @Input() metadataIdentifiers;

  constructor(public MetadataDictionaryService : MetadataDictionaryService) {}

  ngOnInit() {

  }

}
