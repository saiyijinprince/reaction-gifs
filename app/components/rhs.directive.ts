/**
 * Created by akabeera on 2/18/2016.
 */
/// <reference path="../../typings/browser.d.ts" />

module app.Directives {
    'use strict';
    export class RhsDirective implements  ng.IDirective {
        public templateUrl:string = 'components/rhs.html';
        public restrict:string = 'E';
        public controller:string = 'rhsController';
        public controllerAs:string = 'rctrl';
        public scope = {};

        constructor(private $log:ng.ILogService) {
            this.$log.info('rhs directive');
        }

        public static Factory() {
            return (log:ng.ILogService) => {
                return new RhsDirective(log);
            };
        }
    }

    angular.module('reactionGifs').directive('rhs', ['$log', app.Directives.RhsDirective.Factory()]);
}
