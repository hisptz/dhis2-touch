import { Component, OnInit } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { HelpContentsProvider } from '../../providers/help-contents/help-contents';
import { AppTranslationProvider } from '../../providers/app-translation/app-translation';

/**
 * Generated class for the HelpPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-help',
  templateUrl: 'help.html'
})
export class HelpPage implements OnInit {
  helpContentsObject: any;
  loadingMessage: string;
  isLoading: boolean = false;
  isHelpContentOpened: any = {};
  helpContents: any;
  translationMapper: any;

  constructor(
    private HelpContentsProvider: HelpContentsProvider,
    private appTranslation: AppTranslationProvider
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.translationMapper = {};
    this.appTranslation.getTransalations(this.getValuesToTranslate()).subscribe(
      (data: any) => {
        this.translationMapper = data;
        this.loadingHelpContents();
      },
      error => {
        this.loadingHelpContents();
      }
    );
  }

  loadingHelpContents() {
    let key = 'Discovering help contents';
    this.loadingMessage = this.translationMapper[key]
      ? this.translationMapper[key]
      : key;
    this.helpContentsObject = this.HelpContentsProvider.getHelpContents();
    this.helpContents = this.getHelpContents(this.helpContentsObject);
    if (this.helpContents.length > 0) {
      if (this.helpContents[0].id) {
        this.isHelpContentOpened[this.helpContents[0].id] = true;
      }
    }
    this.isLoading = false;
  }

  getHelpContents(helpContentsObject) {
    let helpContents = [];
    Object.keys(helpContentsObject).map(key => {
      helpContents.push(helpContentsObject[key]);
    });
    return helpContents;
  }

  getFilteredList(event: any) {
    let searchValue = event.target.value;
    this.helpContents = this.getHelpContents(this.helpContentsObject);
    if (searchValue && searchValue.trim() != '') {
      this.helpContents = this.helpContents.filter(
        (currentHelpContent: any) => {
          return (
            this.isSearchedValueExist(currentHelpContent.name, searchValue) ||
            this.isSearchedValueExist(currentHelpContent.id, searchValue) ||
            this.isSearchedValueExist(currentHelpContent.tags, searchValue)
          );
        }
      );
    }
  }

  toggleHelpContent(helpContent) {
    if (helpContent && helpContent.id) {
      if (this.isHelpContentOpened[helpContent.id]) {
        this.isHelpContentOpened[helpContent.id] = !this.isHelpContentOpened[
          helpContent.id
        ];
      } else {
        this.isHelpContentOpened[helpContent.id] = true;
      }
    }
  }

  isSearchedValueExist(contents, searchValue) {
    if (contents) {
      return contents.toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
    } else {
      return false;
    }
  }

  trackByFn(index, item) {
    return item.id;
  }

  getValuesToTranslate() {
    return ['Discovering help contents'];
  }
}
