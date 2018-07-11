import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import * as fromPeriodFilterModel from "./period-filter.model";
import * as _ from "lodash";
import { PeriodService } from "./period.service";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { of } from "rxjs/observable/of";

@Component({
  selector: "app-period-filter",
  templateUrl: "./period-filter.component.html",
  styleUrls: ["./period-filter.component.css"]
})
export class PeriodFilterComponent implements OnInit {
  periodTypes: any[];
  @Input() selectedPeriodType = "";
  @Input() selectedPeriods: any[] = [];
  @Input()
  periodConfig: any = {
    resetOnPeriodTypeChange: false,
    emitOnSelection: false
  };
  @Output() onPeriodUpdate = new EventEmitter();
  @Output() onPeriodFilterClose = new EventEmitter();
  availablePeriods: any[];
  periods$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  selectedPeriods$: Observable<any>;
  private _periods: any[];
  selectedYear: number;
  currentYear: number;

  constructor(private periodService: PeriodService) {
    const date = new Date();
    this.selectedYear = date.getFullYear();
    this.currentYear = date.getFullYear();
    this.periodTypes = fromPeriodFilterModel.PERIOD_TYPES;
    this._periods = [];
    this.periods$.asObservable().subscribe((periods: any) => {
      this.selectedPeriods = periods.filter((period: any) => period.selected);
      this.selectedPeriods$ = of(this.selectedPeriods);
      this.availablePeriods = periods.filter((period: any) => !period.selected);
    });
  }

  ngOnInit() {
    if (this.selectedPeriodType === "") {
      this.selectedPeriodType = "Monthly";
    }
    this._periods = this.getPeriods(this.selectedPeriodType, this.selectedYear, this.selectedPeriods);
    this.periods$.next(this._periods);
  }

  getPeriods(selectedPeriodType: string, year: number, selectedPeriods: any[]) {
    return this.updatePeriodsWithSelected(
      this.periodService.getPeriodsBasedOnType(selectedPeriodType, year),
      selectedPeriods
    );
  }

  updatePeriodsWithSelected(periods: any[], selectedPeriods: any[]) {
    selectedPeriods.forEach((selectedPeriod: any) => {
      const availablePeriod = _.find(periods, ["id", selectedPeriod.id]);
      if (availablePeriod) {
        const periodIndex = _.findIndex(periods, availablePeriod);
        availablePeriod.selected = true;
        periods[periodIndex] = availablePeriod;
      } else {
        selectedPeriod.selected = true;
        periods.push(selectedPeriod);
      }
    });

    return periods;
  }

  togglePeriod(period, e) {
    e.stopPropagation();
    const periodIndex = _.findIndex(this._periods, _.find(this._periods, ["id", period.id]));

    if (periodIndex !== -1) {
      if (period.selected) {
        if (period.type === this.selectedPeriodType) {
          /**
           * Check if corresponding period is in the list of selected period type
           */
          period.selected = !period.selected;
          this._periods = [...this._periods.slice(0, periodIndex), period, ...this._periods.slice(periodIndex + 1)];
        } else {
          this._periods = [...this._periods.slice(0, periodIndex), ...this._periods.slice(periodIndex + 1)];
        }
      } else {
        period.selected = !period.selected;
        this._periods = [...this._periods.slice(0, periodIndex), period, ...this._periods.slice(periodIndex + 1)];
      }

      this.periods$.next(this._periods);

      if (this.periodConfig.emitOnSelection) {
        this.getPeriodOutput();
      }
    }
  }

  updatePeriodType(periodType: string, e) {
    e.stopPropagation();
    const selectedPeriods = this.periodConfig.resetOnPeriodTypeChange
      ? []
      : this._periods.filter(period => period.selected);

    this._periods = this.getPeriods(periodType, this.selectedYear, selectedPeriods);
    this.periods$.next(this._periods);
  }

  pushPeriodBackward(e) {
    e.stopPropagation();
    this.selectedYear--;
    this._periods = this.getPeriods(
      this.selectedPeriodType,
      this.selectedYear,
      this._periods.filter(period => period.selected)
    );
    this.periods$.next(this._periods);
  }

  pushPeriodForward(e) {
    e.stopPropagation();
    this.selectedYear++;
    this._periods = this.getPeriods(
      this.selectedPeriodType,
      this.selectedYear,
      this._periods.filter(period => period.selected)
    );
    this.periods$.next(this._periods);
  }

  selectAllPeriods(e) {
    e.stopPropagation();
    this._periods = this._periods.map((period: any) => {
      const newPeriod = { ...period };
      newPeriod.selected = true;
      return newPeriod;
    });
    this.periods$.next(this._periods);

    if (this.periodConfig.emitOnSelection) {
      this.getPeriodOutput();
    }
  }

  deselectAllPeriods(e) {
    e.stopPropagation();
    this._periods = this._periods
      .map((period: any) => {
        const newPeriod = { ...period };
        newPeriod.selected = false;
        return newPeriod;
      })
      .filter((period: any) => period.type === this.selectedPeriodType);
    this.periods$.next(this._periods);

    if (this.periodConfig.emitOnSelection) {
      this.getPeriodOutput();
    }
  }

  updatePeriod(e) {
    e.stopPropagation();
    this.getPeriodOutput();
  }

  getPeriodOutput() {
    const selectedPeriods = this._periods.filter((period: any) => period.selected);
    this.onPeriodUpdate.emit({
      items: selectedPeriods,
      name: "pe",
      value: selectedPeriods.map(period => period.id).join(";")
    });
  }

  closePeriodFilter(e) {
    e.stopPropagation();
    this.onPeriodFilterClose.emit(true);
  }
}
