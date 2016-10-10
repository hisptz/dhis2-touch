var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
/*
  Generated class for the OrgUnitSelectionLabel pipe.

  See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
  Angular 2 Pipes.
*/
var OrgUnitSelectionLabel = (function () {
    function OrgUnitSelectionLabel() {
    }
    /*
      Takes a value and makes it lowercase.
     */
    OrgUnitSelectionLabel.prototype.transform = function (value, args) {
        var label = "Touch to select organisation Unit";
        if (value.name) {
            label = value.name;
        }
        return label;
    };
    OrgUnitSelectionLabel = __decorate([
        core_1.Pipe({
            name: 'orgUnitSelectionLabel'
        }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], OrgUnitSelectionLabel);
    return OrgUnitSelectionLabel;
})();
exports.OrgUnitSelectionLabel = OrgUnitSelectionLabel;
