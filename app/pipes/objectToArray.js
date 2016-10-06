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
  Generated class for the ObjectToArray pipe.

  See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
  Angular 2 Pipes.
*/
var ObjectToArray = (function () {
    function ObjectToArray() {
    }
    ObjectToArray.prototype.transform = function (value, args) {
        var keys = [];
        if (value) {
            for (var key in value) {
                var newValue = value[key];
                if (newValue instanceof Object) {
                    newValue = JSON.stringify(newValue);
                }
                var newKey = (key.charAt(0).toUpperCase() + key.slice(1)).replace(/([A-Z])/g, ' $1').trim();
                keys.push({ key: newKey, value: newValue });
            }
        }
        return keys;
    };
    ObjectToArray = __decorate([
        core_1.Pipe({
            name: 'objectToArray'
        }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], ObjectToArray);
    return ObjectToArray;
})();
exports.ObjectToArray = ObjectToArray;
