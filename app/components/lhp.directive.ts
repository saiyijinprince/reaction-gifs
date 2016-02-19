/**
 * Created by akabeera on 2/18/2016.
 */
/// <reference path="../../typings/browser.d.ts" />

module app.Directives {
    'use strict';
    export class LhpDirective implements  ng.IDirective {
        public templateUrl:string = 'components/lhp.html';
        public restrict:string = 'E';
        public controller:string = 'lhpController';
        public controllerAs:string = 'lctrl';
        public scope = {};

        constructor(private $log:ng.ILogService) {
            this.$log.info('lhp directive');
        }

        public static Factory() {
            return (log:ng.ILogService) => {
                return new LhpDirective(log);
            };
        }
    }

    angular.module('reactionGifs').directive('lhp', ['$log', app.Directives.LhpDirective.Factory()]);
}
