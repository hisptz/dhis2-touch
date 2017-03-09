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
  providers : [MetadataDictionaryService]
})
export class MetadataDictionary implements OnInit{

  @Input() metadataIdentifiers;

  constructor() {}

  ngOnInit() {

  }

  ionViewDidLoad() {
    console.log('Hello MetadataDictionary Page');
  }

}
