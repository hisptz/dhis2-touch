import { Component, OnInit } from "@angular/core";
import { ViewController, NavParams, IonicPage } from "ionic-angular";
import { ProgramsProvider } from "../../providers/programs/programs";
import { AppTranslationProvider } from "../../providers/app-translation/app-translation";

/*
 Generated class for the ProgramSelection page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: "page-program-selection",
  templateUrl: "program-selection.html"
})
export class ProgramSelection implements OnInit {
  programsList: any;
  currentProgram: any;
  icons: any = {};
  translationMapper: any;

  constructor(
    private viewCtrl: ViewController,
    private params: NavParams,
    private programProvider: ProgramsProvider,
    private appTranslation: AppTranslationProvider
  ) {}

  ngOnInit() {
    this.translationMapper = {};
    this.appTranslation.getTransalations(this.getValuesToTranslate()).subscribe(
      (data: any) => {
        this.translationMapper = data;
        this.setModalData();
      },
      error => {
        this.setModalData();
      }
    );
    this.setModalData();
  }

  setModalData() {
    this.icons.program = "assets/icon/program.png";
    this.programsList = this.params.get("programsList");
    this.currentProgram = this.params.get("currentProgram");
  }

  getFilteredList(ev: any) {
    let searchValue = ev.target.value;
    this.programsList = this.params.get("programsList");
    if (searchValue && searchValue.trim() != "") {
      this.programsList = this.programsList.filter((program: any) => {
        return (
          program.name.toLowerCase().indexOf(searchValue.toLowerCase()) > -1
        );
      });
    }
  }

  setSelectedProgram(selectedProgram) {
    this.programProvider.setLastSelectedProgram(selectedProgram);
    this.viewCtrl.dismiss(selectedProgram);
  }

  dismiss() {
    var parameter = {};
    this.viewCtrl.dismiss(parameter);
  }

  getValuesToTranslate() {
    return ["There is no program to select"];
  }
}
