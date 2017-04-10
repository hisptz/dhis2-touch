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

  constructor(public navParams: NavParams,

              public viewCtrl: ViewController) {}

  ngOnInit() {
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

  setCurrentEntryFormSection(selectedEntryFormSection,selectedIndex = 0){

    this.viewCtrl.dismiss({selectedEntryFormSection : selectedEntryFormSection,selectedIndex : selectedIndex});
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
