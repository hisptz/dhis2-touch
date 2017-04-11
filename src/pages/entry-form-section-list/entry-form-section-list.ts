import { Component ,OnInit} from '@angular/core';
import { ViewController,NavParams } from 'ionic-angular';

/*
  Generated class for the EntryFormSectionList page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-entry-form-section-list',
  templateUrl: 'entry-form-section-list.html'
})
export class EntryFormSectionListPage implements OnInit{


  public entryFormSections : any;
  public entryFormSectionsCopy : any;
  public currentEntryFormId : string;

  constructor(public navParams: NavParams,

              public viewCtrl: ViewController) {}

  ngOnInit() {
    this.currentEntryFormId = this.navParams.get("currentEntryFormId");
    this.entryFormSections = this.navParams.get("entryFormSections");
    this.entryFormSectionsCopy = this.navParams.get("entryFormSections");
  }

  getFilteredList(event: any) {
    let searchValue = event.target.value;
    this.entryFormSections = this.entryFormSectionsCopy;
    if(searchValue && searchValue.trim() != ''){
      this.entryFormSections = this.entryFormSections.filter((entryFormSection:any) => {
        return (entryFormSection.name.toLowerCase().indexOf(searchValue.toLowerCase()) > -1);
      })
    }
  }

  setCurrentEntryFormSection(selectedEntryFormSection){
    this.viewCtrl.dismiss({currentEntryFormId : selectedEntryFormSection.id});
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
